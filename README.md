# Modern Catering — Website

A minimal, elegant single-page website for **Modern Catering** (Thrissur, Kerala) — _"Taste the Celebration"_. Built with **Next.js (App Router)**.

## Sections
Home (video hero) · About · Services · Gallery · Reels · Team · Stats · Contact · Footer

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

## Assets

Optimised images live in `public/images/` and compressed videos in `public/videos/`.
The originals (large source PNGs + reel MP4s) stay in the project root and
`insta-reels-videos/`. To regenerate the optimised assets after adding new
originals, run:

```bash
node public/scripts/compress.mjs
```

This uses `sharp` (images → JPG, max 1400px) and a bundled `ffmpeg-static`
binary (hero → 1280px muted, reels → 720px vertical with audio).

## Customising

- **Colours / fonts** — CSS custom properties at the top of `app/globals.css`.
- **Content** — section data arrays in `app/page.js`.
- **Contact form** — `components/ContactForm.js` currently opens a pre-filled
  WhatsApp message (no backend required). Swap in an API route or a service like
  Formspree if you want email delivery.
