FROM node

WORKDIR /airbnb-server

COPY ./package.json .

RUN npm i -g yarn
RUN yarn install --production --network-timeout 100000

COPY ./dist ./dist
COPY ./.env .
COPY ./ormconfig.json .

ENV NODE_ENV production

EXPOSE 4000

CMD ["node", "dist/index.js"]