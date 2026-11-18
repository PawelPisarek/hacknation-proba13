# Scenariusze testów (`test-scenarios`): kryteria A1–A8

**Autor**: Analityk · **Wejście**: `docs/spec.md` a567153 (A1–A8, §5), `docs/pm/04-zalozenia.md`, `docs/pm/05-red-team.md`, kod `6bec849`. Spec poprawia teraz Projektant (recenzja odbiorcy); różnice dopiszę po jego poprawce (sekcja „Różnice po poprawce speca” na końcu).
**Wynik wykonania** podany tylko tam, gdzie uruchomiłem komendę (kolumna „Uruchomiono”); reszta to scenariusz do wykonania ręcznie lub przez Programistę.

## Decyzje do scenariuszy
- **„Jasne odmowy” (A3, A8):** w `dane/zbior/etykiety.csv` **żadna** odmowa nie ma `graniczny=false` (wszystkie 15 NIE_UZNAC to `graniczny=true`; 4 w testowym: W020, W027, W029, W042). Przyjmuję: jasna odmowa = odmowa z jedną przyczyną wprost w tekście, bez braków dokumentów: **W020** (czynność prywatna, przypadek 1), **W027** i **W029** (zasłabnięcie/zawał bez czynnika zewnętrznego, 3a). **W042** odpada: ma braki (`planowane_godziny_pracy`, `opis_ogolnikowy`). Powód: spec A3 używa pojęcia bez definicji (uwaga Programisty, recenzja odbiorcy 5).
- **Ogólnik** (A1): opis bez czynności przed zdarzeniem lub bez czynnika zewnętrznego, niezależnie od długości. Kod używa `< 55 znaków` lub 3 wzorców (`asystent.mjs`).
- **Parafraza**: ta sama sprawa, te same fakty, inne słowa; wejście `dane/parafrazy/testowy/Wxxx/zgloszenie.txt` (zmieniony tylko miejsce/uraz/opis/wyjaśnienia/policja; `wejscie.json` i `karta.json` skopiowane bez zmian). Pisał Analityk, który czytał fragmenty `bazowa.mjs`, więc to **nie jest test ślepy**; lepszy byłby autor bez wiedzy o regułach.

## Scenariusze

### S1 (A3, Z4, N1): parafrazy 5 spraw
- **Wejście:** `dane/parafrazy/testowy/{W006,W020,W027,W038,W052}`.
- **Kroki:** `node ocena/ocen.mjs --zbior dane/parafrazy --szczegoly`.
- **Oczekiwane:** zgodność rekomendacji ≥ 4 z 5 (próg 80% z A3, założenie zespołu); wyłączenie W038 = `ART_21_2_3_NIETRZEZWOSC`; W020/W027 = NIE_UZNAC; W052 = DO_UZUPELNIENIA.
- **Uruchomiono:** `kwalifikacja_3kl=3/5 (60.0%) | UZNAC TP=2 TN=1 FP=2 FN=0 | wylaczenia=4/5 | braki_F1=0.800` → **NIE ZDANY**. Błędy: **W020 → UZNAC** (powinno NIE_UZNAC; zniknęły frazy „własny dom/w wolny dzień”), **W052 → UZNAC** (powinno DO_UZUPELNIENIA; opis 97 znaków, reguła braku dowodu wymaga opisu < 40 znaków), **W038 wyłączenie → BRAK** (zamiast art. 21 ust. 2–3; „nie zgodził się na badanie” zamiast „odmowa”). Kolumna `okolicznosci` 0/5 jest artefaktem: wzorzec porównuje z oryginałem, nie liczyć.
- **Co oznacza:** reguły to w dużej mierze dopasowanie fraz (`bazowa.mjs`: np. `w sobote.*naprawial.*rynn`); 13/13 na oryginałach mierzy dopasowanie do szablonów generatora. Zgodnie z `04-zalozenia.md` N1 licznik na ekranie opisujemy jako „zgodność ze wzorcem sztucznego zbioru”.
- **Decyzja (ramy spec §5):** Z4 niezdane → poprawić reguły lub przyznać ograniczenie w prezentacji; sprawy W020 i W052 wyglądają na FP (UZNAC zamiast odmowy/uzupełnienia), więc najgroźniejsze dla wiarygodności.

### S2 (A3): zbiór oryginalny, odniesienie
- **Kroki:** `node ocena/ocen.mjs`. **Oczekiwane:** 13/13. **Uruchomiono:** `13/13 (100.0%) | UZNAC TP=8 TN=5 FP=0 FN=0 | braki_F1=1.000`. Zdany; pamiętać, że to ten sam zespół i generator (N1).

### S3 (A3): jasne odmowy
- **Wejście:** W020, W027, W029 (oryginały) i parafrazy W020, W027.
- **Kroki:** `node ocena/ocen.mjs --ids W020,W027,W029` nie istnieje; użyć `--szczegoly` i odczytać wiersze albo POST `/api/zus/zgodnosc` z `{"ids":["W020","W027","W029"]}`.
- **Oczekiwane:** 3/3 NIE_UZNAC dla oryginałów; 0 FP (UZNAC zamiast odmowy) także dla parafraz.
- **Uruchomiono (parafrazy):** W027 NIE_UZNAC ✓, **W020 UZNAC ✗** → 0 błędów niespełnione na parafrazie.

