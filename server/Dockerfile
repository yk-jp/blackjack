FROM node:17-slim

ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}

# Create app directory inside the image
WORKDIR /usr/app 

# copy both package.json and package-lock.json
COPY package*.json ./

RUN npm install 

# Bundle app source 
COPY . .

EXPOSE 5000

CMD npm run dev-docker