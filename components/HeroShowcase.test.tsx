import { render, screen } from "@testing-library/react";
import HeroShowcase from "./HeroShowcase";

describe("HeroShowcase", () => {
  it("shows the availability status provided by the admin setting", () => {
    const { rerender } = render(<HeroShowcase isAvailable />);
    const status = () =>
      screen.getByText((_, element) => element?.classList.contains("hero-note") ?? false);
    expect(status()).toHaveTextContent("Available for select projects");

    rerender(<HeroShowcase isAvailable={false} />);
    expect(status()).toHaveTextContent("Not taking projects");
  });
});