### S4 (A1, Z1): ogólniki > 55 znaków, wykrycie
- **Wejście:** `dane/parafrazy/ogolniki.txt` (5 opisów 64–85 znaków; każdy bez czynności przed zdarzeniem; żaden nie wymaga ≥ 55).
- **Kroki:** `node -e` z `czyOpisOgolnikowy` z `app/logika/asystent.mjs` na każdej linii (skrypt w historii: import i pętla po liniach).
- **Oczekiwane:** `true` dla 5/5 (asystent zadaje ≥ 1 pytanie).
- **Uruchomiono:** `false` dla **5/5** → **NIE ZDANY**: żaden z tych opisów nie dostanie pytań. W52 w oryginale (`Poślizgnąłem się w pracy.`, 25 znaków) działa tylko dlatego, że < 55.
- **Decyzja:** poprawić detekcję (czynność / czynnik / uraz zamiast długości) przed E3; do Programisty.

### S5 (A1): E3 na telefonie
- **Wejście:** 5 ogólników z S4 + W052 (`Poślizgnąłem się w pracy.`).
- **Kroki (ręcznie, osoba spoza zespołu, telefon 360–430 px, jedna ręka):** wpisz opis → odpowiedz na pytania (można „Pomiń”) → obejrzyj kompletność i listę załączników → „Wyślij zgłoszenie” → przy brakach okno z „Wróć i uzupełnij” / „Wysyłam mimo braków”.
- **Oczekiwane:** ≤ 3 pytania; ≥ 4 z 5 kończy się opisem z czynnością + przyczyną + urazem; ≤ 60 s; dokładnie 1 okno potwierdzenia; „Wyślij” aktywne zawsze.
- **Jak sprawdzić:** stoper + notatka: liczba pytań, czas, trzy elementy opisu (tak/nie). Zależy od S4.

### S6 (A2): neutralność tekstów przedsiębiorcy
- **Kroki:** wypisać wszystkie teksty po stronie przedsiębiorcy z `app/public/index.html` i `app/logika/asystent.mjs` (`grep -n "pytanie\|komunikat" …`) i szukać słów: `uzna`, `wina`, `przyczyn`, `nieuwag`, `zgodnie z`, `art.`.
- **Oczekiwane:** 0 ocen prawnych i sugestii „pod uznanie”; reguła art. 21 tylko w widoku pracownika. **Uwaga:** pytanie „co wywołało zdarzenie” dotyka przyczyny zewnętrznej (przesłanka prawna), więc sprawdzić brzmienie ręcznie z Arturem.

### S7 (A4, P16): licznik na paczce 6 spraw
- **Wejście:** `W052, W006, W023, W020, W027, W038` (spec §4).
- **Kroki:** POST `/api/zus/zgodnosc` z `{"ids":[…6]}` oraz klik „Wgraj 6 spraw testowych” na ekranie.
- **Oczekiwane:** `y=6`, `x` z faktycznego przebiegu; napis „Trafne rekomendacje: X z Y” (spec), nie „Zgodność ze wzorcem” (stan 12:24: kod ma stary napis, zmiana u Programisty).
- **Jak sprawdzić:** liczba na ekranie = liczba z `curl` = liczba wierszy rekomendacji zgodnych z etykietą w `etykiety.csv`.

### S8 (A4): plik bez ID / nieznane ID
- **Wejście:** `dane/parafrazy/testowy/W052/zgloszenie.txt` wgrany pod nazwą `moj_plik.txt`; `{"ids":["plik_bez_id"]}`; `{"ids":[]}`.
- **Oczekiwane:** komunikat „Brak wzorca dla wgranych spraw”; rekomendacja dla pliku nadal wyświetlona; licznik nie liczy tej sprawy do Y.
- **Uruchomiono (API):** `/api/zus/zgodnosc` z `["plik_bez_id"]` i `[]` → `x=0,y=0,tekst:"Brak wzorca dla wgranych spraw"` ✓. `/api/zus/rekomendacja` z samym `tekst` (bez `id`) → `id:"S001"`, rekomendacja zwrócona ✓ (dla parafrazy W052: UZNAC, patrz S1: błąd merytoryczny, nie licznika).
- **Nie sprawdzone:** czy ekran wgranego pliku używa tych endpointów i jak się zachowuje przy nazwie `W006_kopia.pdf` (ID z nazwy).

