#FROM arm64v8/node:16-alpine AS build-ui
FROM node:16-alpine AS build-ui
WORKDIR /usr/src/ui
COPY . .
RUN npm ci --silent --no-audit --no-fund
RUN npm run build

FROM nginx:1-alpine
RUN rm -rf /var/www/html
RUN sed -i 's/\/usr\/share\/nginx\/html/\/var\/www\/html/g' /etc/nginx/conf.d/default.conf
RUN sed -i 's/index  index.html index.htm;/index  index.html index.htm;\ntry_files $uri $uri\/ \/index.html;/' /etc/nginx/conf.d/default.conf

RUN sed -i 's/80;/3000;/g' /etc/nginx/conf.d/default.conf
COPY --from=build-ui /usr/src/ui/dist /var/www/html
