FROM node:16.18.0-slim
WORKDIR /usr/src
COPY . .
RUN npm ci
RUN npm run build
CMD ["npm", "start"]
