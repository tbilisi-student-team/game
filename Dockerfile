FROM node:16.18.0-slim
WORKDIR /usr/src
COPY . .
RUN npm ci
EXPOSE 8080
CMD ["npm", "run", "dev"]
