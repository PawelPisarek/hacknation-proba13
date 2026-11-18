# hacknation-proba13 — ZANT (ZUS Accident Notification Tool)

## Uruchomienie (jedna komenda)

Wymagany Node.js >= 20 (bez zewnętrznych zależności `npm`). Do odczytu **skanów PDF** (bez warstwy tekstowej) potrzebne są jeszcze `tesseract-ocr` z językiem polskim (`tesseract-ocr-pol`) i `poppler-utils` (`pdftoppm`), np. na Debianie/Ubuntu:

```bash
sudo apt-get install -y tesseract-ocr tesseract-ocr-pol poppler-utils
npm start
```

Aplikacja uruchamia się na `http://localhost:3000` (port konfigurowalny zmienną `PORT`). Bez Tesseracta aplikacja działa dla plików `.txt`, `.json` i PDF z tekstem; skan obrazkowy kończy się wtedy komunikatem „Nie udało się odczytać tego pliku…” (zamiast zgadywania). Najprościej przez Dockera — obraz ma Tesseracta w środku (niżej).

Test dymny głównej ścieżki (bez Dockera i Tesseracta): `npm ci && node scripts/sprawdz-demo.mjs` — przechodzi ścieżkę W052 i paczkę ZUS 6 spraw, kończy linią `WYNIK sprawdz-demo: … → DZIAŁA`.

### Pozostałe komendy

- `npm run generuj` — regeneracja sztucznego zbioru zgłoszeń EWYP i kart wypadków (`dane/zbior/`)
- `npm run ocen` — uruchomienie skryptu oceny na odłożonym zbiorze testowym (`ocena/ocen.mjs`)
- `npm test` — testy dymne szkieletu (asystent, parser, skrypt oceny, API HTTP)

### Docker

```bash
docker build -t zant . && docker run -p 3000:3000 zant
```

Obraz (`node:22-slim`) instaluje `tesseract-ocr`, `tesseract-ocr-pol` i `poppler-utils`; odczyt skanów działa na procesorze, bez karty graficznej i bez zewnętrznego modelu.

## Co to jest

**ZANT – Zgłoszenie i Karta Wypadku** to aplikacja webowa w dwóch częściach: asystent pomaga przedsiębiorcy po wypadku przy pracy prostym językiem złożyć kompletne zgłoszenie (EWYP), a pracownik ZUS dostaje rekomendację (uznać / nie uznać / do uzupełnienia) z uzasadnieniem, listą braków i edytowalnym projektem karty wypadku. Działa lokalnie, bez zewnętrznego modelu; decyduje człowiek.

## Dla kogo

- **Poszkodowany przedsiębiorca** (JDG) — często na telefonie, po urazie: 2–3 neutralne pytania zamiast długiego wywiadu, zgłoszenie z brakami można wysłać po jednym potwierdzeniu.
- **Pracownik ZUS** — niejednorodne dokumenty i skany: ocena 5 przesłanek, podobne sprawy, lista braków, osobna uwaga o możliwych wyłączeniach świadczeń.

## Linki

- Repozytorium: https://github.com/PawelPisarek/hacknation-proba13
- Makieta (gh-pages): https://pawelpisarek.github.io/hacknation-proba13/makieta/
- **Gdzie działa:** publicznie działa makieta (link wyżej); pełną aplikację uruchamia się lokalnie (`npm start`), wdrożenie na serwer w toku — link do wersji na ksefbot.pl dojdzie, gdy domena ruszy.
- Teksty do HackTribe: `docs/hacktribe.md`; scenariusz demo (≤ 2 min): `docs/demo.md`

## Jak jury sprawdza (najprostsza droga)

