FROM node:18-bullseye-slim as build-deps

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

# docker build -t website:vXX --build-arg="HSECRET=XXXX" --build-arg="HSITEKEY=XXXX" --build-arg="JONNAAUTH=XXXX" .
