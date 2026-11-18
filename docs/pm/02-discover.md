# Odkrywanie produktu (/discover): ZANT — asystent zgłoszenia wypadku i wsparcie decyzji ZUS

**Data**: 2026-11-18 · **Etap produktu**: nowy produkt (initial discovery) · **Status**: ukończone (kroki 1–6, po decyzjach Artura P9–P15)
**Źródła wejściowe**: `docs/zadanie.md`, `docs/materialy.md`, `docs/zadania/01-pdf-ewyp-karta.md`, `docs/pm/01-competitive-analysis.md`, `docs/decyzje.md` (P1–P15)

---

## Krok 1: Kontekst odkrywania

- **Etap produktu**: nowy produkt bez potwierdzonego popytu wdrożeniowego — dwie powiązane ze sobą części w jednej aplikacji webowej (ZANT) dla problemu opisanego przez ZUS w zadaniu konkursowym.
- **Co badamy**: zakres funkcji i wyróżników produktu w obu częściach:
  1. **Asystent zgłoszenia wypadku** dla osoby prowadzącej pozarolniczą działalność gospodarczą (pierwszy kontakt po urazie, prosty język, wspiera opis okoliczności i przyczyn, wskazuje braki, nie blokuje wysłania).
  2. **Wsparcie decyzji pracownika ZUS** (lokalny odczyt skanów dokumentacji, rekomendacja „uznać / nie uznać” na podstawie bazy podobnych przypadków i reguł z przepisów, projekt karty wypadku do poprawy, lista braków w dokumentach sprawy; decyzja zawsze u człowieka).
- **Co już wiemy (fakty ze źródeł i ustalenia zespołu)**:
  - **Ustalenia z zadania**: aplikacja webowa (dwie części pod jednym adresem), wgranie min. 5 spraw testowych przez przeglądarkę bez instalacji, prezentacja czasu wdrożenia i ryzyk (w tym ścisłej ochrony danych osobowych w ZUS), sztuczna baza kilkudziesięciu przypadków zamiast nieudostępnionych skanów ZUS.
  - **Ustalenia produktowe Artura (P3–P7)**:
    - W demo pokazujemy najpierw przedsiębiorcę, a pracownika ZUS jako drugą połowę tej samej historii (P3).
    - Główny ból poszkodowanego: nie wie, co i jak opisać, a dodatkowo boi się, że źle opisze przyczynę i wypadku nie uznają, więc pisze ogólnikami typu „poślizgnąłem się” (P4).
    - Zysk poszkodowanego: kompletne zgłoszenie za pierwszym razem, prostym językiem, bez blokowania wysłania (P5).
    - Zysk pracownika ZUS: gotowa rekomendacja z uzasadnieniem, projekt karty wypadku do poprawy oraz **lista braków w dokumentach sprawy** (np. brak dokumentacji medycznej, świadków), żeby wiedział, o co dopytać (P6).
    - Neutralność asystenta: dopytuje neutralnie, opis zostaje słowami poszkodowanego, nic nie podpowiada „pod uznanie”; uspokaja **wyłącznie ogólnie** („opis nie jest egzaminem, napisz po prostu, co się stało”), bez ocen prawnych — reguła o błędzie poszkodowanego działa wyłącznie po stronie pracownika ZUS (P7; zapisane też jako ryzyko do specyfikacji).
  - **Ustalenia techniczne Pawła (P2)**: aplikacja działa **bez zewnętrznego modelu** (brak API w działającej aplikacji) — lokalny odczyt skanów na karcie OMENa (GTX 1050, 4 GB), rozstrzygnięcie na podstawie podobnych przypadków z bazy i reguł z przepisów; mały lokalny model tylko wtedy, gdy Programista pokaże, że się mieści i poprawia wynik.
  - **Pola i przepisy (`docs/materialy.md`, `docs/zadania/01-pdf-ewyp-karta.md`)**: potwierdzone z PDF-ów rzeczywiste pola zawiadomienia EWYP (dane poszkodowanego, adresy w tym miejsce prowadzenia działalności, osoba zawiadamiająca, 10 punktów informacji o wypadku m.in. maszyny/urządzenia, do 3 świadków, wykaz załączników i lista dokumentów do dosłania z terminem) oraz karty wypadku (Dz.U. 2013 poz. 1618, sekcje I–IV: płatnik, poszkodowany, wypadek w tym kwalifikacja JEST/NIE JEST i punkty o naruszeniu BHP oraz nietrzeźwości, pozostałe). Rozdzielamy **uznanie zdarzenia** (5 przesłanek z ustawy z 30.10.2002: nagłość, przyczyna zewnętrzna, uraz/śmierć, związek ze zwykłymi czynnościami działalności, okres ubezpieczenia wypadkowego) od **wyłączeń świadczeń** (art. 21, art. 6). Niepotwierdzone źródłowo (w trakcie weryfikacji Analityka): rozporządzenie „z 23 stycznia 2022” wskazywane na stronie ZUS oraz aktualna treść tekstu jednolitego ustawy w ISAP.
  - **Wnioski z analizy konkurencji (`docs/pm/01-competitive-analysis.md`)**: nie znaleziono narzędzia łączącego obie strony (obywatel + urzędnik ZUS) na polskich wzorach przy zachowaniu lokalnego przetwarzania danych; główne luki rynku to neutralne dopytywanie o okoliczności/przyczynę, kompletność EWYP bez blokowania, lokalna rekomendacja z reguł i podobnych spraw oraz lista braków dla pracownika ZUS.
