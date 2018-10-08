FROM node

WORKDIR /

COPY ./package.json .

RUN npm i -g yarn
RUN yarn install --production

COPY ./dist ./dist
COPY ./.env .
COPY ./ormconfig.json .

ENV NODE_ENV production

EXPOSE 80

CMD ["node", "dist/index.js"]