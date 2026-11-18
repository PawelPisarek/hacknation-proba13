# Założenia: priorytet i tanie sprawdzenie do rana (`prioritize-assumptions`)

**Autor**: Analityk · **Wejście**: `docs/spec.md` (a567153), `docs/pm/02-discover.md` (4e33b6e: Z1–Z14), `docs/decyzje.md` (P1–P22), stan kodu `6bec849`.
**Zasada**: Ryzyko = (1 − pewność) × nakład naprawy; Wpływ = co się wali, jeśli fałsz. Pewność to ocena Analityka, nie dane. Progi liczbowe (80% / 30 s / 60 s) to założenia zespołu bez źródła (zatwierdzają Paweł/Artur). Nowe założenia dopisane po lekturze speca i kodu mają ID **N1–N6**.
Jedyny uruchomiony pomiar, który tu cytuję: `node ocena/ocen.mjs` → `kwalifikacja_3kl=13/13, braki_F1=1.000` (txt, nie PDF).

## Matryca Wpływ × Ryzyko

| Ćwiartka | Założenia | Decyzja |
|---|---|---|
| **Wysoki wpływ, wysokie ryzyko → eksperyment dziś** | **N1** (13/13 jest okrągłe), **Z3/N2** (odczyt skanów na serwerze, P21), **Z1** (ogólnik → pełny opis), **N3** (licznik X z Y wiarygodny dla wgranych plików) | testy poniżej, wyniki przed rankiem |
| **Wysoki wpływ, niskie ryzyko → wdrożyć i sprawdzić smoke-testem** | Z5 (lista braków; braki_F1=1.000 na txt), Z8 (karta I–IV), Z6 (telefon), A8 (akcje decyzji) | kontrola w makiecie / `npm test` |
| **Niski wpływ, wysokie ryzyko → nie inwestować** | Z12 (ZUS zbuduje własne AI), Z13 (czat AI jako domyślny), Z14 (braki wychodzą późno) | tylko jawny opis w prezentacji, bez twierdzeń o rynku |
| **Niski wpływ, niskie ryzyko → odłożyć** | Z10 (realizm bazy: znane, wprost napisane w spec §6), Z11 (tempo) | monitoruj |
| **Przegląd tekstów (P15)** | Z2, Z7 | R-Z2 / R-Z7 przed zamrożeniem makiety |

## Ranking — co sprawdzić do rana