1. Uruchom `npm start` i otwórz http://localhost:3000 (pełna aplikacja działa lokalnie; wdrożenie na serwer w toku).
2. Zakładka **„2. Wsparcie pracownika ZUS”**.
3. Paczka ≥ 5 spraw (przycisk ładuje 6: W052, W006, W023, W020, W027, W038): kliknij **„Załaduj i oceń 6 spraw testowych”** (paczka z bazy, bez wgrywania) **albo** wybierz własne pliki `.pdf` / `.txt` / `.json` (min. 5 naraz; gotowe sztuczne sprawy są w podfolderach `dane/zbior/testowy/`, np. `W006/zgloszenie.pdf`) i kliknij **„Oceń wgrane pliki”**.
4. Przy każdej sprawie widać rekomendację (uznać / nie uznać / do uzupełnienia), uzasadnienie (przesłanki, zdanie „Cytat z dokumentu sprawy: „…”” i 1–2 podobne sprawy z bazy uczącej), braki i projekt karty. Pole odczytane ze skanu z pewnością poniżej 70/100 jest podświetlone na żółto z napisem **„niepewne — sprawdź”**. Plik nieczytelny (albo skan bez Tesseracta) daje komunikat **„Nie udało się odczytać tego pliku…”**, a rekomendacji nie ma — nie jest to „nie uznać”.
5. Ścieżka zgłoszenia: u przedsiębiorcy „Wyślij zgłoszenie” (także „mimo braków”) nadaje numer (pierwszy: **ZG-0001**, zgłoszenia zapisują się trwale w pliku w katalogu `DANE_DIR` i przeżywają restart serwera), a „Otwórz tę sprawę jako pracownik ZUS” ładuje to zgłoszenie po numerze. Pracownik wybiera **Zatwierdź / Odrzuć / Zmień** (przy Odrzuć i Zmień powód jest wymagany); decyzja człowieka zapisuje się obok rekomendacji systemu.
6. Liczba zgodności jest na ekranie, nad wynikami spraw; przed wgraniem pokazuje stan **„0 z 0 — wgraj pliki”**, potem granatowy pasek **„Trafne rekomendacje: X z Y”** (Y = wgrane sprawy o znanym numerze, np. `W006`, X = ile z nich ma rekomendację zgodną ze wzorcem; własne pliki bez numeru sprawy w nazwie nie wchodzą do Y; pod spodem opis „sztuczny zbiór testowy, kwalifikacja zdarzenia”, FP/FN). Dla własnych plików bez wzorca ekran pisze „Brak wzorca dla wgranych spraw”. Dla chętnych cały zbiór testowy (13 spraw) w terminalu: `npm run ocen` (linia `kwalifikacja_3kl=…`).

## Jak sprawdzaliśmy trafność

Pomiar: `node ocena/ocen.mjs [--zbior dane/<zbiór>]` (stan na dzień próby). Kwalifikacja zdarzenia = uznać / nie uznać / do uzupełnienia, zgodność ze wzorcem.

| Zbiór | Liczba spraw | Wynik |
|---|---|---|
| 13 spraw oryginalnych (`dane/zbior`) | 13 | kwalifikacja 13/13 |
| Parafrazy, serie 1–6 (`dane/parafrazy` … `parafrazy-6`) | 6 × 6 | kwalifikacja 6/6 w każdej — **wynik po poprawkach** reguł |
| Parafrazy, seria 7 (`dane/parafrazy-7`) | 6 | kwalifikacja 6/6 — pierwszy pomiar, przed jakąkolwiek poprawką |
| Seria 7, wykrywanie braków | 6 | braki_F1: pierwszy pomiar 0.696 (5 zbędnych, 2 pominięte), po ogólnej poprawce reguł 1.000 |

**Metoda.** Parafrazy to te same sprawy opisane innymi słowami. Serie 1–6 za pierwszym razem znajdowały po 1–3 błędy; reguły poprawialiśmy ogólnie, nie pod konkretne słowa (jedna poprawka, próg długości opisu, wymagała korekty w następnej serii). Seria 7 celowo celowała w trudną klasę i opiera się na tych samych 13 oryginałach. Po poprawce braków nie mamy już serii niewidzianej; następny niezależny test to nowa seria.

