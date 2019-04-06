FROM node:11 as api
WORKDIR /api
COPY . /api
RUN yarn

CMD ["yarn", "start:dev"]
