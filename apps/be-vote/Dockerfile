FROM node:20-alpine
EXPOSE 80

WORKDIR /be-vote

COPY . .

RUN npm install

RUN npm run build 

# ENV NODE_ENV=production
CMD [ "node", "dist/index.js" ]
