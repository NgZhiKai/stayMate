FROM node:18-alpine AS BUILD_IMAGE

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

RUN npm run build

FROM nginx:1.23-alpine AS PRODUCTION_IMAGE
WORKDIR /usr/share/nginx/html
RUN rm -rf *

COPY --from=BUILD_IMAGE /app/dist/ .

EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]