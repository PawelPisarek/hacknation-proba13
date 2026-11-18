# ZANT — Zgłoszenie i Karta Wypadku

**Spokojne zgłoszenie wypadku. Przejrzysta rekomendacja ZUS. Dane zostają na miejscu.**

Zespół botów OpenMausBot i dwie osoby: Paweł, Artur · HackNation, zadanie ZUS · dane wyłącznie sztuczne

Repozytorium: https://github.com/PawelPisarek/hacknation-proba13
Makieta: https://pawelpisarek.github.io/hacknation-proba13/makieta/

---

## 1. Problem

- ZUS dostaje ogromną liczbę zgłoszeń wypadków przy pracy, a każde jest opisane inaczej: ogólniki, skany, braki w dokumentach.
- Poszkodowany przedsiębiorca jest po urazie, ma telefon i mało sił. Nie wie, co opisać ani jakich dokumentów brakuje.
- Pracownik ZUS traci czas na dopytywanie i na ręczne przepisywanie danych do karty wypadku.

---

## 2. Dla kogo

- **Poszkodowany przedsiębiorca (JDG)** — telefon, jedna ręka: 2–3 neutralne pytania zamiast długiego wywiadu; zgłoszenie z brakami da się wysłać po jednym potwierdzeniu.
- **Pracownik ZUS** — niejednorodne dokumenty i skany: rekomendacja z uzasadnieniem, lista braków, projekt karty do poprawienia. **Decyzję podejmuje człowiek.**

---

## 3. Jak działa — jedna historia (sprawa W052)

1. Elektryk pisze: „Poślizgnąłem się w pracy i boli mnie bark”. To ogólnik, więc asystent pyta o czynność, przyczynę i część ciała — bez ocen i bez podpowiadania odpowiedzi.
2. Widzi listę załączników i wysyła zgłoszenie „mimo braków”. Dostaje numer (np. ZG-0001).
3. Pracownik otwiera tę samą sprawę: rekomendacja **do uzupełnienia**, 5 przesłanek, cytat z dokumentu, podobna sprawa, lista braków, projekt karty.
4. Pracownik wybiera: **Zatwierdź / Odrzuć / Zmień** (z powodem).

---

## 4. Wynik i trafność

- Skany PDF czyta Tesseract na procesorze serwera; pola z pewnością poniżej 70/100 są oznaczone „niepewne — sprawdź”, a nieczytelny plik daje „Nie udało się odczytać”, nie „nie uznać”.
- Na ekranie jest licznik **„Trafne rekomendacje: X z Y”** liczony z wgranych spraw (paczka 6 spraw testowych albo własne pliki).

| Zbiór | Liczba spraw | Wynik |
|---|---|---|
| Sprawy oryginalne | 13 | kwalifikacja 13/13 |
| Parafrazy, serie 1–6 | 6 × 6 | 6/6 w każdej — wynik po poprawkach |
| Parafrazy, seria 7 | 6 | kwalifikacja 6/6 — pierwszy pomiar, po poprawce progu z serii 6, przed poprawką braków |
| Seria 7, wykrywanie braków | 6 | braki_F1: 0.696 → 1.000 po ogólnej poprawce reguł |
| Parafrazy, seria 8 (potoczny styl, trzecia osoba) | 6 | kwalifikacja **3/6** — pierwszy pomiar; po ogólnej poprawce 6/6, braki_F1 1.000 |
| Parafrazy, seria 9 (styl urzędowy, trzecia osoba) | 6 | kwalifikacja **6/6**; braki 0.800 — pierwszy pomiar po poprawce serii 8; po poprawce 6/6 i 1.000 |

Pierwsze pomiary braków na seriach 2–4: 0.833 / 0.800 / 0.923; teraz wszystkie serie 1–9 i oryginały mają braki 1.000. Serie 1–6 za pierwszym razem znajdowały po 1–3 błędy; reguły poprawialiśmy ogólnie, nie pod słowa. Po poprawce serii 9 nie mamy już serii niewidzianej; następny niezależny test to nowa seria.

---

## 5. Ograniczenia — mówimy wprost

- To **zgodność ze wzorcem naszego sztucznego zbioru**, a nie jakość na realnych sprawach ZUS (realnych skanów nie mamy). Reguły i wzorzec pochodzą z jednego zespołu.
- 54 parafrazy z 13 oryginałów, jeden autor; etykiety odziedziczone z oryginałów; seria 7 (n = 6) dała pierwszy pomiar bez poprawek, ale jej braki są już poprawione. Odczytu pól na parafrazach nie mierzymy.
- Seria 8 (potoczny styl): pierwszy pomiar 3/6, po poprawce 6/6. Seria 9 (styl urzędowy, bezosobowy, trzecia osoba, dwie osoby, pomieszana kolejność zdarzeń), zmierzona po poprawce serii 8 na regułach, które jej wcześniej nie widziały, dała kwalifikację 6/6, ale wykrywanie braków 0.800 (dwa konkretne opisy uznano za ogólne); po ogólnej poprawce reguł 6/6 i 1.000. Wniosek: na nowym stylu kwalifikacja się utrzymała, a wykrywanie ogólników było najsłabszym miejscem — i to ono wymagało poprawki.
- Odczyt skanu ok. 1 s, zmierzony na serwerze obliczeniowym (nie w kontenerze).
- Zapas na pokaz: `node scripts/sprawdz-demo.mjs` na świeżym klonie przechodzi ścieżkę pokazu i paczkę ZUS — 17 OK, 0 błędów; działa, gdy serwer nie działa.
- Zgłoszenia zapisują się trwale i przeżywają restart — sprawdzone tylko lokalnie (proces node, nie kontener); na serwerze stały katalog dojdzie przy pierwszym wdrożeniu (P35). To MVP, nie system produkcyjny.
- Wdrożenie wymaga DPIA (art. 35 RODO), audytu bezpieczeństwa, zgody IOD i pilotażu na realnych danych; dokładnego terminu nie podajemy.
- Publicznie działa makieta (link na slajdzie 1); pełną aplikację uruchamia się lokalnie (`npm start`), wdrożenie na serwer w toku. Bez zewnętrznego modelu AI; w ZUS działałaby w jego infrastrukturze.

---

## 6. Zespół

- **Paweł** — technika, wygląd, użyteczność. **Artur** — kształt produktu.
- Pięć botów na OpenMausBot: Szef (praca i zegar), Projektant (spec), Analityk (materiały, ryzyka, recenzje), Programista (kod, makieta, wdrożenia), Prezenter (README i teksty).

---

## 7. Narzędzia

- **OpenMausBot** — zespół botów, https://github.com/milind-soni/OpenMausBot (Apache-2.0)
- **Antigravity** i **Claude** (Anthropic) — modele, na których pracowały boty
- **pm-skills** (https://github.com/phuryn/pm-skills, MIT) — `brainstorm-experiments-new`, `brainstorm-ideas-new`, `competitor-analysis`, `create-prd`, `identify-assumptions-new`, `job-stories`, `pre-mortem`, `prioritize-assumptions`, `product-name`, `strategy-red-team`, `test-scenarios`, `value-prop-statements`; plus własne skille zespołu
- **Z kodu:** Node.js (≥ 20, bez zależności `npm`), Tesseract OCR (język polski) i poppler-utils, Docker (obrazu kontenera jeszcze nie zbudowano ani nie sprawdzono; pewna ścieżka to `npm ci` + node)

Dziękujemy — repozytorium i makieta: linki na pierwszym slajdzie.

<!-- skill: value-prop-statements -->
