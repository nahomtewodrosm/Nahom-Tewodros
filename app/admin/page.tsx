import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { markRead, remove, save } from "../actions";
import { AdminNavigation } from "../../components/Navigation";
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
    prisma.message.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        body: true,
        read: true,
        createdAt: true,
      },
    }),
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        summary: true,
        tag: true,
        url: true,
        image: true,
        imageType: true,
      },
    }),
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        published: true,
        createdAt: true,
        imageType: true,
      },
    }),
  ]);
  const ep = projects.find((x) => x.id === edit);
  const eb = posts.find((x) => x.id === edit);
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="wrap" style={{ paddingBottom: 80 }}>
      <AdminNavigation tab={tab} unread={unread} />

      {tab === "messages" && (messages.length === 0 ? <p className="muted">No messages yet.</p> :
        messages.map((m) => (
          <div className="card" key={m.id}>
            <b>{m.name}</b> <a className="muted" href={`mailto:${m.email}`}>{m.email}</a>{" "}
            <small className="muted">{m.createdAt.toLocaleString()}</small> {!m.read && <b style={{ color: "var(--acc)" }}>● new</b>}
            <p className="message-body" style={{ margin: "10px 0" }}>{m.body}</p>
            {!m.read && <form action={markRead} className="inline"><input type="hidden" name="id" value={m.id} /><button className="ghost">Mark read</button></form>}{" "}
            <Del kind="message" id={m.id} />
          </div>)))}

      {tab === "projects" && (<>
        <form action={save} className="stack card" encType="multipart/form-data">
          <input type="hidden" name="kind" value="project" /><input type="hidden" name="id" value={ep?.id ?? ""} />
          <h3>{ep ? "Edit project" : "New project"}</h3>
          <input name="title" placeholder="Title" defaultValue={ep?.title} required />
          <textarea name="summary" rows={3} placeholder="Summary" defaultValue={ep?.summary} required />
          <input name="tag" placeholder="Tag (e.g. Web app)" defaultValue={ep?.tag} />
          <input name="url" placeholder="Project URL" defaultValue={ep?.url} />
          <label>Project image (JPEG, PNG, WebP, or GIF; max 4 MB)
            <input name="imageFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
          </label>
          {(ep?.imageType || ep?.image) && (
            <div className="image-field">
              <img src={ep.imageType ? `/api/media/project/${ep.id}` : ep.image} alt={ep.title} />
              <label><input type="checkbox" name="removeImage" style={{ width: "auto" }} /> Remove current image</label>
            </div>
          )}
          <div><button>{ep ? "Save changes" : "Add project"}</button>{ep && <> <Link className="btn ghost" href="/admin?tab=projects">Cancel</Link></>}</div>
        </form>
        {projects.map((p) => (
          <div className="card content-card" key={p.id}>
            {(p.imageType || p.image) && <img className="admin-thumbnail" src={p.imageType ? `/api/media/project/${p.id}` : p.image} alt="" />}
            <div className="content-card-details"><b>{p.title}</b> <span className="muted">{p.tag}</span>{" "}
              <Link className="btn ghost" href={`/admin?tab=projects&edit=${p.id}`}>Edit</Link> <Del kind="project" id={p.id} /></div>
          </div>))}
      </>)}

      {tab === "posts" && (<>
        <form action={save} className="stack card" encType="multipart/form-data">
          <input type="hidden" name="kind" value="post" /><input type="hidden" name="id" value={eb?.id ?? ""} />
          <h3>{eb ? "Edit post" : "New post"}</h3>
          <input name="title" placeholder="Title" defaultValue={eb?.title} required />
          <input name="excerpt" placeholder="Short excerpt" defaultValue={eb?.excerpt} />
          <textarea name="content" rows={12} placeholder="Write your post…" defaultValue={eb?.content} required />
          <label>Post image (JPEG, PNG, WebP, or GIF; max 4 MB)
            <input name="imageFile" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
          </label>
          {eb?.imageType && (
            <div className="image-field">
              <img src={`/api/media/post/${eb.id}`} alt={eb.title} />
              <label><input type="checkbox" name="removeImage" style={{ width: "auto" }} /> Remove current image</label>
            </div>
          )}
          <label><input type="checkbox" name="published" defaultChecked={eb?.published} style={{ width: "auto" }} /> Published</label>
          <div><button>{eb ? "Save changes" : "Add post"}</button>{eb && <> <Link className="btn ghost" href="/admin?tab=posts">Cancel</Link></>}</div>
        </form>
        {posts.map((p) => (
          <div className="card content-card" key={p.id}>
            {p.imageType && <img className="admin-thumbnail" src={`/api/media/post/${p.id}`} alt="" />}
            <div className="content-card-details"><b>{p.title}</b> <span className="muted">{p.published ? "published" : "draft"}</span>{" "}
              <Link className="btn ghost" href={`/admin?tab=posts&edit=${p.id}`}>Edit</Link> <Del kind="post" id={p.id} /></div>
          </div>))}
      </>)}
    </div>
  );
}
