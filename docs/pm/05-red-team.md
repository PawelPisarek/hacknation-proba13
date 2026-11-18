# Red-Team: ZANT — asystent zgłoszenia wypadku (przedsiębiorca) i wsparcie decyzji (pracownik ZUS)

**Autor**: Analityk · **Wejście**: `docs/spec.md` (a567153), `docs/pm/02-discover.md` · stan kodu `6bec849`. Atakuję steelmana każdego twierdzenia. Liczby z uruchomienia: `node ocena/ocen.mjs` → 13/13 (txt). Reszta to założenia.

## Top Kill-Assumptions (od najważniejszego)

### 1. „Licznik X z Y pokazuje jakość rekomendacji”
- **Claim:** jedna liczba „Trafne rekomendacje: X z Y” (P16) przekonuje jury, że rekomendacje są trafne.
- **Steelman:** liczba jest liczona przez aplikację, nie wpisana na sztywno; Y to wgrane sprawy, mieszanka klas; opis „sztuczny zbiór” jest uczciwy.
- **Fails if:** jury (lub pracownik ZUS) zapyta, kto napisał reguły i kto napisał dane. Reguły (`bazowa.mjs`) i dane (`dane/generator.mjs`) pochodzą z jednego zespołu, teksty są szablonowe, wynik na całej puli to 13/13: dla jury to dowód dopasowania, nie jakości. Do tego serwer liczy wzorzec z ID z nazwy pliku (txt zbioru), a nie z rekomendacji pokazanej dla wgranego pliku.
- **Evidence to get this week:** `git log` `bazowa.mjs` względem testowych (czy reguły poprawiano pod testowe); 5 ręcznie napisanych parafraz spraw bez szablonowych zwrotów; wgranie pliku ze zmienioną treścią i nazwą.
- **Kill criterion:** < 4 z 5 parafraz zgodnych albo licznik niezgodny z ekranem w którymkolwiek z 3 prób → nie mówimy „trafność”, tylko „zgodność ze wzorcem sztucznego zbioru”; poprawka licznika przed nagraniem.
- **Cheapest test:** 30–45 min, patrz `04-zalozenia.md` N1/N3.

### 2. „Odczyt skanów działa w teście jury, bez instalowania”
- **Claim:** pracownik wgrywa skany/PDF, aplikacja je odczytuje, niepewne pola są podświetlone, ≤ 30 s i ≥ 80% pól (A5).
- **Steelman:** tryb pokazowy (skany odczytane wcześniej) chroni demo; serwer `ksefbot.pl` nie wymaga instalacji.
- **Fails if:** testowy skan jury jest rastrem bez warstwy tekstowej, a w kodzie jest tylko `wyciagnijTekstZPdf` w `node:22-slim` bez OCR: wynik to puste pola albo błąd. „Niepewne pole” nie ma zdefiniowanej miary pewności. Tryb pokazowy ukrywa to w demo, ale jury „bez instalowania” (zadanie §6) może wgrać własny plik.
- **Evidence to get this week:** wgranie 5 PDF-ów ze zbioru i jednego zrobionego z zewnątrz na wdrożony URL; czas i liczba pól.
- **Kill criterion:** własny plik jury daje pusty/błędny wynik bez czytelnego komunikatu → w UI jawny komunikat „odczyt tylko dla plików z warstwą tekstu / tryb pokazowy”, a w prezentacji ograniczenie (spec A5).
- **Cheapest test:** 1 h, jak wyżej.

### 3. „Ogólnik elektryka pokaże dopytywanie i przekona przedsiębiorcę”
- **Claim:** 2–3 neutralne pytania zamieniają „poślizgnąłem się w pracy” w pełny opis (Z1, A1).
- **Steelman:** pytania neutralne (P12), uspokojenie (P7), „Pomiń” wolno; wysyłka nigdy nie blokowana.
- **Fails if:** detekcja ogólnika w kodzie to `< 55 znaków` lub wzorce (`asystent.mjs`), więc opis 70-znakowy, nadal ogólnikowy („Spadłem z drabiny na budowie, noga mnie boli”), nie dostanie pytań; w demo działa tylko W052. Dodatkowo zbiór „5 ogólników” do E3 nie istnieje (Programista zauważył w recenzji).
- **Evidence to get this week:** 5 ogólników różnej długości (Analityk pisze), przeklik na telefonie.
- **Kill criterion:** < 4/5 pełnych opisów po ≤ 3 pytaniach, albo ≥ 1 z 5 ogólników bez żadnego pytania → poprawić detekcję (próg, wzorce przyczyny/czynności/urazu) i powtórzyć.
- **Cheapest test:** 1 h.

