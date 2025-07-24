FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["sh", "-c", "node wait-for-db.js && node index.js"] 