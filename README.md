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
- `.github/workflows/build-push.yml` — merge to main: run `tests/check.js`,
  build the arm64 image, push `curiouspace/portfolio:latest` (+ `:sha-*`)
  to Docker Hub

## Deploy

Rollout stays manual:

```sh
kubectl apply -f manifests/
# after a merge publishes a fresh image:
kubectl rollout restart deployment/portfolio -n profile
```

Required repo secrets for the workflow: `DOCKERHUB_USERNAME` /
`DOCKERHUB_TOKEN` (Docker Hub access token, read+write).

## Swapping the photo

The headshot lives at `src/img/prajwal.jpg` (900px wide, resized with
ffmpeg). It is referenced from the hero portrait, the hero is duplicated
on the ID card front — update both `<img>` tags if the filename changes.
Photos are rendered in grayscale via CSS (`filter: grayscale(1)`) to keep
the monochrome theme; remove the filter for color.
