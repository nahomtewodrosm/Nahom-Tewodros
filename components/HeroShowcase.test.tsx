import { render, screen } from "@testing-library/react";
import HeroShowcase from "./HeroShowcase";

const currentWork = {
  projectName: "Portfolio website",
  deploymentUrl: "https://example.com",
  deploymentLabel: "Deployment",
  commitHash: "a1b2c3d4e5f6",
  commitMessage: "Add the current work card to the hero.",
  commitUrl: "https://github.com/example/portfolio/commit/a1b2c3d4e5f6",
};

describe("HeroShowcase", () => {
  it("shows the availability status provided by the admin setting", () => {
    const { rerender } = render(
      <HeroShowcase isAvailable currentWork={currentWork} />,
    );
    const status = () =>
      screen.getByText((_, element) => element?.classList.contains("hero-note") ?? false);
    expect(status()).toHaveTextContent("Available for select projects");

    rerender(
      <HeroShowcase isAvailable={false} currentWork={currentWork} />,
    );
    expect(status()).toHaveTextContent("Not taking projects");
  });

  it("shows the project, deployment, and commit message without interaction", () => {
    render(<HeroShowcase isAvailable currentWork={currentWork} />);

    expect(
      screen.getByRole("heading", { name: "Portfolio website" }),
    ).toBeInTheDocument();
    const deploymentLink = screen.getByRole("link", {
      name: /view deployment: https:\/\/example\.com/i,
    });
    expect(deploymentLink).toHaveAttribute("href", "https://example.com");
    expect(deploymentLink).toHaveTextContent("https://example.com");
    expect(screen.getByText("a1b2c3d")).toBeInTheDocument();

    expect(screen.getByText("Latest commit")).toBeInTheDocument();
    expect(
      screen.getByText("Add the current work card to the hero."),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: /view commit/i }),
    ).toHaveAttribute("href", currentWork.commitUrl);
  });

  it("does not invent commit information when none is configured", () => {
    render(
      <HeroShowcase
        isAvailable
        currentWork={{
          ...currentWork,
          commitHash: "",
          commitMessage: "",
        }}
      />,
    );

    expect(
      screen.getByText("Commit details have not been configured yet."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /view commit/i }),
    ).not.toBeInTheDocument();
  });
});
