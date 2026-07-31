"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";

const initials = (name) =>
  name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

// Matches the `width` of .tperson__modalphoto in globals.css. Used to work out
// how far the card has to grow, so the zoom starts at exactly the card's size.
const targetSize = () => Math.min(320, window.innerWidth * 0.62);

export default function TeamPeople({ people }) {
  const [active, setActive] = useState(null); // { person, from }
  const closeRef = useRef(null);

  const close = useCallback(() => setActive(null), []);

  const open = (person, e) => {
    // FLIP-style: measure the card, then animate the modal from that box so it
    // reads as the card growing rather than a panel appearing over it.
    const card = e.currentTarget.querySelector(".tperson__photo");
    let from = null;
    if (card) {
      const r = card.getBoundingClientRect();
      const size = targetSize();
      from = {
        x: Math.round(r.left + r.width / 2 - window.innerWidth / 2),
        y: Math.round(r.top + r.height / 2 - window.innerHeight / 2),
        scale: +(r.width / size).toFixed(3),
      };
    }
    setActive({ person, from });
  };

  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [active, close]);

  return (
    <>
      <div className="tpeople">
        {people.map((p, i) => (
          <Reveal
            className="tperson"
            key={p.name}
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <div
              className="tperson__card"
              role="button"
              tabIndex={0}
              aria-label={`View ${p.name}, ${p.role}`}
              onClick={(e) => open(p, e)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  open(p, e);
                }
              }}
            >
              <div className="tperson__photo">
                {p.img ? (
                  <Image
                    src={p.img}
                    alt={`${p.name}, ${p.role} at Modern Catering`}
                    fill
                    sizes="(max-width: 620px) 45vw, (max-width: 960px) 30vw, 260px"
                  />
                ) : (
                  <span className="tperson__initials" aria-hidden="true">
                    {initials(p.name)}
                  </span>
                )}
              </div>
              <p className="tperson__role">{p.role}</p>
              <p className="tperson__name">{p.name}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {active && (
        <div
          className="tmodal"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${active.person.name}, ${active.person.role}`}
        >
          <button className="tmodal__close" onClick={close} aria-label="Close" ref={closeRef}>
            &times;
          </button>

          {/* clicking the card itself does nothing; anywhere else closes */}
          <div
            className="tmodal__panel"
            onClick={(e) => e.stopPropagation()}
            style={
              active.from
                ? {
                    "--fx": `${active.from.x}px`,
                    "--fy": `${active.from.y}px`,
                    "--fs": active.from.scale,
                  }
                : undefined
            }
          >
            <div className="tmodal__photo">
              {active.person.img ? (
                <Image
                  src={active.person.img}
                  alt={`${active.person.name}, ${active.person.role} at Modern Catering`}
                  width={640}
                  height={640}
                  sizes="(max-width: 620px) 62vw, 320px"
                  priority
                />
              ) : (
                <span className="tperson__initials" aria-hidden="true">
                  {initials(active.person.name)}
                </span>
              )}
            </div>
            <p className="tmodal__role">{active.person.role}</p>
            <p className="tmodal__name">{active.person.name}</p>
          </div>
        </div>
      )}
    </>
  );
}
