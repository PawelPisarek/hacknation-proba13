# Scenariusze testów (`test-scenarios`): kryteria A1–A8

**Autor**: Analityk · **Wejście**: `docs/spec.md` **31b7a2b** (A1–A8, §5; pierwotnie a567153, różnice w sekcji „Różnice po poprawce speca” na końcu), `docs/pm/04-zalozenia.md`, `docs/pm/05-red-team.md`, kod `6bec849`/`1685a8d`.
**Wynik wykonania** podany tylko tam, gdzie uruchomiłem komendę (kolumna „Uruchomiono”); reszta to scenariusz do wykonania ręcznie lub przez Programistę.

## Decyzje do scenariuszy
- **Odmowy kontrolne (A3, A8) — wg speca 31b7a2b: `W020`, `W027`, `W029`** (NIE UZNAĆ; w zbiorze wszystkie odmowy są `graniczny=true`, wybrane mają jedną przyczynę wprost w tekście i brak braków dokumentów; `W042` odpada — decyzja Szefa 12:33, zgodna z moją wcześniejszą). `W020` i `W027` są w paczce pokazowej 6, `W029` w puli 13.
- **Ogólnik** (A1) wg speca §1: opis krótszy niż 55 znaków albo jeden z 3 wzorców (zgodnie z `asystent.mjs`); zbiór 5 ogólników do E3 pisze Projektant (spec A1). Mój zbiór opisów > 55 znaków (`dane/parafrazy/ogolniki.txt`) testuje **granicę definicji**, nie jest zbiorem z A1.
- **Parafraza**: ta sama sprawa, te same fakty, inne słowa; 6 spraw (W006, W020, W027, W029, W038, W052), wejście `dane/parafrazy/testowy/Wxxx/zgloszenie.txt` (zmieniony tylko miejsce/uraz/opis/wyjaśnienia/policja; `wejscie.json` i `karta.json` skopiowane bez zmian). Pisał Analityk, który czytał fragmenty `bazowa.mjs`, więc to **nie jest test ślepy**; lepszy byłby autor bez wiedzy o regułach.

## Scenariusze

### S1 (A3, Z4, N1): parafrazy 6 spraw
- **Wejście:** `dane/parafrazy/testowy/{W006,W020,W027,W029,W038,W052}` (W029 dopisana po specu 31b7a2b).
- **Kroki:** `node ocena/ocen.mjs --zbior dane/parafrazy --szczegoly`.
- **Oczekiwane:** zgodność rekomendacji ≥ 80% (≥ 5 z 6; próg A3, założenie zespołu); W020/W027/W029 = NIE_UZNAC; W038 wyłączenie = `ART_21_2_3_NIETRZEZWOSC`; W052 = DO_UZUPELNIENIA.
- **Uruchomiono:** `kwalifikacja_3kl=4/6 (66.7%) | UZNAC TP=2 TN=2 FP=2 FN=0 | wylaczenia=5/6 | braki_F1=0.800` → **NIE ZDANY**. Błędy: **W020 → UZNAC** (odmowa kontrolna!), **W052 → UZNAC**, **W038 wyłączenie → BRAK**. Kolumny `okolicznosci`/`przyczyna` nie liczyć (porównanie z oryginałem).
- **Status w specu:** spec §8 opisuje to jako ryzyko („3/5”, odporność na sformułowania), nie jako kryterium; A3 mierzone jest na puli oryginałów. Ten scenariusz zostaje jako test ostrzegawczy (próg nieobowiązkowy w A3).

### S2 (A3): zbiór oryginalny, odniesienie
- **Kroki:** `node ocena/ocen.mjs`. **Oczekiwane:** 13/13. **Uruchomiono:** `13/13 (100.0%) | UZNAC TP=8 TN=5 FP=0 FN=0 | braki_F1=1.000`. Zdany; pamiętać, że to ten sam zespół i generator (N1).

