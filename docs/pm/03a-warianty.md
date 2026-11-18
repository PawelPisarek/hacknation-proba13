# Szkice 3 wariantów ekranu (moment c — przed `/write-prd`)

**Data**: 2026-11-18 · **Autor**: Projektant · **Cel**: wejście dla Programisty do zbudowania 3 klikalnych makiet wariantów (np. `/warianty/1/`, `/warianty/2/`, `/warianty/3/`), zanim Projektant pokaże je Arturowi do wyboru w pokoju Produkt.
**Podstawa**: `docs/zadanie.md`, `docs/materialy.md` (`f1efade`), `docs/pm/02-discover.md`, `docs/decyzje.md` (P1–P17), zbiór `dane/zbior/testowy/` (`5ab0b35`).

---

## Zasady wspólne dla wszystkich 3 wariantów (niezmienne)

1. **Jedna aplikacja webowa, dwie role (P3):** w każdym wariancie zaczynamy od **przedsiębiorcy** (pierwsza połowa historii w demo), a jednym kliknięciem przechodzimy do **pracownika ZUS** z tą samą sprawą (druga połowa historii). Cała ścieżka demonstracyjna mieści się w **≤ 2 minutach**.
2. **Ekran przedsiębiorcy — mobile-first (P17):** projektowany przede wszystkim pod **telefon (360–430 px)** i obsługę jedną ręką (osoba po wypadku, np. z ręką w gipsie): jedna kolumna, przyciski o wysokości ≥ 48 px, krótkie zdania, bez tabel i bez bocznych paneli na telefonie. Na komputerze ten sam widok skaluje się do wycentrowanej kolumny. Ekran pracownika ZUS projektowany pod komputer (z poprawnym przewijaniem na mniejszym ekranie).
3. **Neutralność asystenta (P4, P7):** po stronie przedsiębiorcy wyłącznie **ogólne uspokojenie** (*„Opis nie jest egzaminem — napisz swoimi słowami, co dokładnie się wydarzyło”*), **zero ocen prawnych**, zero podpowiadania faktów „pod uznanie” i **zero reguły o błędzie poszkodowanego** (art. 21 ust. 1 działa wyłącznie w widoku pracownika ZUS). Tekst wpisany przez poszkodowanego jest wyraźnie oddzielony od neutralnych pytań pomocniczych.
4. **Krótka runda pytań (P12):** przy ogólnikowym opisie (np. *„Poślizgnąłem się w pracy”*) asystent zadaje maksymalnie **2–3 krótkie, neutralne pytania otwarte** (czynność przed zdarzeniem, czynnik zewnętrzny, uraz/pomoc).
5. **Kompletność bez blokowania + łagodne potwierdzenie (P5, P11):** przycisk wysłania zgłoszenia jest zawsze aktywny. Gdy czegoś brakuje, przed wysłaniem pojawia się dokładnie jedno łagodne okno/karta potwierdzenia: *„Brakuje jeszcze: [lista]. Możesz wysłać zgłoszenie teraz — przekażemy tę listę pracownikowi ZUS”* z dwoma przyciskami: **„Wróć i uzupełnij”** oraz **„Wysyłam mimo braków”**.
6. **Zakres funkcji (P9, P13, P14):**
   - **W makietach są:** #1 neutralny dopytywacz (2–3 pytania), #2 kompletność EWYP bez blokowania + łagodne potwierdzenie, #4 (w części) prosta lista załączników do dołączenia przez przedsiębiorcę, #6 rekomendacja (`UZNAĆ` / `NIE UZNAĆ` / `DO UZUPEŁNIENIA`) z oceną 5 przesłanek i podobnymi sprawami z bazy, #7 edytowalny projekt karty wypadku (sekcje I–IV wg **Dz.U. 2022 poz. 223 — bez pieczątek**) z podglądem źródła wpisu, #8 lista braków i niespójności w dokumentach sprawy, #9 (w części) krótka osobna uwaga o możliwych wyłączeniach wypłaty świadczeń po stronie ZUS (`art. 21 ust. 1`, `art. 21 ust. 2–3`, `art. 6 ust. 2–3`), #10 wgrywanie min. 5 spraw testowych w przeglądarce z lokalnym odczytem skanu i ręczną korektą niepewnych pól + **jedna wyraźna liczba trafności na pokaz** (P16).
   - **Poza pierwszą wersją (NIE umieszczać w makietach):** #3 warunkowe ukrywanie sekcji wg rodzaju zdarzenia; pobieranie pliku podsumowania z #4.
