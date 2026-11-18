# Product Requirements Document: ZANT — zgłoszenie wypadku i wsparcie decyzji ZUS

**Autor**: Projektant · **Data**: 2026-11-18 · **Status**: Wersja robocza — wariant ekranu (P19) i historia demo (P20) czekają na Artura
**Wejście**: `docs/zadanie.md`, `docs/materialy.md` (`f1efade`), `docs/pm/01-competitive-analysis.md`, `docs/pm/02-discover.md`, `docs/pm/03a-warianty.md`, `docs/decyzje.md` (P1–P21). Pełny opis ekranów i kryteria: `docs/spec.md`.

## 1. Podsumowanie
ZANT to jedna aplikacja w przeglądarce z dwiema częściami. Pierwsza pomaga przedsiębiorcy po wypadku przy pracy zgłosić go kompletnie i prostym językiem. Druga pomaga pracownikowi ZUS ocenić sprawę: pokazuje rekomendację „uznać / nie uznać / do uzupełnienia” z uzasadnieniem, projekt karty wypadku i listę braków. Decyzję zawsze podejmuje człowiek. Zadanie wprost wymaga obu części i wgrania min. 5 spraw testowych (`docs/zadanie.md` §2, §6).

## 2. Tło
- Zgłoszeń jest dużo, a okoliczności bardzo różne (`docs/zadanie.md` §2).
- Poszkodowany nie wie, co i jak opisać, i boi się, że źle opisze przyczynę, więc pisze ogólnikami typu „poślizgnąłem się” (P4).
- Pracownik ZUS dostaje niejednorodne sprawy i musi sam szukać braków (P6).
- Nie mamy pakietu ZUS; zbiór spraw jest sztuczny (44–52 sprawy, część jako PDF/skan), zbudowany z publicznych źródeł (`docs/materialy.md`).

## 3. Cel
Pokazać jurorom w demo do 2 minut jedną historię: przedsiębiorca zgłasza wypadek z pomocą asystenta, a ta sama sprawa trafia do pracownika ZUS z rekomendacją, kartą i listą braków (P3, P9).

**Miary sukcesu** (P16, z założeniami progowymi z `docs/pm/02-discover.md`; progi to założenia zespołu, nie dane ZUS):
1. Przedsiębiorca kończy kompletne zgłoszenie po 2–3 neutralnych pytaniach, bez blokowania wysłania.
2. Po stronie ZUS narzędzie trafnie rozróżnia uznanie, odmowę i sprawę graniczną na min. 5 wgranych sprawach — z uzasadnieniem, projektem karty i listą braków.
3. Cała historia mieści się w demo do 2 minut.
4. **Jedna wyraźna liczba na pokaz**: ile z wgranych spraw testowych dostało trafną rekomendację (np. 6 z 6). Mierzy zgodność z naszymi regułami i sztucznymi rozstrzygnięciami, nie z praktyką ZUS.

## 4. Segmenty
1. **Poszkodowany przedsiębiorca** (pozarolnicza działalność: prace na wysokości, remonty, naprawy maszyn, dojazdy do klientów). Pierwszy raz styka się z tematem, jest w ruchu, często z urazem ręki; głównie telefon (P17). Dziś szuka poradników lub wpisuje ogólniki ze strachu przed błędem (P4).
2. **Pracownik ZUS** rozpatrujący zawiadomienia o wypadku. Ma duży wolumen spraw, skany i różne dokumenty; potrzebuje pomocy, nie automatu (P6).

## 5. Propozycja wartości
**Przedsiębiorca.** *Kto:* poszkodowany przedsiębiorca. *Po co:* zgłosić wypadek tak, żeby go nie odesłano do poprawy. *Co dziś:* nie wie, co opisać; pisze ogólnikami; boi się błędu. *Jak:* asystent dopytuje 2–3 neutralnymi pytaniami, pokazuje, czego brakuje, i nigdy nie blokuje wysłania. *Co potem:* kompletne zgłoszenie za pierwszym razem, napisane własnymi słowami (P5). *Alternatywy:* poradniki w sieci, papierowy EWYP, czat AI (zewnętrzny model — dane trafiają do zewnętrznej usługi, nie zna wzoru karty; ZANT działa bez zewnętrznego modelu, P2).
**Pracownik ZUS.** *Kto:* pracownik oceniający zawiadomienie. *Po co:* szybko ocenić sprawę i przygotować kartę. *Co dziś:* ręczne czytanie skanów i szukanie braków. *Jak:* odczyt skanów w aplikacji ZANT (w teście jury na serwerze aplikacji — miejsce do potwierdzenia P21; we wdrożeniu w infrastrukturze ZUS), bez zewnętrznego modelu, rekomendacja z 5 przesłanek i podobnych spraw, projekt karty do poprawy, lista braków z podpowiedzią, o co dopytać. *Co potem:* gotowa rekomendacja z uzasadnieniem do zatwierdzenia lub odrzucenia (P6). *Alternatywy:* praca ręczna; narzędzia ubezpieczeniowe i czat AI bez wzoru karty ZUS.
**Hasło i nazwa:** `docs/hacktribe.md`.

