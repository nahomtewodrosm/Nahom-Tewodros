import { fireEvent, render, screen } from "@testing-library/react";
import HeroShowcase from "./HeroShowcase";

const currentWork = {
  projectName: "Portfolio website",
  deploymentUrl: "https://example.com",
  commitHash: "a1b2c3d4e5f6",
  commitMessage: "Add the current work card to the hero.",
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

  it("shows the configured project, deployment, and expandable commit details", () => {
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

    fireEvent.click(screen.getByText("Latest commit"));
    expect(
      screen.getByText("Add the current work card to the hero."),
    ).toBeInTheDocument();
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

    expect(screen.getByText("Not configured")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Latest commit"));
    expect(
      screen.getByText("Commit details have not been configured yet."),
    ).toBeInTheDocument();
  });
});
