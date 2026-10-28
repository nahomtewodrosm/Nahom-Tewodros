"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";
import { token } from "../lib/auth";

const s = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

async function requireAdmin() {
  if ((await cookies()).get("admin")?.value !== (await token())) throw new Error("Unauthorized");
}

export async function login(f: FormData) {
  if (s(f, "password") !== process.env.ADMIN_PASSWORD) redirect("/admin/login?error=1");
  (await cookies()).set("admin", await token(), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete("admin");
  redirect("/admin/login");
}

export async function sendMessage(f: FormData) {
  const name = s(f, "name"), email = s(f, "email"), body = s(f, "body");
  if (!name || !email.includes("@") || !body) return;
  await prisma.message.create({ data: { name, email, body } });
  revalidatePath("/admin");
  redirect("/?sent=1#contact");
}

export async function save(f: FormData) {
  await requireAdmin();
  const id = s(f, "id"), kind = s(f, "kind");
  if (kind === "project") {
    const data = { title: s(f, "title"), summary: s(f, "summary"), tag: s(f, "tag"), url: s(f, "url"), image: s(f, "image") };
    if (id) await prisma.project.update({ where: { id }, data });
    else await prisma.project.create({ data });
  } else if (kind === "post") {
    const data = { title: s(f, "title"), excerpt: s(f, "excerpt"), content: s(f, "content"), published: f.get("published") === "on" };
    if (id) await prisma.post.update({ where: { id }, data });
    else await prisma.post.create({ data });
  }
  revalidatePath("/");
  redirect(`/admin?tab=${kind}s`);
}

export async function remove(f: FormData) {
  await requireAdmin();
  const id = s(f, "id"), kind = s(f, "kind");
  if (kind === "project") await prisma.project.delete({ where: { id } });
  if (kind === "post") await prisma.post.delete({ where: { id } });
  if (kind === "message") await prisma.message.delete({ where: { id } });
  revalidatePath("/"); revalidatePath("/admin");
}

export async function markRead(f: FormData) {
  await requireAdmin();
  await prisma.message.update({ where: { id: s(f, "id") }, data: { read: true } });
  revalidatePath("/admin");
}
