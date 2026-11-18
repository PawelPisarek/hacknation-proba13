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

## Co to jest

**ZANT – Zgłoszenie i Karta Wypadku** to aplikacja webowa w dwóch częściach: asystent pomaga przedsiębiorcy po wypadku przy pracy prostym językiem złożyć kompletne zgłoszenie (EWYP), a pracownik ZUS dostaje rekomendację (uznać / nie uznać / do uzupełnienia) z uzasadnieniem, listą braków i edytowalnym projektem karty wypadku. Działa lokalnie, bez zewnętrznego modelu; decyduje człowiek.

## Dla kogo

- **Poszkodowany przedsiębiorca** (JDG) — często na telefonie, po urazie: 2–3 neutralne pytania zamiast długiego wywiadu, zgłoszenie z brakami można wysłać po jednym potwierdzeniu.
- **Pracownik ZUS** — niejednorodne dokumenty i skany: ocena 5 przesłanek, podobne sprawy, lista braków, osobna uwaga o możliwych wyłączeniach świadczeń.

## Linki

- Repozytorium: https://github.com/PawelPisarek/hacknation-proba13
- Makieta (gh-pages): _do uzupełnienia po wdrożeniu_
- Wersja na ksefbot.pl: _do uzupełnienia po wdrożeniu_
- Teksty do HackTribe: `docs/hacktribe.md`; scenariusz demo (≤ 2 min): `docs/demo.md`

## Ocena na zbiorze testowym

`npm run ocen` (równoważnie `node ocena/ocen.mjs`) liczy zgodność z wzorcem na sztucznym zbiorze: kwalifikację, wyłączenia świadczeń, trafność odczytu pól i wykrywanie braków. Dane są wyłącznie sztuczne (generator z ustalonym ziarnem, `dane/generator.mjs`) — bez danych ZUS i osobowych.

## Użyte narzędzia

- **OpenMausBot** — zespół botów (Szef, Analityk, Projektant, Programista, Prezenter), https://github.com/milind-soni/OpenMausBot, licencja Apache-2.0.
- **Antigravity** i **Claude** (Anthropic) — modele, na których pracowały boty (zmiana silnika w trakcie, gdy kończył się limit jednego z nich).
- **pm-skills** — skille zarządzania produktem (m.in. `product-name`, `value-prop-statements`, `release-notes`), https://github.com/phuryn/pm-skills, licencja MIT.
- **Node.js** (>= 20) — serwer i skrypty; bez zewnętrznych zależności `npm` (wbudowany `node:test`).
- **Docker** — opcjonalne uruchomienie (`Dockerfile`, obraz `node:22-slim`).
