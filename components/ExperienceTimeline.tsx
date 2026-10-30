"use client";

import { useEffect, useRef, useState } from "react";

export type ExperienceItem = {
  title: string;
  company: string;
  dates: string;
  description: string;
};

export default function ExperienceTimeline({
  items,
}: {
  items: ExperienceItem[];
}) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeItems, setActiveItems] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const cards = Array.from(
      timeline.querySelectorAll<HTMLElement>(".experience-card"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        setActiveItems((current) => {
          const next = new Set(current);
          for (const entry of entries) {
            const index = cards.indexOf(entry.target as HTMLElement);
            if (index < 0) continue;
            if (entry.isIntersecting) next.add(index);
            else next.delete(index);
          }
          return next;
        });
      },
      { threshold: 0.25 },
    );
    cards.forEach((card) => observer.observe(card));

    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = timeline.getBoundingClientRect();
        const markers = timeline.querySelectorAll<HTMLElement>(
          ".experience-marker",
        );
        const firstMarker = markers[0];
        const lastMarker = markers[markers.length - 1];
        if (!firstMarker || !lastMarker) return;

        const firstBounds = firstMarker.getBoundingClientRect();
        const lastBounds = lastMarker.getBoundingClientRect();
        const start = firstBounds.top + firstBounds.height / 2 - bounds.top;
        const end = lastBounds.top + lastBounds.height / 2 - bounds.top;
        const trackLength = Math.max(0, end - start);
        const scrollPosition = window.innerHeight * 0.65 - bounds.top;
        const fill = Math.max(0, Math.min(trackLength, scrollPosition - start));

        timeline.style.setProperty("--timeline-start", `${start}px`);
        timeline.style.setProperty("--timeline-length", `${trackLength}px`);
        timeline.style.setProperty("--timeline-progress", `${fill}px`);
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div
      className="experience-list"
      ref={timelineRef}
    >
      {items.map((item, index) => (
        <article
          className={`experience-card${activeItems.has(index) ? " is-active" : ""}`}
          key={`${item.company}-${item.title}`}
          style={{ "--timeline-index": index } as React.CSSProperties}
        >
          <span className="experience-marker" aria-hidden="true" />
          <div className="experience-card-content">
            <div className="experience-heading">
              <h3>{item.title}</h3>
              <span className="experience-dates">{item.dates}</span>
            </div>
            <p className="experience-company">{item.company}</p>
            <p className="muted">{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
