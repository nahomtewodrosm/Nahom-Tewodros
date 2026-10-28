"use client";

import { useState } from "react";

export default function CertificationCard({
  name,
  url,
}: {
  name: string;
  url: string;
}) {
  const [iconFailed, setIconFailed] = useState(false);
  let domain = url;

  try {
    domain = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    // Keep the original URL visible if an older record contains an invalid URL.
  }

  return (
    <a
      className="certification-card"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      <span className="certification-mark" aria-hidden="true">
        {iconFailed ? (
          "✳"
        ) : (
          <img
            src={`https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url)}&sz=128`}
            alt=""
            width={24}
            height={24}
            onError={() => setIconFailed(true)}
          />
        )}
      </span>
      <span className="certification-details">
        <span className="certification-name">{name}</span>
        <span className="certification-domain">{domain}</span>
      </span>
      <span className="certification-arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}
