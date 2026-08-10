"use client";
import { Children, cloneElement, useEffect, useRef } from "react";

/**
 * Auto-scrolling, swipeable horizontal marquee.
 * Children are duplicated once so the scroll can loop seamlessly. Instead of
 * driving the container's native scrollLeft (which fights iOS momentum
 * scrolling and jitters on mobile), a rAF loop translates the track with a
 * GPU-composited transform. Pointer events let the user drag to browse.
 */
export default function Marquee({ children, speed = 0.5, className = "", trackClassName = "" }) {
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const resumeTimer = useRef(null);
  const posRef = useRef(0);          // current translateX (<= 0, moving left)
  const dragRef = useRef(null);      // { startX, startPos } while dragging
  const items = Children.toArray(children);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf;

    const wrap = (half) => {
      if (half <= 0) return;
      // keep pos within (-half, 0] so the two duplicated halves loop seamlessly
      while (posRef.current <= -half) posRef.current += half;
      while (posRef.current > 0) posRef.current -= half;
    };

    const tick = () => {
      const half = track.scrollWidth / 2;
      if (!pausedRef.current) posRef.current -= speed;
      wrap(half);
      // Round to the device pixel to avoid sub-pixel shimmer, keep it composited.
      track.style.transform = `translate3d(${posRef.current.toFixed(2)}px,0,0)`;
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

  const onPointerDown = (e) => {
    pause();
    dragRef.current = { startX: e.clientX, startPos: posRef.current };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    posRef.current = dragRef.current.startPos + (e.clientX - dragRef.current.startX);
  };
  const endDrag = (e) => {
    if (dragRef.current) {
      dragRef.current = null;
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    }
    resume(600);
  };

  return (
    <div
      className={`marquee ${className}`}
      onMouseEnter={pause}
      onMouseLeave={() => resume()}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div ref={trackRef} className={`marquee__track ${trackClassName}`}>
        {items.map((c, i) => cloneElement(c, { key: `a-${i}` }))}
        {items.map((c, i) => cloneElement(c, { key: `b-${i}`, "aria-hidden": true }))}
      </div>
    </div>
  );
}
