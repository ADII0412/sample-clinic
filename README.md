# Lumen Dental Studio — sample website

A production-quality sample site for presenting to dental clinics. Single-page, zero
dependencies beyond Google Fonts (Archivo + Inter), no framework, no build step.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
npx http-server -p 8088
```

## What's customizable per client

| What | Where |
|---|---|
| Clinic name, brand mark | `index.html` — `.brand-name` and SVG in header/footer |
| Phone, email, address, hours | `index.html` — search `555`, `hello@`, `412 Harborview` |
| Clinic name / city | Title tag, footer bottom line |
| Prices / plan names | `index.html` — `#plans` section |
| Doctor names & bios | `index.html` — `#team` section |
| Testimonials | `index.html` — `#reviews` (slider is generic, add/remove cards) |
| Colors | `css/styles.css` — `:root` variables at the top (`--blue-*`, `--ink`) |
| Fonts | `:root` — `--font-display` / `--font-body` + the Google Fonts link |
| Map | `.map-card` placeholder in `#contact` — swap for a Google Maps iframe |
| Booking form | `#booking-form` — hook `submit` in `js/main.js` to your backend/Calendly |

## Structure

```
index.html      — all content, semantic sections, inline SVG icons
css/styles.css  — design tokens, layout, hover/reveal animations
js/main.js      — header, mobile nav, scroll reveals, counters, slider, FAQ, form
```

## Swapping the team photos

`team-photo` blocks use a gradient + initials so the sample runs with no image assets.
For a real client, replace the inner markup with `<img src="..." alt="Dr. …">` and add
`object-fit: cover` on `.team-photo img` — the hover overlay still works.
