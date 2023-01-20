# syntax=docker/dockerfile:1
FROM node:17

ENV NODE_ENV=production

WORKDIR /app
COPY ./ /app
RUN npm install


CMD [ "node", "." ]
