FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

ENV WATCHPACK_POLLING=true

CMD ["npm", "run", "start:dev"]