7. **Lokalność (P2):** w nagłówku aplikacji dyskretna etykieta *„Przetwarzanie lokalne — dane nie wychodzą z ZUS (bez zewnętrznego modelu)”*; decyzję zawsze zatwierdza pracownik ZUS (przycisk po stronie człowieka).

---

## Wspólne udawane dane do makiet (z `dane/zbior/testowy/`, `5ab0b35`)

Programista używa dokładnie tych samych danych we wszystkich 3 wariantach, żeby Artur porównywał wyłącznie układ i ścieżkę:

### A. Sprawa startowa przedsiębiorcy (demo cz. 1 → cz. 2) — na bazie `W052`
- **Poszkodowany:** Rafał Dąbrowski, PKD `43.21.Z` (wykonywanie instalacji elektrycznych), ul. Kościuszki 94/26, 00-955 Warszawa.
- **Wpis startowy (ogólnikowy, gotowy do załadowania jednym kliknięciem „Przykład ogólnikowy”):** *„Poślizgnąłem się w pracy i boli mnie bark.”* (data: `2026-01-07`, godzina: `14:20`, miejsce: `obiekt przy ul. Przemysłowa 101, Lublin`).
- **3 neutralne pytania asystenta (P12, bez ocen prawnych):**
  1. *Jaką dokładnie czynność wykonywałeś w momencie zdarzenia i w ramach jakiego zlecenia?*
  2. *Co było na podłożu lub w otoczeniu i co wywołało poślizgnięcie?*
  3. *Która część ciała ucierpiała i czy udzielił Ci już pomocy lekarz lub SOR?*
