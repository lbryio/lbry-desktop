FROM node:10

RUN apt-get update -y && apt-get upgrade -y && apt-get install libsecret-1-0 -y

WORKDIR /app
COPY ./ ./

ENV APP_ENV=web
ENV NODE_ENV=production
ENV SDK_API_URL='https://api.dev.lbry.tv/api/proxy'

RUN rm -rf package-lock.json
RUN rm -rf node_modules && APP_ENV=web yarn
RUN yarn compile:web --display errors-only && rm -rf node_modules
CMD node ./dist/web/server.js
