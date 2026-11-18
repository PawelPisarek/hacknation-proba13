FROM node:22-slim

WORKDIR /app
COPY package.json ./
COPY app ./app
COPY dane/zbior ./dane/zbior

ENV PORT=3000
EXPOSE 3000

CMD ["node", "app/server.mjs"]
