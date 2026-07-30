"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { onam, onamIsLive } from "@/lib/site";

// Shown once per browser session, after the splash has lifted.
const SEEN_KEY = "onam-popup-seen";
const DELAY_MS = 2600;

export default function OnamPopup() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  const dismiss = useCallback(() => {
    setOpen(false);
    if (onam.popupEveryVisit) return; // don't remember it — show again next load
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // private mode — the popup just shows again next load
    }
  }, []);

  // Liveness is checked here rather than on the server: the page is statically
  // prerendered, so a build-time check would freeze the expiry date into the HTML.
  useEffect(() => {
    if (!onamIsLive()) return;
    if (!onam.popupEveryVisit) {
      try {
        if (sessionStorage.getItem(SEEN_KEY)) return;
      } catch {
        // storage blocked — fall through and show it
      }
    }
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Freeze the page behind the popup. <html> as well as <body>, because iOS
  // Safari ignores `overflow: hidden` on <body> alone.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") dismiss();
      if (e.key !== "Tab") return;
      // Keep focus inside the dialog while it is open.
      const items = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled])'
      );
      if (!items?.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [open, dismiss]);

  if (!open) return null;

  const soldOut = onam.soldOut;

  return (
    <div className="opop" onClick={dismiss} role="presentation">
      <div
        className="opop__panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="opop-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="opop__close" onClick={dismiss} aria-label="Close" ref={closeRef}>
          &times;
        </button>

        {/* The poster carries the headline, price and full dish list, so it
            leads — the copy underneath only has to get people to the page. */}
        <Link href="/onam" className="opop__poster" onClick={dismiss}>
          <Image
            src={onam.poster}
            alt={`Modern Catering Onam Sadhya ${onam.year} — ₹${onam.sadhya.price} for ${onam.sadhya.serves} members. Tap for full details.`}
            width={1000}
            height={1333}
            priority
          />
        </Link>

        <div className="opop__body">
          {soldOut ? (
            <>
              <h2 className="opop__title" id="opop-title">
                Onam sadhya is <em>fully booked</em>
              </h2>
              <p className="opop__lead">
                Every order has been taken — thank you for the wonderful response.
              </p>
              <div className="opop__actions">
                <a href="#contact" className="btn btn--gold" onClick={dismiss}>
                  Enquire For Other Events
                </a>
                <button className="opop__dismiss" onClick={dismiss}>
                  Close
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="opop__title" id="opop-title">
                Onam Sadhya <em>₹{onam.sadhya.price}</em>
                <span className="opop__serves">for {onam.sadhya.serves} members</span>
              </h2>
              <div className="opop__actions">
                <Link href="/onam" className="btn btn--gold" onClick={dismiss}>
                  Book Now
                </Link>
                <button className="opop__dismiss" onClick={dismiss}>
                  Maybe later
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
