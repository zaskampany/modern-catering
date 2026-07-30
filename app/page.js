import Image from "next/image";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import Reels from "@/components/Reels";
import Services from "@/components/Services";
import Menu from "@/components/Menu";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import OnamStrip from "@/components/OnamStrip";
import OnamPopup from "@/components/OnamPopup";
import { IconPin, IconPhone, IconMail, IconWhatsApp } from "@/components/Icons";
import { site, mailLink, whatsappLink } from "@/lib/site";



const testimonials = [
  ["The food was the highlight of our wedding. Every guest kept asking who the caterers were, and the service was flawless from start to finish.", "Anjali & Rahul", "Wedding, Thrissur", "A"],
  ["Handled our office event for 400 people without a single hiccup. Punctual, professional and genuinely delicious.", "Deepak Menon", "Corporate Event", "D"],
  ["From the live counters to the desserts, everything was top class. The team treated our family like their own.", "Suja Thomas", "Reception, Kolazhy", "S"],
];

// Every gallery image, split across two collage rows. Size classes (assigned
// by position below) vary the tiles so the track reads like a packed collage
// rather than a plain filmstrip.
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

        {/* Sliding panel — content scrolls up over the pinned hero */}
        <div className="stack">
        {/* ONAM — seasonal; removes itself once the promo ends (see lib/site.js) */}
        <OnamStrip />

        {/* ABOUT */}
        <section className="about section" id="about">
          <div className="container about__grid">
            <Reveal className="about__media">
              <Image src="/images/s305.webp" alt="Modern Catering live counter setup" fill sizes="(max-width: 960px) 100vw, 45vw" />
              <div className="about__badge">
                <span className="about__badge-num">25+</span>
                <span className="about__badge-txt">Years of<br />Celebrations</span>
              </div>
            </Reveal>
            <Reveal className="about__text">
              <p className="eyebrow">About Us</p>
              <h2 className="title">Great food, done<br />the <em>right way</em></h2>
              <p>
                Since 1997, <strong>Modern Catering</strong>&nbsp;has been a trusted name behind Kerala&apos;s
                happiest occasions. What started as a small family kitchen now serves everything from
                intimate get-togethers to weddings of a thousand guests, with the same care in every dish.
              </p>
              <p>
                We keep it simple: authentic flavours, spotless presentation and a team that treats your
                guests like their own. With us, the food isn&apos;t just part of the event, it&apos;s the part
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
            <Services />
          </div>
        </section>

        {/* MENU */}
        <section className="menu section" id="menu">
          <div className="container">
            <Reveal className="section__head">
              <p className="eyebrow">Our Menu</p>
              <h2 className="title">A feast for <em>every taste</em></h2>
              <p className="section__lead">From an authentic Kerala sadhya to lavish multi-cuisine spreads, every menu is fully customisable. Here&apos;s a taste of what we serve.</p>
            </Reveal>
            <Menu />
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

          <Gallery />
        </section>

        {/* REELS */}
        <section className="reels section" id="reels">
          <div className="container">
            <Reveal className="section__head">
              <p className="eyebrow">In Motion</p>
              <h2 className="title">Straight From Our Events</h2>
              <p className="section__lead">Real celebrations, real flavour. Tap to watch.</p>
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
                coordinators, all trained, uniformed and passionate about hospitality. When you host with
                Modern Catering, you get people who genuinely care that every guest leaves happy.
              </p>
              <a href="#contact" className="btn btn--dark">Work With Us</a>
            </Reveal>
            <Reveal className="team__media">
              <Image src="/images/team3.webp" alt="The Modern Catering service team in uniform" fill sizes="(max-width: 960px) 100vw, 45vw" />
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
                  <div><strong>Visit Us</strong><br />{site.addressLine1},<br />{site.addressLine2}</div>
                </li>
                {site.phones.length > 0 && (
                  <li>
                    <span className="contact__ico"><IconPhone /></span>
                    <div>
                      <strong>Call Us</strong><br />
                      {site.phones.map((p, i) => (
                        <span key={p.tel}>
                          <a href={p.tel}>{p.display}</a>
                          {i < site.phones.length - 1 && <br />}
                        </span>
                      ))}
                    </div>
                  </li>
                )}
                <li>
                  <span className="contact__ico"><IconMail /></span>
                  <div><strong>Email</strong><br /><a href={mailLink(site.email)}>{site.email}</a></div>
                </li>
              </ul>
            </div>
            <ContactForm />
          </div>
        </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <Image src="/images/logo.png" alt="Modern Catering" width={76} height={76} />
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
            {site.phones.map((p) => (
              <a key={p.tel} href={p.tel}>{p.display}</a>
            ))}
            <span>{site.addressShort}</span>
          </div>
          <div className="footer__col">
            <h4>Follow</h4>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href={site.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
        <div className="footer__bar container">
          <span>© 2026 Modern Catering. All rights reserved.</span>
        </div>
      </footer>

      <a href={whatsappLink()} className="fab" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <IconWhatsApp />
      </a>

      <OnamPopup />
    </>
  );
}
