FROM node:16.13.1-alpine3.15

WORKDIR /usr/src/clean-node-api

COPY ./package.json .

RUN npm install -g yarn@1.22.17 --force
RUN yarn --only=prod
