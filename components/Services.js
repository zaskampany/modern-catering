"use client";
import { useState } from "react";
import Reveal from "@/components/Reveal";
import { IconChevron } from "@/components/Icons";

const services = [
  ["01", "Wedding Catering", "Your big day deserves a feast to match. From traditional sadhya to lavish multi-cuisine spreads, we make every plate memorable."],
  ["02", "Live Counters", "Freshly made, right before your eyes. Our chefs run interactive stations that turn dining into part of the entertainment."],
  ["03", "Buffet Service", "Stunning illuminated counters, thoughtful décor and a spread that keeps guests coming back for more."],
  ["04", "Corporate & Events", "Product launches, retirements, school functions and office parties, handled with precision, polish and perfect timing."],
  ["05", "Custom Menus", "Pure-veg, non-veg or regional favourites. We build a menu around your taste, your tradition and your budget."],
  ["06", "Full Event Management", "Décor, seating, uniformed staff and clean-up. Leave the logistics to us and simply enjoy your own celebration."],
];

export default function Services() {
  const [open, setOpen] = useState(0); // first row open by default

  return (
    <div className="services__list">
      {services.map(([num, title, desc], i) => {
        const isOpen = open === i;
        return (
          <Reveal as="article" className={`srow${isOpen ? " is-open" : ""}`} key={num}>
            <button
              type="button"
              className="srow__head"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
            >
              <span className="srow__num">{num}</span>
              <span className="srow__title">{title}</span>
              <span className="srow__arrow" aria-hidden="true"><IconChevron /></span>
            </button>
            <div className="srow__panel">
              <p className="srow__desc">{desc}</p>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