### S3 (A3): odmowy kontrolne W020, W027, W029
- **Wejście:** `W020`, `W027`, `W029` (oryginały z `dane/zbior/testowy/`) oraz ich parafrazy.
- **Kroki:** `node ocena/ocen.mjs --szczegoly` (wiersze W020/W027/W029) oraz `node ocena/ocen.mjs --zbior dane/parafrazy --szczegoly`; na ekranie: wgrać 3 sprawy i sprawdzić rekomendację.
- **Oczekiwane (A3):** 0 błędów na oryginałach: 3/3 NIE UZNAĆ (żadne UZNAĆ ani DO UZUPEŁNIENIA).
- **Uruchomiono:** oryginały **3/3 NIE_UZNAC** ✓ (A3 zdane). Parafrazy: W027 ✓, W029 ✓, **W020 → UZNAC ✗** (parafraza poza kryterium A3, ale to FP na odmowie kontrolnej: patrz S1 i spec §8).

### S4 (A1, Z1): wykrywanie ogólnika
- **S4a, zbiór ze speca (5 ogólników Projektanta):** „Poślizgnąłem się w pracy.”, „Miałem wypadek przy pracy, doznałem urazu.”, „Upadłem podczas pracy.”, „Coś mnie uderzyło na budowie.”, „Zrobiłem sobie krzywdę przy maszynie.” Kroki: `czyOpisOgolnikowy` z `app/logika/asystent.mjs` na każdym. Oczekiwane: `true` ×5. **Uruchomiono: `true` 5/5 (22–42 znaków)** ✓ — wszystkie są krótsze niż 55, więc to test ledwie nietrywialny.
- **S4b, granica definicji (opisy > 55 znaków, bez czynności przed zdarzeniem):** `dane/parafrazy/ogolniki.txt` (5 opisów 64–85 znaków). Spec §1 mówi, że ogólnik to < 55 znaków lub 3 wzorce, więc **`false` jest zgodne ze specem**, ale asystent nie zada tu żadnego pytania. **Uruchomiono: `false` 5/5** — to ryzyko jawnie zapisane w spec §8 („ogólniki dłuższe niż 55 znaków nie są wykrywane”); nie obiecujemy pytań dla takich opisów, a w demo nie używamy takiego opisu.
- **Decyzja:** S4a zdany; S4b to znane ograniczenie, nie błąd względem specu. Poprawka detekcji tylko jeśli zespół zdecyduje (poza zakresem speca).

### S5 (A1): E3 na telefonie
- **Wejście:** 5 ogólników ze speca (S4a).
- **Kroki (ręcznie, osoba spoza zespołu, telefon 360–430 px, jedna ręka):** wpisz ogólnik → odpowiedz na pytania w stałej kolejności (czynność i zlecenie → podłoże i co wywołało → część ciała i pomoc lekarska; pytania, na które opis już odpowiada, są pomijane; można „Pomiń”) → obejrzyj kompletność i listę załączników → „Wyślij zgłoszenie” → okno „Wróć i uzupełnij” / „Wysyłam mimo braków”.
- **Oczekiwane:** ≤ 3 pytania; ≥ 4 z 5 kończy się „pełnym opisem” (czynność + przyczyna + część ciała; każdy element tak/nie ocenia ręcznie Analityk); ≤ 60 s (mierzy Programista stoperem); dokładnie 1 okno potwierdzenia; „Wyślij” aktywne zawsze.
- **Zapis wyniku:** tabela: ogólnik | liczba pytań | czas | czynność t/n | przyczyna t/n | część ciała t/n. Zależy od S4a (zdany) i wdrożenia ekranu; nie uruchomiono.

### S6 (A2): neutralność tekstów przedsiębiorcy
- **Kroki:** wypisać wszystkie teksty po stronie przedsiębiorcy z `app/public/index.html` i `app/logika/asystent.mjs` (`grep -n "pytanie\|komunikat" …`) i szukać słów: `uzna`, `wina`, `przyczyn`, `nieuwag`, `zgodnie z`, `art.`.
- **Oczekiwane:** 0 ocen prawnych i sugestii „pod uznanie”; reguła art. 21 tylko w widoku pracownika. **Uwaga:** pytanie „co wywołało zdarzenie” dotyka przyczyny zewnętrznej (przesłanka prawna), więc sprawdzić brzmienie ręcznie z Arturem.

