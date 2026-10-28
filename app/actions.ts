"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";
import { token } from "../lib/auth";
import { sendContactEmails } from "../lib/mail";
import { serializePostLinks } from "../lib/post-links";

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const maxImageSize = 4 * 1024 * 1024;

async function uploadedImage(f: FormData) {
  const file = f.get("imageFile");
  if (!(file instanceof File) || file.size === 0) return null;
  if (!imageTypes.includes(file.type))
    throw new Error("Image must be JPEG, PNG, WebP, or GIF.");
  if (file.size > maxImageSize)
    throw new Error("Image must be 4 MB or smaller.");
  return {
    imageData: new Uint8Array(await file.arrayBuffer()),
    imageType: file.type,
  };
}

async function requireAdmin() {
  if ((await cookies()).get("admin")?.value !== (await token()))
    throw new Error("Unauthorized");
}

export async function login(f: FormData) {
  if (s(f, "password") !== process.env.ADMIN_PASSWORD)
    redirect("/admin/login?error=1");
  (await cookies()).set("admin", await token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete("admin");
  redirect("/admin/login");
}

export async function sendMessage(
  f: FormData,
): Promise<{ ok: boolean; notificationSent?: boolean }> {
  if (s(f, "website")) return { ok: true, notificationSent: true }; // honeypot: bots fill this in
  const name = s(f, "name").slice(0, 100),
    email = s(f, "email").slice(0, 200),
    body = s(f, "body").slice(0, 5000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !body)
    return { ok: false };
  try {
    await prisma.message.create({ data: { name, email, body } });
  } catch (e) {
    console.error("Save message failed:", e);
    return { ok: false };
  }
  try {
    const { notificationSent } = await sendContactEmails({ name, email, body });
    revalidatePath("/admin");
    return { ok: true, notificationSent };
  } catch (e) {
    console.error("Contact email delivery failed:", e);
    revalidatePath("/admin");
    return { ok: true, notificationSent: false };
  }
}

export async function save(f: FormData) {
  await requireAdmin();
  const id = s(f, "id"),
    kind = s(f, "kind");
  if (kind === "project") {
    const image = await uploadedImage(f);
    const data = {
      title: s(f, "title"),
      summary: s(f, "summary"),
      tag: s(f, "tag"),
      url: s(f, "url"),
      technologies: s(f, "technologies")
        .split(/[,\n]/)
        .map((technology) => technology.trim())
        .filter(Boolean)
        .slice(0, 12)
        .join(", "),
      ...(f.get("removeImage") === "on"
        ? { image: "", imageData: null, imageType: null }
        : image
          ? { image: "", ...image }
          : {}),
    };
    if (id) await prisma.project.update({ where: { id }, data });
    else await prisma.project.create({ data });
  } else if (kind === "post") {
    const image = await uploadedImage(f);
    const data = {
      title: s(f, "title"),
      excerpt: s(f, "excerpt"),
      content: s(f, "content"),
      published: f.get("published") === "on",
      links: serializePostLinks(s(f, "links")),
      ...(f.get("removeImage") === "on"
        ? { imageData: null, imageType: null }
        : (image ?? {})),
    };
    if (id) await prisma.post.update({ where: { id }, data });
    else await prisma.post.create({ data });
  } else if (kind === "certification") {
    const name = s(f, "name").slice(0, 120);
    const url = s(f, "url");
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new Error("Enter a valid certification URL.");
    }
    if (!name || !["http:", "https:"].includes(parsedUrl.protocol))
      throw new Error("Enter a name and a valid HTTP or HTTPS certification URL.");
    await prisma.certification.create({
      data: { name, url: parsedUrl.toString() },
    });
  } else {
    throw new Error("Unknown content type.");
  }
  revalidatePath("/");
  revalidatePath("/admin");
  redirect(`/admin?tab=${kind === "certification" ? "certifications" : `${kind}s`}`);
}

export async function remove(f: FormData) {
  await requireAdmin();
  const id = s(f, "id"),
    kind = s(f, "kind");
  if (kind === "project") await prisma.project.delete({ where: { id } });
  if (kind === "post") await prisma.post.delete({ where: { id } });
  if (kind === "message") await prisma.message.delete({ where: { id } });
  if (kind === "certification")
    await prisma.certification.delete({ where: { id } });
  if (!["project", "post", "message", "certification"].includes(kind))
    throw new Error("Unknown content type.");
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function markRead(f: FormData) {
  await requireAdmin();
  await prisma.message.update({
    where: { id: s(f, "id") },
    data: { read: true },
  });
  revalidatePath("/admin");
}

export async function saveAvailability(f: FormData) {
  await requireAdmin();
  const available = s(f, "available") === "true";
  await prisma.siteSetting.upsert({
    where: { key: "availability" },
    create: { key: "availability", available },
    update: { available },
  });
  revalidatePath("/");
  revalidatePath("/admin");
}
