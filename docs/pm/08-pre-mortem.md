# Pre-mortem: ZANT — pokaz rano (krok 7)

**Autor:** Analityk · **Podstawa:** `docs/spec.md` (§5 A1–A8, §6, §9), `docs/decyzje.md` (P21, P23, P27, P30, P33, P34; parafrazy 1–4), `docs/stan.md` (13:05), `docs/pm/04-zalozenia.md`, `05-red-team.md`.
**Założenie ćwiczenia:** jest rano, pokaz się nie udał. Co poszło źle?
**Skala:** prawdopodobieństwo i skutek (W/Ś/N) to **moja ocena, bez liczb źródłowych**. Liczby z wyników niżej są z uruchomień z dziś (źródło przy każdej).

## Stan dowodów (uruchomione 13:05, `node ocena/ocen.mjs --zbior dane/<zbiór>`)
| zbiór | kwalifikacja | FP / FN |
|---|---|---|
| `zbior` (oryginały, 13) | 13/13 | 0 / 0 |
| `parafrazy` (6) | 6/6 | 0 / 0 |
| `parafrazy-2` (6) | 6/6 | 0 / 0 |
| `parafrazy-3` (6) | 6/6 | 0 / 0 |
| `parafrazy-4` (6) | 6/6 | 0 / 0 |

Ważne: **każda seria parafraz po raz pierwszy znajdowała nowy błąd** (parafrazy-1: 4/6; -2: 5/6, W027; -3: 5/6, W029; -4: 5/6, W011 — wszystkie naprawione regułami ogólnymi przez Programistę). Zielone 6/6 w każdej serii to wynik **po** poprawce na tej serii, nie dowód odporności na następną.

## Tigers (realne ryzyka)

