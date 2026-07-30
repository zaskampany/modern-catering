"use client";
import { useEffect, useRef } from "react";
import { IconPlay, IconInstagram } from "@/components/Icons";
import { site } from "@/lib/site";

// Point these at the matching Instagram reel URLs when available.
const INSTAGRAM_REELS = site.instagramReels;

const reels = [
  { src: "/videos/reel1.mp4", poster: "/images/s301.webp" },
  { src: "/videos/reel2.mp4", poster: "/images/s304.webp" },
  { src: "/videos/reel3.mp4", poster: "/images/s305.webp" },
  { src: "/videos/reel4.mp4", poster: "/images/s307.webp" },
  { src: "/videos/reel5.mp4", poster: "/images/s309.webp" },
  { src: "/videos/reel6.mp4", poster: "/images/s311.webp" },
  { src: "/videos/reel7.mp4", poster: "/images/s303.webp" },
  { src: "/videos/reel8.mp4", poster: "/images/s312.webp" },
].map((r) => ({ ...r, insta: INSTAGRAM_REELS }));

export default function Reels() {
  const refs = useRef([]);
  const carousel = useRef(null);
  const pausedRef = useRef(false); // hover / swipe
  const playingRef = useRef(false); // a reel is playing

  // Auto-scroll the strip; pauses on interaction or while a reel plays. The
  // native scroll container also lets users swipe/drag through the reels.
  useEffect(() => {
    const el = carousel.current;
    if (!el) return;
    let raf;
    // Float position — scrollLeft is integer-rounded, so sub-pixel speeds stall.
    let pos = 1;
    el.scrollLeft = pos;
    const tick = () => {
      const h = el.scrollWidth / 2;
      if (!pausedRef.current && !playingRef.current) {
        pos += 0.45;
        if (h > 0) {
          if (pos >= h) pos -= h;
          else if (pos < 0) pos += h;
        }
        el.scrollLeft = pos;
      } else {
        pos = el.scrollLeft;
        if (h > 0) {
          if (pos >= h) { pos -= h; el.scrollLeft = pos; }
          else if (pos <= 0) { pos += h; el.scrollLeft = pos; }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggle = (i) => {
    const vid = refs.current[i];
    if (!vid) return;
    const wrap = vid.parentElement;
    if (vid.paused) {
      // pause any other playing reels
      refs.current.forEach((v, j) => {
        if (v && j !== i) {
          v.pause();
          v.parentElement.classList.remove("is-playing");
        }
      });
      vid.muted = false;
      vid.play();
      wrap.classList.add("is-playing");
      playingRef.current = true; // freeze the drift while a reel is playing
    } else {
      vid.pause();
      wrap.classList.remove("is-playing");
      playingRef.current = false;
    }
  };

  let resumeTimer;
  const pause = () => { clearTimeout(resumeTimer); pausedRef.current = true; };
  const resume = (delay = 0) => { clearTimeout(resumeTimer); resumeTimer = setTimeout(() => { pausedRef.current = false; }, delay); };

  // Rendered twice for a seamless infinite loop.
  const loop = [...reels, ...reels];

  return (
    <div
      className="reels__carousel"
      ref={carousel}
      aria-label="Video reels from our events"
      onMouseEnter={pause}
      onMouseLeave={() => resume()}
      onPointerDown={pause}
      onPointerUp={() => resume(600)}
      onTouchStart={pause}
      onTouchEnd={() => resume(600)}
    >
      <div className="reels__track">
        {loop.map((r, i) => (
          <div className="reel" key={`${r.src}-${i}`} onClick={() => toggle(i)} aria-hidden={i >= reels.length}>
            <video
              ref={(el) => (refs.current[i] = el)}
              src={r.src}
              poster={r.poster}
              muted
              loop
              playsInline
              preload="none"
              onEnded={(e) => e.currentTarget.parentElement.classList.remove("is-playing")}
            />
            <a
              className="reel__insta"
              href={r.insta}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Watch on Instagram"
            >
              <IconInstagram />
            </a>
            <button className="reel__play" aria-label="Play reel">
              <IconPlay />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