### S7 (A4, P16): licznik na paczce 6 spraw
- **Wejście:** `W052, W006, W023, W020, W027, W038` (spec §4).
- **Kroki:** POST `/api/zus/zgodnosc` z `{"ids":[…6]}` oraz klik „Wgraj 6 spraw testowych” na ekranie.
- **Oczekiwane:** `y=6`, `x` z faktycznego przebiegu; napis „Trafne rekomendacje: X z Y” (spec), nie „Zgodność ze wzorcem” (stan 12:24: kod ma stary napis, zmiana u Programisty).
- **Jak sprawdzić:** liczba na ekranie = liczba z `curl` = liczba wierszy rekomendacji zgodnych z etykietą w `etykiety.csv`.

### S8 (A4): plik bez ID / nieznane ID
- **Wejście:** `dane/parafrazy/testowy/W052/zgloszenie.txt` wgrany pod nazwą `moj_plik.txt` (spec: ID = `Wxxx` w nazwie pliku/folderu lub pole `id` w JSON; plik bez ID nie wchodzi do Y); `{"ids":["plik_bez_id"]}`; `{"ids":[]}`.
- **Oczekiwane:** komunikat „Brak wzorca dla wgranych spraw”; rekomendacja dla pliku nadal wyświetlona; licznik nie liczy tej sprawy do Y.
- **Uruchomiono (API):** `/api/zus/zgodnosc` z `["plik_bez_id"]` i `[]` → `x=0,y=0,tekst:"Brak wzorca dla wgranych spraw"` ✓. `/api/zus/rekomendacja` z samym `tekst` (bez `id`) → `id:"S001"`, rekomendacja zwrócona ✓ (dla parafrazy W052: UZNAC, patrz S1: błąd merytoryczny, nie licznika).
- **Nie sprawdzone:** czy ekran wgranego pliku używa tych endpointów i jak się zachowuje przy nazwie `W006_kopia.pdf` (ID z nazwy).

### S9 (A4, N3): licznik zgodny z ekranem
- **Kroki:** wgrać `W006` z zmienioną treścią (np. W006 z opisem W020) pod nazwą `W006.txt`.
- **Oczekiwane (spec 31b7a2b):** X liczy **rekomendację systemu widoczną na ekranie** (po korekcie pól i „Przelicz”), nie decyzję człowieka; zmieniona treść ma dać niezgodność z wzorcem W006 (UZNAC).
- **Kod dziś:** `/api/zus/zgodnosc` liczy po samym ID z txt zbioru (`server.mjs`), nie z wgranej treści: spodziewany FAIL (zawsze 1 z 1). Do potwierdzenia testem na wdrożeniu.

### S10 (A5, Z3): odczyt PDF
- **Wejście:** `dane/zbior/testowy/*/zgloszenie.pdf` (13) + 1 PDF z zewnątrz (skan rastrowy).
- **Kroki:** `node ocena/ocen.mjs --zrodlo pdf --szczegoly` (na CPU serwera/OMEN klasa `testy`, nie ThinkPad: spec P21); czas wywołania POST `/api/zus/rekomendacja` z `pdfBase64`.
- **Oczekiwane (spec 31b7a2b):** PDF z tekstem czytany jako tekst; PDF-obraz: rasteryzacja 200 dpi + Tesseract (pl) na CPU serwera, dopisane do `Dockerfile`; ≤ 30 s na sprawę, ≥ 80% kluczowych pól; **pole niepewne** = pewność Tesseract < 70/100 albo zły format (data, godzina, PESEL), podświetlone do korekty i „Przelicz”; PDF rastrowy w obrazie serwera bez Tesseract → komunikat i tryb pokazowy, nie pusty wynik. Sprawdzić także: czy `Dockerfile` zawiera Tesseract (`grep -i tesseract Dockerfile`).
- **Uruchomiono:** nie. Dziś `wyciagnijTekstZPdf` czyta tylko warstwę tekstową; w `node:22-slim` nie ma OCR.

### S11 (A6, Z7): rozdział wyłączeń od kwalifikacji
- **Wejście:** W038 (art. 21 ust. 2–3, UZNAC) i W006 (BRAK).
- **Kroki:** otworzyć ekran pracownika; sprawdzić ramkę „Wyłączenia świadczeń — nie mylić z uznaniem”.
- **Oczekiwane:** W038: rekomendacja UZNAC **i** osobna ramka z art. 21 ust. 2–3; W006: „brak”; w karcie III.4 osobno od III.5–6; karta bez pieczątek (Dz.U. 2022 poz. 223).
- **Uruchomiono (kod):** S1 pokazuje, że parafraza W038 traci wyłączenie, więc ramka bywa pusta mimo odmowy badania.

