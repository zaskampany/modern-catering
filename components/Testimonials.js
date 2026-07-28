"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { IconStar, IconChevron } from "@/components/Icons";

export default function Testimonials({ items }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback(
    (i) => {
      const track = trackRef.current;
      if (!track) return;
      const idx = (i + items.length) % items.length;
      track.scrollTo({ left: idx * track.clientWidth, behavior: "smooth" });
    },
    [items.length]
  );

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  };

  // autoplay (pauses on hover)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let paused = false;
    const enter = () => (paused = true);
    const leave = () => (paused = false);
    track.addEventListener("pointerenter", enter);
    track.addEventListener("pointerleave", leave);
    const id = setInterval(() => {
      if (paused) return;
      const next = (Math.round(track.scrollLeft / track.clientWidth) + 1) % items.length;
      track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
    }, 6000);
    return () => {
      clearInterval(id);
      track.removeEventListener("pointerenter", enter);
      track.removeEventListener("pointerleave", leave);
    };
  }, [items.length]);

  return (
    <div className="tcar">
      <button className="tcar__arrow tcar__arrow--prev" onClick={() => goTo(active - 1)} aria-label="Previous testimonial">
        <IconChevron />
      </button>

      <div className="tcar__track" ref={trackRef} onScroll={onScroll}>
        {items.map(([quote, name, role, initial]) => (
          <div className="tcar__slide" key={name}>
            <article className="tcard">
              <div className="tcard__stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar key={i} />
                ))}
              </div>
              <p className="tcard__quote">&ldquo;{quote}&rdquo;</p>
              <div className="tcard__who">
                <span className="tcard__avatar">{initial}</span>
                <span>
                  <span className="tcard__name">{name}</span>
                  <br />
                  <span className="tcard__role">{role}</span>
                </span>
              </div>
            </article>
          </div>
        ))}
      </div>

      <button className="tcar__arrow tcar__arrow--next" onClick={() => goTo(active + 1)} aria-label="Next testimonial">
        <IconChevron />
      </button>

      <div className="tcar__dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`tcar__dot${i === active ? " is-active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
