"use client";
import { useState } from "react";
import { sendMessage } from "../app/actions";

export default function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "ok" | "saved" | "err"
  >("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await sendMessage(new FormData(form));
      if (res.ok) {
        form.reset();
        setStatus(res.notificationSent ? "ok" : "saved");
      } else setStatus("err");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setStatus("err");
    }
  }

  return (
    <form onSubmit={onSubmit} className="stack contact-form">
      {status === "ok" && (
        <p className="alert ok" role="status">
          ✓ Thank you! Your message was sent successfully. I’ll get back to you
          soon.
        </p>
      )}
      {status === "err" && (
        <p className="alert err" role="alert">
          ✕ Sorry, your message failed to send. Please try again later.
        </p>
      )}
      {status === "saved" && (
        <p className="alert ok" role="status">
          ✓ Your message was saved, but the email notification could not be
          delivered. You do not need to submit it again.
        </p>
      )}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        style={{ position: "absolute", left: "-9999px" }}
      />
      <label className="contact-field">
        <span>Your name</span>
        <input
          name="name"
          placeholder="Your name"
          autoComplete="name"
          required
        />
      </label>
      <label className="contact-field">
        <span>Your email</span>
        <input
          name="email"
          type="email"
          placeholder="Your email"
          autoComplete="email"
          required
        />
      </label>
      <textarea
        name="body"
        rows={5}
        placeholder="What's on your mind?"
        aria-label="Your message"
        required
      />
      <button disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
