import Link from "next/link";
import { prisma } from "../lib/prisma";
import { sendMessage } from "./actions";
export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ sent?: string }> }) {
  const { sent } = await searchParams;
  const [projects, posts] = await Promise.all([
    prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <div className="wrap">
      <nav>
        <Link href="/" className="logo">yourname<b>✳</b></Link>
        <div><a href="#work">Work</a><a href="#about">About</a><a href="#notes">Notes</a><a href="#contact">Contact</a></div>
      </nav>
      <header className="hero">
        <p className="label">Independent developer &amp; designer</p>
        <h1>Good design.<br /><em>Thoughtful</em> code.</h1>
        <p className="lede">Write one or two lines about what you build and who you build it for.</p>
        <a className="btn" href="#work">Explore my work ↗</a>{" "}
        <a className="btn ghost" href="#about">A little about me ↘</a>
      </header>

      <section id="about">
        <p className="label">01 / About</p>
        <h2>One person. Many ways to make something good.</h2>
        <p className="muted" style={{ maxWidth: 640 }}>Replace this with your story: where you are, what you care about, and your experience.</p>
      </section>

      <section id="work">
        <p className="label">02 / Selected work</p>
        <h2>A few things out in the world.</h2>
        {projects.length === 0 && <p className="muted">No projects yet. Add some from /admin.</p>}
        {projects.map((p, i) => (
          <div className="row" key={p.id}>
            <small>{String(i + 1).padStart(2, "0")}</small>
            <div><h3>{p.title}</h3><p>{p.summary}</p>{p.tag && <small>[ {p.tag} ]</small>}</div>
            {p.url && <a className="btn ghost" href={p.url} target="_blank" rel="noreferrer">Visit ↗</a>}
          </div>
        ))}
      </section>

      <section id="notes">
        <p className="label">03 / Notes</p>
        <h2>Thinking out loud.</h2>
        {posts.length === 0 && <p className="muted">No posts yet.</p>}
        {posts.map((p) => (
          <Link href={`/blog/${p.id}`} className="row" key={p.id}>
            <small>{p.createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</small>
            <div><h3>{p.title}</h3><p>{p.excerpt}</p></div><span>↗</span>
          </Link>
        ))}
      </section>

      <section id="contact">
        <p className="label">04 / Contact</p>
        <h2>Make something good together.</h2>
        {sent ? <p>Thanks! Your message was sent.</p> : (
          <form action={sendMessage} className="stack">
            <input name="name" placeholder="Your name" required />
            <input name="email" type="email" placeholder="Your email" required />
            <textarea name="body" rows={5} placeholder="What's on your mind?" required />
            <button>Send message ↗</button>
          </form>
        )}
      </section>
      <footer>© {new Date().getFullYear()} Your Name · <Link href="/admin">Admin</Link></footer>
    </div>
  );
}
