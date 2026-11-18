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

| Zbiór | Liczba spraw | Trafne kwalifikacje |
|---|---|---|
| Sprawy oryginalne | 13 | 13/13 |
| Parafrazy, serie 1–7 | 7 × 6 | każda seria 6/6 |

Serie 1–6 za pierwszym razem znajdowały po 1–3 błędy; reguły poprawialiśmy ogólnie, nie pod słowa. Seria 7 była pierwszym pomiarem na opisach, których reguły wcześniej nie widziały.

---

## 5. Ograniczenia — mówimy wprost

- To **zgodność ze wzorcem naszego sztucznego zbioru**, a nie jakość na realnych sprawach ZUS (realnych skanów nie mamy). Reguły i wzorzec pochodzą z jednego zespołu.
- Czas odczytu skanów na serwerze nie jest jeszcze zmierzony.
- Zgłoszenia są w pamięci serwera (restart je czyści); to makieta działającego MVP, nie system produkcyjny.
- Wdrożenie wymaga DPIA (art. 35 RODO), audytu bezpieczeństwa, zgody IOD i pilotażu na realnych danych; dokładnego terminu nie podajemy.
- W teście jury aplikacja działa na serwerze, bez zewnętrznego modelu AI; w ZUS działałaby w jego infrastrukturze.

---

## 6. Zespół

- **Paweł** — technika, wygląd, użyteczność. **Artur** — kształt produktu.
- Pięć botów na OpenMausBot: Szef (praca i zegar), Projektant (spec), Analityk (materiały, ryzyka, recenzje), Programista (kod, makieta, wdrożenia), Prezenter (README i teksty).

---

## 7. Narzędzia

- **OpenMausBot** — zespół botów, https://github.com/milind-soni/OpenMausBot (Apache-2.0)
- **Claude** (Anthropic) — modele, na których pracowały boty
- **pm-skills** — `product-name`, `value-prop-statements`, https://github.com/phuryn/pm-skills (MIT)
- **Z kodu:** Node.js (≥ 20, bez zależności `npm`), Tesseract OCR (język polski) i poppler-utils, Docker

Dziękujemy — repozytorium i makieta: linki na pierwszym slajdzie.

<!-- skill: value-prop-statements -->
