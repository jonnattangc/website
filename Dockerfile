FROM node:24-alpine AS build-deps

ARG API_BASE_URL
ARG HCAPTCHA_SITE_KEY
ARG AUTH_JONNA_SERVER
ARG PAGE_API_KEY

ENV VITE_API_BASE_URL=$API_BASE_URL
ENV VITE_HCAPTCHA_SITE_KEY=$HCAPTCHA_SITE_KEY
ENV VITE_AUTH_JONNA_SERVER=$AUTH_JONNA_SERVER
ENV VITE_PAGE_API_KEY=$PAGE_API_KEY

WORKDIR /usr/src/app

COPY ./jonnapp .

RUN npm install

ADD enviroments .env

RUN npm run build

ENV NODE_ENV=production

ENV TZ=UTC

ENV WDS_SOCKET_PORT=0

ENV WDS_SOCKET_BROWSER=none

FROM nginx:stable-alpine

COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/html

ADD ./conf-nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

# docker build --build-arg API_BASE_URL=https://api.jonna.cl \
# --build-arg=HCAPTCHA_SITE_KEY=? \ 
# --build-arg AUTH_JONNA_SERVER=? \ 
# --build-arg PAGE_API_KEY=? \ 
# -t jonnattangc/website:1.0.0 .