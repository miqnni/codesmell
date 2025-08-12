FROM node:22.15.0

ENV NODE_ENV=development

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
