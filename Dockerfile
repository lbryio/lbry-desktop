FROM node:10
EXPOSE 1337

RUN yarn -v && npm -v
RUN apt-get update -y && apt-get upgrade -y && apt-get install -y libsecret-1-0 libsecret-1-dev

WORKDIR /app
ENV PATH="/app/node_modules/.bin:${PATH}"

COPY ./ ./

RUN rm -rf node_modules && APP_ENV=web yarn && SDK_API_URL='https://api.lbry.tv/api/proxy' NODE_ENV=production yarn compile:web --display errors-only
CMD node ./dist/web/server.js