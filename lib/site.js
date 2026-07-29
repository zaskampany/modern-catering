// Centralized contact & social config.
// Values come from NEXT_PUBLIC_* env vars (see .env.example). Fallbacks keep the
// site working without a .env file. All vars are NEXT_PUBLIC_ so they can be read
// from client components (Nav, ContactForm, Reels).
//
// Phones use ?? (not ||) so an *explicitly empty* value is respected and hidden,
// while an unset value still falls back to a default.

const phonePrimary = process.env.NEXT_PUBLIC_PHONE_PRIMARY ?? "+919447268441";
const phoneSecondary = process.env.NEXT_PUBLIC_PHONE_SECONDARY ?? "+919497843441";

// "+919447268441" -> "+91 94472 68441" for display
function formatPhone(p) {
  const d = p.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  return p;
}

export const telLink = (p) => `tel:${p.replace(/\s/g, "")}`;
export const mailLink = (e) => `mailto:${e}`;

// Only the numbers that are actually set — empty ones are dropped, not shown.
const phones = [phonePrimary, phoneSecondary]
  .filter((p) => p && p.trim())
  .map((p) => ({ tel: telLink(p), display: formatPhone(p) }));

export const site = {
  phones,
  email: process.env.NEXT_PUBLIC_EMAIL || "moderncatering1997@gmail.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "919447268441",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "https://instagram.com/moderncatering",
  instagramReels:
    process.env.NEXT_PUBLIC_INSTAGRAM_REELS || "https://www.instagram.com/moderncatering/reels/",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK || "https://facebook.com/moderncatering",
  addressLine1: process.env.NEXT_PUBLIC_ADDRESS_LINE1 || "Sivagiri Nagar, Doctor Padi",
  addressLine2: process.env.NEXT_PUBLIC_ADDRESS_LINE2 || "Kolazhy, Thrissur, Kerala",
  addressShort: process.env.NEXT_PUBLIC_ADDRESS_SHORT || "Kolazhy, Thrissur, Kerala",
};

export const whatsappLink = (text) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${text}` : ""}`;
