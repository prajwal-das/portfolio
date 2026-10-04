# Portfolio image — static site baked into nginx, no backend.
FROM nginx:1.27-alpine
COPY nginx/portfolio.conf /etc/nginx/conf.d/default.conf
COPY src/ /usr/share/nginx/html/
EXPOSE 80
