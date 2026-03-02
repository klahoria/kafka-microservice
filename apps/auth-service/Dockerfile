FROM node:18-alpine
WORKDIR /app
COPY  package*.json ./
RUN npm install
COPY . .
RUN npm run build || true
EXPOSE 4001
CMD ["npx". "ts-node-dev", "src/server.ts"];