import Link from "next/link";
import { prisma } from "../lib/prisma";
import ContactForm from "../components/ContactForm";
import CertificationCard from "../components/CertificationCard";
import ExperienceTimeline from "../components/ExperienceTimeline";
import HeroShowcase from "../components/HeroShowcase";
import NotesList from "../components/NotesList";
import ProjectCard from "../components/ProjectCard";
import { MainNavigation } from "../components/Navigation";
export const dynamic = "force-dynamic";

const experience = [
  {
    title: "Junior Full Stack Developer",
    company: "QmemDevs Tech Inc.",
    dates: "2022 – Present",
    description:
      "Led development of multiple web applications using React, Node.js, and AWS. Implemented CI/CD pipelines and mentored junior developers.",
  },
  {
    title: "Web Developer Intern",
    company: "Truest Tech Agency",
    dates: "2020",
    description:
      "Built and maintained websites for clients using JavaScript, HTML, and CSS, with a focus on SEO best practices.",
  },
  {
    title: "Part-time English Teacher",
    company: "MH Language University",
    dates: "2019 – 2023",
    description:
      "Taught English language skills, focusing on communication, writing, and comprehension. Developed engaging lesson plans and assessments.",
  },
  {
    title: "Junior Programming Language Trainer",
    company: "Qmem Cloud Solutions",
    dates: "2020 – 2022",
    description:
      "Worked remotely during the COVID-19 pandemic, teaching programming to internship applicants and clients.",
  },
];

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
        <h2>A liitle about me</h2>
        <p className="muted" style={{ maxWidth: 640 }}>
          I'm Nahom Tewodros, a Full-Stack developer and UI designer. I care
          about how things look, how they work, and the small details that make
          them feel right. Over four years of working with corporate teams,
          startups, and my own ideas, I've turned designs into responsive
          websites and useful products. From Figma to Next & React, I stay close
          to the whole process.
        </p>
        <div className="about-links" aria-label="Social profiles">
          <a
            className="btn ghost"
            href="https://github.com/Nahomtewodros101"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="btn ghost"
            href="https://www.linkedin.com/in/nahom-tewodros"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a className="btn ghost" href="mailto:nahomtewodrosm@gmail.com">
            Gmail
          </a>
        </div>
      </section>

      <section id="experience">
        <div className="experience-layout">
          <div className="experience-intro">
            <p className="label">02 / Experience</p>
            <h2>Where I’ve put ideas to work.</h2>
          </div>
          <ExperienceTimeline items={experience} />
        </div>
      </section>

      <section id="work">
        <div className="projects-layout">
          <div className="projects-intro">
            <p className="label">03 / Selected work</p>
            <h2>
              A few things i have built before.{" "}
              <span className="muted">More on my GitHub.</span>
            </h2>
            {projects.length === 0 && (
              <p className="muted">No projects yet. Add some from /admin.</p>
            )}
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section id="notes">
        <p className="label">04 / Notes</p>
        <h2>Thinking out loud.</h2>
        {posts.length === 0 && <p className="muted">No posts yet.</p>}
        <NotesList posts={posts} />
      </section>

      <section id="certifications">
        <p className="label">05 / Certifications</p>
        <h2>Learning, put into practice.</h2>
        {certifications.length === 0 ? (
          <p className="muted">New certifications will appear here.</p>
        ) : (
          <div className="certification-grid">
            {certifications.map((certification) => (
              <CertificationCard
                key={certification.id}
                name={certification.name}
                url={certification.url}
              />
            ))}
          </div>
        )}
      </section>

      <section id="contact">
        <p className="label">06 / Contact</p>
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
