FROM node:20

# Set NODE_ENV to development
ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY /package*.json /usr/src/app
RUN npm install
# Bundle app source
COPY . /usr/src/app

RUN npm install pm2 -g