| # | ID | Założenie | Wpływ | Pewność | Nakład testu | Test (zachowanie, nie opinia) | Próg / decyzja |
|---|---|---|---|---|---|---|---|
| 1 | **N1** | Wynik 13/13 mówi coś o jakości reguł, a nie o tym, że reguły i dane testowe pisał ten sam zespół z jednego generatora (`dane/generator.mjs`, `app/logika/bazowa.mjs`) | Wysoki: licznik „X z Y” to jedyna liczba na pokaz; jury (zadanie §4/§6) zapyta, czy to nie jest dopasowanie | Niska | 30 min | (a) `git log` bazowej: czy reguły były poprawiane po zobaczeniu testowych (tak/nie, z hasha); (b) 5 spraw napisanych **ręcznie innymi słowami** (parafrazy W006/W020/W027/W038/W052, bez szablonowych zwrotów) przez kogoś, kto nie widział reguł — Analityk pisze, Programista puszcza | ≥ 4 z 5 zgodnych: utrzymujemy. < 4: na ekranie i w demo opis „zgodność ze wzorcem sztucznego zbioru”, nie „trafność”; nie obiecujemy jakości |
| 2 | **Z3 + N2** | Odczyt skanu działa na serwerze `ksefbot.pl` (CPU, `node:22-slim`, bez OCR) w ≤ 30 s, ≥ 80% pól; dziś kod czyta tylko warstwę tekstową PDF (`wyciagnijTekstZPdf`) | Wysoki: bez tego „wgraj skany” nie działa w teście jury | Niska (P21 otwarte, przebieg PDF na OMEN nie wykonany) | 1 h | Wgraj 5 `zgloszenie.pdf` na wdrożony URL: czas odpowiedzi, ile pól w wyniku; jeśli PDF-y mają warstwę tekstową, to pomiar jest łatwy, jeśli to raster, OCR jest do dodania | ≤ 30 s i ≥ 80% pól: zostaje. Inaczej: tryb pokazowy (skany odczytane wcześniej) jako **jedyny** w demo, ograniczenie w prezentacji (spec A5) |
| 3 | **Z1** | 2–3 neutralne pytania prowadzą ogólnik do pełnego opisu | Wysoki: główny wyróżnik po stronie przedsiębiorcy | Niska | 1 h | 5 ogólników (nie tylko W052), przeklik na telefonie przez osobę spoza zespołu lub Artura; zapis: liczba pytań, czas, czy opis ma czynność + przyczynę + uraz | ≥ 4/5 w ≤ 60 s i ≤ 3 pytaniach (A1). Dziś kod: ogólnik = < 55 znaków lub wzorce; sprawdzić też opis 60–120 znaków, który nadal jest ogólnikowy |
| 4 | **N3** | Licznik „X z Y” liczy to, co widać na ekranie: dziś serwer bierze ID z nazwy pliku i liczy ze wzorca txt zbioru (`server.mjs` `ocen({zrodlo:'txt'})`), a nie z rekomendacji pokazanej dla wgranego pliku | Wysoki: rozjazd ekran ↔ liczba to błąd, który jury może zauważyć na żywo | Niska | 20 min | Wgraj plik o zmienionej nazwie, plik ze zmienioną treścią (zmieniony opis → inna rekomendacja), JSON bez ID; porównaj licznik z kolumną rekomendacji | Licznik zgodny z ekranem w 3/3; inaczej poprawka przed nagraniem |
| 5 | **Z4** | ≥ 80% zgodności na puli | Wysoki | Średnia po E1 (13/13 na txt), ale zależna od N1 i od PDF | 20 min | Powtórz `ocen.mjs` na wyniku odczytu PDF (nie txt) dla 13 spraw | Spadek ≥ 2 spraw względem txt = odczyt, nie reguły, jest wąskim gardłem (powiązane z #2) |
| 6 | **N4** | Spec A3/A8 („0 błędów na jasnych odmowach”, „5 z 5 czytelnych uzasadnień”) da się ocenić: kto ocenia i które sprawy to „jasne odmowy” — nie jest zapisane | Średni | Niska | 10 min | W `etykiety.csv` W020 i W027 mają NIE_UZNAC, ale `graniczny=true`, więc nie są „jasnymi” odmowami w sensie A3; trzeba wskazać inne sprawy lub zmienić sformułowanie A3; ocenia Analityk (E2) | Zapisać w spec lub `decyzje.md` |
| 7 | **N5** | Dokąd trafia „Wyślij zgłoszenie” i czy decyzja pracownika zapisuje się (pamięć serwera / sesja / nigdzie) — spec milczy; demo „Otwórz tę sprawę jako pracownik ZUS” wymaga stanu | Średni | Średnia | 15 min | Smoke: wyślij, odśwież stronę, otwórz jako pracownik, zatwierdź, odśwież | Jeśli nic nie przeżywa odświeżenia: demo robić bez odświeżania, spec: „pamięć sesji” |
| 8 | **N6** | Wybór wariantu ekranu i historii demo (P19, P20) nie zmieni treści sekcji 1 | Średni | Średnia | 0 (czeka na Artura) | — | Nie testujemy, tylko czekamy; nie liczyć jako zrobione |
| 9 | **Z2/Z7** | Neutralność tekstów; rozdział uznania od wyłączeń | Wysoki | Średnia | 20 min | R-Z2: wypisz wszystkie teksty po stronie przedsiębiorcy z kodu/makiet i szukaj słów o kwalifikacji ("uzna", "wina", "przyczyna zewnętrzna", "nieuwaga"); R-Z7: etykiety III.4 vs III.5–6 | 0 trafień / rozdział widoczny |

Z5, Z6, Z8 pozostają w „wdrożyć i sprawdzić”: nie mamy tu danych, które by je podważyły; nie wymyślam dla nich ryzyka.

## Co jest po wykonaniu testów 1–4
Jeśli N1 i Z3 oba wyjdą źle, **nie ruszamy ekranu**, tylko zmieniamy komunikat: pokazujemy liczbę jako zgodność ze wzorcem sztucznego zbioru, a odczyt skanów jako tryb pokazowy z jawnym ograniczeniem. To jest zgodne z ramami decyzyjnymi spec §5.

<!-- skill: prioritize-assumptions -->
