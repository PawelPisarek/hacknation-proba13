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

## Jak jury sprawdza (najprostsza droga)

1. Uruchom `npm start` i otwórz http://localhost:3000 (albo wersję na ksefbot.pl po wdrożeniu).
2. Zakładka **„2. Wsparcie pracownika ZUS”**.
3. Paczka ≥ 5 spraw: kliknij **„Załaduj i oceń 5 spraw testowych”** (paczka z bazy, bez wgrywania) **albo** wybierz własne pliki `.pdf` / `.txt` / `.json` (min. 5 naraz; gotowe sztuczne sprawy są w podfolderach `dane/zbior/testowy/`, np. `W006/zgloszenie.pdf`) i kliknij **„Oceń wgrane pliki”**.
4. Przy każdej sprawie widać rekomendację (uznać / nie uznać / do uzupełnienia), uzasadnienie, braki i projekt karty.
5. Liczba zgodnych ze wzorcem: w terminalu `npm run ocen` (linia `kwalifikacja_3kl=…`). Ekran aplikacji nie podsumowuje jeszcze liczby zgodności — pokazuje wyniki per sprawa.

## Ocena na zbiorze testowym

`npm run ocen` (równoważnie `node ocena/ocen.mjs`) liczy zgodność z wzorcem na sztucznym zbiorze: kwalifikację, wyłączenia świadczeń, trafność odczytu pól i wykrywanie braków. Wynik to **zgodność ze wzorcem naszego sztucznego zbioru i naszych reguł**, a nie ocena jakości wobec praktyki ZUS (realnych skanów i kart nie mamy). Dane są wyłącznie sztuczne (generator z ustalonym ziarnem, `dane/generator.mjs`) — bez danych ZUS i osobowych.

## Użyte narzędzia

- **OpenMausBot** — zespół botów (Szef, Analityk, Projektant, Programista, Prezenter), https://github.com/milind-soni/OpenMausBot, licencja Apache-2.0.
- **Antigravity** i **Claude** (Anthropic) — modele, na których pracowały boty (zmiana silnika w trakcie, gdy kończył się limit jednego z nich).
- **pm-skills** — skille zarządzania produktem użyte w pracy: `product-name` i `value-prop-statements` (wynik w `docs/hacktribe.md`), https://github.com/phuryn/pm-skills, licencja MIT.
- **Node.js** (>= 20) — serwer i skrypty; bez zewnętrznych zależności `npm` (wbudowany `node:test`).
- **Docker** — opcjonalne uruchomienie (`Dockerfile`, obraz `node:22-slim`).

## Czas wdrożenia i ryzyka

Szczegóły i źródła: `docs/materialy.md` §8–9 (RODO i wnioski wdrożeniowe, rzeczy nieustalone).

- **Czas wdrożenia:** oprócz integracji technicznej (PUE/eZUS, testy odczytu skanów na realnych dokumentach ZUS) harmonogram musi objąć ścieżkę formalną: DPIA (art. 35 RODO), audyt bezpieczeństwa, akceptację IOD, kontrolę dostępu i logowanie oraz pilotaż z pracownikami. Dokładnego terminu nie podajemy — to założenie projektowe do ustalenia z ZUS.
- **Ochrona danych osobowych:** zgłoszenia zawierają dane o zdrowiu (art. 9 RODO). Dlatego działamy lokalnie, bez zewnętrznego modelu (brak powierzenia danych i transferu poza EOG), a decyzję podejmuje pracownik ZUS (art. 22 RODO).
- **Sprzęt:** lokalny odczyt skanów (OCR) ma mieścić się na karcie 4 GB (GTX 1050, komputer OMEN); metoda bazowa nie wymaga GPU.
- **Jakość na realnych danych:** nie została zmierzona — mamy tylko zbiór sztuczny.