| # | Co poszło źle | P | Skutek | Zapobieganie | Klasa |
|---|---|---|---|---|---|
| T1 | **Domena bez DNS (P23).** `hacknation.ksefbot.pl` nie ma rekordu (curl 000; Cloudflare 530); jury i sala nie otwierają linku. Rekord/tunel robi Paweł — boty nie ruszają DNS; P23 bez odpowiedzi → tylko rekomendacja | Ś | **Krytyczny** (zadanie §5: link do aplikacji dla jury) | Paweł: rekord/tunel do 22:00; test z zewnątrz (nie z sieci zespołu) `curl -s -o /dev/null -w "%{http_code}" https://hacknation.ksefbot.pl/` = 200 i powtórka o 06:00. Do tego czasu fallback poz. 1–2 (niżej) | Launch-blocking |
| T2 | **Odczyt skanów na serwerze.** Tesseract pol w obrazie Docker: obraz nie zbudowany lokalnie, czas na serwerze `ksefbot.pl` **niezmierzony** (Programista 12:43); jedyne pomiary: OMEN, czyste skany 1051/887 ms; zaszumione: W052 1 pole <70, W023 3 pola <70 (12:52). Jury wgra własne skany o nieznanym formacie | Ś | Wysoki: „nie udało się odczytać” przy żywym teście albo timeout | (a) pomiar na wdrożonym URL: PDF z tekstem, PDF-obraz, zaszumiony skan — czas i pola <70 (Programista, do 23:00); (b) w demo **tylko paczka 6 spraw z warstwą tekstową** (S2: 7–106 ms) — nie odczyt na żywo (A5/A7); (c) komunikat „Nie udało się odczytać…” zamiast NIE_UZNAC jest w kodzie — pokazać go jako cechę, nie awarię | Launch-blocking |
| T3 | **Opisy potoczne i przyczyna wewnętrzna.** Silnik regułowy (regex + TF-IDF); sprawy graniczne (omdlenie/cukier/serce vs upadek z czynnikiem zewnętrznym) wychodziły jako FP/FN w każdej serii parafraz (patrz wyżej). Jury wpisze własne zdanie | W | Wysoki: pierwsza sprawa jury z błędem „UZNAĆ” przy chorobie → utrata wiarygodności licznika | (a) **na pokazie nie wpisujemy własnych opisów na żywo** — tylko paczka 6 spraw + ogólnik W052; (b) seria 5 parafraz (≥10 spraw, bez czytania reguł) jeszcze dziś wieczorem, potem **zamrożenie `app/logika` o 20:00** — poprawki po tej godzinie tylko z błędem odtworzonym na wejściu jury; (c) w prezentacji: „zgodność z naszymi regułami, nie z praktyką ZUS” (spec §6) | Launch-blocking: (b) zamrożenie; seria 5 = fast-follow |
| T4 | **Licznik „X z Y” (P16/P27).** 6 z 6 liczone z reguł i etykiet jednego zespołu (N1 w `04`); własne pliki jury → „Brak wzorca dla wgranych spraw” (nie ma liczby, a zadanie §6: „wynikiem jest liczba rekomendacji dobrej jakości”). Jury może uznać 6/6 za przeuczenie | Ś | Średni–wysoki: brak „liczby” w ręku jury | Instrukcja jury (README): „Wgraj 6 spraw testowych → liczba”, plik o nazwie `Wxxx` ze zbioru → liczy; jedno zdanie o wzorcu sztucznym. Rekomendowane: do liczby 6/6 dopisać w tym samym kadrze wynik 13/13 oryginałów i 4 serie parafraz (tabela wyżej) | Launch-blocking: tekst; reszta track |
| T5 | **Pamięć serwera po restarcie.** Sprawa `ZG-0001` jest w pamięci procesu (spec: „zapis w pamięci serwera”, P30: „zostanie po odświeżeniu”). Redeploy Coolify, restart kontenera lub zasypianie → numer znika; przejście przedsiębiorca → ZUS po numerze pada w połowie demo | Ś | Wysoki: pęka główna historia (W052) | (a) **zakaz deployu po 06:00** i brak automatycznego redeployu z gh/main po zamrożeniu; (b) historia wykonywana bez przerwy w jednej sesji; (c) „Otwórz jako pracownik ZUS” przekazuje dane bez numeru (r2-7: „te same dane, bez przepisywania”) — sprawdzić, że działa **po** restarcie; (d) plan B: zrzuty `docs/zrzuty/r2-telefon-375-*` | Launch-blocking: test po restarcie |
| T6 | **Telefon.** Pomiar tylko w Chromium 360 px (brak przewijania poziomego, 0 elementów <48 px — Programista 12:43); **nie sprawdzone przez Pawła na prawdziwym telefonie**; sieć mobilna w sali; klawiatura zasłania „Dalej” | Ś | Średni: pierwszy ekran demo (50 s historii) | Paweł: jedno przejście W052 na własnym telefonie + w tej samej sieci co sala (hotspot) do 23:00; demo prowadzone z laptopa z emulacją 375 px jako plan B | Launch-blocking: przejście na prawdziwym telefonie |
| T7 | **Makieta ≠ MVP.** Makieta (`gh-pages /makieta/`) i aplikacja to dwie rzeczy; otwarte: P33 („O co dopytać” ogólnikowe), P34 (W029 poza paczką), W038 „Przyczyna zewnętrzna” pokazuje odmowę badania trzeźwości; krytyk R2 8/10, R3 niewykonany | W | Średni (spójność, nie awaria) | R3 makiety po P33/P34; pokaz opiera się na jednym z dwóch, nie miesza | Fast-follow |

## Paper Tigers (przereklamowane)
- **Wyciek danych do modelu zewnętrznego:** brak API/zewnętrznego modelu (P2); etykieta „Bez zewnętrznego modelu AI” jest na ekranie. Nie obiecujemy „dane nie wychodzą z ZUS” (spec §1).
- **PDF z warstwą tekstową nie zadziała:** sondy S2: 5/5 PDF, 6/6 pól, kwalifikacja jak z txt; S4 `--zrodlo pdf` 13/13.
- **Poziomy overflow na telefonie:** scrollWidth 360 przy 360 px (Programista 12:43).
- **RODO art. 22:** człowiek zatwierdza/odrzuca/zmienia z powodem (A8), widoczne na zrzutach r2b.

## Elephants (nikt nie mówi, a może boleć)
1. **Próba ze stoperem (A7/Z9) niewykonana:** plan 105 s + 15 s zapasu to szacunek, nie pomiar. Zbadać: jedna próba 3× z czasem i osobą, która nie budowała demo — **do 22:00**.
2. **Kryteria oceny organizatora są nieznane** (`docs/zadanie.md`: „zna Szef”) — optymalizujemy pod własne A1–A8.
3. **Jakiego formatu 5 spraw użyje jury** (zadanie §6: ≥5 przypadków): jeśli skany-obrazy, T2 wraca w pełni. Zbadać: mail/zapytanie do organizatora lub założenie jawne w README.
4. **Kto i na czym prowadzi pokaz, jaka sieć w sali:** nikt tego nie przypisał. Zbadać: Paweł/Artur — wskazać prowadzącego do 23:00.
5. **Zależność od botów po ~15:53 (P18 „koledzy na Claude”)** — jeśli limity padną w nocy, nikt nie poprawi regresji; stąd zamrożenie T3(b).

