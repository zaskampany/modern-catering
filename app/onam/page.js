import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import OnamBookingForm from "@/components/OnamBookingForm";
import { IconPhone, IconWhatsApp, IconPin } from "@/components/Icons";
import { onam, map, whatsappLink } from "@/lib/site";

export const metadata = {
  title: `Onam Sadhya ${onam.year} | Modern Catering, Thrissur`,
  description: `Onam sadhya ₹${onam.sadhya.price} for ${onam.sadhya.serves} members, from Modern Catering, Kolazhi. Full traditional banana-leaf sadhya on Thiruvonam day. Book your order.`,
  openGraph: {
    title: `Onam Sadhya ${onam.year}: ₹${onam.sadhya.price} for ${onam.sadhya.serves} | Modern Catering`,
    description: `A full traditional Onam sadhya on Thiruvonam day, from Modern Catering, Kolazhi, Thrissur.`,
    images: ["/images/s304.jpg"],
  },
};

export default function OnamPage() {
  const {
    soldOut, sadhya, payasams, formEmbedUrl, formPostUrl, formEmbed, formUrl, year,
    poster, pickup, sadhyaTime, payasamTime, bookingPhone, onSwiggy, onZomato,
    collectionDateLabel,
  } = onam;

  return (
    <>
      <Nav />
      <main className="onam">
        {/* HEADER */}
        <header className="onam__hero">
          <div className="container onam__herotext">
            <p className="eyebrow eyebrow--light">
              Onam {year} {soldOut ? "· Fully Booked" : "· Now Booking"}
            </p>
            <h1 className="onam__title">
              {soldOut ? (
                <>Onam sadhya is <em>fully booked</em></>
              ) : (
                <>The sadhya your<br />Onam <em>deserves</em></>
              )}
            </h1>
            <p className="onam__lead">
              {soldOut
                ? `Every order for Onam ${year} has been taken. Thank you for the wonderful response. We're still catering all other events.`
                : `A full traditional sadhya on Thiruvonam day, cooked fresh and packed on banana leaf. ₹${sadhya.price} for ${sadhya.serves} members, ready to collect from Kolazhi.`}
            </p>
            {!soldOut && (
              <a href="#book" className="btn btn--gold">Book Your Sadhya</a>
            )}
          </div>
        </header>

        {/* THE PACKAGE */}
        <section className="section onam__packages">
          <div className="container">
            <Reveal className="section__head">
              <p className="eyebrow">The Sadhya</p>
              <h2 className="title">What&apos;s on the <em>leaf</em></h2>
              <p className="section__lead">
                One complete sadhya, {sadhya.items.length} items including two
                litres of payasam, enough for {sadhya.serves} people.
              </p>
            </Reveal>

            <div className="osadhya">
              <Reveal className="osadhya__poster">
                <Image
                  src={poster}
                  alt={`Modern Catering Onam Sadhya ${year} poster: ₹${sadhya.price} for ${sadhya.serves} members`}
                  width={1000}
                  height={1333}
                  sizes="(max-width: 960px) 92vw, 420px"
                />
              </Reveal>

              <Reveal className="osadhya__detail">
                <div className="osadhya__pricebox">
                  <span className="osadhya__amount">₹{sadhya.price}</span>
                  <span className="osadhya__serves">for {sadhya.serves} members</span>
                </div>

                <ul className="osadhya__items">
                  {sadhya.items.map(([en, ml]) => (
                    <li key={en}>
                      <span className="osadhya__en">{en}</span>
                      <span className="osadhya__ml" lang="ml">{ml}</span>
                    </li>
                  ))}
                </ul>

                {!soldOut && (
                  <a href="#book" className="btn btn--gold btn--full">Book This Sadhya</a>
                )}
              </Reveal>
            </div>

            {/* PAYASAM ADD-ONS */}
            <Reveal className="opayasam">
              <div className="opayasam__head">
                <h3>Extra payasam</h3>
                <p>Want more than the two litres included? Add any of these by the litre.</p>
              </div>
              <div className="opayasam__grid">
                {payasams.map((p) => (
                  <div className="opayasam__card" key={p.name}>
                    <span className="opayasam__name">{p.name}</span>
                    <span className="opayasam__ml" lang="ml">{p.malayalam}</span>
                    <span className="opayasam__price">₹{p.price}<i>/{p.unit}</i></span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* COLLECTION */}
            <Reveal className="ocollect">
              <div className="ocollect__item">
                <span className="ocollect__label">Collection Date</span>
                <strong>{collectionDateLabel}</strong>
              </div>
              <div className="ocollect__item">
                <span className="ocollect__label">Collection Point</span>
                <strong>{pickup}</strong>
              </div>
              <div className="ocollect__item">
                <span className="ocollect__label">Sadhya Collection</span>
                <strong>{sadhyaTime}</strong>
              </div>
              <div className="ocollect__item">
                <span className="ocollect__label">Payasam Collection</span>
                <strong>{payasamTime}</strong>
              </div>
              {(onSwiggy || onZomato) && (
                <div className="ocollect__item">
                  <span className="ocollect__label">Also Available On</span>
                  <strong>
                    {[onSwiggy && "Swiggy", onZomato && "Zomato"].filter(Boolean).join(" & ")}
                  </strong>
                </div>
              )}
            </Reveal>

            {/* MAP — collection only, so finding the place matters */}
            <Reveal className="omap">
              <div className="omap__text">
                <h3>No delivery. Collect from us.</h3>
                <p>
                  Every sadhya is collected in person from {pickup}. We don&apos;t
                  deliver to home addresses, so please plan to pick your order up
                  within the collection window.
                </p>
                <a
                  href={map.link}
                  className="btn btn--dark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconPin /> Get Directions
                </a>
              </div>
              <div className="omap__frame">
                <iframe
                  src={map.embedUrl}
                  title={`Map to ${pickup}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* BOOKING */}
        <section className="section onam__book" id="book">
          <div className="container">
            <Reveal className="section__head">
              <p className="eyebrow">Reserve Your Date</p>
              <h2 className="title">
                {soldOut ? <>Bookings are <em>closed</em></> : <>Book your <em>sadhya</em></>}
              </h2>
              <p className="section__lead">
                {soldOut
                  ? `We're fully committed for Onam ${year}. Leave us a message and we'll reach out first when next season opens.`
                  : "Fill in the form below and we'll confirm your slot by phone. It takes about a minute."}
              </p>
            </Reveal>

            {soldOut ? (
              <div className="obook__closed">
                <h3>Fully booked for Onam {year}</h3>
                <p>
                  Every sadhya slot has been reserved. We&apos;re still open for
                  weddings, receptions and corporate events.
                </p>
                <div className="obook__actions">
                  <Link href="/#contact" className="btn btn--gold">Enquire For Other Events</Link>
                </div>
              </div>
            ) : formPostUrl && !formEmbed ? (
              /* Themed on-site form — posts to the same Google Form, so the
                 responses still collect in the linked sheet. */
              <div className="obook">
                <OnamBookingForm />
                <p className="obook__fallback">
                  Prefer Google Forms?{" "}
                  <a href={formUrl} target="_blank" rel="noopener noreferrer">
                    Open the original form ↗
                  </a>
                </p>
              </div>
            ) : formEmbedUrl ? (
              <div className="obook">
                <iframe
                  src={formEmbedUrl}
                  title={`Onam ${year} sadhya booking form`}
                  className="obook__frame"
                  loading="lazy"
                >
                  Loading booking form…
                </iframe>
                <p className="obook__fallback">
                  Form not loading?{" "}
                  <a href={formUrl} target="_blank" rel="noopener noreferrer">
                    Open it in a new tab ↗
                  </a>
                </p>
              </div>
            ) : formUrl ? (
              /* A forms.gle short link can't be rewritten for embedding without
                 following its redirect — link out to it instead. */
              <div className="obook__closed">
                <h3>Reserve your sadhya</h3>
                <p>
                  Our booking form opens in a new tab. It takes about a minute,
                  and we&apos;ll call you back to confirm the slot.
                </p>
                <div className="obook__actions">
                  <a href={formUrl} className="btn btn--gold" target="_blank" rel="noopener noreferrer">
                    Open Booking Form ↗
                  </a>
                </div>
              </div>
            ) : (
              <div className="obook__closed">
                <h3>Booking form not configured yet</h3>
                <p>
                  Set <code>NEXT_PUBLIC_ONAM_FORM_URL</code> in <code>.env.local</code>{" "}
                  to your Google Form link, then rebuild. Until then, guests can
                  still reach you directly.
                </p>
                <div className="obook__actions">
                  <a href={bookingPhone.tel} className="btn btn--dark">
                    <IconPhone /> Call {bookingPhone.display}
                  </a>
                  <a
                    href={whatsappLink(`Hi, I'd like to book an Onam sadhya for Onam ${year}.`)}
                    className="btn btn--gold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconWhatsApp /> WhatsApp Us
                  </a>
                </div>
              </div>
            )}

            <div className="obook__direct">
              <p>Or book by phone</p>
              <div className="obook__actions">
                <a href={bookingPhone.tel} className="obook__phone">
                  <IconPhone /> {bookingPhone.display}
                </a>
                <a
                  href={whatsappLink(`Hi, I'd like to ask about your Onam ${year} sadhya.`)}
                  className="obook__phone"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconWhatsApp /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
