import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { parsePostLinks } from "../../../lib/post-links";
export const dynamic = "force-dynamic";

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      createdAt: true,
      imageType: true,
      links: true,
    },
  }).catch(() => null);
  if (!post || !post.published) notFound();
  const links = parsePostLinks(post.links ?? "[]");
  return (
    <div className="wrap" style={{ maxWidth: 720, padding: "60px 24px" }}>
      <Link href="/#notes" className="muted">← Back</Link>
      <h2 style={{ marginTop: 24 }}>{post.title}</h2>
      <p className="muted" style={{ marginBottom: 24 }}>{post.createdAt.toDateString()}</p>
      {post.imageType && (
        <img
          className="post-cover"
          src={`/api/media/post/${post.id}`}
          alt={post.title}
        />
      )}
      <div style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>
      {links.length > 0 && (
        <nav className="post-social-links" aria-label="Post links">
          {links.map(({ label, url }) => (
            <a className="btn ghost" href={url} key={url} target="_blank" rel="noreferrer">
              {label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
