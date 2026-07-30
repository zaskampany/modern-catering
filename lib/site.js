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

// ============ ONAM (seasonal) ============
// Drives all three Onam surfaces: the homepage strip, the first-visit popup and
// the /onam booking page. Env vars accept yes/no as well as true/false.
//
//   NEXT_PUBLIC_ONAM_ENABLED   "no" retires the promo everywhere at once.
//   NEXT_PUBLIC_ONAM_SOLD_OUT  "yes" keeps /onam live but replaces the booking
//                              form with a "fully booked" message.
//   NEXT_PUBLIC_ONAM_UNTIL     Last day to show it (YYYY-MM-DD, inclusive).
//                              The strip and popup retire themselves after it.
//   NEXT_PUBLIC_ONAM_FORM_URL  Google Form URL. Paste the normal share link —
//                              it gets rewritten to the embeddable form below.
//
// Changing any of these needs a rebuild/redeploy: the pages are statically
// prerendered, so the values are baked in at build time.

const bool = (v, fallback) => {
  if (v == null || v.trim() === "") return fallback;
  return /^(1|true|yes|on)$/i.test(v.trim());
};

// Google Form share links come in several shapes (/edit, /viewform, forms.gle).
// Only /viewform?embedded=true renders correctly inside an iframe.
function formBase(url) {
  if (!url) return "";
  const clean = url.trim().split("#")[0];
  // Short forms.gle links can't be rewritten without following the redirect —
  // they still work as a plain link, just not embedded or posted to.
  if (!/docs\.google\.com\/forms/.test(clean)) return "";
  return clean.split("?")[0].replace(/\/(edit|viewform|viewanalytics|formResponse)?$/, "");
}

function toEmbedUrl(url) {
  const base = formBase(url);
  return base ? `${base}/viewform?embedded=true` : "";
}

// Endpoint the themed on-site form posts to. Responses land in the same
// Google Form (and the same linked sheet) as the embedded version would.
function toPostUrl(url) {
  const base = formBase(url);
  return base ? `${base}/formResponse` : "";
}

const onamFormUrl = process.env.NEXT_PUBLIC_ONAM_FORM_URL || "";
const onamBookingPhone = process.env.NEXT_PUBLIC_ONAM_BOOKING_PHONE || "+919497843441";
const onamDeliveryDate = process.env.NEXT_PUBLIC_ONAM_DELIVERY_DATE || "2026-08-26";

// Formatted by hand rather than via Intl/toLocaleDateString: those depend on
// the runtime's locale and timezone, which differ between the build server and
// the visitor's browser and would trip a hydration mismatch. Fixed UTC parsing
// makes the output identical everywhere.
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso).trim());
  if (!m) return "";
  const [, y, mo, d] = m;
  const dt = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d)));
  if (Number.isNaN(dt.getTime())) return "";
  return `${WEEKDAYS[dt.getUTCDay()]}, ${Number(d)} ${MONTHS[dt.getUTCMonth()]} ${y}`;
}

// Every price below comes from the printed Onam poster (public/images/
// onam-poster.webp). Keep the two in sync — if the poster is reprinted with new
// rates, update .env.local rather than editing this file.
const payasam = (name, malayalam) => ({
  name,
  malayalam,
  price: process.env.NEXT_PUBLIC_ONAM_PAYASAM_PRICE || "270",
  unit: "1 ltr",
});

