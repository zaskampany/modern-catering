"use client";
import { useEffect, useState } from "react";
import { IconWhatsApp, IconInstagram, IconFacebook, IconPhone, IconMail } from "@/components/Icons";

const links = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Services", "#services"],
  ["Menu", "#menu"],
  ["Gallery", "#gallery"],
  ["Team", "#team"],
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="nav__inner container">
        <a href="#home" className="nav__brand" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="Modern Catering" className="nav__logo" />
          <span className="nav__name">
            <b>Modern</b>
            <span>Catering</span>
          </span>
        </a>

        <nav className={`nav__links${open ? " is-open" : ""}`}>
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a href="#contact" className="nav__cta" onClick={() => setOpen(false)}>
            Contact
          </a>
          <div className="nav__social">
            <a href="https://wa.me/919447268441" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <IconWhatsApp />
            </a>
            <a href="https://instagram.com/moderncatering" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <IconInstagram />
            </a>
            <a href="https://facebook.com/moderncatering" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <IconFacebook />
            </a>
            <a href="tel:+919447268441" aria-label="Call us">
              <IconPhone />
            </a>
            <a href="mailto:moderncatering1997@gmail.com" aria-label="Email us">
              <IconMail />
            </a>
          </div>
        </nav>

        <button
          className={`nav__toggle${open ? " is-open" : ""}`}
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div
        className={`nav__overlay${open ? " is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
    </header>
  );
}
