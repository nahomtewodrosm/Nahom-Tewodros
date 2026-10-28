import Link from "next/link";
import { prisma } from "../lib/prisma";
import ContactForm from "../components/ContactForm";
import HeroShowcase from "../components/HeroShowcase";
import { MainNavigation } from "../components/Navigation";
export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, posts, certifications, siteSetting] = await Promise.all([
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
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        excerpt: true,
        createdAt: true,
        imageType: true,
      },
    }),
    prisma.certification.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, url: true },
    }),
    prisma.siteSetting.findUnique({
      where: { key: "availability" },
      select: { available: true },
    }),
  ]);
  return (
    <div className="wrap">
      <MainNavigation />
      <HeroShowcase isAvailable={siteSetting?.available ?? true} />

      <section id="about">
        <p className="label">01 / About</p>
        <h2>One person. Many ways to make something good.</h2>
        <p className="muted" style={{ maxWidth: 640 }}>
          Replace this with your story: where you are, what you care about, and
          your experience.
        </p>
      </section>

      <section id="work">
        <p className="label">02 / Selected work</p>
        <h2>A few things out in the world.</h2>
        {projects.length === 0 && (
          <p className="muted">No projects yet. Add some from /admin.</p>
        )}
        <div className="grid">
          {projects.map((p) => (
            <article className="proj" key={p.id}>
              {(p.imageType || p.image) && (
                <img
                  src={p.imageType ? `/api/media/project/${p.id}` : p.image}
                  alt={p.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="pb">
                {p.tag && <small className="muted">[ {p.tag} ]</small>}
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                {p.technologies && (
                  <div className="tech-stack-chips" aria-label="Technologies used">
                    {String(p.technologies).split(",").filter(Boolean).map((technology, index) => (
                      <span
                        className="tech-stack-chip"
                        key={technology}
                        style={{ "--chip-index": index } as React.CSSProperties}
                      >
                        {technology.trim()}
                      </span>
                    ))}
                  </div>
                )}
                {p.url && (
                  <a
                    className="btn ghost"
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Visit
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="notes">
        <p className="label">03 / Notes</p>
        <h2>Thinking out loud.</h2>
        {posts.length === 0 && <p className="muted">No posts yet.</p>}
        {posts.map((p) => (
          <Link href={`/blog/${p.id}`} className="row" key={p.id}>
            <small>
              {p.createdAt.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </small>
            <div className="post-row-content">
              {p.imageType && (
                <img
                  className="post-thumbnail"
                  src={`/api/media/post/${p.id}`}
                  alt=""
                  loading="lazy"
                />
              )}
              <div>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
              </div>
            </div>
            <span></span>
          </Link>
        ))}
      </section>

      <section id="certifications">
        <p className="label">04 / Certifications</p>
        <h2>Learning, put into practice.</h2>
        {certifications.length === 0 ? (
          <p className="muted">New certifications will appear here.</p>
        ) : (
          <div className="certification-grid">
            {certifications.map((certification) => (
              <a
                className="certification-card"
                href={certification.url}
                key={certification.id}
                target="_blank"
                rel="noreferrer"
              >
                <span className="certification-mark" aria-hidden="true">✳</span>
                <span className="certification-name">{certification.name}</span>
                <span className="certification-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        )}
      </section>

      <section id="contact">
        <p className="label">05 / Contact</p>
        <h2>Make something good together.</h2>
        <ContactForm />
      </section>
      <footer>
        © {new Date().getFullYear()} Your Name ·{" "}
        <Link href="/admin">Admin</Link>
      </footer>
    </div>
  );
}
