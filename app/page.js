import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import Reels from "@/components/Reels";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import { IconPin, IconPhone, IconMail, IconWhatsApp } from "@/components/Icons";

const services = [
  ["01", "Wedding Catering", "Your big day deserves a feast to match. From traditional sadhya to lavish multi-cuisine spreads, we make every plate memorable."],
  ["02", "Live Counters", "Freshly made, right before your eyes. Our chefs run interactive stations that turn dining into part of the entertainment."],
  ["03", "Buffet Service", "Stunning illuminated counters, thoughtful décor and a spread that keeps guests coming back for more."],
  ["04", "Corporate & Events", "Product launches, retirements, school functions and office parties — handled with precision, polish and perfect timing."],
  ["05", "Custom Menus", "Pure-veg, non-veg or regional favourites — we build a menu around your taste, your tradition and your budget."],
  ["06", "Full Event Management", "Décor, seating, uniformed staff and clean-up — leave the logistics to us and simply enjoy your own celebration."],
];

const menu = [
  ["Welcome & Starters", "Veg & Non-Veg", [
    "Welcome drink & fresh cut fruits",
    "Cream of vegetable soup",
    "Chicken 65 · Chilli chicken",
    "Gobi Manchurian · Paneer tikka",
    "Kerala fish fry · Prawns roast",
  ]],
  ["Kerala Sadhya", "Pure Veg", [
    "Matta rice · Parippu & ghee",
    "Sambar · Rasam · Kaalan",
    "Avial · Thoran · Olan",
    "Pachadi · Kichadi · Pickles",
    "Pappadam · Banana · Payasam",
  ]],
  ["Vegetarian Main", "Pure Veg", [
    "Ghee rice · Veg biryani",
    "Paneer butter masala",
    "Vegetable kurma · Dal makhani",
    "Chapathi · Butter naan · Porotta",
    "Gobi 65 · Mushroom masala",
  ]],
  ["Non-Vegetarian", "Non-Veg", [
    "Chicken dum biryani",
    "Mutton curry · Beef ularthiyathu",
    "Fish moilee · Chicken curry",
    "Kerala chicken roast",
    "Prawns masala · Egg roast",
  ]],
  ["Live Counters", "Interactive", [
    "Dosa & appam station",
    "Pasta & noodles counter",
    "Chaat & pani puri",
    "Grill & barbecue",
    "Ice cream & falooda bar",
  ]],
  ["Desserts & Sweets", "Sweet", [
    "Ada pradhaman · Palada payasam",
    "Gulab jamun · Rasmalai",
    "Fresh fruit salad with ice cream",
    "Assorted pastries & cakes",
    "Kulfi · Jalebi",
  ]],
];

const testimonials = [
  ["The food was the highlight of our wedding. Every guest kept asking who the caterers were — flawless service from start to finish.", "Anjali & Rahul", "Wedding, Thrissur", "A"],
  ["Handled our office event for 400 people without a single hiccup. Punctual, professional and genuinely delicious.", "Deepak Menon", "Corporate Event", "D"],
  ["From the live counters to the desserts, everything was top class. The team treated our family like their own.", "Suja Thomas", "Reception, Kolazhy", "S"],
];

// Every gallery image, split across two collage rows. Size classes (assigned
// by position below) vary the tiles so the track reads like a packed collage
// rather than a plain filmstrip.
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

