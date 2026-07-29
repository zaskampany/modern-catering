"use client";
import { Children, cloneElement, useEffect, useRef } from "react";

/**
 * Auto-scrolling, swipeable horizontal marquee.
 * Children are duplicated once so the scroll can loop seamlessly. The track is a
 * native scroll container, so touch swipe / drag works; a rAF loop nudges it
 * along and pauses while the user interacts or hovers.
 */
export default function Marquee({ children, speed = 0.5, className = "", trackClassName = "" }) {
  const scrollerRef = useRef(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef(null);
  const items = Children.toArray(children);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf;
    // Track position as a float; scrollLeft is integer-rounded by the browser,
    // so speeds < 1px/frame would otherwise never accumulate.
    let pos = 1;
    el.scrollLeft = pos;
    const tick = () => {
      const h = el.scrollWidth / 2;
      if (!pausedRef.current) {
        pos += speed;
        if (h > 0) {
          if (pos >= h) pos -= h;
          else if (pos < 0) pos += h;
        }
        el.scrollLeft = pos;
      } else {
        // user is swiping — follow their scroll and wrap for a seamless loop
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
  }, [speed]);

  const pause = () => {
    clearTimeout(resumeTimer.current);
    pausedRef.current = true;
  };
  const resume = (delay = 0) => {
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => { pausedRef.current = false; }, delay);
  };

  return (
    <div
      ref={scrollerRef}
      className={`marquee ${className}`}
      onMouseEnter={pause}
      onMouseLeave={() => resume()}
      onPointerDown={pause}
      onPointerUp={() => resume(600)}
      onTouchStart={pause}
      onTouchEnd={() => resume(600)}
    >
      <div className={`marquee__track ${trackClassName}`}>
        {items.map((c, i) => cloneElement(c, { key: `a-${i}` }))}
        {items.map((c, i) => cloneElement(c, { key: `b-${i}`, "aria-hidden": true }))}
      </div>
    </div>
  );
}
