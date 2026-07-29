"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IconWhatsApp, IconInstagram, IconFacebook, IconPhone, IconMail } from "@/components/Icons";
import { site, mailLink, whatsappLink } from "@/lib/site";

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

  // The hero is sticky-pinned, so a plain #home anchor is a no-op — scroll to top.
  const handleNav = (e, href) => {
    setOpen(false);
    if (href === "#home") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}`}>
      <div className="nav__inner container">
        <a href="#home" className="nav__brand" onClick={(e) => handleNav(e, "#home")}>
          <Image src="/images/logo.png" alt="Modern Catering" width={46} height={46} className="nav__logo" priority />
          <span className="nav__name">
            <b>Modern</b>
            <span>Catering</span>
          </span>
        </a>

        <nav className={`nav__links${open ? " is-open" : ""}`}>
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={(e) => handleNav(e, href)}>
              {label}
            </a>
          ))}
          <a href="#contact" className="nav__cta" onClick={() => setOpen(false)}>
            Contact
          </a>
          <div className="nav__social">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <IconWhatsApp />
            </a>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <IconInstagram />
            </a>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <IconFacebook />
            </a>
            {site.phones[0] && (
              <a href={site.phones[0].tel} aria-label="Call us">
                <IconPhone />
              </a>
            )}
            <a href={mailLink(site.email)} aria-label="Email us">
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