### S9 (A4, N3): licznik zgodny z ekranem
- **Kroki:** wgrać `W006` z zmienioną treścią (np. W006 z opisem W020) pod nazwą `W006.txt`.
- **Oczekiwane:** rekomendacja na ekranie dla wgranej treści; licznik liczy **tę** rekomendację względem wzorca W006 (UZNAC), więc ma wskazać niezgodność.
- **Kod dziś:** `/api/zus/zgodnosc` liczy po samym ID z txt zbioru (`server.mjs`), nie z wgranej treści: spodziewany FAIL (zawsze 1 z 1). Do potwierdzenia testem na wdrożeniu.

### S10 (A5, Z3): odczyt PDF
- **Wejście:** `dane/zbior/testowy/*/zgloszenie.pdf` (13) + 1 PDF z zewnątrz (skan rastrowy).
- **Kroki:** `node ocena/ocen.mjs --zrodlo pdf --szczegoly` (na CPU serwera/OMEN klasa `testy`, nie ThinkPad: spec P21); czas wywołania POST `/api/zus/rekomendacja` z `pdfBase64`.
- **Oczekiwane:** ≤ 30 s na sprawę, ≥ 80% kluczowych pól, niepewne pola podświetlone; PDF rastrowy → czytelny komunikat, nie pusty wynik.
- **Uruchomiono:** nie. Dziś `wyciagnijTekstZPdf` czyta tylko warstwę tekstową; w `node:22-slim` nie ma OCR.

### S11 (A6, Z7): rozdział wyłączeń od kwalifikacji
- **Wejście:** W038 (art. 21 ust. 2–3, UZNAC) i W006 (BRAK).
- **Kroki:** otworzyć ekran pracownika; sprawdzić ramkę „Wyłączenia świadczeń — nie mylić z uznaniem”.
- **Oczekiwane:** W038: rekomendacja UZNAC **i** osobna ramka z art. 21 ust. 2–3; W006: „brak”; w karcie III.4 osobno od III.5–6; karta bez pieczątek (Dz.U. 2022 poz. 223).
- **Uruchomiono (kod):** S1 pokazuje, że parafraza W038 traci wyłączenie, więc ramka bywa pusta mimo odmowy badania.

### S12 (A7, Z9): ścieżka demo ≤ 120 s
- **Kroki:** stoper: przedsiębiorca na telefonie (W052) ≈ 50 s → pracownik ≈ 40 s → „Wgraj 6 spraw” + licznik ≈ 15 s, tryb pokazowy.
- **Oczekiwane:** ≤ 105 s + 15 s zapasu; bez odczytu skanów na żywo. **Jak sprawdzić:** 3 próby, zapis czasu; zależy od P20 (Artur).

### S13 (A8): decyzja człowieka
- **Kroki:** na W020 kliknąć „Zatwierdź rekomendację”; na W052 „Odrzuć”; na W027 „Zmień na…” z powodem; potem „Zatwierdź projekt karty”.
- **Oczekiwane:** status „Rekomendacja — czeka na decyzję pracownika” do kliknięcia; po wyborze decyzja człowieka obok rekomendacji systemu; zatwierdzenie karty osobne; pola karty edytowalne z etykietą źródła.
- **Nie ustalone w specu (uwaga Programisty 3):** czy decyzja przeżywa odświeżenie; sprawdzić i dopisać oczekiwanie.

### S14 (A8, Z8): pola karty
- **Wejście:** W006, W020, W023, W038, W052; `karta.json` jako wzorzec.
- **Kroki:** `node ocena/ocen.mjs --szczegoly` (kolumny data/miejsce/przyczyna) i ręczne sprawdzenie sekcji I–IV.
- **Oczekiwane:** ≥ 80% kluczowych pól poprawnych (założenie), poprawki ≤ 20% pól. Dla oryginałów `data 13/13, miejsce 13/13` (S2); dla parafraz `data 5/5, miejsce 4/5` (S1, W020: inne brzmienie miejsca).

### S15 (A1, N5): stan po wysłaniu
- **Kroki:** wysłać zgłoszenie bez załączników → odświeżyć stronę → „Otwórz tę sprawę jako pracownik ZUS”.
- **Oczekiwane (do ustalenia w specu):** albo sprawa w pamięci serwera, albo komunikat, że odświeżenie kasuje sprawę. **Uruchomiono:** nie.

## Zestawienie
| Kryterium | Scenariusze | Wynik uruchomienia |
|---|---|---|
| A1 | S4, S5, S15 | S4: **niezdany** (0/5 wykrytych) |
| A2 | S6 | nie uruchomiono |
| A3 | S1, S2, S3 | S2 zdany 13/13; S1 **niezdany** 3/5; S3 **niezdany** (parafraza W020) |
| A4 | S7, S8, S9 | S8 API ✓; S7 licznik/napis do Programisty; S9 oczekiwany FAIL, niepotwierdzony |
| A5 | S10 | nie uruchomiono |
| A6 | S11 | częściowo (S1: W038 bez wyłączenia) |
| A7 | S12 | nie uruchomiono |
| A8 | S13, S14 | nie uruchomiono |

## Różnice po poprawce speca
_(do uzupełnienia po poprawce Projektanta; baza: a567153)_

<!-- skill: test-scenarios -->
