import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { markRead, remove, save, saveAvailability } from "../actions";
import { AdminNavigation } from "../../components/Navigation";
import SharePostButton from "../../components/SharePostButton";
import { formatPostLinks } from "../../lib/post-links";
export const dynamic = "force-dynamic";

const Del = ({ kind, id }: { kind: string; id: string }) => (
  <form action={remove} className="inline">
    <input type="hidden" name="kind" value={kind} />
    <input type="hidden" name="id" value={id} />
    <button className="ghost">Delete</button>
  </form>
);

export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; edit?: string }>;
}) {
  const { tab = "messages", edit } = await searchParams;
  const [messages, projects, posts, certifications, testimonials, siteSetting] =
    await Promise.all([
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
          technologies: true,
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
          links: true,
          createdAt: true,
          imageType: true,
        },
      }),
      prisma.certification.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, url: true, createdAt: true },
      }),
      prisma.testimonial.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          role: true,
          company: true,
          quote: true,
          imageType: true,
          createdAt: true,
        },
      }),
      prisma.siteSetting.findUnique({
        where: { key: "availability" },
        select: { available: true },
      }),
    ]);
  const ep = projects.find((x) => x.id === edit);
  const eb = posts.find((x) => x.id === edit);
  const et = testimonials.find((x) => x.id === edit);
  const unread = messages.filter((m) => !m.read).length;
  const isAvailable = siteSetting?.available ?? true;

  return (
    <div className="wrap" style={{ paddingBottom: 80 }}>
      <AdminNavigation tab={tab} unread={unread} />
      <Link href="/" className="admin-home-link">
        ← View portfolio
      </Link>
      <form action={saveAvailability} className="availability-setting">
        <span
          className={`availability-indicator${isAvailable ? " active" : ""}`}
        />
        <span>
          <span>
            {isAvailable ? "Available for work" : "Not taking projects"}
          </span>
          <small className="muted">
            Controls the status shown on your portfolio
          </small>
        </span>
        <input type="hidden" name="available" value={String(!isAvailable)} />
        <button className="ghost availability-toggle" type="submit">
          {isAvailable ? "Set unavailable" : "Set available"}
        </button>
      </form>

      {tab === "messages" &&
        (messages.length === 0 ? (
          <p className="muted">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div className="card" key={m.id}>
              <b>{m.name}</b>{" "}
              <a className="muted" href={`mailto:${m.email}`}>
                {m.email}
              </a>{" "}
              <small className="muted">{m.createdAt.toLocaleString()}</small>{" "}
              {!m.read && <b style={{ color: "var(--acc)" }}>● new</b>}
              <p className="message-body" style={{ margin: "10px 0" }}>
                {m.body}
              </p>
              {!m.read && (
                <form action={markRead} className="inline">
                  <input type="hidden" name="id" value={m.id} />
                  <button className="ghost">Mark read</button>
                </form>
              )}{" "}
              <Del kind="message" id={m.id} />
            </div>
          ))
        ))}

      {tab === "projects" && (
        <>
          <form
            action={save}
            className="stack card"
            encType="multipart/form-data"
          >
            <input type="hidden" name="kind" value="project" />
            <input type="hidden" name="id" value={ep?.id ?? ""} />
            <h3>{ep ? "Edit project" : "New project"}</h3>
            <input
              name="title"
              placeholder="Title"
              defaultValue={ep?.title}
              required
            />
            <textarea
              name="summary"
              rows={3}
              placeholder="Summary"
              defaultValue={ep?.summary}
              required
            />
            <input
              name="tag"
              placeholder="Tag (e.g. Web app)"
              defaultValue={ep?.tag}
            />
            <input
              name="url"
              placeholder="Project URL"
              defaultValue={ep?.url}
            />
            <label>
              Tech stack (separate names with commas or new lines)
              <textarea
                name="technologies"
                rows={2}
                placeholder={"Next.js, TypeScript\nPrisma"}
                defaultValue={ep?.technologies}
              />
            </label>
            <label>
              Project image (JPEG, PNG, WebP, or GIF; max 4 MB)
              <input
                name="imageFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
              />
            </label>
            {(ep?.imageType || ep?.image) && (
              <div className="image-field">
                <img
                  src={ep.imageType ? `/api/media/project/${ep.id}` : ep.image}
                  alt={ep.title}
                />
                <label>
                  <input
                    type="checkbox"
                    name="removeImage"
                    style={{ width: "auto" }}
                  />{" "}
                  Remove current image
                </label>
              </div>
            )}
            <div>
              <button>{ep ? "Save changes" : "Add project"}</button>
              {ep && (
                <>
                  {" "}
                  <Link className="btn ghost" href="/admin?tab=projects">
                    Cancel
                  </Link>
                </>
              )}
            </div>
          </form>
          {projects.map((p) => (
            <div className="card content-card" key={p.id}>
              {(p.imageType || p.image) && (
                <img
                  className="admin-thumbnail"
                  src={p.imageType ? `/api/media/project/${p.id}` : p.image}
                  alt=""
                />
              )}
              <div className="content-card-details">
                <b>{p.title}</b> <span className="muted">{p.tag}</span>
                {p.technologies && (
                  <div className="tech-stack-chips">
                    {p.technologies
                      .split(",")
                      .map((technology) => technology.trim())
                      .filter(Boolean)
                      .map((technology, index) => (
                        <span
                          className="tech-stack-chip"
                          key={`${technology}-${index}`}
                        >
                          {technology}
                        </span>
                      ))}
                  </div>
                )}
                <Link
                  className="btn ghost"
                  href={`/admin?tab=projects&edit=${p.id}`}
                >
                  Edit
                </Link>{" "}
                <Del kind="project" id={p.id} />
              </div>
            </div>
          ))}
        </>
      )}

      {tab === "posts" && (
        <>
          <form action={save} className="stack card">
            <input type="hidden" name="kind" value="post" />
            <input type="hidden" name="id" value={eb?.id ?? ""} />
            <h3>{eb ? "Edit post" : "New post"}</h3>
            <input
              name="title"
              placeholder="Title"
              defaultValue={eb?.title}
              required
            />
            <input
              name="excerpt"
              placeholder="Short excerpt"
              defaultValue={eb?.excerpt}
            />
            <textarea
              name="content"
              rows={12}
              placeholder="Write your post…"
              defaultValue={eb?.content}
              required
            />
            <label>
              Social links (one per line: platform | URL)
              <textarea
                name="links"
                rows={3}
                placeholder={
                  "X | https://x.com/…\nLinkedIn | https://linkedin.com/…"
                }
                defaultValue={formatPostLinks(eb?.links ?? "[]")}
              />
            </label>
            <label>
              Post image (JPEG, PNG, WebP, or GIF; max 4 MB)
              <input
                name="imageFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
              />
            </label>
            {eb?.imageType && (
              <div className="image-field">
                <img src={`/api/media/post/${eb.id}`} alt={eb.title} />
                <label>
                  <input
                    type="checkbox"
                    name="removeImage"
                    style={{ width: "auto" }}
                  />{" "}
                  Remove current image
                </label>
              </div>
            )}
            <label>
              <input
                type="checkbox"
                name="published"
                defaultChecked={eb?.published}
                style={{ width: "auto" }}
              />{" "}
              Published
            </label>
            <div>
              <button>{eb ? "Save changes" : "Add post"}</button>
              {eb && (
                <>
                  {" "}
                  <Link className="btn ghost" href="/admin?tab=posts">
                    Cancel
                  </Link>
                </>
              )}
            </div>
          </form>
          {posts.map((p) => (
            <div className="card content-card" key={p.id}>
              {p.imageType && (
                <img
                  className="admin-thumbnail"
                  src={`/api/media/post/${p.id}`}
                  alt=""
                />
              )}
              <div className="content-card-details">
                <b>{p.title}</b>{" "}
                <span className="muted">
                  {p.published ? "published" : "draft"}
                </span>{" "}
                {p.published && <SharePostButton postId={p.id} />}{" "}
                <Link
                  className="btn ghost"
                  href={`/admin?tab=posts&edit=${p.id}`}
                >
                  Edit
                </Link>{" "}
                <Del kind="post" id={p.id} />
              </div>
            </div>
          ))}
        </>
      )}

      {tab === "certifications" && (
        <>
          <form action={save} className="stack card">
            <input type="hidden" name="kind" value="certification" />
            <h3>Add a certification</h3>
            <input
              name="name"
              placeholder="Certification name"
              maxLength={120}
              required
            />
            <input name="url" type="url" placeholder="https://…" required />
            <button>Add certification</button>
          </form>
          {certifications.length === 0 ? (
            <p className="muted">No certifications yet.</p>
          ) : (
            certifications.map((certification) => (
              <div
                className="card certification-admin-card"
                key={certification.id}
              >
                <div>
                  <b>{certification.name}</b>
                  <a
                    className="muted certification-admin-link"
                    href={certification.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {certification.url}
                  </a>
                </div>
                <Del kind="certification" id={certification.id} />
              </div>
            ))
          )}
        </>
      )}

      {tab === "testimonials" && (
        <>
          <form
            action={save}
            className="stack card"
            encType="multipart/form-data"
          >
            <input type="hidden" name="kind" value="testimonial" />
            <input type="hidden" name="id" value={et?.id ?? ""} />
            <h3>{et ? "Edit testimonial" : "Add a testimonial"}</h3>
            <input
              name="name"
              placeholder="Person's name"
              maxLength={100}
              defaultValue={et?.name}
              required
            />
            <input
              name="role"
              placeholder="Role or title"
              maxLength={120}
              defaultValue={et?.role}
              required
            />
            <input
              name="company"
              placeholder="Company or organization"
              maxLength={120}
              defaultValue={et?.company}
              required
            />
            <textarea
              name="quote"
              rows={4}
              placeholder="Their testimonial"
              maxLength={1200}
              defaultValue={et?.quote}
              required
            />
            <label>
              Portrait (JPEG, PNG, WebP, or GIF; max 4 MB){!et && " — required"}
              <input
                name="imageFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                required={!et}
              />
            </label>
            {et?.imageType && (
              <div className="image-field">
                <img src={`/api/media/testimonial/${et.id}`} alt={et.name} />
                <label>
                  <input
                    type="checkbox"
                    name="removeImage"
                    style={{ width: "auto" }}
                  />{" "}
                  Remove current image
                </label>
              </div>
            )}
            <div>
              <button>{et ? "Save changes" : "Add testimonial"}</button>
              {et && (
                <>
                  {" "}
                  <Link className="btn ghost" href="/admin?tab=testimonials">
                    Cancel
                  </Link>
                </>
              )}
            </div>
          </form>
          {testimonials.length === 0 ? (
            <p className="muted">
              No testimonials yet. Add one above to show it on your portfolio.
            </p>
          ) : (
            testimonials.map((testimonial) => (
              <div className="card content-card" key={testimonial.id}>
                {testimonial.imageType && (
                  <img
                    className="admin-thumbnail"
                    src={`/api/media/testimonial/${testimonial.id}`}
                    alt=""
                  />
                )}
                <div className="content-card-details">
                  <b>{testimonial.name}</b>{" "}
                  <span className="muted">
                    {testimonial.role} · {testimonial.company}
                  </span>
                  <p className="message-body" style={{ margin: "8px 0" }}>
                    {testimonial.quote}
                  </p>
                  <Link
                    className="btn ghost"
                    href={`/admin?tab=testimonials&edit=${testimonial.id}`}
                  >
                    Edit
                  </Link>{" "}
                  <Del kind="testimonial" id={testimonial.id} />
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
