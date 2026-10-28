"use client";

import { useEffect, useRef, useState } from "react";

type Project = {
  id: string;
  title: string;
  summary: string;
  tag: string;
  url: string;
  technologies: string;
  image: string;
  imageType: string | null;
};

export default function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      className={`proj project-card${isVisible ? " is-visible" : ""}`}
      ref={cardRef}
    >
      {(project.imageType || project.image) && (
        <img
          src={
            project.imageType
              ? `/api/media/project/${project.id}`
              : project.image
          }
          alt={project.title}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )}
      <div className="pb">
        {project.tag && <small className="muted">[ {project.tag} ]</small>}
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        {project.technologies && (
          <div className="tech-stack-chips" aria-label="Technologies used">
            {project.technologies
              .split(",")
              .filter(Boolean)
              .map((technology, index) => (
                <span
                  className="tech-stack-chip"
                  key={`${technology.trim()}-${index}`}
                  style={{ "--chip-index": index } as React.CSSProperties}
                >
                  {technology.trim()}
                </span>
              ))}
          </div>
        )}
        {project.url && (
          <a
            className="btn ghost"
            href={project.url}
            target="_blank"
            rel="noreferrer"
          >
            Visit
          </a>
        )}
      </div>
    </article>
  );
}
