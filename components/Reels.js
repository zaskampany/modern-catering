"use client";
import { useRef } from "react";
import { IconPlay, IconInstagram } from "@/components/Icons";
import { site } from "@/lib/site";

// Point these at the matching Instagram reel URLs when available.
const INSTAGRAM_REELS = site.instagramReels;

const reels = [
  { src: "/videos/reel1.mp4", poster: "/images/s301.jpg" },
  { src: "/videos/reel2.mp4", poster: "/images/s304.jpg" },
  { src: "/videos/reel3.mp4", poster: "/images/s305.jpg" },
  { src: "/videos/reel4.mp4", poster: "/images/s307.jpg" },
  { src: "/videos/reel5.mp4", poster: "/images/s309.jpg" },
  { src: "/videos/reel6.mp4", poster: "/images/s311.jpg" },
  { src: "/videos/reel7.mp4", poster: "/images/s303.jpg" },
  { src: "/videos/reel8.mp4", poster: "/images/s312.jpg" },
].map((r) => ({ ...r, insta: INSTAGRAM_REELS }));

export default function Reels() {
  const refs = useRef([]);
  const carousel = useRef(null);

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
      // freeze the drift while a reel is playing
      carousel.current?.classList.add("is-active");
    } else {
      vid.pause();
      wrap.classList.remove("is-playing");
      carousel.current?.classList.remove("is-active");
    }
  };

  // Rendered twice for a seamless infinite loop.
  const loop = [...reels, ...reels];

  return (
    <div className="reels__carousel" ref={carousel} aria-label="Video reels from our events">
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
