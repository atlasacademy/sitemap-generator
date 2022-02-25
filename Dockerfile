FROM node:16
MAINTAINER sadisticsolutione@gmail.com

ENV REPO="" \
    TOKEN="" \
    WEBHOOK=""

ENTRYPOINT tail -f /dev/null
WORKDIR /app

COPY . /app
RUN npm install