- **Jaką decyzję ustawia to odkrywanie**: wybór **3–5 konkretnych pomysłów** do przeniesienia do specyfikacji (`docs/spec.md`) i makiety pod 2-minutowe demo oraz wskazanie **najryzykowniejszych założeń** do walidacji przed kodowaniem pełnego MVP.

---

## Krok 2: Burza mózgów — 3 perspektywy (`brainstorm-ideas-new`)

### Perspektywa Product Managera (wartość, dopasowanie do problemu, wyróżnienie)
1. **Neutralny dopytywacz o okoliczności i przyczynę** — wykrywa zbyt ogólnikowy opis (np. „poślizgnąłem się”) i zadaje otwarte, neutralne pytania o czynność przed zdarzeniem, czynnik zewnętrzny i uraz, z ogólnym uspokojeniem bez ocen prawnych (P4, P7). | Wpływ: Wysoki | Nakład: Średni
2. **Lista braków i niespójności w dokumentach sprawy dla pracownika ZUS** — obok rekomendacji wskazuje brakujące dokumenty (np. karta informacyjna ze szpitala, świadkowie, dane maszyny) oraz rozbieżności w zgłoszeniu i podpowiada, o co dopytać (P6). | Wpływ: Wysoki | Nakład: Średni
3. **Rekomendacja „uznać / nie uznać” z 5 przesłanek + podobnych spraw z bazy** — osobno ocenia 5 przesłanek z przepisów, pokazuje najbliższe sprawy ze sztucznej bazy i uzasadnia propozycję cytatami z dokumentu (P2, zadanie). | Wpływ: Wysoki | Nakład: Wysoki
4. **Osobna flaga możliwych wyłączeń świadczeń (po stronie ZUS)** — oddziela ocenę uznania zdarzenia (karta wypadku) od ostrzeżenia o potencjalnych wyłączeniach wypłaty (rażące niedbalstwo jako wyłączna przyczyna, nietrzeźwość, zaległości w składkach), żeby pracownik nie mylił tych dwóch decyzji. | Wpływ: Średni | Nakład: Niski
5. **Jedna spójna historia „przedsiębiorca → pracownik ZUS”** — sprawa zakończona u asystenta jednym kliknięciem przechodzi na biurko pracownika ZUS, domykając obie połowy opowieści w demo do 2 min (P3). | Wpływ: Wysoki | Nakład: Niski

### Perspektywa Projektanta UX (pierwszy kontakt po urazie, prosty język, zaufanie)
6. **Pasek kompletności zgłoszenia EWYP bez blokowania wysłania** — prostym językiem pokazuje, które sekcje zgłoszenia są gotowe, a czego jeszcze brakuje, z miękką zachętą do uzupełnienia i pełną swobodą wysłania mimo braków (P5, zadanie). | Wpływ: Wysoki | Nakład: Niski
7. **Wyraźne rozróżnienie „Twoje słowa” i „Podpowiedź asystenta”** — oddziela treść wpisaną przez poszkodowanego od neutralnych pytań pomocniczych i ogólnego komunikatu uspokajającego, żeby uniknąć wrażenia sugerowania odpowiedzi pod uznanie (P4, P7). | Wpływ: Średni | Nakład: Niski
8. **Edytowalny projekt karty wypadku z cytatami ze zgłoszenia** — wstępnie wypełnia sekcje I–IV karty wypadku (wg wzoru z Dz.U. 2013 poz. 1618), pozwalając pracownikowi poprawić każde pole przed zatwierdzeniem i zobaczyć fragment dokumentu, z którego pochodzi wpis (P6). | Wpływ: Wysoki | Nakład: Średni
9. **Warunkowe pytania dopasowane do rodzaju zdarzenia** — ukrywa zbędne sekcje EWYP (np. obsługa maszyny, atest, organ ścigania) i pokazuje je tylko wtedy, gdy pasują do konkretnego wypadku, zmniejszając obciążenie osoby po urazie. | Wpływ: Średni | Nakład: Niski
10. **Podsumowanie zgłoszenia do pobrania + lista załączników do zebrania** — na końcu rozmowy daje poszkodowanemu gotowy dokument zgłoszenia oraz dopasowaną listę dokumentów do dołączenia (np. pierwsza pomoc, świadkowie, lista brakujących załączników z terminem dosłania — jak w EWYP). | Wpływ: Średni | Nakład: Niski

### Perspektywa Inżyniera (wykonalność lokalna na 4 GB, test ≥5 spraw, wiarygodność)
11. **Lokalny odczyt skanów z podglądem i ręczną korektą niepewnych pól** — cały odczyt skanów PDF/obrazów działa lokalnie (P2, GTX 1050 4 GB — do weryfikacji wydajności przez Programistę), a niepewne pola są oznaczone do szybkiej poprawy przez pracownika przed przeliczeniem rekomendacji. | Wpływ: Wysoki | Nakład: Wysoki
12. **Przeglądarkowe wgrywanie wsadowe min. 5 spraw testowych dla jury** — prosty panel „Wgraj sprawy testowe” bez instalacji; po wgraniu paczki spraw pokazuje wynik rekomendacji dla każdej z nich oraz liczbę trafień zgodnych ze zbiorem wzorcowym (zadanie §4–§6). | Wpływ: Wysoki | Nakład: Średni
13. **Jawny tryb „Przetwarzanie lokalne — dane nie wychodzą z ZUS”** — czytelna informacja w aplikacji o braku wysyłania danych na zewnątrz oraz przejrzysta nota o granicach lokalnego odczytu (wymóg ochrony danych osobowych z §5 zadania i P2). | Wpływ: Średni | Nakład: Niski
14. **Automatyczne wykrywanie niespójności między dokumentami sprawy** — wychwytuje rozbieżności (np. inna data wypadku niż dokumentu medycznego, brak opisu urazu przy zaznaczonej pomocy medycznej) i dopisuje je do listy braków pracownika ZUS. | Wpływ: Średni | Nakład: Średni
15. **Przejrzysty ślad uzasadnienia „co przeważyło” (bez czarnej skrzynki)** — pokazuje dla każdej rekomendacji: status 5 przesłanek, wskazane podobne przypadki z bazy oraz informację, jaki brakujący dokument mógłby zmienić ocenę. | Wpływ: Wysoki | Nakład: Średni

