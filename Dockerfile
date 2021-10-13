# pull the official base image
FROM node:13.12.0-alpine
# set working direction
WORKDIR /app
RUN chown -R node:node /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm i
# add app
COPY . ./
# start app
CMD ["npm", "start"]