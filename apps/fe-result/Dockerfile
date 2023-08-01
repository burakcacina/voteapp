FROM node:20-alpine as nodeBuilder

WORKDIR /fe-result

COPY . .

RUN npm install
RUN npm run build


FROM httpd

EXPOSE 80

COPY --from=nodeBuilder fe-result/dist/ /usr/local/apache2/htdocs/