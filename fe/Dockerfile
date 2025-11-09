FROM node:22-alpine

WORKDIR /app

# Copy only package files and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the source
COPY . .

EXPOSE 3000

ENV WATCHPACK_POLLING=true

CMD ["npm", "run", "dev"]