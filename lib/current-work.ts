export type CurrentWork = {
  projectName: string;
  deploymentUrl: string;
  commitHash: string;
  commitMessage: string;
};

const defaultDeploymentUrl = "https://nahom-tewodros-portfolio.vercel.app";

function getDeploymentUrl(value: string | undefined) {
  const deploymentUrl = value?.trim() || defaultDeploymentUrl;
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(deploymentUrl);
  } catch {
    throw new Error("CURRENT_WORK_URL must be a valid HTTP or HTTPS URL.");
  }

  if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
    throw new Error("CURRENT_WORK_URL must be a valid HTTP or HTTPS URL.");
  }

  return deploymentUrl;
}

export function getCurrentWork(): CurrentWork {
  return {
    projectName: process.env.CURRENT_WORK_PROJECT?.trim() || "Portfolio website",
    deploymentUrl: getDeploymentUrl(process.env.CURRENT_WORK_URL),
    commitHash: process.env.CURRENT_WORK_COMMIT_HASH?.trim() || "",
    commitMessage: process.env.CURRENT_WORK_COMMIT_MESSAGE?.trim() || "",
  };
}