## 6. Rozwiązanie
### 6.1 Główna ścieżka (demo ≤ 2 min, P3)
Przedsiębiorca wpisuje ogólnik → 2–3 neutralne pytania → lista braków i załączników → „Wyślij” (przy brakach jedno łagodne potwierdzenie) → ta sama sprawa u pracownika ZUS: rekomendacja, braki, projekt karty → „Wgraj 6 spraw testowych” i liczba trafności. Szczegóły ekranów: `docs/spec.md`. Układ ekranu (jeden obraz / lista / porównanie obok siebie) wybiera Artur po obejrzeniu makiet — `docs/pm/03a-warianty.md`.

### 6.2 Funkcje pierwszej wersji (P9, P13, P14)
1. **Neutralny dopytywacz** — 2–3 pytania otwarte tylko przy ogólnikowym opisie; uspokojenie wyłącznie ogólne, bez ocen prawnych (P7, P12).
2. **Kompletność zgłoszenia bez blokowania** — wysyłka zawsze aktywna; przy brakach jedno łagodne potwierdzenie „Wysyłam mimo braków”, braki trafiają na listę pracownika ZUS (P5, P11).
3. **Lista załączników do dołączenia** (część #4) — karta ze szpitala, umowa/zlecenie, świadek; bez pobierania pliku (P14).
4. **Rekomendacja z uzasadnieniem** — „uznać / nie uznać / do uzupełnienia”, status 5 przesłanek, podobne sprawy z bazy; bez zewnętrznego modelu (P2).
5. **Edytowalny projekt karty wypadku** — części I–IV wg Dz.U. 2022 poz. 223, bez pieczątek; człowiek zatwierdza.
6. **Lista braków i niespójności** w dokumentach sprawy z podpowiedzią, o co dopytać (P6).
7. **Osobna uwaga o wyłączeniu świadczeń** (część #9) — art. 21 ust. 1, art. 21 ust. 2–3, art. 6 ust. 2–3; wyraźnie oddzielona od uznania wypadku (P14).
8. **Wgranie min. 5 spraw testowych (pokaz: 6)** w przeglądarce, z odczytem skanu na serwerze i ręczną korektą niepewnych pól, plus „Trafne rekomendacje: X z Y” (P9, P16; bez wzorca: „Brak wzorca dla wgranych spraw”). Pracownik zatwierdza / odrzuca / zmienia rekomendację i osobno zatwierdza projekt karty.

### 6.3 Technologia (skrót)
Aplikacja webowa bez instalacji; działa bez zewnętrznego modelu (P2): odczyt skanów na serwerze aplikacji (P21 do potwierdzenia przez Pawła; rekomendacja: `ksefbot.pl`, bez OMENa), rekomendacja z reguł 5 przesłanek i podobnych spraw (Programista).

### 6.4 Założenia i otwarte pytania
- **Z4, Z1, Z3** do sprawdzenia testami (E1–E4), **Z2, Z7** przeglądem tekstów (P15) — patrz `docs/spec.md` §5 (A1–A8, ramy decyzyjne) i §8.
- Wynik testu mierzy zgodność z naszymi regułami, nie z praktyką ZUS.
- Odczyt skanów może być wolny lub słaby: pomiar (`braki_F1` i czas) robi Programista **na sprzęcie z P21** (rekomendacja: serwer `ksefbot.pl`, CPU); karta OMEN (4 GB) tylko do własnych pomiarów. Próg czasu zatwierdza Paweł po P21.
- Układ ekranu (P19) i główna historia demo (P20): zadane Arturowi 12:20, czekają; makiety: https://pawelpisarek.github.io/hacknation-proba13/warianty/1/ , /2/ , /3/.
- Asystent nie ocenia prawnie (P7): ryzyko, że przedsiębiorca nadal boi się błędu w opisie przyczyny.

## 7. Wydanie
- **W pierwszej wersji:** funkcje 1–8 z 6.2 na sztucznym zbiorze (≥ 5 spraw), demo ≤ 2 min, makieta na gh-pages do 20:00.
- **Później:** warunkowe ukrywanie sekcji wg rodzaju zdarzenia (#3); pobieranie podsumowania (#4); integracje z PUE/eZUS; ocena na realnych skanach ZUS.
- **Nie robimy:** logowania i kont, integracji z PUE, zewnętrznego modelu w działającej aplikacji, automatycznej decyzji bez człowieka, ocen prawnych po stronie przedsiębiorcy.
- **Wdrożenie w ZUS (do prezentacji, `docs/zadanie.md` §5):** poza techniką potrzebne są DPIA (art. 35 RODO), audyt bezpieczeństwa, akceptacja IOD i pilotaż z pracownikami; czasu nie podajemy jako liczby bez źródła (założenie do uzgodnienia z Prezenterem).

<!-- skill: przeplywy-pm -->
<!-- skill: create-prd -->