- **Lista braków EWYP i załączników do dołączenia (#2, #4 część):**
  - Brakujące elementy: opis szczegółowy (jeśli nie doprecyzowano), karta informacyjna ze szpitala / SOR, umowa lub zlecenie na usługę (opcjonalnie dane świadka).
  - Po kliknięciu „Wysyłam mimo braków” te same braki lądują od razu na liście braków u pracownika ZUS dla sprawy `W052`.

### B. Paczka 6 spraw testowych dla pracownika ZUS (mieszanka z P10, `#10`, `P16`)
Jednym przyciskiem **„Wgraj 6 spraw testowych”** (lub wyborem plików w przeglądarce) ładuje się mieszanka z `dane/zbior/testowy/`:

| ID | Poszkodowany i skrót zdarzenia | Rekomendacja (kwalifikacja) | Osobna uwaga: wyłączenia świadczeń (#9 cz.) | Braki w dokumentach (#8) |
|---|---|---|---|---|
| **W052** | Rafał Dąbrowski — elektryk, ogólnik „Poślizgnąłem się w pracy”, bark | **DO UZUPEŁNIENIA** | Brak | 3: brak karty medycznej, opis ogólnikowy, brak umowy/zlecenia |
| **W006** | Dariusz Nowak — stolarz, piła tarczowa, rana palca (zwykła nieuwaga, przyp. 4a) | **UZNAĆ** | Brak *(zwykła nieuwaga nie wyłącza świadczeń — art. 21 ust. 1 nie zachodzi)* | 0 |
| **W023** | Michał Mazur — elektryk, poślizgnięcie na parkingu u klienta (dojazd, przyp. 2a) | **UZNAĆ** | Brak | 3: pierwsza pomoc, godzina wypadku, karta medyczna *(+ 2 niepewne pola OCR do korekty: godzina `10:45`, uraz `skręcenie kolana lewego`)* |
| **W020** | Michał Krawczyk — naprawa rynny przy własnym domu w sobotę (przyp. 1) | **NIE UZNAĆ** | n/d *(brak związku z działalnością)* | 0 |
| **W027** | Anna Szymańska — zasłabnięcie / zawał przy biurku bez czynnika zewn. (przyp. 3a) | **NIE UZNAĆ** | n/d *(brak przyczyny zewnętrznej)* | 0 |
| **W038** | Piotr Kozłowski — upadek z rusztowania + odmowa badania trzeźwości (przyp. 5a) | **UZNAĆ** | **Uwaga (art. 21 ust. 2–3):** odmowa badania trzeźwości — wpisać w polu III.6 karty | 0 |

- **Licznik trafności na pokaz (P16):** **„Trafne rekomendacje: 6 z 6”** z dopiskiem *„sztuczny zbiór testowy — zgodność z regułami ZANT (cały zbiór testowy: 13 z 13)”*.
- **Przykładowa podobna sprawa z bazy (dla `W006` / `W023` / `W052`):** np. dla `W023` → `W022` (dojazd do klienta, uznano); dla `W052` → `W051` (ogólnik + brak karty medycznej, do uzupełnienia); dla `W006` → `W004` (odrzut na pilarce, uznano).

---

## Trzy wyraźnie różne warianty ekranu

### Wariant 1 — Jeden widok na cały ekran (krok po kroku, pełnoekranowe karty)

**Szkic w 3 linijkach (do pokazania Arturowi):**
- **Układ:** jeden prosty ekran naraz na pełną szerokość (telefon: pełnoekranowe karty do obsługi jedną ręką; komputer: jedna wycentrowana kolumna bez bocznych paneli).
- **Co widać pierwsze:** ekran przedsiębiorcy z ogólnym uspokojeniem (*„Opis nie jest egzaminem — napisz swoimi słowami, co się stało”*), jednym dużym polem opisu zdarzenia i dyskretnym przełącznikiem ról na górze.
- **Główna ścieżka (≤ 2 min):** opis ogólnikowy → 2–3 neutralne pytania po jednym na kartę → podsumowanie kompletności i lista załączników → łagodne „Wysyłam mimo braków” → jednym kliknięciem ta sama sprawa u pracownika ZUS (zakładki: Rekomendacja i braki → Skan i korekta → Projekt karty) → przycisk „Testuj 6 spraw” z wielką liczbą **6 z 6**.

**Lista ekranów dla Programisty (Wariant 1):**
1. **E1.1 — Przedsiębiorca: Opisz zdarzenie (ekran startowy, telefon):** górny pasek (ZANT, etykieta lokalności, przełącznik `Przedsiębiorca | Pracownik ZUS`), komunikat ogólnego uspokojenia (P7), jedno duże pole tekstowe „Co się wydarzyło?” + przycisk pomocniczy dla demo „Wstaw przykład (`W052`)”, na dole duży przycisk **„Dalej”**.
2. **E1.2 — Przedsiębiorca: Krótka runda pytań (max 3 karty):** pasek „Pytanie 1 z 3”, wyraźny boks „Twoje słowa” (tylko do podglądu) i pod spodem jedno neutralne pytanie + pole odpowiedzi; przyciski **„Pomiń”** i **„Dalej”** (niczego nie wymusza).
3. **E1.3 — Przedsiębiorca: Kompletność i załączniki:** krótka lista braków EWYP (co gotowe, czego brakuje), prosta checklista załączników do dołączenia (*karta ze szpitala/SOR*, *umowa/zlecenie*, *świadek*), bez przycisku pobierania pliku; duży przycisk **„Wyślij zgłoszenie”** → przy brakach karta potwierdzenia (**„Wróć i uzupełnij”** / **„Wysyłam mimo braków”**).
4. **E1.4 — Przedsiębiorca: Wysłano:** potwierdzenie zapisu sprawy `W052`, przypomnienie listy dokumentów do dosłania, duży przycisk **„Otwórz tę sprawę jako pracownik ZUS”**.
5. **E1.5 — Pracownik ZUS: Sprawa krok po kroku (jedna kolumna z 3 zakładkami):**
   - Zakładka **„1. Rekomendacja i braki”**: werdykt (`DO UZUPEŁNIENIA` / `UZNAĆ` / `NIE UZNAĆ`), 5 przesłanek (zielone/czerwone/brak danych), osobna ramka **„Wyłączenia świadczeń (nie mylić z uznaniem)”**, lista braków i niespójności z podpowiedzią, o co dopytać, oraz 1–2 podobne sprawy z bazy.
   - Zakładka **„2. Skan i niepewne pola”**: podgląd odczytanego tekstu skanu z 2 podświetlonymi polami do kliknięcia i poprawy + przycisk „Przelicz rekomendację”.
   - Zakładka **„3. Projekt karty wypadku”**: edytowalne sekcje I–IV (Dz.U. 2022 poz. 223, bez pieczątek), przy polach etykieta źródła (np. „z EWYP”, „z wyjaśnień”), na dole przycisk decyzji człowieka **„Zatwierdź projekt karty”**.
6. **E1.6 — Pracownik ZUS: Test paczki spraw (≥ 5):** przycisk „Wgraj 6 spraw testowych”, wyraźna karta na górze **„Trafne rekomendacje: 6 z 6”** (P16) i prosta lista 6 kart (kliknięcie otwiera E1.5 dla wybranej sprawy).

---

### Wariant 2 — Najpierw lista / kolejka (checklista sekcji na telefonie, kolejka spraw w ZUS)

**Szkic w 3 linijkach (do pokazania Arturowi):**
- **Układ:** start od przejrzystej listy — u przedsiębiorcy pionowa lista 5 krótkich sekcji zgłoszenia EWYP ze statusami gotowe/brakuje na telefonie, a u pracownika ZUS tabela-kolejka spraw do rozpatrzenia.
- **Co widać pierwsze:** na telefonie przedsiębiorcy pasek kompletności EWYP (np. 2/5 gotowe), ogólne uspokojenie i 5 rozwijanych wierszy zgłoszenia (pierwszy: „1. Co się stało”) ze stałym przyciskiem „Wyślij zgłoszenie” na dole ekranu.
- **Główna ścieżka (≤ 2 min):** rozwinięcie sekcji „Co się stało” → ogólnik i 2–3 neutralne pytania pod polem → spojrzenie na listę braków i załączników → „Wyślij” z łagodnym potwierdzeniem → wejście do kolejki pracownika ZUS (na górze przycisk „Wgraj 6 spraw” + licznik **6 z 6**, na pierwszym wierszu nowa sprawa z brakami) → otwarcie szczegółu z rekomendacją, osobną uwagą o wyłączeniach i edytowalną kartą.

**Lista ekranów dla Programisty (Wariant 2):**
1. **E2.1 — Przedsiębiorca: Lista sekcji zgłoszenia EWYP (ekran startowy, telefon):** górny pasek (ZANT, etykieta lokalności, przełącznik `Przedsiębiorca | Kolejka ZUS`), pasek kompletności („Uzupełniono 2 z 5 — możesz wysłać w każdej chwili”), komunikat ogólnego uspokojenia (P7), 5 rozwijanych bloków (akordeon):
   - *1. Co się stało (okoliczności i przyczyna)* — domyślnie otwarty: pole „Twoje słowa” + po wpisaniu ogólnika od razu pod spodem zwarta ramka „Pomocnicze pytania (2–3)” z dopiskiem, że to tylko pytania pomocnicze.
   - *2. Kiedy i gdzie* (data, godzina, miejsce, planowane godziny pracy).
   - *3. Uraz i pierwsza pomoc*.
   - *4. Dane firmy i poszkodowanego* (wstępnie wypełnione z przykładu `W052`).
   - *5. Załączniki do dołączenia* (lista dokumentów do zebrania: karta ze szpitala/SOR, umowa/zlecenie, świadek — bez pobierania pliku).
   - Na dole przypięty przycisk **„Wyślij zgłoszenie”** (zawsze aktywny) → przy brakach jedno łagodne potwierdzenie (**„Wróć”** / **„Wysyłam mimo braków”**), potem baner z linkiem **„Przejdź do kolejki pracownika ZUS”**.
2. **E2.2 — Pracownik ZUS: Kolejka spraw + test paczki (≥ 5):** u góry pasek akcji: przycisk **„Wgraj 6 spraw testowych”** + wyróżniony kafelek **„Trafne rekomendacje: 6 z 6”** (P16) + filtr mieszanki (`Wszystkie | Uznać | Nie uznać | Do uzupełnienia`). Poniżej tabela-kolejka spraw (na samej górze świeżo wysłana `W052` z etykietą „Nowe zgłoszenie · 3 braki”, pod nią `W006`, `W023`, `W020`, `W027`, `W038` z kolumnami: Sprawa, Rekomendacja, Wyłączenie świadczeń, Liczba braków, Akcja „Otwórz”).
3. **E2.3 — Pracownik ZUS: Szczegół wybranej sprawy:** przycisk powrotu „← Wróć do kolejki”, na górze baner z rekomendacją + osobnym boxem **„Wyłączenia świadczeń”** (#9 część), poniżej kolejno sekcje: (a) 5 przesłanek + podobne sprawy z bazy, (b) Lista braków i niespójności + „O co dopytać”, (c) Niepewne pola ze skanu do szybkiej korekty (np. w `W023`), (d) Edytowalny projekt karty wypadku (sekcje I–IV, Dz.U. 2022 poz. 223) i przycisk **„Zatwierdź kartę”**.

---

### Wariant 3 — Porównanie obok siebie (dwa panele: „Zgłoszenie / Skan” vs „Podpowiedź / Ocena i karta”)

**Szkic w 3 linijkach (do pokazania Arturowi):**
- **Układ:** dwa panele obok siebie — po lewej źródło (słowa przedsiębiorcy / odczytany skan), po prawej wsparcie (pytania i braki / rekomendacja i edytowalna karta); na telefonie przedsiębiorcy dwa przełączane panele na zakładkach pod wspólnym paskiem kompletności.
- **Co widać pierwsze:** u przedsiębiorcy na telefonie pasek kompletności + ogólne uspokojenie i dwie zakładki **„Moje zgłoszenie” | „Podpowiedzi i braki (3)”** (na komputerze oba panele obok siebie); w ZUS od razu podział 50/50: po lewej dokument i skan z cytatami, po prawej rekomendacja i projekt karty.
- **Główna ścieżka (≤ 2 min):** wpis ogólnika w „Moje zgłoszenie” → przełączenie na „Podpowiedzi i braki” (2–3 neutralne pytania + lista załączników) → wysłanie z łagodnym potwierdzeniem → w ZUS porównanie 50/50: po lewej podświetlone cytaty i korekta niepewnych pól OCR, po prawej 5 przesłanek, osobna uwaga o wyłączeniach i edytowalna karta, a nad nimi pasek paczki testowej z licznikiem **6 z 6**.

**Lista ekranów dla Programisty (Wariant 3):**
1. **E3.1 — Przedsiębiorca: Zgłoszenie i podpowiedzi obok siebie (mobile: 2 zakładki; desktop: 2 kolumny):**
   - Góra: pasek ZANT + etykieta lokalności + przełącznik `Przedsiębiorca | Pracownik ZUS`, pod nim ogólne uspokojenie (P7) i pasek kompletności EWYP.
   - Na telefonie (360–430 px): wyraźny przełącznik dwóch kart **„Moje zgłoszenie”** i **„Podpowiedzi i braki (3)”** (z licznikiem, żeby było widać, że czekają pytania pomocnicze).
   - Panel A (**„Moje zgłoszenie — Twoje słowa”**): proste pola EWYP (opis zdarzenia z przyciskiem „Wstaw przykład `W052`”, data/godzina/miejsce, uraz, dane firmy).
   - Panel B (**„Podpowiedzi i braki”**): 2–3 neutralne pytania pomocnicze z przyciskiem „Dopisz odpowiedź do opisu”, lista brakujących pól EWYP oraz checklista załączników do dołączenia (#4 część, bez pobierania pliku).
   - Dół (przypięty): przycisk **„Wyślij zgłoszenie”** → łagodne potwierdzenie przy brakach (P11) → przejście jednym kliknięciem **„Otwórz sprawę w widoku ZUS”**.
2. **E3.2 — Pracownik ZUS: Widok porównawczy 50/50 + górny pasek paczki testowej:**
   - **Górny pasek paczki testowej:** przycisk **„Wgraj 6 spraw testowych”**, wyraźna odznaka **„Trafne rekomendacje: 6 z 6”** (P16) oraz pigułki szybkiego przełączania między 6 sprawami (`W052`, `W006`, `W023`, `W020`, `W027`, `W038` z kolorową kropką klasy).
   - **Lewy panel (Źródło — dokument / skan):** pełny tekst zgłoszenia/skanu z podświetlonymi cytatami wspierającymi przesłanki oraz podświetlonymi na żółto **niepewnymi polami OCR** do kliknięcia i poprawy w miejscu (#10, np. w `W023`), z przyciskiem „Przelicz”.
   - **Prawy panel (Ocena i decyzja):**
     1. Karta rekomendacji (`UZNAĆ` / `NIE UZNAĆ` / `DO UZUPEŁNIENIA`) + status 5 przesłanek + 1 podobna sprawa z bazy.
     2. Osobna, wyraźnie oddzielona ramka **„Wyłączenia świadczeń (art. 21 / art. 6) — osobno od uznania wypadku”** (#9 część; widoczna np. na `W038`).
     3. Lista braków i niespójności (#8) z podpowiedzią, o co dopytać.
     4. Edytowalny projekt karty wypadku (sekcje I–IV wg Dz.U. 2022 poz. 223, bez pieczątek) + przycisk **„Zatwierdź projekt karty”**.

---

## Czego NIE robimy teraz
- Nie pytamy jeszcze Artura w pokoju Produkt — najpierw Programista buduje 3 klikalne makiety na bazie powyższych szkiców i oddaje 3 linki. Dopiero wtedy Projektant pokazuje Arturowi 3-linijkowe szkice razem z 3 linkami i zbiera wybór oraz pytania doprecyzowujące.

<!-- skill: przeplywy-pm -->
<!-- skill: przesluchanie-hackathon -->