### S12 (A7, Z9): ścieżka demo ≤ 120 s
- **Kroki:** (wariant ekranu P19 = 1 + elementy 3 po stronie ZUS, historia P20 = W052; oba przyjęte wg rekomendacji) stoper: przedsiębiorca na telefonie (W052) ≈ 50 s → pracownik ≈ 40 s → „Wgraj 6 spraw” + licznik ≈ 15 s, tryb pokazowy.
- **Oczekiwane:** ≤ 105 s + 15 s zapasu; bez odczytu skanów na żywo. **Jak sprawdzić:** 3 próby, zapis czasu; zależy od P20 (Artur).

### S13 (A8): decyzja człowieka
- **Kroki:** na W020 kliknąć „Zatwierdź rekomendację”; na W052 „Odrzuć”; na W027 „Zmień na…” z powodem; potem „Zatwierdź projekt karty”.
- **Oczekiwane:** status „Rekomendacja — czeka na decyzję pracownika” do kliknięcia; po wyborze zapis (wybór, powód zmiany, godzina) obok rekomendacji systemu, **w pamięci serwera przy sprawie — przetrwa odświeżenie strony, nie restart serwera** (spec §1 pkt 6); zatwierdzenie karty osobne; edycje pól karty zapisują się tak samo.
- **Jak sprawdzić:** po „Zatwierdź” odświeżyć stronę i ponownie otworzyć sprawę po numerze (np. `S001`): decyzja jest zachowana; po restarcie serwera znika (oczekiwane).

### S14 (A8, Z8): pola karty
- **Wejście:** W006, W020, W023, W038, W052; `karta.json` jako wzorzec.
- **Kroki:** `node ocena/ocen.mjs --szczegoly` (kolumny data/miejsce/przyczyna) i ręczne sprawdzenie sekcji I–IV.
- **Oczekiwane:** ≥ 80% kluczowych pól poprawnych (założenie), poprawki ≤ 20% pól. Dla oryginałów `data 13/13, miejsce 13/13` (S2); dla parafraz `data 5/5, miejsce 4/5` (S1, W020: inne brzmienie miejsca).

### S15 (A1, N5): stan po wysłaniu
- **Kroki:** wysłać zgłoszenie („Wysyłam mimo braków”) → zapisać numer sprawy → odświeżyć stronę → „Otwórz tę sprawę jako pracownik ZUS”.
- **Oczekiwane (spec §1 przedsiębiorca pkt 5):** zgłoszenie (opis, odpowiedzi, braki, załączniki) zapisane w pamięci serwera z numerem sprawy (np. `S001`); przycisk przełącza na widok pracownika i ładuje **to samo** zgłoszenie po numerze, bez ponownego wpisywania; nic nie jest wysyłane poza aplikację. **Uruchomiono:** nie. Do sprawdzenia, czy numer w `/api/zus/rekomendacja` (dziś `S001` dla każdego zgłoszenia bez `id`) rośnie, czy jest stały.

### S16 (A3, E2): uzasadnienia i podobne sprawy
- **Wejście:** pięć spraw paczki z rekomendacją UZNAĆ/NIE UZNAĆ: `W006, W023, W020, W027, W038` (wszystkie poza W052).
- **Kroki:** (a) automatycznie: dla każdej sprawy `ocenSpraweBazowa` i sprawdzenie, że ID „podobnych spraw” nie należą do `dane/zbior/testowy/`; (b) ręcznie (Analityk, E2): czy uzasadnienie zawiera rekomendację, wskazaną przesłankę i ≥ 1 cytat z dokumentu sprawy.
- **Oczekiwane (spec A3):** 5 z 5 czytelnych; podobne sprawy tylko ze zbioru uczącego (39 spraw); 1–2 podobne sprawy.
- **Uruchomiono (a):** podobne sprawy 3 na sprawę, **0 z zbioru testowego** ✓ (np. W006 → W004, W005, W044). Ale spec mówi 1–2, kod daje 3 (`znajdzPodobne(..., 3)`). **(b) wstępny odczyt kodu:** uzasadnienie jest szablonem z przepisami i polami (`bazowa.mjs` ~l. 299–303); prosta heurystyka (słowa > 5 znaków z opisu zgłoszenia w tekście uzasadnienia) wykryła 0–1 wspólnych słów na sprawę, cudzysłów tylko w W020, więc **cytaty z dokumentu sprawy mogą nie być**. Wynik ręczny E2: nie wykonano; kryterium „cytat” prawdopodobnie niespełnione.

