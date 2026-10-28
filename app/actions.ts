"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";
import { token } from "../lib/auth";
import { sendContactEmails } from "../lib/mail";

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

export async function sendMessage(f: FormData): Promise<{ ok: boolean }> {
  if (s(f, "website")) return { ok: true }; // honeypot: bots fill this in
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
    await sendContactEmails({ name, email, body });
  } catch (e) {
    console.error("Email error:", e);
  }
  revalidatePath("/admin");
  return { ok: true };
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
      ...(f.get("removeImage") === "on"
        ? { imageData: null, imageType: null }
        : image ?? {}),
    };
    if (id) await prisma.post.update({ where: { id }, data });
    else await prisma.post.create({ data });
  }
  revalidatePath("/");
  redirect(`/admin?tab=${kind}s`);
}

export async function remove(f: FormData) {
  await requireAdmin();
  const id = s(f, "id"),
    kind = s(f, "kind");
  if (kind === "project") await prisma.project.delete({ where: { id } });
  if (kind === "post") await prisma.post.delete({ where: { id } });
  if (kind === "message") await prisma.message.delete({ where: { id } });
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
