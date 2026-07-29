"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Marquee from "@/components/Marquee";

const galleryRowTop = [
  ["s301.jpg", "Illuminated buffet counter"],
  ["sadhya1.jpg", "Traditional sadhya banquet at our garden venue"],
  ["s302.jpg", "Grand catering spread under warm lights"],
  ["sadhya2.jpg", "Guests served a feast on banana leaves"],
  ["s303.jpg", "Neon-lit buffet at an evening event"],
  ["serve1.jpg", "Serving a fresh feast on banana leaves"],
  ["s304.jpg", "Grand illuminated catering setup"],
  ["sadhya3.jpg", "Families dining at a celebration"],
  ["s305.jpg", "Live counter with neon signage"],
  ["sadhya4.jpg", "Guests enjoying a garden sadhya"],
  ["s306.jpg", "Elegant buffet presentation"],
];
const galleryRowBottom = [
  ["s307.jpg", "Elegant table setting with flowers"],
  ["sadhya5.jpg", "A full traditional feast laid out"],
  ["s308.jpg", "Beautifully plated dishes on display"],
  ["team1.jpg", "Our uniformed service team on site"],
  ["s309.jpg", "Dessert and live counter spread"],
  ["sadhya6.jpg", "A grand sadhya served to guests"],
  ["s310.jpg", "Vibrant multi-cuisine buffet"],
  ["team2.jpg", "The Modern Catering crew ready to serve"],
  ["s311.jpg", "Grand reception catering setup"],
  ["team3.jpg", "Our trained team at a garden venue"],
  ["s312.jpg", "Lavish spread at an evening celebration"],
];
// Repeating collage rhythm — mixed widths for the packed, non-uniform look.
const gSizes = ["gitem--md", "gitem--sm", "gitem--lg", "gitem--sm", "gitem--md"];

export default function Gallery() {
  const [preview, setPreview] = useState(null); // { img, alt }

  useEffect(() => {
    if (!preview) return;
    const onKey = (e) => e.key === "Escape" && setPreview(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [preview]);

  const tile = (rowLen, offset) => ([img, alt], i) => (
    <figure
      className={`gitem ${gSizes[((i % rowLen) + offset) % gSizes.length]}`}
      key={`${img}-${i}`}
      onClick={() => setPreview({ img, alt })}
      role="button"
      tabIndex={0}
      aria-label={`View: ${alt}`}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPreview({ img, alt })}
    >
      <Image src={`/images/${img}`} alt={alt} fill sizes="(max-width: 520px) 86vw, (max-width: 960px) 40vw, 30vw" />
    </figure>
  );

  return (
    <>
      <div className="gallery__carousel" aria-label="Gallery of catered events">
        <Marquee className="gallery__row" trackClassName="gallery__track" speed={0.5}>
          {galleryRowTop.map(tile(galleryRowTop.length, 0))}
        </Marquee>
        <Marquee className="gallery__row" trackClassName="gallery__track" speed={0.4}>
          {galleryRowBottom.map(tile(galleryRowBottom.length, 2))}
        </Marquee>
      </div>

      {preview && (
        <div className="lightbox" onClick={() => setPreview(null)} role="dialog" aria-modal="true" aria-label={preview.alt}>
          <button className="lightbox__close" aria-label="Close preview" onClick={() => setPreview(null)}>&times;</button>
          {/* clicking the image itself does nothing; clicking anywhere else closes */}
          <Image
            src={`/images/${preview.img}`}
            alt={preview.alt}
            width={/^s\d/.test(preview.img) ? 1080 : 1600}
            height={/^s\d/.test(preview.img) ? 1350 : 1067}
            sizes="92vw"
            className="lightbox__img"
            onClick={(e) => e.stopPropagation()}
            priority
          />
          <p className="lightbox__caption">{preview.alt}</p>
        </div>
      )}
    </>
  );
}
