FROM node:22-alpine AS build

# Coolify v4 bug workaround: Dockerfile no puede empezar con comentario
# (rompe inyeccion automatica de build args). ARGs explicitos antes del WORKDIR
# para que Coolify pueda pasar las VITE_* en build time.
ARG VITE_API_BASE_URL
ARG VITE_DEMO_USER_EMAIL
ARG VITE_DEMO_USER_PASSWORD
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_DEMO_USER_EMAIL=$VITE_DEMO_USER_EMAIL
ENV VITE_DEMO_USER_PASSWORD=$VITE_DEMO_USER_PASSWORD

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- runtime stage ----------
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
