FROM node:16-alpine
WORKDIR /usr/src/ui
COPY . .
RUN npm ci --quiet --no-audit --no-fund
RUN npm run build

FROM nginx:1-alpine
RUN rm -rf /var/www/html
RUN sed -i 's/\/usr\/share\/nginx\/html/\/var\/www\/html/g' /etc/nginx/conf.d/default.conf
RUN sed -i 's/index  index.html index.htm;/index  index.html index.htm;\ntry_files $uri $uri\/ \/index.html;/' /etc/nginx/conf.d/default.conf

RUN sed -i 's/80;/3000;/g' /etc/nginx/conf.d/default.conf
COPY --from=0 /usr/src/ui/dist /var/www/html
