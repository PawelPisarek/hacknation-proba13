# hacknation-proba13 — ZANT (ZUS Accident Notification Tool)

## Uruchomienie (jedna komenda)

Wymagany Node.js >= 20 (bez zewnętrznych zależności `npm`):

```bash
npm start
```

Aplikacja uruchamia się na `http://localhost:3000` (port konfigurowalny zmienną `PORT`).

### Pozostałe komendy

- `npm run generuj` — regeneracja sztucznego zbioru zgłoszeń EWYP i kart wypadków (`dane/zbior/`)
- `npm run ocen` — uruchomienie skryptu oceny na odłożonym zbiorze testowym (`ocena/ocen.mjs`)
- `npm test` — testy dymne szkieletu (asystent, parser, skrypt oceny, API HTTP)

### Docker

```bash
docker build -t zant . && docker run -p 3000:3000 zant
```
