FROM node:11 as api

# Create and define the node_modules's cache directory.
RUN mkdir -p /usr/api/cache
WORKDIR /usr/api/cache

# Install the application's dependencies into the node_modules's cache directory.
COPY package.json ./
COPY yarn.lock ./
RUN yarn


RUN mkdir -p /usr/api/app
WORKDIR /usr/api/app

RUN yarn
