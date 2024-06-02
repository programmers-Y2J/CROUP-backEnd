FROM node:20.10.0

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
