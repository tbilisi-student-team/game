FROM node:16.17.0
WORKDIR /usr/src
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "start"]
