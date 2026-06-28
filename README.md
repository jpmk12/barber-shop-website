# Terry's Barber Shop — website

A modern, responsive, mobile-friendly site for Terry's Barber Shop in
Monroe, LA. Built as a single static page — no build step, no framework —
so it loads fast, costs nothing extra to host, and is easy to maintain.

🔗 Live: https://www.terrys-barbershop.com/

## What's here

```
index.html              The site (one page, semantic HTML5)
assets/
  css/styles.css        Mobile-first responsive styles
  js/main.js            Mobile nav + live "Open now / Closed" indicator
  favicon.svg           Barber-pole favicon
  img/                  Optimized photos (WebP + JPEG fallback)
robots.txt, sitemap.xml SEO basics
_original_site/         Archive of the previous site (see its README)
```

## Editing common things

- **Hours / prices / phone / address:** all in `index.html`. The opening-hours
  logic for the "Open now" badge is also defined in `assets/js/main.js` (the
  `SCHEDULE` map, keyed by weekday with per-day open/close in 24h) — keep it in
  sync with the hours table in `index.html` if hours change.
- **Photos:** drop new images in `assets/img/`. Source photos live in
  `_original_site/`; re-run the optimization if you add large originals.
- **Facebook link:** the shop's Facebook URL appears twice in `index.html` —
  the `sameAs` field in the structured-data block and the "Facebook" button in
  the Visit section. Update both if the page URL ever changes.

## Run locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Features

- Responsive layout (mobile-first) — looks right from phones to desktop
- Sticky header with tap-to-call button; animated mobile menu
- Live **Open now / Closed** badge, computed in the shop's Central Time so it's
  correct for any visitor; today's row is highlighted in the hours table
- SEO: meta description, Open Graph tags, `HairSalon` structured data,
  `robots.txt` + `sitemap.xml`
- Accessibility: skip link, semantic landmarks, alt text, visible focus
  styles, reduced-motion support
- Performance: optimized WebP/JPEG images (header photo cut from ~1 MB to
  ~100 KB), lazy-loaded below-the-fold images, no JS frameworks

## Deploying

It's plain static files, so any static host works — upload the repo contents
(everything except `_original_site/` and dotfiles) to the web root. Options:

- **Current GoDaddy hosting:** upload `index.html`, `assets/`, `robots.txt`,
  `sitemap.xml` to the site root via the GoDaddy file manager / FTP.
- **GitHub Pages / Netlify (free):** point it at this repo and deploy.
