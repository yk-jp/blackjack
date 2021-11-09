# node:17 is not available in crate-react-app environment
FROM node:16-slim  

# Create app directory inside the image
WORKDIR /usr/app 

# copy both package.json and package-lock.json
COPY ./package*.json ./
# copy yarn lock
COPY ./yarn.lock ./

RUN npm install 

# Bundle app source 
COPY . .

EXPOSE 3000

CMD npm run start

