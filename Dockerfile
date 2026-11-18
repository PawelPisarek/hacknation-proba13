FROM node:22-slim

# Odczyt skanów na serwerze: Tesseract (język polski) + poppler (pdftoppm, 200 dpi). Bez zewnętrznego modelu AI.
RUN apt-get update \
 && apt-get install -y --no-install-recommends tesseract-ocr tesseract-ocr-pol poppler-utils \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json ./
COPY app ./app
COPY ocena ./ocena
COPY dane/zbior ./dane/zbior

ENV PORT=3000
# Trwały stan (zgłoszenia, decyzje): w Coolify zamontuj wolumen na /dane. Bez sekretów.
ENV DANE_DIR=/dane
VOLUME /dane
EXPOSE 3000

CMD ["node", "app/server.mjs"]
