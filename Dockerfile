FROM node:18-bullseye-slim as build-deps

ARG HSECRET=''
ARG HSITEKEY=''

ENV HCAPTCHA_SECRET=$HSECRET
ENV HCAPTCHA_SITE_KEY=$HSITEKEY

ENV NODE_ENV 'production'

WORKDIR /usr/src/app

COPY ./jonnapp ./jonnapp

RUN cd jonnapp/  && \
    npm install --ignore-scripts && \
    npm run build

FROM nginx:1.12-alpine

COPY --from=build-deps /usr/src/app/jonnapp/build /usr/share/nginx/html

ADD ./conf-nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
