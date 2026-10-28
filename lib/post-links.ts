export type PostLink = {
  label: string;
  url: string;
};

export function parsePostLinks(value: string): PostLink[] {
  try {
    const links: unknown = JSON.parse(value);
    if (!Array.isArray(links)) return [];

    return links.filter(
      (link): link is PostLink =>
        typeof link === "object" &&
        link !== null &&
        "label" in link &&
        typeof link.label === "string" &&
        "url" in link &&
        typeof link.url === "string" &&
        ["http:", "https:"].includes(new URL(link.url).protocol),
    );
  } catch {
    return [];
  }
}

export function formatPostLinks(value: string): string {
  return parsePostLinks(value)
    .map(({ label, url }) => `${label} | ${url}`)
    .join("\n");
}

export function serializePostLinks(value: string): string {
  const links = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const separator = line.indexOf("|");
      const label = separator >= 0 ? line.slice(0, separator).trim() : "";
      const rawUrl = (separator >= 0 ? line.slice(separator + 1) : line).trim();
      const urlWithProtocol = /^https?:\/\//i.test(rawUrl)
        ? rawUrl
        : `https://${rawUrl}`;
      let url: URL;

      try {
        url = new URL(urlWithProtocol);
      } catch {
        throw new Error(
          `Invalid social link on line ${index + 1}. Use Platform | URL or enter a URL.`,
        );
      }

      if (!["http:", "https:"].includes(url.protocol))
        throw new Error(
          `Invalid social link on line ${index + 1}. Only HTTP and HTTPS links are allowed.`,
        );

      return { label: label || url.hostname.replace(/^www\./, ""), url: url.toString() };
    });

  return JSON.stringify(links);
}
