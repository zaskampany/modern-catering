"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { onam, onamIsLive } from "@/lib/site";

// Temporary seasonal band on the homepage. Renders nothing once the promo is
// switched off or its end date passes — checked on the client so an expired
// promo disappears on its own, without a redeploy.
export default function OnamStrip() {
  const [live, setLive] = useState(false);

  useEffect(() => {
    setLive(onamIsLive());
  }, []);

  if (!live) return null;

  const soldOut = onam.soldOut;

  return (
    <section className={`ostrip${soldOut ? " is-soldout" : ""}`} id="onam" aria-label={`Onam ${onam.year}`}>
      <div className="container ostrip__inner">
        <div className="ostrip__text">
          <p className="ostrip__eyebrow">
            <span className="ostrip__dot" aria-hidden="true" />
            Onam {onam.year} {soldOut ? "· Fully Booked" : "· Now Booking"}
          </p>
          <h2 className="ostrip__title">
            {soldOut ? (
              <>Our Onam sadhya is <em>fully booked</em></>
            ) : (
              <>
                Onam sadhya <em>₹{onam.sadhya.price}</em> for {onam.sadhya.serves} members
              </>
            )}
          </h2>
          <p className="ostrip__lead">
            {soldOut
              ? "Thank you for the wonderful response. Every order is taken, but we're still catering all other events."
              : `A full traditional sadhya on Thiruvonam day, ${onam.sadhya.items.length} items including two litres of payasam. Collect from Kolazhi.`}
          </p>

          <div className="ostrip__cta">
            {soldOut ? (
              <a href="#contact" className="btn btn--dark">Enquire For Other Events</a>
            ) : (
              <>
                <Link href="/onam" className="btn btn--gold">View Packages &amp; Book</Link>
                <Link href="/onam" className="ostrip__link">See what&apos;s included →</Link>
              </>
            )}
          </div>
        </div>

        {/* The poster repeats the price and full dish list, so it only earns its
            place while there's still something to book. */}
        {!soldOut && (
          <Link href="/onam" className="ostrip__poster" aria-label={`Onam ${onam.year} sadhya: see full details`}>
            <Image
              src={onam.poster}
              alt={`Modern Catering Onam Sadhya ${onam.year}: ₹${onam.sadhya.price} for ${onam.sadhya.serves} members`}
              width={1000}
              height={1333}
              sizes="(max-width: 720px) 78vw, (max-width: 960px) 40vw, 300px"
            />
          </Link>
        )}
      </div>
    </section>
  );
}