### 4. „Pracownik ZUS zaufa rekomendacji i zaoszczędzi czas”
- **Claim:** rekomendacja + status 5 przesłanek + cytaty + podobne sprawy wspierają decyzję, człowiek zatwierdza (A8).
- **Steelman:** człowiek decyduje (RODO art. 22); rekomendacja ma uzasadnienie z cytatami; wyłączenia świadczeń są osobno.
- **Fails if:** pracownik musi poprawić większość pól karty (Z8), a „podobne sprawy” pochodzą z 39 spraw uczących, które pracownik uzna za nieistotne albo nie zrozumie, skąd się wzięły. Ocena „5 z 5 czytelnych uzasadnień” nie ma kryterium (kto, jak) — każdy wynik można obronić.
- **Evidence to get this week:** E2 z konkretnym kryterium: dla 5 spraw sprawdź, czy z samego uzasadnienia da się wskazać dokument i zdanie źródłowe; dla pól karty policz poprawne z 5 spraw.
- **Kill criterion:** ≥ 2 z 5 uzasadnień bez cytatu źródłowego albo ≥ 20% pól karty błędnych → uzasadnienie i pola karty do poprawy przed makietą; w prezentacji nie twierdzimy oszczędności czasu.
- **Cheapest test:** 40 min.

### 5. „Przedsiębiorca nie odbierze pytań jako podpowiadania pod uznanie” (Z2) i spójność na telefonie (Z6)
- **Claim:** neutralność i „bez oceny prawnej” po stronie przedsiębiorcy; telefon, jedna ręka.
- **Steelman:** zasady neutralności są w spec §1, przegląd R-Z2 zaplanowany.
- **Fails if:** pytanie „co było na podłożu i co wywołało zdarzenie” prowadzi do opisu przyczyny zewnętrznej (art. 3 ustawy) tak, że ZUS zobaczy sugestię; albo przycisk ma < 48 px/okno potwierdzenia nie mieści się na 360 px.
- **Evidence to get this week:** lista wszystkich tekstów przedsiębiorcy, grep słów kwalifikujących; widok 360 px.
- **Kill criterion:** ≥ 1 trafienie sugerujące kwalifikację → przeredagować przed zamrożeniem makiety; przycisk < 48 px → poprawka CSS.
- **Cheapest test:** 20 min.

## What's Well-Reasoned
- **Rozdział uznania od wyłączeń** (art. 21, art. 6 osobno od 5 przesłanek) i karta wg Dz.U. 2022 poz. 223 mają podstawę w `docs/materialy.md` i są wprost w spec §1/A6. Atak byłby wymyślony.
- **Decyzja człowieka** (zatwierdź / odrzuć / zmień z powodem, osobno zatwierdzenie karty) jest poprawnie ujęta w A8 — zamknięta luka po recenzji R1.
- **Tryb pokazowy w demo** (105 s + 15 s zapasu) jest uczciwym obejściem wolnego odczytu i jest jawnie opisany w A5/A7; samo to założenie nie jest słabe.
- **Zakres „nie obiecujemy zgodności z ZUS”** (spec §6) chroni przed zarzutem o fałszywe twierdzenie.

## What I Couldn't Assess
- Czy realny pracownik ZUS pracuje na tych 5 przesłankach i czy „podobne sprawy” są w ogóle jego sposobem pracy: brak danych poza zadaniem; zespół nie rozmawia z użytkownikami (zadanie + Artur).
- Czy ZUS zbuduje własne AI (Z12) i czy obywatele wybiorą czat AI (Z13): bez źródła, ocena rynku poza materiałami.
- Wariant ekranu (P19), historia demo (P20) i miejsce odczytu skanów (P21): czekają na ludzi, nie liczone.
- Realna wydajność odczytu na `ksefbot.pl`: brak pomiaru.

## Co zrobić do rana
1. Parafrazy i licznik (N1/N3 w `04-zalozenia.md`) — 45 min. 2. Pomiar PDF na wdrożonym URL — 1 h. 3. 5 ogólników na telefonie — 1 h. 4. Grep tekstów przedsiębiorcy — 20 min. Wynik 1 i 2 decyduje o brzmieniu liczby i o tym, co w prezentacji mówimy o odczycie skanów.

<!-- skill: strategy-red-team -->
