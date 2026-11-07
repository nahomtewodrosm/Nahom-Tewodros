import { getCurrentWork } from "./current-work";

type JsonResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

function jsonResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  } as JsonResponse as Response;
}

describe("getCurrentWork", () => {
  const originalFetch = global.fetch;
  const environmentKeys = [
    "CURRENT_WORK_GITHUB_USERNAME",
    "CURRENT_WORK_GITHUB_TOKEN",
    "CURRENT_WORK_PROJECT",
    "CURRENT_WORK_URL",
    "CURRENT_WORK_COMMIT_HASH",
    "CURRENT_WORK_COMMIT_MESSAGE",
  ] as const;
  const originalEnvironment = Object.fromEntries(
    environmentKeys.map((key) => [key, process.env[key]]),
  );

  beforeEach(() => {
    for (const key of environmentKeys) delete process.env[key];
    process.env.CURRENT_WORK_GITHUB_USERNAME = "example-user";
    process.env.CURRENT_WORK_GITHUB_TOKEN = "test-token";
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    for (const key of environmentKeys) {
      const value = originalEnvironment[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    jest.restoreAllMocks();
  });

  it("uses the most recently pushed repository and displays its latest commit", async () => {
    const fetchMock = global.fetch as jest.MockedFunction<typeof fetch>;
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse([
          {
            name: "Portfolio",
            full_name: "example-user/portfolio",
            html_url: "https://github.com/example-user/portfolio",
            homepage: "https://portfolio.example",
            pushed_at: "2026-10-01T10:00:00Z",
            default_branch: "main",
            owner: { login: "example-user" },
          },
          {
            name: "affiliate-hub",
            full_name: "example-user/affiliate-hub",
            html_url: "https://github.com/example-user/affiliate-hub",
            homepage: "https://affiliate.example",
            pushed_at: "2026-11-07T10:00:00Z",
            default_branch: "main",
            owner: { login: "example-user" },
          },
        ]),
      )
      .mockResolvedValueOnce(
        jsonResponse([
          {
            sha: "1234567890abcdef",
            html_url:
              "https://github.com/example-user/affiliate-hub/commit/1234567890abcdef",
            commit: { message: "Show the latest repository change\n\nDetails" },
          },
        ]),
      );

    await expect(getCurrentWork()).resolves.toEqual({
      projectName: "Affiliate Hub",
      deploymentUrl: "https://affiliate.example",
      deploymentLabel: "Deployment",
      commitHash: "1234567890abcdef",
      commitMessage: "Show the latest repository change",
      commitUrl:
        "https://github.com/example-user/affiliate-hub/commit/1234567890abcdef",
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      "/user/repos?affiliation=owner&sort=pushed",
    );
    expect(fetchMock.mock.calls[1][0]).toContain(
      "/repos/example-user/affiliate-hub/commits?sha=main",
    );
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      Authorization: "Bearer test-token",
    });
  });

  it("uses the manual fallback when the GitHub request fails", async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(jsonResponse({}, 503)) as jest.MockedFunction<
      typeof fetch
    >;
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    await expect(getCurrentWork()).resolves.toMatchObject({
      projectName: "Portfolio website",
      deploymentUrl: "https://nahom-tewodros-portfolio.vercel.app",
      commitHash: "",
      commitMessage: "",
    });
    expect(consoleError).toHaveBeenCalled();
  });
});
