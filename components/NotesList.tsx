"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Note = {
  id: string;
  title: string;
  excerpt: string;
  createdAt: Date;
  imageType: string | null;
};

export default function NotesList({ posts }: { posts: Note[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [visiblePosts, setVisiblePosts] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const rows = Array.from(list.querySelectorAll<HTMLElement>(".notes-row"));
    if (!("IntersectionObserver" in window)) {
      setVisiblePosts(new Set(rows.map((_, index) => index)));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const newlyVisible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => rows.indexOf(entry.target as HTMLElement))
          .filter((index) => index >= 0);

        if (newlyVisible.length) {
          setVisiblePosts((current) => new Set([...current, ...newlyVisible]));
          entries
            .filter((entry) => entry.isIntersecting)
            .forEach((entry) => observer.unobserve(entry.target));
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="notes-list" ref={listRef}>
      {posts.map((post, index) => (
        <Link
          href={`/blog/${post.id}`}
          className={`row notes-row${visiblePosts.has(index) ? " is-visible" : ""}`}
          key={post.id}
          style={{ "--notes-delay": `${Math.min(index, 5) * 90}ms` } as React.CSSProperties}
        >
          <small>
            {post.createdAt.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </small>
          <div className="post-row-content">
            {post.imageType && (
              <img
                className="post-thumbnail"
                src={`/api/media/post/${post.id}`}
                alt=""
                loading="lazy"
              />
            )}
            <div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </div>
          </div>
          <span></span>
        </Link>
      ))}
    </div>
  );
}
