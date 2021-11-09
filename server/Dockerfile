FROM node:17-slim

# Create app directory inside the image
WORKDIR /usr/app 

# copy both package.json and package-lock.json
COPY package*.json ./

RUN npm install 

# Bundle app source 
COPY . .

EXPOSE 5000

CMD npm run dev