**Ograniczenia.**
- 42 parafrazy powstały z 13 oryginałów, ich autor jest jeden; etykiety (wzorzec) są odziedziczone z oryginałów.
- Serie 1–6 to wynik po poprawkach; seria 7 (n = 6) dała pierwszy pomiar kwalifikacji bez poprawek, ale jej braki zostały już poprawione, więc 1.000 nie jest testem niezależnym.
- Odczytu pól (miejsce, okoliczności) na parafrazach nie mierzymy, bo wzorzec ma tekst oryginału.
- Reguły i wzorzec pochodzą z jednego zespołu, a dane są sztuczne — to zgodność z wzorcem, nie dowód jakości na realnych sprawach ZUS (te wymagałyby pilotażu).

## Ocena na zbiorze testowym

`npm run ocen` (równoważnie `node ocena/ocen.mjs`) liczy zgodność z wzorcem na sztucznym zbiorze: kwalifikację, wyłączenia świadczeń, trafność odczytu pól i wykrywanie braków. Wynik to **zgodność ze wzorcem naszego sztucznego zbioru i naszych reguł**, a nie ocena jakości wobec praktyki ZUS (realnych skanów i kart nie mamy). Dane są wyłącznie sztuczne (generator z ustalonym ziarnem, `dane/generator.mjs`) — bez danych ZUS i osobowych.

## Użyte narzędzia

- **OpenMausBot** — zespół botów (Szef, Analityk, Projektant, Programista, Prezenter), https://github.com/milind-soni/OpenMausBot, licencja Apache-2.0.
- **Antigravity** i **Claude** (Anthropic) — modele, na których pracowały boty (zmiana silnika w trakcie, gdy kończył się limit jednego z nich).
- **pm-skills** — skille zarządzania produktem użyte w pracy (wg znaczników `<!-- skill: … -->` w `docs/`): `brainstorm-experiments-new`, `brainstorm-ideas-new`, `competitor-analysis`, `create-prd`, `identify-assumptions-new`, `job-stories`, `pre-mortem`, `prioritize-assumptions`, `product-name`, `strategy-red-team`, `test-scenarios`, `value-prop-statements`; https://github.com/phuryn/pm-skills, licencja MIT. Zespół miał też własne skille `przeplywy-pm` i `przesluchanie-hackathon`.
- **Tesseract OCR** (język polski) i **poppler-utils** (`pdftoppm`) — odczyt skanów PDF na procesorze serwera, https://github.com/tesseract-ocr/tesseract, licencja Apache-2.0.
- **Node.js** (>= 20) — serwer i skrypty; bez zewnętrznych zależności `npm` (wbudowany `node:test`).
- **Docker** — uruchomienie razem z Tesseractem (`Dockerfile`, obraz `node:22-slim`).

## Czas wdrożenia i ryzyka

Szczegóły i źródła: `docs/materialy.md` §8–9 (RODO i wnioski wdrożeniowe, rzeczy nieustalone).

- **Czas wdrożenia:** oprócz integracji technicznej (PUE/eZUS, testy odczytu skanów na realnych dokumentach ZUS) harmonogram musi objąć ścieżkę formalną: DPIA (art. 35 RODO), audyt bezpieczeństwa, akceptację IOD, kontrolę dostępu i logowanie oraz pilotaż z pracownikami. Dokładnego terminu nie podajemy — to założenie projektowe do ustalenia z ZUS.
- **Ochrona danych osobowych:** zgłoszenia zawierają dane o zdrowiu (art. 9 RODO). Dlatego działamy lokalnie, bez zewnętrznego modelu (brak powierzenia danych i transferu poza EOG), a decyzję podejmuje pracownik ZUS (art. 22 RODO).
- **Sprzęt i odczyt skanów:** Tesseract działa na procesorze serwera, bez GPU. Odczyt skanu trwa około 1 s (0,9–1,1 s), zmierzone na serwerze obliczeniowym (komputer OMEN, serwer uruchomiony bezpośrednio, nie w kontenerze); w kontenerze i pod docelową domeną jeszcze nie mierzyliśmy.
- **Jakość na realnych danych:** nie została zmierzona — mamy tylko zbiór sztuczny.
