"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Marquee from "@/components/Marquee";

const galleryRowTop = [
  ["s301.webp", "Illuminated buffet counter"],
  ["sadhya1.webp", "Traditional sadhya banquet at our garden venue"],
  ["s302.webp", "Grand catering spread under warm lights"],
  ["sadhya2.webp", "Guests served a feast on banana leaves"],
  ["s303.webp", "Neon-lit buffet at an evening event"],
  ["serve1.webp", "Serving a fresh feast on banana leaves"],
  ["s304.webp", "Grand illuminated catering setup"],
  ["sadhya3.webp", "Families dining at a celebration"],
  ["s305.webp", "Live counter with neon signage"],
  ["sadhya4.webp", "Guests enjoying a garden sadhya"],
  ["s306.webp", "Elegant buffet presentation"],
  // Landscape — carries its own dimensions so the lightbox does not letterbox it.
  ["s313.webp", "Floral entrance archway leading into an engagement ceremony hall", 1620, 1080],
  ["s315.webp", "Garlanded ceremony stage with rows of draped gold chairs", 1080, 1620],
];
const galleryRowBottom = [
  ["s307.webp", "Elegant table setting with flowers"],
  ["sadhya5.webp", "A full traditional feast laid out"],
  ["s308.webp", "Beautifully plated dishes on display"],
  ["team1.webp", "Our uniformed service team on site"],
  ["s309.webp", "Dessert and live counter spread"],
  ["sadhya6.webp", "A grand sadhya served to guests"],
  ["s310.webp", "Vibrant multi-cuisine buffet"],
  ["team2.webp", "The Modern Catering crew ready to serve"],
  ["s311.webp", "Grand reception catering setup"],
  ["team3.webp", "Our trained team at a garden venue"],
  ["s312.webp", "Lavish spread at an evening celebration"],
  ["s314.webp", "Gilded pot and scattered rose petals in the entrance decor", 1080, 1620],
  ["s316.webp", "Carved wooden settee framed by jasmine and rose garlands", 1080, 1620],
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

  const tile = (rowLen, offset) => ([img, alt, w, h], i) => (
    <figure
      className={`gitem ${gSizes[((i % rowLen) + offset) % gSizes.length]}`}
      key={`${img}-${i}`}
      onClick={() => setPreview({ img, alt, w, h })}
      role="button"
      tabIndex={0}
      aria-label={`View: ${alt}`}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setPreview({ img, alt, w, h })}
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
            width={preview.w ?? (/^s\d/.test(preview.img) ? 1080 : 1600)}
            height={preview.h ?? (/^s\d/.test(preview.img) ? 1350 : 1067)}
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
