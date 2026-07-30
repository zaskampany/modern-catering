"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const MIN_MS = 900;   // hold the logo long enough that it never just flashes
const MAX_MS = 6000;  // but never keep the site hostage to a slow video

export default function Splash() {
  const [hidden, setHidden] = useState(false);

  // Stay up until the hero video has buffered enough to paint its first frame,
  // so the splash lifts onto moving video rather than the poster.
  useEffect(() => {
    const started = Date.now();
    const video = document.querySelector("video.hero__video");
    let settled = false;
    let hideTimer;

    // Safari refuses to start a video it considers hidden, and the splash
    // covers this one completely — so kick playback off once we uncover it.
    const play = () => video?.play?.().catch(() => {});

    const finish = () => {
      if (settled) return;
      settled = true;
      hideTimer = setTimeout(() => {
        setHidden(true);
        play();
      }, Math.max(0, MIN_MS - (Date.now() - started)));
    };

    const cap = setTimeout(finish, MAX_MS);

    // readyState >= 3 (HAVE_FUTURE_DATA) means canplay already fired.
    if (!video || video.readyState >= 3) {
      finish();
    } else {
      video.addEventListener("canplay", finish);
      video.addEventListener("error", finish); // fall through to the poster
    }

    // Low Power Mode / Low Data Mode refuse programmatic playback outright —
    // only a real user gesture lifts that. Retry on the first one, then stop
    // listening as soon as the video reports it is running.
    const stopRetrying = () => {
      window.removeEventListener("touchstart", play);
      window.removeEventListener("click", play);
    };
    window.addEventListener("touchstart", play, { passive: true });
    window.addEventListener("click", play);
    video?.addEventListener("playing", stopRetrying);

    return () => {
      clearTimeout(cap);
      clearTimeout(hideTimer);
      stopRetrying();
      video?.removeEventListener("canplay", finish);
      video?.removeEventListener("error", finish);
      video?.removeEventListener("playing", stopRetrying);
    };
  }, []);

  return (
    <div className={`splash${hidden ? " is-hidden" : ""}`} aria-hidden={hidden}>
      <div className="splash__inner">
        <Image
          src="/images/logo.png"
          alt="Modern Catering"
          width={104}
          height={104}
          className="splash__logo"
          priority
        />
        <div className="splash__bar" aria-hidden="true"><span /></div>
      </div>
    </div>
  );
}
