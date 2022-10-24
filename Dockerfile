FROM node:16.18.0-slim
WORKDIR /usr/src
COPY . .
RUN npm ci
CMD ["npm", "run", "dev"]
