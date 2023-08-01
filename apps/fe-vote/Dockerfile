FROM node:20-alpine as nodeBuilder

WORKDIR /fe-vote

COPY . .

RUN npm install
RUN npm run build


FROM httpd

EXPOSE 80

COPY --from=nodeBuilder fe-vote/dist/ /usr/local/apache2/htdocs/