const stats = [
  ["28+", "Years of Service"],
  ["6,000+", "Events Catered"],
  ["150+", "Menu Options"],
  ["100%", "Guests Delighted"],
];

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />

        {/* ABOUT */}
        <section className="about section" id="about">
          <div className="container about__grid">
            <Reveal className="about__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/s305.jpg" alt="Modern Catering live counter setup" />
              <div className="about__badge">
                <span className="about__badge-num">25+</span>
                <span className="about__badge-txt">Years of<br />Celebrations</span>
              </div>
            </Reveal>
            <Reveal className="about__text">
              <p className="eyebrow">About Us</p>
              <h2 className="title">Great food, done<br />the <em>right way</em></h2>
              <p>
                Since 1997, <strong>Modern Catering</strong> has been a trusted name behind Kerala&apos;s
                happiest occasions. What started as a small family kitchen now serves everything from
                intimate get-togethers to weddings of a thousand guests — with the same care in every dish.
              </p>
              <p>
                We keep it simple: authentic flavours, spotless presentation and a team that treats your
                guests like their own. With us, the food isn&apos;t just part of the event — it&apos;s the part
                everyone remembers.
              </p>
              <ul className="about__list">
                <li>Authentic multi-cuisine kitchens</li>
                <li>Trained &amp; uniformed service team</li>
                <li>Custom menus for every tradition</li>
                <li>End-to-end event management</li>
              </ul>
              <a href="#services" className="link-arrow">Explore our services →</a>
            </Reveal>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services section" id="services">
          <div className="container">
            <Reveal className="section__head">
              <p className="eyebrow">What We Do</p>
              <h2 className="title">Our Services</h2>
              <p className="section__lead">A complete catering experience, tailored to the moment you&apos;re celebrating.</p>
            </Reveal>
            <div className="services__grid">
              {services.map(([num, title, desc]) => (
                <Reveal className="scard" as="article" key={num}>
                  <span className="scard__num">{num}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* MENU */}
        <section className="menu section" id="menu">
          <div className="container">
            <Reveal className="section__head">
              <p className="eyebrow">Our Menu</p>
              <h2 className="title">A feast for <em>every taste</em></h2>
              <p className="section__lead">From an authentic Kerala sadhya to lavish multi-cuisine spreads — every menu is fully customisable. Here&apos;s a taste of what we serve.</p>
            </Reveal>
            <div className="menu__grid">
              {menu.map(([cat, tag, items]) => (
                <Reveal className="mcat" as="article" key={cat}>
                  <div className="mcat__head">
                    <h3>{cat}</h3>
                    <span className="mcat__tag">{tag}</span>
                  </div>
                  <ul>
                    {items.map((dish) => (
                      <li key={dish}>{dish}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="gallery section" id="gallery">
          <div className="container">
            <Reveal className="section__head">
              <p className="eyebrow">Our Work</p>
              <h2 className="title">Moments We&apos;ve Catered</h2>
              <p className="section__lead">A glimpse into the celebrations we&apos;ve had the honour of serving.</p>
            </Reveal>
          </div>

          {/* Infinite collage carousel — two rows drifting in opposite directions */}
          <div className="gallery__carousel" aria-label="Gallery of catered events">
            <div className="gallery__row">
              <div className="gallery__track gallery__track--left">
                {[...galleryRowTop, ...galleryRowTop].map(([img, alt], i) => (
                  <figure className={`gitem ${gSizes[(i % galleryRowTop.length) % gSizes.length]}`} key={`t-${img}-${i}`} aria-hidden={i >= galleryRowTop.length}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/images/${img}`} alt={alt} loading="lazy" />
                  </figure>
                ))}
              </div>
            </div>
            <div className="gallery__row">
              <div className="gallery__track gallery__track--right">
                {[...galleryRowBottom, ...galleryRowBottom].map(([img, alt], i) => (
                  <figure className={`gitem ${gSizes[((i % galleryRowBottom.length) + 2) % gSizes.length]}`} key={`b-${img}-${i}`} aria-hidden={i >= galleryRowBottom.length}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/images/${img}`} alt={alt} loading="lazy" />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* REELS */}
        <section className="reels section" id="reels">
          <div className="container">
            <Reveal className="section__head">
              <p className="eyebrow">In Motion</p>
              <h2 className="title">Straight From Our Events</h2>
              <p className="section__lead">Real celebrations, real flavour — tap to watch.</p>
            </Reveal>
          </div>
          <Reels />
        </section>

        {/* STATS */}
        <section className="stats">
          <div className="container stats__grid">
            {stats.map(([num, label]) => (
              <div className="stat" key={label}>
                <span className="stat__num">{num}</span>
                <span className="stat__label">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="testi section" id="testimonials">
          <div className="container">
            <Reveal className="section__head">
              <p className="eyebrow">Kind Words</p>
              <h2 className="title">Loved by our <em>guests</em></h2>
              <p className="section__lead">Nothing means more to us than a happy table. Here&apos;s what our clients say.</p>
            </Reveal>
            <Testimonials items={testimonials} />
          </div>
        </section>

        {/* TEAM */}
        <section className="team section" id="team">
          <div className="container team__grid">
            <Reveal className="team__text">
              <p className="eyebrow">The People</p>
              <h2 className="title">A team that treats<br />your event like family</h2>
              <p>
                Behind every seamless celebration is our dedicated team of chefs, service staff and
                coordinators — trained, uniformed and passionate about hospitality. When you host with
                Modern Catering, you get people who genuinely care that every guest leaves happy.
              </p>
              <a href="#contact" className="btn btn--dark">Work With Us</a>
            </Reveal>
            <Reveal className="team__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/team3.jpg" alt="The Modern Catering service team in uniform" />
            </Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact section" id="contact">
          <div className="container contact__grid">
            <div className="contact__info">
              <p className="eyebrow">Get In Touch</p>
              <h2 className="title">Let&apos;s plan your<br />celebration</h2>
              <p className="contact__lead">Tell us about your event and we&apos;ll craft a menu and quote made just for you.</p>
              <ul className="contact__details">
                <li>
                  <span className="contact__ico"><IconPin /></span>
                  <div><strong>Visit Us</strong><br />Sivagiri Nagar, Doctor Padi,<br />Kolazhy, Thrissur, Kerala</div>
                </li>
                <li>
                  <span className="contact__ico"><IconPhone /></span>
                  <div>
                    <strong>Call Us</strong><br />
                    <a href="tel:+919447268441">+91 94472 68441</a><br />
                    <a href="tel:+919497843441">+91 94978 43441</a>
                  </div>
                </li>
                <li>
                  <span className="contact__ico"><IconMail /></span>
                  <div><strong>Email</strong><br /><a href="mailto:moderncatering1997@gmail.com">moderncatering1997@gmail.com</a></div>
                </li>
              </ul>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="Modern Catering" />
            <p>Taste the Celebration.<br />Serving Kerala&apos;s finest since 1997.</p>
          </div>
          <div className="footer__col">
            <h4>Explore</h4>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#gallery">Gallery</a>
            <a href="#reels">Reels</a>
          </div>
          <div className="footer__col">
            <h4>Contact</h4>
            <a href="tel:+919447268441">+91 94472 68441</a>
            <a href="tel:+919497843441">+91 94978 43441</a>
            <span>Kolazhy, Thrissur, Kerala</span>
          </div>
          <div className="footer__col">
            <h4>Follow</h4>
            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://wa.me/919447268441" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
        <div className="footer__bar container">
          <span>© 2026 Modern Catering. All rights reserved.</span>
          <span>FSSAI Lic. 11320008000498</span>
        </div>
      </footer>

      <a href="https://wa.me/919447268441" className="fab" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <IconWhatsApp />
      </a>
    </>
  );
}