## Wersja „działa na pewno” (gotowa przed 07:00)
Zasada: pokazujemy **najwyższy poziom, który przeszedł kontrolę o 06:30**; nie przechodzimy w górę w trakcie pokazu. Każdy poziom ma osobny, spisany skrypt.

| poz. | co | kiedy używamy | co mamy gotowe | właściciel |
|---|---|---|---|---|
| 1 (pełny) | `https://hacknation.ksefbot.pl/` — telefon: W052 (ogólnik → 3 pytania → lista braków → „Wysyłam mimo braków” → numer) → ZUS: paczka 6 spraw, licznik 6 z 6, W020/W027 odmowy, W038 z ramką wyłączeń; odczyt skanów **nie na żywo** | domena = 200, restart-test przeszedł, T6 przeszedł | URL + wynik `curl` z 06:30 | Programista + Paweł |
| 2 (lokalny) | `npm start` na laptopie prowadzącego (Node ≥20, bez Dockera i Tesseracta; PDF z warstwą tekstową i tekst — bez OCR), `http://localhost:3000`; telefon = ta sama sieć lub emulacja 375 px | T1 lub T5 padły | repo sklonowane i uruchomione 1× na tym laptopie; `npm test` = ostatnia linia wyniku zapisana | Programista |
| 3 (statyczny) | makieta `https://pawelpisarek.github.io/hacknation-proba13/makieta/` (statyczna, bez backendu, 200) + zrzuty `docs/zrzuty/r2*-*.png` + `r2b-*` | wszystko inne padło | adres sprawdzony o 06:30; zrzuty w jednym PDF/slajdach | Prezenter |
| 4 (papier) | slajd z tabelą wyników: 13/13 oryginałów, 4 serie parafraz, `braki_F1` (wiersz „Stan dowodów” wyżej) | zawsze, jako zdanie o jakości liczby | tabela wyżej z datą uruchomienia | Analityk |

**Czego nie robimy przed jury w żadnym poziomie:** nie wpisujemy własnych opisów (T3), nie robimy odczytu skanu na żywo (T2), nie wdrażamy po 06:00 (T5).

### Lista „przed 07:00” (godziny proponowane, dopasować do zegara Szefa)
- 20:00 zamrożenie `app/logika` (T3) · seria parafraz-5 (Analityk, ≥10 spraw, na zamrożonym kodzie)
- 22:00 DNS = 200 z zewnątrz (T1) · próba ze stoperem 3× (E1)
- 23:00 pomiar odczytu na wdrożonym URL (T2) · telefon Pawła (T6) · prowadzący + sieć (E4)
- 06:00 zakaz deployu; test restart → `ZG-0001` → „otwórz jako ZUS” (T5)
- 06:30 kontrola: `curl` (poz. 1 i 3), `npm test`, `ocen.mjs` na wszystkich zbiorach; decyzja Szefa, który poziom pokazujemy
- 07:00 zamrożenie wszystkiego

## Działania launch-blocking (skrót)
| ryzyko | działanie | właściciel | termin |
|---|---|---|---|
| T1 | rekord DNS / tunel; test z zewnątrz | Paweł | 22:00 |
| T2 | pomiar na wdrożonym URL + tryb pokazowy | Programista | 23:00 |
| T3 | zamrożenie `app/logika`; seria 5 | Programista / Analityk | 20:00 / 22:00 |
| T4 | liczba 6/6 + 13/13 + parafrazy w jednym kadrze; instrukcja jury | Prezenter | 22:00 |
| T5 | test po restarcie, zakaz deployu | Programista | 06:00 |
| T6 | przejście na prawdziwym telefonie | Paweł | 23:00 |

Niezweryfikowane: czas odczytu na serwerze, zachowanie po restarcie kontenera, telefon, próba ze stoperem. Prawdopodobieństwa i skutki to ocena Analityka.

<!-- skill: pre-mortem -->
