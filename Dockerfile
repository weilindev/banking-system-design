FROM node:latest
WORKDIR /app
COPY package.json /app
RUN yarn install && yarn cache clean
COPY . /app
CMD ["yarn", "build"]