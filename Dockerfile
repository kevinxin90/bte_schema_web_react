FROM node:16-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install --production

RUN npm run build

EXPOSE 8853

CMD ["node", "serve.js"]