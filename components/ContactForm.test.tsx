import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ContactForm from "./ContactForm";
import { sendMessage } from "../app/actions";

jest.mock("../app/actions", () => ({
  sendMessage: jest.fn(),
}));

const mockedSendMessage = jest.mocked(sendMessage);

describe("ContactForm", () => {
  beforeEach(() => {
    mockedSendMessage.mockReset();
  });

  it("confirms when the message is saved but the email notification fails", async () => {
    mockedSendMessage.mockResolvedValue({ ok: true, notificationSent: false });
    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "Ada" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your email"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), {
      target: { value: "Hello" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByText(/message was saved/i)).toBeInTheDocument();
    expect(mockedSendMessage).toHaveBeenCalledTimes(1);
  });

  it("shows a failure when the message could not be saved", async () => {
    mockedSendMessage.mockResolvedValue({ ok: false });
    render(<ContactForm />);

    fireEvent.change(screen.getByPlaceholderText("Your name"), {
      target: { value: "Ada" },
    });
    fireEvent.change(screen.getByPlaceholderText("Your email"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("What's on your mind?"), {
      target: { value: "Hello" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "message failed to send",
      );
    });
  });
});
