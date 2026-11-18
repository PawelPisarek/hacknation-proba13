# Krok 4 (autor): historyjki użytkownika — ZANT

**Źródło:** `docs/spec.md` (`afe2bed`), `docs/decyzje.md` (P1–P22). Format: historyjki zadaniowe „Gdy…, chcę…, żebym mógł…” (skill `job-stories`). Kryteria odwołują się do A1–A8 ze specu §5; progi to założenia zespołu (spec §5). Makieta: wariant ekranu wg P19 (przyjęty wg rekomendacji; późniejsza odpowiedź Artura wygrywa).

## Przedsiębiorca (telefon 360–430 px, jedna ręka — P17)

### H1. Opisać wypadek własnymi słowami
**Gdy** po wypadku nie wiem, co i jak opisać, i boję się, że źle opiszę przyczynę, **chcę** wpisać opis swoimi słowami w jedno duże pole, **żebym mógł** zacząć zgłoszenie bez stresu.
**Kryteria:**
1. Ekran ma uspokojenie ogólne („Opis nie jest egzaminem…”) i pole „Co się wydarzyło?”; żadnej oceny prawnej (A2).
2. Przycisk „Wstaw przykład” wstawia opis `W052` (A7, demo).
3. Cały ekran działa jedną ręką na 360 px (A1, P17).

### H2. Dopowiedzieć ogólnik krótkimi pytaniami
**Gdy** mój opis jest ogólnikowy („Poślizgnąłem się w pracy”), **chcę**, żeby asystent zapytał, czego brakuje, **żebym mógł** uzupełnić opis bez zgadywania.
**Kryteria:**
1. Ogólnik = opis < 55 znaków lub jeden z 3 wzorców; wtedy najwyżej 3 pytania w stałej kolejności: czynność i zlecenie → podłoże i przyczyna → część ciała i pomoc lekarza (A1).
2. Pytania są neutralne i otwarte; „Pomiń” działa; moje słowa są oddzielone od pytań pomocniczych (A1, A2).
3. Z 5 ogólników ze specu ≥ 4 kończy się pełnym opisem (czynność, przyczyna, część ciała) w ≤ 60 s na telefonie (A1, Z1/E3).

### H3. Zobaczyć, czego brakuje i co dołączyć
**Gdy** uzupełniam zgłoszenie, **chcę** widzieć, co jest gotowe, a czego brakuje (pola EWYP), i jakie załączniki dołączyć, **żebym mógł** nie dostać odesłania do poprawy.
**Kryteria:**
1. Lista kompletności wg pól EWYP; lista załączników: karta ze szpitala/SOR, umowa/zlecenie, dane świadka (A1).
2. Teksty bez oceny prawnej i bez podpowiedzi „pod uznanie” (A2).

### H4. Wysłać zgłoszenie mimo braków
**Gdy** nie mam jeszcze wszystkich dokumentów, **chcę** móc wysłać zgłoszenie teraz, **żebym mógł** nie tracić czasu na terminie.
**Kryteria:**
1. „Wyślij zgłoszenie” jest zawsze aktywne (A1).
2. Przy brakach pojawia się dokładnie jedno okno z listą braków i przyciskami „Wróć i uzupełnij” / „Wysyłam mimo braków” (A1).
3. Po wysłaniu zgłoszenie zapisuje się w pamięci serwera i dostaje numer (np. `S001`); widzę potwierdzenie i listę dokumentów do dosłania (spec §1).

## Pracownik ZUS (komputer)

### H5. Zobaczyć zgłoszenie bez przepisywania
**Gdy** otwieram sprawę przedsiębiorcy, **chcę** zobaczyć to samo zgłoszenie z listą braków, **żebym mógł** od razu zająć się oceną.
**Kryteria:**
1. „Otwórz tę sprawę jako pracownik ZUS” ładuje zgłoszenie po numerze sprawy, z brakami z „Wysyłam mimo braków” (A7, A8).
2. Przejście z H4 do H5 mieści się w planie demo ≤ 120 s (A7).

### H6. Wczytać skany i poprawić niepewne pola
**Gdy** dostaję sprawy jako skany PDF, **chcę** żeby aplikacja odczytała dane i pokazała, czego nie jest pewna, **żebym mógł** poprawić tylko to, co wątpliwe.
**Kryteria:**
1. Przycisk „Wgraj 6 spraw testowych” (min. 5 — zadanie §6) lub wybór własnych plików PDF (A4, A5).
2. Odczyt ≤ 30 s na sprawę i ≥ 80% kluczowych pól bez przepisywania — założenie do pomiaru na sprzęcie z P21 (A5).
3. Pole niepewne (pewność < 70/100 lub zły format) jest podświetlone, klikalne; „Przelicz” uwzględnia poprawkę (A5).
4. W demo używamy skanów wcześniej odczytanych (A5, A7).

### H7. Dostać rekomendację z uzasadnieniem i brakami
**Gdy** rozpatruję zawiadomienie, **chcę** zobaczyć rekomendację z uzasadnieniem i listą braków, **żebym mógł** szybko ocenić sprawę.
**Kryteria:**
1. Rekomendacja UZNAĆ / NIE UZNAĆ / DO UZUPEŁNIENIA, status 5 przesłanek, uzasadnienie z ≥ 1 cytatem z dokumentu i 1–2 podobne sprawy ze zbioru uczącego (A3).
2. Jasne odmowy `W020` i `W027`: 0 błędów (A3, Z4).
3. Ramka „Wyłączenia świadczeń — nie mylić z uznaniem” jest osobno od kwalifikacji (A6).
4. Lista braków i niespójności z podpowiedzią, o co dopytać (A3, P6).

### H8. Zdecydować jako człowiek i poprawić kartę
**Gdy** zatwierdzam wynik, **chcę** zatwierdzić, odrzucić lub zmienić rekomendację (z powodem) oraz osobno zatwierdzić projekt karty, **żebym mógł** zachować decyzję po swojej stronie (RODO art. 22).
**Kryteria:**
1. Do czasu wyboru status: „Rekomendacja — czeka na decyzję pracownika”; po wyborze zapisana decyzja człowieka obok rekomendacji systemu (A8).
2. „Zmień na…” wymaga krótkiego powodu; edycje zapisują się w pamięci serwera (A8).
3. Projekt karty (części I–IV, bez pieczątek, Dz.U. 2022 poz. 223) ma pola edytowalne z etykietą źródła; „Zatwierdź projekt karty” jest osobnym przyciskiem (A6, A8).

### H9. Zobaczyć, ile rekomendacji trafiło
**Gdy** ocenia się paczka spraw, **chcę** jednej wyraźnej liczby zgodności, **żebym mógł** ocenić trafność bez liczenia.
**Kryteria:**
1. Po wgraniu ≥ 5 spraw: „Trafne rekomendacje: X z Y” z dopiskiem „sztuczny zbiór testowy, kwalifikacja zdarzenia” (A4).
2. Y = wgrane sprawy ze wzorcem (ID `Wxxx`); X liczone z rekomendacji systemu, nie z decyzji człowieka (A4).
3. Brak wzorca → „Brak wzorca dla wgranych spraw” (A4).

## Przekrój
- **Demo ≤ 120 s (A7):** H1 → H2 → H4 → H5 → H7/H8 → H9; 105 s + 15 s zapasu, bez odczytu skanów na żywo.
- **Ryzyka i otwarte:** próg 30 s / 80% i miejsce odczytu (P21) czekają na Pawła; progi zatwierdzają Paweł i Artur.

<!-- skill: przeplywy-pm -->
<!-- skill: job-stories -->
