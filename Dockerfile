FROM node:24-alpine AS build-deps

ARG API_BASE_URL
ARG HCAPTCHA_SITE_KEY
ARG AUTH_JONNA_SERVER
ARG PAGE_API_KEY
ARG GEO_API_KEY
ARG LOGIA_API_KEY
ARG UCC_API_KEY

ENV VITE_API_BASE_URL=$API_BASE_URL
ENV VITE_HCAPTCHA_SITE_KEY=$HCAPTCHA_SITE_KEY
ENV VITE_AUTH_JONNA_SERVER=$AUTH_JONNA_SERVER
ENV VITE_PAGE_API_KEY=$PAGE_API_KEY
ENV VITE_GEO_API_KEY=$GEO_API_KEY
ENV VITE_LOGIA_API_KEY=$LOGIA_API_KEY
ENV VITE_UCC_API_KEY=$UCC_API_KEY

WORKDIR /usr/src/app

COPY ./jonnapp .

RUN npm install

ADD .env .env

RUN npm run build

ENV NODE_ENV=production

FROM nginx:stable-alpine

COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/html

ADD ./conf-nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
