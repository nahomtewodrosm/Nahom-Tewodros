import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
export const dynamic = "force-dynamic";

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } }).catch(() => null);
  if (!post || !post.published) notFound();
  return (
    <div className="wrap" style={{ maxWidth: 720, padding: "60px 24px" }}>
      <Link href="/#notes" className="muted">← Back</Link>
      <h2 style={{ marginTop: 24 }}>{post.title}</h2>
      <p className="muted" style={{ marginBottom: 24 }}>{post.createdAt.toDateString()}</p>
      <div style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>
    </div>
  );
}
