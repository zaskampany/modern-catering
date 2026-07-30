import { IconArrowDown } from "@/components/Icons";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <video
        className="hero__video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/sadhya1.webp"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="hero__overlay" />
      <div className="hero__content container">
        <p className="hero__eyebrow">Est. 1997 · Thrissur, Kerala</p>
        <h1 className="hero__title">
          We Cater
          <br />
          <em>Celebrations</em>
        </h1>
        <p className="hero__sub">
          Weddings, receptions and every big day in between, served with bold
          flavour, effortless style and the warmth Kerala is known for.
        </p>
        <div className="hero__actions">
          <a href="#contact" className="btn btn--gold">
            Plan Your Event
          </a>
          <a href="#gallery" className="btn btn--ghost">
            View Our Work
          </a>
        </div>
      </div>
      <a href="#about" className="hero__scroll" aria-label="Scroll down">
        <IconArrowDown />
      </a>
    </section>
  );
}
