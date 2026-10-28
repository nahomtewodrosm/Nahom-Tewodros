import { fireEvent, render, screen, within } from "@testing-library/react";
import { AdminNavigation, MainNavigation } from "./Navigation";

jest.mock("../app/actions", () => ({
  logout: jest.fn(),
}));

describe("MainNavigation", () => {
  it("opens the mobile menu and closes it after selecting a link", () => {
    render(<MainNavigation />);

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));

    const dropdown = document.getElementById("main-mobile-menu");
    expect(dropdown).toBeInTheDocument();
    expect(within(dropdown as HTMLElement).getByRole("link", { name: "Work" }))
      .toHaveAttribute("href", "#work");

    fireEvent.click(within(dropdown as HTMLElement).getByRole("link", { name: "Work" }));

    expect(document.getElementById("main-mobile-menu")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});

describe("AdminNavigation", () => {
  it("shows admin tabs and the unread count in the mobile menu", () => {
    render(<AdminNavigation tab="messages" unread={3} />);

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));

    const dropdown = document.getElementById("admin-mobile-menu");
    expect(dropdown).toBeInTheDocument();
    expect(within(dropdown as HTMLElement).getByRole("link", { name: "messages (3)" }))
      .toHaveAttribute("href", "/admin?tab=messages");
    expect(within(dropdown as HTMLElement).getByRole("link", { name: "projects" }))
      .toHaveAttribute("href", "/admin?tab=projects");
  });
});
