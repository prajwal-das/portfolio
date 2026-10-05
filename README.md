# portfolio

Prajwal Premdas — personal portfolio site, live at https://profile.curiouspace.com.

A hand-built, single-page site (plain HTML/CSS/JS, no frameworks) styled
after the Instagram reel template: warm-paper monochrome theme, Playfair
Display serif titles, giant watermark hero with floating portrait, a
hanging ID badge on a lanyard with pendulum sway (click to flip),
32-element periodic-table-of-stack with family filter tabs, expandable
project panels with vertical labels, an "always learning" rows list, a
vertical education & experience timeline with giant year numerals, a
sideways-scrolling "proud moments" strip, contact.

## Layout

- `src/` — the site: `index.html`, `styles.css`, `app.js`, `img/prajwal.jpg`,
  `fonts/` (self-hosted Playfair Display serif woff2 — keeps the no-external-resources rule)
- `nginx/portfolio.conf` — nginx vhost (security headers + cache policy)
- `Dockerfile` — bakes `src/` into `nginx:1.27-alpine`
- `manifests/` — k3s manifests: namespace `profile`, Deployment (pinned to
  m1air), Service, cert-manager Certificate, Traefik IngressRoute for
  `profile.curiouspace.com`
- `.github/workflows/pages.yml` — merge to main: run `tests/check.js`,
  deploy `src/` to GitHub Pages (custom domain `profile.curiouspace.com`)

## Deploy

Automatic: every merge to main runs `tests/check.js` and deploys `src/`
to GitHub Pages, served publicly at https://profile.curiouspace.com.

DNS (Cloudflare): `CNAME profile → prajwal-das.github.io` (proxied or
DNS-only both work; GitHub terminates TLS for the custom domain).

Retired: the old Docker Hub image (`curiouspace/portfolio`) and the k3s
`manifests/` + `Dockerfile`/`nginx/` are leftovers from the previous
Tailscale-only hosting and can be removed once Pages is verified live.

## Swapping the photo

The headshot lives at `src/img/prajwal.jpg` (900px wide, resized with
ffmpeg). It is referenced from the hero portrait, the hero is duplicated
on the ID card front — update both `<img>` tags if the filename changes.
Photos are rendered in grayscale via CSS (`filter: grayscale(1)`) to keep
the monochrome theme; remove the filter for color.
