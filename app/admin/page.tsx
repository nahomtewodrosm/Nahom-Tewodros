import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { logout, markRead, remove, save } from "../actions";
export const dynamic = "force-dynamic";

const Del = ({ kind, id }: { kind: string; id: string }) => (
  <form action={remove} className="inline">
    <input type="hidden" name="kind" value={kind} /><input type="hidden" name="id" value={id} />
    <button className="ghost">Delete</button>
  </form>
);

export default async function Admin({ searchParams }: { searchParams: Promise<{ tab?: string; edit?: string }> }) {
  const { tab = "messages", edit } = await searchParams;
  const [messages, projects, posts] = await Promise.all([
    prisma.message.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.post.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  const ep = projects.find((x) => x.id === edit);
  const eb = posts.find((x) => x.id === edit);
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="wrap" style={{ paddingBottom: 80 }}>
      <nav><Link href="/" className="logo">dashboard<b>✳</b></Link>
        <form action={logout}><button className="ghost">Log out</button></form></nav>
      <div className="tabs">
        {["messages", "projects", "posts"].map((t) => (
          <Link key={t} href={`/admin?tab=${t}`} className={tab === t ? "on" : ""}>
            {t}{t === "messages" && unread ? ` (${unread})` : ""}
          </Link>))}
      </div>

      {tab === "messages" && (messages.length === 0 ? <p className="muted">No messages yet.</p> :
        messages.map((m) => (
          <div className="card" key={m.id}>
            <b>{m.name}</b> <a className="muted" href={`mailto:${m.email}`}>{m.email}</a>{" "}
            <small className="muted">{m.createdAt.toLocaleString()}</small> {!m.read && <b style={{ color: "var(--acc)" }}>● new</b>}
            <p style={{ margin: "10px 0", whiteSpace: "pre-wrap" }}>{m.body}</p>
            {!m.read && <form action={markRead} className="inline"><input type="hidden" name="id" value={m.id} /><button className="ghost">Mark read</button></form>}{" "}
            <Del kind="message" id={m.id} />
          </div>)))}

      {tab === "projects" && (<>
        <form action={save} className="stack card">
          <input type="hidden" name="kind" value="project" /><input type="hidden" name="id" value={ep?.id ?? ""} />
          <h3>{ep ? "Edit project" : "New project"}</h3>
          <input name="title" placeholder="Title" defaultValue={ep?.title} required />
          <textarea name="summary" rows={3} placeholder="Summary" defaultValue={ep?.summary} required />
          <input name="tag" placeholder="Tag (e.g. Web app)" defaultValue={ep?.tag} />
          <input name="url" placeholder="Project URL" defaultValue={ep?.url} />
          <input name="image" placeholder="Image URL" defaultValue={ep?.image} />
          <div><button>{ep ? "Save changes" : "Add project"}</button>{ep && <> <Link className="btn ghost" href="/admin?tab=projects">Cancel</Link></>}</div>
        </form>
        {projects.map((p) => (
          <div className="card" key={p.id}><b>{p.title}</b> <span className="muted">{p.tag}</span>{" "}
            <Link className="btn ghost" href={`/admin?tab=projects&edit=${p.id}`}>Edit</Link> <Del kind="project" id={p.id} /></div>))}
      </>)}

      {tab === "posts" && (<>
        <form action={save} className="stack card">
          <input type="hidden" name="kind" value="post" /><input type="hidden" name="id" value={eb?.id ?? ""} />
          <h3>{eb ? "Edit post" : "New post"}</h3>
          <input name="title" placeholder="Title" defaultValue={eb?.title} required />
          <input name="excerpt" placeholder="Short excerpt" defaultValue={eb?.excerpt} />
          <textarea name="content" rows={12} placeholder="Write your post…" defaultValue={eb?.content} required />
          <label><input type="checkbox" name="published" defaultChecked={eb?.published} style={{ width: "auto" }} /> Published</label>
          <div><button>{eb ? "Save changes" : "Add post"}</button>{eb && <> <Link className="btn ghost" href="/admin?tab=posts">Cancel</Link></>}</div>
        </form>
        {posts.map((p) => (
          <div className="card" key={p.id}><b>{p.title}</b> <span className="muted">{p.published ? "published" : "draft"}</span>{" "}
            <Link className="btn ghost" href={`/admin?tab=posts&edit=${p.id}`}>Edit</Link> <Del kind="post" id={p.id} /></div>))}
      </>)}
    </div>
  );
}
