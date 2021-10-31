FROM node:17-slim as base

# Create app directory inside the image
WORKDIR /usr/app 

# copy both package.json and package-lock.json
COPY package*.json ./

RUN npm install 

# Bundle app source 
COPY . .

FROM base as production

ENV NODE_PATH=./dist

RUN npm run build