## Zestawienie
| Kryterium | Scenariusze | Wynik uruchomienia |
|---|---|---|
| A1 | S4, S5, S15 | S4a **zdany** (5/5, ale wszystkie < 55 zn.); S4b: znane ograniczenie (spec §8); S5, S15 nie uruchomiono |
| A2 | S6 | nie uruchomiono |
| A3 | S1, S2, S3, S16 | S2 zdany 13/13; S3 oryginały **3/3 zdany**; S1 parafrazy 4/6 (ostrzeżenie, nie kryterium); S16: podobne ze zbioru uczącego ✓, 3 zamiast 1–2, cytaty niepotwierdzone |
| A4 | S7, S8, S9 | S8 API ✓; S7 licznik/napis do Programisty; S9 oczekiwany FAIL, niepotwierdzony |
| A5 | S10 | nie uruchomiono |
| A6 | S11 | częściowo (S1: W038 bez wyłączenia na parafrazie) |
| A7 | S12 | nie uruchomiono |
| A8 | S13, S14 | nie uruchomiono |

## Różnice po poprawce speca (a567153 → 31b7a2b)
| Zmiana w specu | Skutek dla scenariuszy |
|---|---|
| §1 przedsiębiorca 2: definicja ogólnika (< 55 zn. lub 3 wzorce) i stała kolejność pytań | S4 rozbity na S4a (zbiór ze speca, zdany) i S4b (> 55 zn., znane ograniczenie); S5 używa kolejności pytań i zbioru 5 ogólników |
| A1: zbiór 5 ogólników (pisze Projektant), „pełny opis” = czynność + przyczyna + część ciała, ocena Analityk, czas Programista | S5 zapisuje te trzy elementy i czas; mój `ogolniki.txt` zostaje jako test granicy |
| §1 przedsiębiorca 5: zgłoszenie zapisane w pamięci serwera z numerem sprawy, „Otwórz jako pracownika” ładuje po numerze | S15 ma konkretne oczekiwanie (poprzednio „do ustalenia”) |
| §1 pracownik 1: format PDF (tekst / obraz), Tesseract 200 dpi na CPU, „pole niepewne” < 70/100 | S10: oczekiwania i `grep tesseract Dockerfile` |
| §1 pracownik 2: ID = `Wxxx` w nazwie/folderze lub pole `id`; X = rekomendacja systemu z ekranu, nie decyzja człowieka | S8, S9 doprecyzowane; S9 nadal oczekiwany FAIL względem dzisiejszego `server.mjs` |
| §1 pracownik 6–7: decyzja i edycje karty w pamięci serwera, przetrwają odświeżenie, nie restart | S13 ma sprawdzenie po odświeżeniu |
| A3: odmowy kontrolne W020/W027/W029 zamiast „jasnych odmów”; uzasadnienie = rekomendacja + przesłanka + ≥ 1 cytat; podobne sprawy tylko z uczącego, 1–2 | S3 na W020/W027/W029 (oryginały 3/3 ✓), W029 dopisana do parafraz (S1 6 spraw), S16 nowy |
| §2/§3/§8: P19 (wariant 1 + elementy 3 po stronie ZUS) i P20 (W052) przyjęte wg rekomendacji | S12: bez zmiany kolejności; zależność od Artura usunięta, ale odpowiedź po czasie zmieni scenariusz |
| §8: ryzyko parafraz (3/5) i ogólników > 55 zn. | S1 i S4b opisane jako ryzyko znane specowi |

**Moja wcześniejsza decyzja o „jasnych odmowach” (W020, W027, W029) jest zgodna ze specem; zmiana Szefa 12:33 nie wymagała poprawki treści scenariuszy poza nazwą „odmowy kontrolne”.** Liczby w S1 zmieniły się z 3/5 na 4/6 przez dodanie W029 (zgodna).

<!-- skill: test-scenarios -->
