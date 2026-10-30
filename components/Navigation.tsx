"use client";

import Link from "next/link";
import { useState } from "react";
import { logout } from "../app/actions";
import styles from "./Navigation.module.css";

const mainLinks = [
  ["Work", "#work"],
  ["About", "#about"],
  ["Journey", "#experience"],
  ["Notes", "#notes"],
  ["Certs", "#certifications"],
  ["Contact", "#contact"],
] as const;

const adminTabs = ["messages", "projects", "posts", "certifications"] as const;

export function MainNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.mainNav} aria-label="Main navigation">
      <Link href="/" className={`${styles.brand} logo`}>
        <img src="/logo.gif" alt="Nahom Tewodros" />
      </Link>
      <div className={styles.desktopLinks}>
        {mainLinks.map(([label, href]) => (
          <a href={href} key={href}>
            {label}
          </a>
        ))}
        <Link href="/admin" className={styles.adminLink}>
          Admin
        </Link>
      </div>
      <button
        className={styles.menuToggle}
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-mobile-menu"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "Close" : "Menu"}
      </button>
      {menuOpen && (
        <div className={styles.mobileLinks} id="main-mobile-menu">
          {mainLinks.map(([label, href]) => (
            <a href={href} key={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <Link
            href="/admin"
            className={styles.mobileAdminLink}
            onClick={() => setMenuOpen(false)}
          >
            Admin
          </Link>
        </div>
      )}
    </nav>
  );
}

export function AdminNavigation({
  tab,
  unread,
}: {
  tab: string;
  unread: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const labelFor = (value: (typeof adminTabs)[number]) =>
    `${value}${value === "messages" && unread ? ` (${unread})` : ""}`;

  return (
    <>
      <nav className="site-nav admin-nav">
        <Link href="/" className="logo">
          Nahom's dashboard
        </Link>
        <form action={logout} className="desktop-logout">
          <button className="ghost">Log out</button>
        </form>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="admin-mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        {menuOpen && (
          <div className="mobile-menu" id="admin-mobile-menu">
            {adminTabs.map((value) => (
              <Link
                key={value}
                href={`/admin?tab=${value}`}
                className={tab === value ? "on" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {labelFor(value)}
              </Link>
            ))}
            <form action={logout}>
              <button className="ghost">Log out</button>
            </form>
          </div>
        )}
      </nav>
      <div className="tabs">
        {adminTabs.map((value) => (
          <Link
            key={value}
            href={`/admin?tab=${value}`}
            className={tab === value ? "on" : ""}
          >
            {labelFor(value)}
          </Link>
        ))}
      </div>
    </>
  );
}
