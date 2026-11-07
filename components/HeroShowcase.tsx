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
import type { CurrentWork } from "../lib/current-work";

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
  currentWork,
}: {
  isAvailable: boolean;
  currentWork: CurrentWork;
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
        <section className="current-work" aria-labelledby="current-work-title">
          <div className="current-work-heading">
            <p className="current-work-label">
              <span aria-hidden="true" />
              Currently working on
            </p>
            <span className="current-work-status">In progress</span>
          </div>
          <h2 className="current-work-title" id="current-work-title">
            {currentWork.projectName}
          </h2>
          <a
            className="current-work-deployment"
            href={currentWork.deploymentUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`View deployment: ${currentWork.deploymentUrl}`}
          >
            <span className="current-work-deployment-label">Deployment</span>
            <span className="current-work-url">{currentWork.deploymentUrl}</span>
            <span aria-hidden="true">↗</span>
          </a>
          <details className="current-work-commit">
            <summary>
              <span>Latest commit</span>
              <code>
                {currentWork.commitHash
                  ? currentWork.commitHash.slice(0, 7)
                  : "Not configured"}
              </code>
            </summary>
            <p>
              {currentWork.commitMessage ||
                "Commit details have not been configured yet."}
            </p>
          </details>
        </section>
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
