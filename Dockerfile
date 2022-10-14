FROM node:lts-alpine3.16

LABEL version=16.0
LABEL description="Jonnattan Griffiths"
LABEL product="Jonna App"

RUN npm install -g create-react-native-app && \
    mkdir -p /app/logs

COPY ./jonnapp /app/jonnapp

ENV NODE_ENV=production
ENV PORT=3001
ENV LOGS_PATH=/app/logs

WORKDIR /app/jonnapp

RUN npm install && \
    npm run build

EXPOSE 3001

CMD [ "/bin/sh", "./run.sh" ]
