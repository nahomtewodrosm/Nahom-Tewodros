"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [t, setT] = useState("dark");
  useEffect(() => setT(document.documentElement.dataset.theme || "dark"), []);
  const flip = () => {
    const n = t === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = n;
    try {
      localStorage.setItem("theme", n);
    } catch {}
    setT(n);
  };
  return (
    <button
      type="button"
      className="ghost"
      onClick={flip}
      aria-label="Toggle light/dark mode"
    >
      {t === "dark" ? "☀ Light" : "☾ Dark"}
    </button>
  );
}