export const onam = {
  enabled: bool(process.env.NEXT_PUBLIC_ONAM_ENABLED, true),
  soldOut: bool(process.env.NEXT_PUBLIC_ONAM_SOLD_OUT, false),
  until: process.env.NEXT_PUBLIC_ONAM_UNTIL || "2026-08-26",
  year: process.env.NEXT_PUBLIC_ONAM_YEAR || "2026",
  formUrl: onamFormUrl,
  formEmbedUrl: toEmbedUrl(onamFormUrl),
  formPostUrl: toPostUrl(onamFormUrl),
  // "yes" drops back to the raw embedded Google Form instead of the themed
  // on-site form — useful if the form's fields change and the ids drift.
  formEmbed: bool(process.env.NEXT_PUBLIC_ONAM_FORM_EMBED, false),
  poster: "/images/onam-poster.webp",

  // "yes" re-shows the popup on every page load. Default is once per browser
  // session, which is the friendlier setting once the promo has been up a while.
  popupEveryVisit: bool(process.env.NEXT_PUBLIC_ONAM_POPUP_EVERY_VISIT, false),

  // The one sadhya package the poster advertises: ₹2800 for 5 people.
  sadhya: {
    price: process.env.NEXT_PUBLIC_ONAM_SADHYA_PRICE || "2800",
    serves: process.env.NEXT_PUBLIC_ONAM_SADHYA_SERVES || "5",
    items: [
      ["Choru", "ചോറ്"],
      ["Sambar", "സാമ്പാർ"],
      ["Rasam", "രസം"],
      ["Pachadi", "പച്ചടി"],
      ["Koottukari", "കൂട്ടുകറി"],
      ["Kaalan", "കാളൻ"],
      ["Ishtu", "ഇഷ്ടു"],
      ["Avial", "അവിയൽ"],
      ["Thoran", "തോരൻ"],
      ["Puliyinji", "പുളിഞ്ചി"],
      ["Naranga", "നാരങ്ങ"],
      ["Varavu × 2", "വറവ്-2"],
      ["Pappadam", "പപ്പടം"],
      ["Moru", "മോര്"],
      ["Pazham Nurukku", "പഴംനുറുക്ക്"],
      ["Palada (1 ltr)", "പാലട"],
      ["Parippu Pradhaman (1 ltr)", "പരിപ്പ് പ്രഥമൻ"],
      ["Banana Leaf", "ഇല"],
    ],
  },

  // Optional extra litres, for anyone who wants more than the two included.
  payasams: [
    payasam("Parippu Pradhaman", "പരിപ്പ് പ്രഥമൻ"),
    payasam("Palada Pradhaman", "പാലട പ്രഥമൻ"),
    payasam("Pazham Pradhaman", "പഴം പ്രഥമൻ"),
  ],

  // Delivery/collection happens on Thiruvonam day only.
  deliveryDate: onamDeliveryDate,
  deliveryDateLabel: formatDate(onamDeliveryDate),
  deliveryDateShort: formatDate(onamDeliveryDate).replace(/^[^,]+,\s*/, ""),

  // Collection point and timings — this is a pickup/delivery offer, not on-site
  // catering, so these matter more than they would for an event booking.
  pickup: process.env.NEXT_PUBLIC_ONAM_PICKUP || "Modern Catering, Kolazhi, Doctor Padi",
  sadhyaTime: process.env.NEXT_PUBLIC_ONAM_SADHYA_TIME || "11:00 am – 12:30 pm",
  payasamTime: process.env.NEXT_PUBLIC_ONAM_PAYASAM_TIME || "From 7:00 am",
  // The poster prints its own booking line, which may differ from the numbers
  // in the site footer — so it's resolved here rather than reusing site.phones.
  bookingPhone: {
    tel: telLink(onamBookingPhone),
    display: formatPhone(onamBookingPhone),
  },
  onSwiggy: bool(process.env.NEXT_PUBLIC_ONAM_ON_SWIGGY, true),
  onZomato: bool(process.env.NEXT_PUBLIC_ONAM_ON_ZOMATO, true),
};

// Evaluated on the client so an expired promo disappears without a redeploy.
export function onamIsLive(now = new Date()) {
  if (!onam.enabled) return false;
  if (!onam.until) return true;
  const end = new Date(`${onam.until}T23:59:59`);
  if (Number.isNaN(end.getTime())) return true; // malformed date shouldn't hide it
  return now <= end;
}
