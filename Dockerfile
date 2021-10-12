FROM node:3.13.6-alpine

WORKDIR /app

# add app/node_modules/.bin to PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm install react-script@3.4.1 -g --silent
RUN npm start --silent

COPY . ./

CMD ["npm", "start"]