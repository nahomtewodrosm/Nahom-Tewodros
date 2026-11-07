export type CurrentWork = {
  projectName: string;
  deploymentUrl: string;
  deploymentLabel: string;
  commitHash: string;
  commitMessage: string;
  commitUrl: string;
};

type GitHubRepository = {
  name: string;
  full_name: string;
  html_url: string;
  homepage: string | null;
};

type GitHubCommitSearchResult = {
  items: Array<{
    sha: string;
    html_url: string;
    commit: { message: string };
    repository: {
      name: string;
      full_name: string;
      html_url: string;
    };
  }>;
};

const githubApi = "https://api.github.com";
const defaultUsername = "nahomtewodrosm";
const defaultDeploymentUrl = "https://nahom-tewodros-portfolio.vercel.app";
const cacheDurationSeconds = 300;

function isHttpUrl(value: string | null | undefined): value is string {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function getFallbackCurrentWork(): CurrentWork {
  const deploymentUrl =
    process.env.CURRENT_WORK_URL?.trim() || defaultDeploymentUrl;

  if (!isHttpUrl(deploymentUrl)) {
    throw new Error("CURRENT_WORK_URL must be a valid HTTP or HTTPS URL.");
  }

  return {
    projectName: process.env.CURRENT_WORK_PROJECT?.trim() || "Portfolio website",
    deploymentUrl,
    deploymentLabel: "Deployment",
    commitHash: process.env.CURRENT_WORK_COMMIT_HASH?.trim() || "",
    commitMessage: process.env.CURRENT_WORK_COMMIT_MESSAGE?.trim() || "",
    commitUrl: "",
  };
}

async function fetchGitHubJson<T>(
  path: string,
  token?: string,
): Promise<T> {
  const response = await fetch(`${githubApi}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { revalidate: cacheDurationSeconds },
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

function titleFromRepositoryName(name: string) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function getCurrentWork(): Promise<CurrentWork> {
  const fallback = getFallbackCurrentWork();
  const username =
    process.env.CURRENT_WORK_GITHUB_USERNAME?.trim() || defaultUsername;
  const token = process.env.CURRENT_WORK_GITHUB_TOKEN?.trim();

  try {
    const commits = await fetchGitHubJson<GitHubCommitSearchResult>(
      `/search/commits?q=${encodeURIComponent(`author:${username}`)}&sort=committer-date&order=desc&per_page=1`,
      token,
    );
    const latestCommit = commits.items[0];
    if (!latestCommit) return fallback;

    const latestRepository = latestCommit.repository;
    const repository = await fetchGitHubJson<GitHubRepository>(
      `/repos/${latestRepository.full_name}`,
      token,
    );
    const deploymentUrl = isHttpUrl(repository.homepage)
      ? repository.homepage
      : latestRepository.full_name.toLowerCase() ===
          `${username}/nahom-tewodros`.toLowerCase()
        ? defaultDeploymentUrl
        : latestRepository.html_url;

    return {
      projectName: titleFromRepositoryName(latestRepository.name),
      deploymentUrl,
      deploymentLabel: isHttpUrl(repository.homepage) ||
        deploymentUrl === defaultDeploymentUrl
        ? "Deployment"
        : "Repository",
      commitHash: latestCommit.sha,
      commitMessage:
        latestCommit.commit.message.split(/\r?\n/, 1)[0]?.trim() || "",
      commitUrl: latestCommit.html_url,
    };
  } catch (error) {
    console.error("Unable to load current work from GitHub.", error);
    return fallback;
  }
}
