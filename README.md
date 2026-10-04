# portfolio

Prajwal Premdas — personal portfolio site, live at https://profile.curiouspace.com.

A hand-built, black-and-white, single-page site (plain HTML/CSS/JS, no
frameworks): hero, about ID card, periodic-table-of-stack, projects,
experience timeline, achievements, contact.

## Layout

- `src/` — the site: `index.html`, `styles.css`, `app.js`
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

`src/index.html` has a `PHOTO:` comment marking the placeholder blocks in
the hero and the ID card. Drop a `photo.jpg` in `src/` and replace the
placeholder divs with `<img src="photo.jpg" alt="Prajwal Premdas">`.
