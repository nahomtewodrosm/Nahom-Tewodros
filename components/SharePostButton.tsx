"use client";

import { useState } from "react";

export default function SharePostButton({ postId }: { postId: string }) {
  const [status, setStatus] = useState("");

  async function copyPostLink() {
    try {
      await navigator.clipboard.writeText(
        new URL(`/blog/${postId}`, window.location.origin).toString(),
      );
      setStatus("Link copied");
    } catch {
      setStatus("Could not copy link");
    }
  }

  return (
    <>
      <button className="ghost" type="button" onClick={copyPostLink}>
        Share link
      </button>
      <span className="muted" role="status" aria-live="polite">
        {status}
      </span>
    </>
  );
}