---

### Top 10 pomysłów przedstawionych Arturowi do wyboru (P9)

Poniższa lista łączy 15 pomysłów w 10 rozłącznych propozycji (językiem produktu, gotowych do wyboru w pokoju Produkt):

| # | Pomysł | Co daje użytkownikowi | Powiązanie | Charakter |
|---|---|---|---|---|
| 1 | **Neutralny dopytywacz o okoliczności i przyczynę** (łączy #1 i #7) | Gdy opis jest ogólnikowy („poślizgnąłem się”), zadaje krótkie, neutralne pytania otwarte i uspokaja ogólnie bez ocen prawnych; tekst zostaje wyłącznie słowami poszkodowanego | P4, P7, zadanie §3 | Wyróżnik rdzeniowy |
| 2 | **Sprawdzanie kompletności zgłoszenia bez blokowania wysłania** (#6) | Pokazuje prostym językiem, co z pól EWYP jest uzupełnione, a czego brakuje, ale zawsze pozwala wysłać zgłoszenie | P5, zadanie §3 | Rdzeń obywatela |
| 3 | **Pytania dopasowane do rodzaju zdarzenia** (#9) | Ukrywa niepotrzebne sekcje (np. maszyny, policja) i pokazuje je tylko, gdy dotyczą tej sprawy — mniej przytłoczenia po urazie | Pola EWYP (`01-pdf-ewyp-karta.md`) | Usprawnienie UX |
| 4 | **Podsumowanie zgłoszenia do pobrania + lista załączników do zebrania** (#10) | Na końcu przedsiębiorca dostaje gotowe zgłoszenie i dopasowaną checklistę dokumentów do dołączenia do ZUS | Pola EWYP, P5 | Wartość praktyczna |
| 5 | **Jedna spójna historia w demo: zgłoszenie od przedsiębiorcy od razu u pracownika ZUS** (#5) | Zgłoszenie z asystenta jednym kliknięciem pojawia się w widoku pracownika ZUS jako druga połowa tej samej historii | P3, demo ≤ 2 min | Baza pokazu |
| 6 | **Rekomendacja „uznać / nie uznać” z jasnym uzasadnieniem (przepisy + podobne sprawy)** (łączy #3 i #15) | Ocenia każdą z 5 przesłanek, pokazuje najbliższe podobne sprawy z bazy i cytaty z dokumentu; decyzja zawsze u pracownika | P2, P6, zadanie §2–§3 | Rdzeń pracownika ZUS |
| 7 | **Edytowalny projekt karty wypadku gotowy do poprawy** (#8) | Wstępnie wypełnia sekcje I–IV karty wypadku z podglądem źródła wpisu; pracownik poprawia każde pole przed zatwierdzeniem | P6, zadanie §2, `01-pdf-ewyp-karta.md` | Rdzeń pracownika ZUS |
| 8 | **Lista braków i niespójności w dokumentach sprawy dla pracownika ZUS** (łączy #2 i #14) | Wskazuje brakujące dokumenty (np. karta ze szpitala, świadkowie), wyłapuje sprzeczności (np. daty) i podpowiada, o co dopytać | P6 | Wyróżnik pracownika ZUS |
| 9 | **Osobna uwaga o możliwych wyłączeniach świadczeń (po stronie ZUS)** (#4) | Oddziela ocenę „czy to wypadek” od ostrzeżenia o potencjalnym wyłączeniu świadczeń (rażące niedbalstwo, nietrzeźwość, składki) | `docs/materialy.md` (art. 21, art. 6), R2 1a | Zgodność z prawem |
| 10 | **Wgrywanie spraw testowych (min. 5 przypadków) z podglądem i korektą odczytanych pól** (łączy #11, #12, #13) | Wgranie paczki spraw w przeglądarce bez instalacji, przetwarzanie wyłącznie lokalne, ręczna korekta niepewnych pól po odczycie skanu i wynik rekomendacji dla każdej sprawy | P2, zadanie §4–§6 | Baza testu jury + lokalność |

### Wstępna rekomendacja Top 5 (do decyzji Artura w P9)

Według kryteriów `brainstorm-ideas-new` (wartość główna, szybkość walidacji, wyróżnienie) rekomendujemy wybór **5 pomysłów: 1, 2, 6, 7, 8** jako rdzenia funkcjonalnego produktu (przy założeniu, że **#5** i **#10** stanowią obowiązkową bazę pokazu i testu jury wynikającą wprost z zadania i P3, a **#3, #4, #9** pozostają do decyzji jako dodatki):

| Priorytet | Pomysł | Uzasadnienie (wartość / walidacja / wyróżnienie) | Główne wstępne założenie do przetestowania |
|---|---|---|---|
| 1 | **#1 Neutralny dopytywacz o okoliczności i przyczynę** | Wprost rozwiązuje największy ból z P4 (ogólniki ze strachu) przy zachowaniu neutralności z P7; brak takiego narzędzia u konkurencji | Krótkie, neutralne pytania rzeczywiście skłaniają do doprecyzowania opisu bez sugerowania treści „pod uznanie” |
| 2 | **#6 Rekomendacja z 5 przesłanek + podobnych spraw z bazy** | Rdzeń wartości po stronie ZUS przy lokalnym działaniu bez zewnętrznego modelu (P2); przejrzystość zamiast czarnej skrzynki | Reguły z przepisów + dopasowanie do podobnych spraw ze sztucznej bazy dają zrozumiałe i trafne rekomendacje bez zewnętrznego modelu |
| 3 | **#8 Lista braków i niespójności w dokumentach sprawy** | Wprost wskazany przez Artura w P6 jako główna oszczędność czasu pracownika ZUS; jasno wyróżnia się na tle prostych klasyfikatorów | Pracownik otrzymuje trafną listę braków dopasowaną do typu zdarzenia bez fałszywych alarmów |
| 4 | **#2 Kompletność zgłoszenia EWYP bez blokowania wysłania** | Wprost realizuje P5 i wymóg §3 zadania („wsparcie, nie blokada”); szybkie do pokazania w makiecie i demo | Użytkownik po urazie rozumie listę brakujących pól i uzupełnia je przed wysłaniem, choć nie jest do tego zmuszany |
| 5 | **#7 Edytowalny projekt karty wypadku** | Wymóg §2 zadania i P6; zamyka obieg pracy pracownika ZUS gotowym dokumentem do korekty | Wypełnienie sekcji I–IV karty wypadku ze zgłoszenia i skanów realnie skraca pracę, mimo ręcznych poprawek |

---

## Zatwierdzony zakres po Checkpoint 1 (decyzje Artura P9–P14)

- **Wybrane funkcje rdzeniowe produktu (P9, P13):** **#1** Neutralny dopytywacz o okoliczności i przyczynę (krótka runda 2–3 pytań przy ogólniku — P12; ogólne uspokojenie bez ocen prawnych — P7), **#2** Sprawdzanie kompletności zgłoszenia EWYP bez blokowania wysłania (jedno łagodne potwierdzenie „wysyłam mimo braków” + przekazanie braków pracownikowi ZUS — P11), **#6** Rekomendacja „uznać / nie uznać” z 5 przesłanek i podobnych spraw z bazy (lokalnie bez zewnętrznego modelu — P2), **#7** Edytowalny projekt karty wypadku (sekcje I–IV), **#8** Lista braków i niespójności w dokumentach sprawy dla pracownika ZUS (P6), **#10** Wgrywanie min. 5 spraw testowych w przeglądarce (mieszanka: uznanie, odmowa, sprawa graniczna z brakami — P10) z lokalnym odczytem skanów i korektą niepewnych pól (wymóg zadania §4–§6).
- **Wzięte w części z odrzuconych (P14):**
  - **#9 (w części):** krótka, osobna uwaga o możliwych wyłączeniach wypłaty świadczeń po stronie pracownika ZUS (art. 21, art. 6 — oddzielona od uznania wypadku).
  - **#4 (w części):** lista załączników do dołączenia przez przedsiębiorcę (np. karta ze szpitala, oświadczenia świadków); bez pobierania podsumowania.
- **Sposób pokazania (P3, P9):** **#5** (jedna spójna historia: przedsiębiorca → pracownik ZUS w demo ≤ 2 min).
- **Poza pierwszą wersją (P9, P14):** **#3** (warunkowe ukrywanie sekcji wg rodzaju zdarzenia) oraz pobieranie pliku podsumowania z **#4**.

---

## Krok 3: Identyfikacja ryzykownych założeń (`identify-assumptions-new`)

### Dlaczego ten produkt może się nie udać — 3 perspektywy
- **Product Manager:** przedsiębiorca po urazie i tak wpisze ogólnik mimo pytań pomocniczych; albo ZUS/jury uzna, że neutralne pytania zbyt mocno sugerują treść zgłoszenia; albo sztuczna baza i brak zewnętrznego modelu dadzą rekomendacje słabsze od oczekiwań jury na sprawach granicznych.
- **Projektant UX:** osoba w stresie po wypadku poczuje się przytłoczona listą pól EWYP i załączników, a pracownik ZUS zamiast oszczędzać czas będzie musiał ręcznie poprawiać większość pól odczytanych ze skanu i sekcji projektu karty wypadku.
- **Inżynier:** lokalny odczyt niejednorodnych skanów PDF na karcie GTX 1050 (4 GB, P2) może być zbyt wolny lub zbyt mało dokładny dla ≥ 5 spraw testowych w przeglądarce; reguły z przepisów mogą wymagać doprecyzowania po weryfikacji rozporządzenia „z 23 stycznia 2022” (Analityk).

### Lista założeń w 8 kategoriach ryzyka

| ID | Założenie | Kategoria | Dotyczy | Pewność (Confidence) | Wstępny pomysł testu |
|---|---|---|---|---|---|
| **Z1** | Krótka runda 2–3 neutralnych pytań (P12) i ogólne uspokojenie bez ocen prawnych (P7) skłonią przedsiębiorcę po urazie do rozwinięcia ogólnika („poślizgnąłem się”) w konkretny opis okoliczności i przyczyny. | Value | #1, P4, P7, P12 | Niska | Test na 3–5 scenariuszach ogólnikowych wpisów w makiecie: czy użytkownik po 2–3 pytaniach dopisuje czynność, czynnik zewnętrzny i uraz. |
| **Z2** | Neutralne pytania pomocnicze i rozdzielenie „Twoje słowa / podpowiedź” nie zostaną odebrane przez ZUS ani jury jako „podpowiadanie pod uznanie wypadku”. | Ethics | #1, P7 | Niska | Przegląd treści pytań pod kątem neutralności (Analityk + Artur): brak słów sugerujących kwalifikację prawną i brak narzucania przyczyny. |
| **Z3** | Lokalny odczyt skanów na OMENie (GTX 1050, 4 GB, bez zewnętrznego modelu — P2) jest wystarczająco dokładny i szybki na ≥ 5 sprawach, a korekta niepewnych pól skraca pracę zamiast zmuszać do przepisywania całości. | Feasibility | #10, P2 | Niska | Próbny pomiar na ≥ 5 sztucznych skanach PDF/obrazach przez Programistę: czas odczytu na sprawę i odsetek pól wymagających ręcznej poprawy (założenie progu do ustalenia w kroku 5). |
| **Z4** | Reguły z 5 przesłanek + dopasowanie do podobnych spraw ze sztucznej bazy (bez zewnętrznego modelu — P2) dają trafne i zrozumiałe rekomendacje na mieszance spraw (uznanie, odmowa, sprawa graniczna — P10). | Value / Feasibility | #6, #10, P2, P10 | Niska | Test oceny na sztucznej puli testowej (mieszanka ≥ 5 przypadków): zgodność rekomendacji z rozstrzygnięciami wzorcowymi + czytelność uzasadnienia. |
| **Z5** | Lista braków i niespójności w dokumentach sprawy (w tym braki przekazane po wysłaniu z #2 — P11) trafnie wskazuje pracownikowi ZUS, o co dopytać, bez zalewania fałszywymi alarmami. | Value / Usability | #8, #2, P6, P11 | Średnia | Przegląd wyników listy braków na mieszance spraw (kompletne vs niekompletne): sprawdzenie braków pominiętych i fałszywych alertów. |
| **Z6** | Poszkodowany po urazie rozumie prosty wskaźnik kompletności, listę załączników do dołączenia (#4 część) oraz jedno łagodne potwierdzenie „wysyłam mimo braków” (P11) — bez poczucia blokady. | Usability | #2, #4 (część), P5, P11 | Średnia | Przeklikanie makiety na ścieżce kompletnej i niekompletnej (Artur + zespół): ocena liczby kroków i zrozumiałości komunikatów. |
| **Z7** | Rozdzielenie uznania zdarzenia (5 przesłanek, karta wypadku) od osobnej uwagi o wyłączeniach wypłaty świadczeń (#9 część: art. 21, art. 6) jest spójne z aktualnymi przepisami ZUS i jasne dla pracownika (uwaga: rozporządzenie 2013 vs „2022” w weryfikacji; test mierzy zgodność z naszymi regułami, nie praktyką ZUS). | Viability | #6, #7, #9 (część) | Niska | Weryfikacja podstaw prawnych przez Analityka (`docs/materialy.md`) + wyraźna etykieta rozdzielająca w projekcie karty i rekomendacji. |
| **Z8** | Edytowalny projekt karty wypadku (sekcje I–IV wg Dz.U. 2013 poz. 1618 z podglądem źródła wpisu) realnie skraca przygotowanie karty zamiast wymagać większej liczby poprawek niż wypełnienie od zera. | Usability / Feasibility | #7, P6 | Średnia | Sprawdzenie wypełnienia sekcji I–IV na 5 sprawach testowych: ile pól jest wypełnionych poprawnie ze zgłoszenia/skanu i czy edycja działa bez tarcia. |
| **Z9** | Cała historia (przedsiębiorca → pracownik ZUS + test ≥ 5 spraw w przeglądarce bez instalacji) mieści się w pokazie do 2 minut i wiarygodnie adresuje wymóg ścisłej ochrony danych osobowych w ZUS (zadanie §4–§6). | Go-to-Market | #5, #10, P3 | Średnia | Próba czasowa makiety ze stoperem (≤ 2 min) oraz weryfikacja komunikatu lokalnego przetwarzania i planu wdrożenia. |
| **Z10** | Sztuczna baza kilkudziesięciu przypadków wystarczająco dobrze odzwierciedla różnorodność rzeczywistych zgłoszeń ZUS (różne urazy, niejednorodne dokumenty), by wynik testu był wiarygodny dla jury. | Strategy & Objectives | #6, #10, dane | Średnia | Przegląd przekroju sztucznej bazy (Analityk): zróżnicowanie branż, rodzajów urazów, przyczyn, braków i jakości skanów. |
| **Z11** | Zespół dowiezie makietę (20:00) i działający test lokalny ≥ 5 spraw na OMENie przed finałem mimo ograniczenia 4 GB VRAM i pracy na sztucznych danych. | Team | Całość | Średnia | Wczesny wynik bazowy (krok 0P Programisty) i podział na funkcje rdzeniowe przed bramką 20:00. |

---

## Krok 4: Priorytetyzacja założeń — macierz Wpływ × Ryzyko (`prioritize-assumptions`)

Ryzyko oceniamy jako połączenie niskiej pewności i kosztu błędu/naprawy `(1 - Pewność) × Nakład`.

| Ćwiartka macierzy | Założenia | Decyzja |
|---|---|---|
| **Wysoki Wpływ, Wysokie Ryzyko** *(„skok wiary” — testujemy jako pierwsze)* | **Z1** (skuteczność 2–3 neutralnych pytań), **Z2** (brak wrażenia „podpowiadania pod uznanie”), **Z3** (lokalny odczyt skanów na 4 GB + szybka korekta), **Z4** (trafność rekomendacji z reguł i podobnych spraw na mieszance spraw), **Z7** (zgodność rozdzielenia uznania i wyłączeń z przepisami) | **Projektujemy konkretne testy i kryteria akceptacji w kroku 5** |
| **Wysoki Wpływ, Średnie/Niskie Ryzyko** *(wdrażamy i weryfikujemy w makiecie)* | **Z5** (lista braków bez fałszywych alarmów), **Z6** (kompletność, lista załączników i łagodne potwierdzenie), **Z8** (edytowalny projekt karty wypadku), **Z9** (ścieżka w demo ≤ 2 min + ochrona danych) | **Przenosimy do wymagań i weryfikujemy na makiecie / w próbie czasowej** |
| **Średni Wpływ, Średnie Ryzyko** *(monitorujemy w pracy zespołu)* | **Z10** (realizm sztucznej bazy), **Z11** (tempo dowiezienia do bramki) | **Kontrola na przeglądach Analityka i kamieniach Szefa** |
| **Niski Wpływ, Wysokie Ryzyko** *(odrzucone)* | *(brak wśród wybranych funkcji — w P9/P14 odrzucono #3 oraz pobieranie pliku z #4)* | **Poza pierwszą wersją** |

### Ranking Top 5 najryzykowniejszych założeń (do potwierdzenia przez Artura w P15)

| Priorytet | ID | Założenie („skok wiary”) | Dlaczego krytyczne |
|---|---|---|---|
| **1** | **Z1** | Krótkie neutralne dopytywanie (2–3 pytania + ogólne uspokojenie) realnie rozwija ogólnikowy opis wypadku | Bez tego główny wyróżnik asystenta (P4, P7) nie rozwiązuje bólu przedsiębiorcy |
| **2** | **Z4** | Reguły 5 przesłanek + podobne sprawy (bez zewnętrznego modelu) trafnie oceniają mieszankę spraw (uznanie, odmowa, graniczna) | Bez tego rdzeń wsparcia decyzji (P2, P10) przegrywa test jury na ≥ 5 sprawach |
| **3** | **Z2** | Pytania pomocnicze pozostają w pełni neutralne (brak wrażenia „podpowiadania pod uznanie”) | Błąd etyczny/prawny dyskwalifikuje rozwiązanie w oczach ZUS (P7, recenzja R2/R3 1a) |
| **4** | **Z3** | Lokalny odczyt skanów (GTX 1050, 4 GB) + szybka poprawa niepewnych pól oszczędzają czas pracownika | Zbyt słaby lub wolny odczyt skanów blokuje test ≥ 5 spraw i użyteczność po stronie ZUS |
| **5** | **Z7** | Rozdzielenie uznania zdarzenia od osobnej uwagi o wyłączeniach wypłaty jest zgodne z przepisami i jasne dla pracownika | Mylenie uznania wypadku z wyłączeniem świadczeń (art. 21, art. 6) to błąd merytoryczny w karcie wypadku |

---

### Potwierdzenie kolejności przez Artura (P15)

Artur wyznaczył kolejność walidacji założeń:
1. **Z4** (priorytet 1 — sedno wartości dla pracownika ZUS: trafność rekomendacji na mieszance spraw),
2. **Z1** (priorytet 2 — skuteczność krótkiej rundy 2–3 neutralnych pytań przy ogólnikowym opisie),
3. **Z3** (priorytet 3 — lokalny odczyt skanów i szybka poprawa niepewnych pól),
- **Z2 i Z7** — sprawdzane **przeglądem tekstów i podstaw prawnych** (bez osobnego eksperymentu).

---

## Krok 5: Projekt eksperymentów walidacyjnych (`brainstorm-experiments-new`)

Wszystkie progi liczbowe w hipotezach XYZ są wyraźnie oznaczone jako **założenia progowe** zespołu do weryfikacji w testach (nie są danymi empirycznymi ZUS). Zgodnie z uwagą z recenzji 1a, testy na sztucznej bazie mierzą zgodność z naszymi regułami i sztucznymi rozstrzygnięciami, nie z historyczną praktyką orzeczniczą ZUS.

### Priorytet 1 — Eksperymenty dla **Z4** (trafność rekomendacji na mieszance spraw)

- **Hipoteza XYZ (Z4):** Co najmniej **80%** *(założenie progowe)* spraw ze sztucznej puli testowej (mieszanka: uznanie, odmowa, sprawa graniczna z brakami — min. 5 spraw, docelowo 12 spraw z `dane/zbior/testowy/`) otrzyma rekomendację („uznać / nie uznać / wymaga uzupełnienia”) zgodną ze wzorcowymi rozstrzygnięciami, wraz ze wskazaniem statusu 5 przesłanek i co najmniej jednej trafnej sprawy podobnej z bazy uczącej.
- **Eksperyment E1 (Test porównawczy na puli wzorcowej — YODA):** uruchomienie lokalnej metody bazowej (reguły 5 przesłanek + TF-IDF podobnych spraw, bez zewnętrznego modelu — `ocena/ocen.mjs` na 12 sprawach testowych) z podziałem na 3 klasy z P10 (uznanie, odmowa, sprawa graniczna z brakami).
  - *Metryka i próg sukcesu:* zgodność rekomendacji z wzorcem ≥ 80% *(założenie progowe)* i 0 błędnych kategoryzacji na oczywistych odmowach (np. brak przyczyny zewnętrznej / zdarzenie prywatne).
  - *Nakład / termin:* Niski (skrypt oceny gotowy z kroku 0P) · przed makietą (przed 20:00).
- **Eksperyment E2 (Przegląd „ślepy” uzasadnień — Concierge check):** Analityk ocenia wygenerowane uzasadnienia i listę braków (#8) dla 5 wybranych spraw z mieszanki (bez podglądu kodu), sprawdzając, czy na ich podstawie da się podjąć decyzję i wskazać, o co dopytać.
  - *Metryka i próg sukcesu:* 5/5 spraw *(założenie progowe)* ma czytelne uzasadnienie oparte na cytatach z dokumentów i bez rażących braków w liście dokumentów do uzupełnienia.
  - *Nakład / termin:* Niski · po pierwszym przebiegu E1.

### Priorytet 2 — Eksperymenty dla **Z1** (skuteczność krótkich, neutralnych pytań przy ogólnikowym opisie)

- **Hipoteza XYZ (Z1):** W co najmniej **80%** *(założenie progowe)* scenariuszy startujących od ogólnika („poślizgnąłem się”, „skaleczyłem rękę”, „spadłem z drabiny”) krótka runda **2–3 neutralnych pytań** z ogólnym uspokojeniem (P7, P12) dostarcza komplet trzech brakujących elementów opisu (czynność przed zdarzeniem, czynnik zewnętrzny, skutek/uraz) w czasie poniżej **60 sekund** *(założenie progowe)*.
- **Eksperyment E3 (Test scenariuszowy „Concierge” na makiecie asystenta):** przeklikanie 5 typowych ogólnikowych zgłoszeń na interaktywnej makiecie (Artur + zespół wcielający się w poszkodowanego przedsiębiorcę bez wcześniejszej instrukcji).
  - *Metryka i próg sukcesu:* ≥ 4/5 scenariuszy kończy się pełnym opisem (czynność + przyczyna zewnętrzna + uraz) po ≤ 3 pytaniach, bez zablokowania wysłania i przy zrozumiałym łagodnym potwierdzeniu z P11.
  - *Nakład / termin:* Niski · na etapie przeglądu makiety (przed 20:00).

### Priorytet 3 — Eksperymenty dla **Z3** (lokalny odczyt skanów i korekta niepewnych pól)

- **Hipoteza XYZ (Z3):** Dla co najmniej **80%** *(założenie progowe)* sztucznych skanów PDF/obrazów (z puli testowej ≥ 5 spraw) lokalny odczyt na OMENie (GTX 1050, 4 GB — P2) zakończy się w czasie akceptowalnym w demo (≤ **30 s** na sprawę, *założenie progowe*) i poprawnie rozpozna kluczowe pola (data, opis zdarzenia, uraz, brakujące załączniki) tak, aby pracownik musiał ręcznie poprawić najwyżej **20%** pól *(założenie progowe)*.
- **Eksperyment E4 (Pomiar lokalnego odczytu skanów na OMENie):** uruchomienie `ocena/ocr_omen.py` na ≥ 5 wygenerowanych skanach PDF o różnej jakości (czysty skan, lekko przekrzywiony, skan z brakami) oraz ręczne sprawdzenie odczytanych pól przez Programistę/Analityka.
  - *Metryka i próg sukcesu:* czas odczytu ≤ 30 s/sprawę *(założenie progowe)*, ≥ 80% kluczowych pól poprawnych bez przepisywania całego dokumentu; niepewne pola wyraźnie oznaczone do korekty.
  - *Nakład / termin:* Średni (zależny od dostępności OMENa po WoL) · przed nocnym wdrożeniem MVP.

### Kontrola przeglądowa dla **Z2** i **Z7** (zgodnie z P15 — bez osobnego eksperymentu)

- **Przegląd R-Z2 (neutralność asystenta):** jednorazowy przegląd wszystkich tekstów pytań, podpowiedzi i komunikatu uspokajającego przez Analityka i Artura przed zamknięciem makiety — kryterium: 0 ocen prawnych, 0 sugestii „pod uznanie”, opis w polu zgłoszenia wyłącznie słowami poszkodowanego (P7).
- **Przegląd R-Z7 (rozdzielenie uznania i wyłączeń świadczeń):** weryfikacja podstaw prawnych przez Analityka w `docs/materialy.md` (w tym potwierdzenie rozporządzenia 2013 vs „2022”) oraz sprawdzenie w makiecie i projekcie karty wypadku, że osobna uwaga o wyłączeniach wypłaty (#9 część: art. 21, art. 6) jest wyraźnie oddzielona od kwalifikacji 5 przesłanek uznania wypadku.

---

## Krok 6: Plan odkrywania (Discovery Plan — podsumowanie do `docs/spec.md`)

**Data**: 2026-11-18 · **Etap**: nowy produkt · **Pytanie badawcze**: Które funkcje ZANT najmocniej rozwiązują problemy przedsiębiorcy (P4–P5) i pracownika ZUS (P6) w granicach lokalnego przetwarzania (P2) i 2-minutowego demo (P3), oraz jakie założenia musimy zweryfikować jako pierwsze?

### Wybrane funkcje do specyfikacji (`docs/spec.md`) i makiety
1. **#1 Neutralny dopytywacz o okoliczności i przyczynę** — krótka runda 2–3 neutralnych pytań przy ogólniku (P12), ogólne uspokojenie bez ocen prawnych (P7).
2. **#2 Sprawdzanie kompletności zgłoszenia EWYP bez blokowania wysłania** — jedno łagodne potwierdzenie „wysyłam mimo braków” + automatyczne przekazanie braków na listę pracownika ZUS (P11).
3. **#4 (w części) Lista załączników dla przedsiębiorcy** — prosta lista dokumentów do dołączenia (np. karta ze szpitala, świadkowie), bez pobierania podsumowania (P14).
4. **#6 Rekomendacja „uznać / nie uznać” z jasnym uzasadnieniem** — ocena 5 przesłanek + podobne sprawy z bazy + cytaty, lokalnie bez zewnętrznego modelu (P2, P6).
5. **#7 Edytowalny projekt karty wypadku** — wstępnie wypełnione sekcje I–IV z podglądem źródła wpisu do poprawy przez pracownika (P6).
6. **#8 Lista braków i niespójności w dokumentach sprawy** — brakujące dokumenty, sprzeczności (np. daty) i podpowiedź, o co dopytać (P6).
7. **#9 (w części) Osobna uwaga o wyłączeniach wypłaty świadczeń po stronie ZUS** — oddzielona od uznania wypadku (art. 21, art. 6; P14).
8. **#10 Wgrywanie min. 5 spraw testowych (mieszanka: uznanie, odmowa, graniczna — P10)** z lokalnym odczytem skanów i ręczną korektą niepewnych pól (zadanie §4–§6, P9).
- *Sposób pokazania (nie osobna funkcja):* **#5** jedna spójna historia „przedsiębiorca → pracownik ZUS” w demo ≤ 2 min (P3, P9).
- *Poza pierwszą wersją:* **#3** (warunkowe ukrywanie sekcji wg rodzaju zdarzenia), pobieranie pliku podsumowania z **#4**.

### Tabela krytycznych założeń i planu walidacji

| Kolejność (P15) | ID | Założenie | Kategoria | Wpływ | Niepewność | Metoda walidacji | Kryterium sukcesu *(założenie progowe)* | Nakład | Okno w hackathonie |
|---|---|---|---|---|---|---|---|---|---|
| **1** | **Z4** | Reguły 5 przesłanek + podobne sprawy trafnie oceniają mieszankę spraw bez zewnętrznego modelu | Value / Feasibility | Wysoki | Wysoka | **E1** test na 12 sprawach (`ocena/ocen.mjs`) + **E2** przegląd uzasadnień przez Analityka | ≥ 80% zgodności na puli testowej, 0 błędów na jasnych odmowach, 5/5 czytelnych uzasadnień | Niski | Przed makietą (do 20:00) |
| **2** | **Z1** | Krótka runda 2–3 neutralnych pytań + ogólne uspokojenie rozwijają ogólnikowy opis | Value | Wysoki | Wysoka | **E3** test scenariuszowy 5 ogólników na makiecie (Artur + zespół) | ≥ 4/5 scenariuszy kończy się pełnym opisem po ≤ 3 pytaniach w ≤ 60 s | Niski | Przegląd makiety (przed 20:00) |
| **3** | **Z3** | Lokalny odczyt skanów (GTX 1050, 4 GB) + poprawa niepewnych pól oszczędzają czas | Feasibility | Wysoki | Wysoka | **E4** pomiar `ocena/ocr_omen.py` na ≥ 5 sztucznych skanach PDF | ≤ 30 s/sprawę, ≥ 80% pól poprawnych bez ręcznego przepisywania całości | Średni | Przed nocnym MVP (po WoL OMEN) |
| *Przegląd* | **Z2** | Pytania asystenta nie wyglądają na „podpowiadanie pod uznanie” | Ethics | Wysoki | Wysoka | **R-Z2** przegląd tekstów przez Analityka i Artura | 0 ocen prawnych, 0 sugestii „pod uznanie”, opis słowami poszkodowanego | Niski | Przed zamrożeniem makiety |
| *Przegląd* | **Z7** | Rozdzielenie uznania (5 przesłanek) i uwagi o wyłączeniach zgodne z przepisami ZUS | Viability | Wysoki | Wysoka | **R-Z7** weryfikacja w `docs/materialy.md` + kontrola etykiet w makiecie | Potwierdzony stan prawny (2013 vs „2022”) + wyraźne rozdzielenie w UI | Niski | Przed zamrożeniem speca/makiety |

### Ramy decyzyjne (Decision Framework — wracają jako kryteria akceptacji i ryzyka w `docs/spec.md`)
- **E1/E2 (Z4) zdane →** utrzymujemy lokalną metodę (reguły 5 przesłanek + TF-IDF podobnych spraw) jako domyślny silnik MVP. **Nie zdane →** doprecyzowujemy wagi/reguły przesłanek lub testujemy mały model lokalny na OMENie (zgodnie z warunkiem Pawła w P2).
- **E3 (Z1) zdane →** zamrażamy treść 2–3 pytań pomocniczych i łagodnego potwierdzenia w MVP. **Nie zdane →** upraszczamy sformułowania pytań z Arturem i testujemy ponownie na makiecie (bez dokładania kolejnych kroków ponad 2–3 pytania z P12).
- **E4 (Z3) zdane →** włączamy pełny odczyt skanów na żywo w ścieżce testowej ≥ 5 spraw. **Nie zdane (zbyt wolne lub niskiej jakości na 4 GB) →** wdrażamy tryb szybkiego podglądu z wyraźnym podświetleniem niepewnych pól do korekty + wariant pre-przetworzonego odczytu dla spraw pokazowych, a ograniczenie sprzętu opisujemy jawnie w prezentacji wdrożeniowej (zadanie §5).
- **R-Z2 / R-Z7 wykryją lukę →** natychmiastowa poprawka tekstów komunikatów / etykiet karty przed oddaniem makiety o 20:00.

### Następny krok w łańcuchu
- Przejście do momentu **(c)** i `/write-prd` (`docs/pm/03-write-prd.md` + `docs/spec.md`): po uzyskaniu odpowiedzi Artura na pytania produktowe **P16–P17** i przygotowaniu 3 wariantów makiet ekranu z Programistą.

<!-- skill: przeplywy-pm -->
<!-- skill: brainstorm-ideas-new -->
<!-- skill: identify-assumptions-new -->
<!-- skill: prioritize-assumptions -->
<!-- skill: brainstorm-experiments-new -->
