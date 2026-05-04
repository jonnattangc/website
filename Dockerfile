FROM node:22-alpine3.21 as build-deps

ARG HCAPTCHA_SECRET
ARG HCAPTCHA_SITE_KEY
ARG AUTH_JONNA_SERVER
ARG API_BASE_URL

ENV HCAPTCHA_SECRET=$HCAPTCHA_SECRET
ENV HCAPTCHA_SITE_KEY=$HCAPTCHA_SITE_KEY
ENV AUTH_JONNA_SERVER=$AUTH_JONNA_SERVER
ENV API_BASE_URL=$API_BASE_URL

ENV NODE_ENV 'production'

WORKDIR /usr/src/app

COPY ./jonnapp ./jonnapp

RUN cd jonnapp/  && \
    yarn install --ignore-scripts && \
    yarn build

FROM nginx:1.12-alpine

COPY --from=build-deps /usr/src/app/jonnapp/build /usr/share/nginx/html

ADD ./conf-nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

#docker build -t website:v3.0 
#   --build-arg HCAPTCHA_SECRET="" 
#   --build-arg HCAPTCHA_SITE_KEY=" " 
#   --build-arg AUTH_JONNA_SERVER=" " 
#   --build-arg API_BASE_URL=" " .