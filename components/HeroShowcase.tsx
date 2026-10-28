"use client";

import { useRef } from "react";
import {
  SiGit,
  SiGraphql,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPrisma,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";

const technologies = [
  { name: "React", Icon: SiReact, className: "react" },
  { name: "Next.js", Icon: SiNextdotjs, className: "next" },
  { name: "TypeScript", Icon: SiTypescript, className: "typescript" },
  { name: "JavaScript", Icon: SiJavascript, className: "javascript" },
  { name: "Node.js", Icon: SiNodedotjs, className: "node" },
  { name: "GraphQL", Icon: SiGraphql, className: "graphql" },
  { name: "MongoDB", Icon: SiMongodb, className: "mongodb" },
  { name: "Git", Icon: SiGit, className: "git" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, className: "tailwind" },
  { name: "Vercel", Icon: SiVercel, className: "vercel" },
  { name: "Prisma", Icon: SiPrisma, className: "prisma" },
];

export default function HeroShowcase({
  isAvailable,
}: {
  isAvailable: boolean;
}) {
  const heroRef = useRef<HTMLElement>(null);

  function moveLight(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;
    const hero = heroRef.current;
    if (!hero) return;

    const bounds = hero.getBoundingClientRect();
    hero.style.setProperty("--light-x", `${event.clientX - bounds.left}px`);
    hero.style.setProperty("--light-y", `${event.clientY - bounds.top}px`);
    hero.dataset.lightActive = "true";
  }

  function hideLight() {
    if (heroRef.current) heroRef.current.dataset.lightActive = "false";
  }

  return (
    <header
      className="hero"
      ref={heroRef}
      onPointerMove={moveLight}
      onPointerLeave={hideLight}
    >
      <div className="hero-light" aria-hidden="true" />
      <div className="hero-content">
        <p className="label">Nahom Tewodros</p>
        <h1>
          Good design.
          <br />
          <em>Thoughtful</em> code.
        </h1>
        <p className="lede">
          I create <span className="lede-highlight">digital experiences</span>{" "}
          with modern technology, bringing thoughtful design and purposeful code
          together to make the web feel a little more human.
        </p>
        <p className="hero-note">
          <span
            className={isAvailable ? undefined : "unavailable"}
            aria-hidden="true"
          />
          {isAvailable
            ? "Available for select projects"
            : "Not taking projects"}
        </p>
        <div className="hero-actions">
          <a className="btn" href="#work">
            Explore my work
          </a>
          <a className="btn ghost" href="#about">
            A little about me
          </a>
          <a className="btn ghost" href="/cv.pdf" download>
            Download my CV
          </a>
        </div>
        <div className="tech-marquee" aria-label="Technology skills">
          <div className="tech-track">
            {[0, 1].map((copy) => (
              <div
                className="tech-group"
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {technologies.map((technology) => (
                  <span className="tech-item" key={technology.name}>
                    <technology.Icon
                      className={`tech-icon ${technology.className}`}
                      aria-hidden="true"
                    />
                    {technology.name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
