"use client";
import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    // Compose a WhatsApp message as a no-backend fallback
    const msg =
      `New enquiry from ${data.get("name") || "—"}%0A` +
      `Phone: ${data.get("phone") || "—"}%0A` +
      `Event: ${data.get("event") || "—"}%0A` +
      `Guests: ${data.get("guests") || "—"}%0A` +
      `Details: ${data.get("message") || "—"}`;
    window.open(`https://wa.me/919447268441?text=${msg}`, "_blank", "noopener");
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <form className="contact__form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" placeholder="Your name" required />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone</label>
        <input id="phone" name="phone" type="tel" placeholder="Your phone number" required />
      </div>
      <div className="field">
        <label htmlFor="event">Event Type</label>
        <select id="event" name="event" defaultValue="Wedding">
          <option>Wedding</option>
          <option>Reception</option>
          <option>Corporate Event</option>
          <option>Birthday / Anniversary</option>
          <option>Other</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="guests">Guests (approx.)</label>
        <input id="guests" name="guests" type="number" placeholder="e.g. 250" min="1" />
      </div>
      <div className="field field--full">
        <label htmlFor="message">Tell us more</label>
        <textarea id="message" name="message" rows={4} placeholder="Date, venue, cuisine preferences..." />
      </div>
      <button type="submit" className="btn btn--gold btn--full">
        Send Enquiry
      </button>
      {sent && <p className="contact__note">Thank you! Your enquiry is opening in WhatsApp.</p>}
    </form>
  );
}
