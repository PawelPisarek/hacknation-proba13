# Odkrywanie produktu (/discover): ZANT — asystent zgłoszenia wypadku i wsparcie decyzji ZUS

**Data**: 2026-11-18 · **Etap produktu**: nowy produkt (initial discovery) · **Status**: kroki 1–2 gotowe; czeka na wybór 3–5 pomysłów przez Artura (P9) przed krokami 3–6
**Źródła wejściowe**: `docs/zadanie.md`, `docs/materialy.md`, `docs/zadania/01-pdf-ewyp-karta.md`, `docs/pm/01-competitive-analysis.md`, `docs/decyzje.md` (P1–P7)

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

## Punkt kontrolny (Checkpoint 1 — czeka na Artura)

Zgodnie z zasadami `przeplywy-pm` (`/discover` krok 2) oraz `przesluchanie-hackathon`:
- Do Artura w pokoju Produkt poszły pytania **P9** (wybór 3–5 pomysłów z Top 10) oraz **P10–P12** (niezależne niewiadome przed (b)).
- **Kroki 3–6 tego dokumentu** (`identify-assumptions-new`, `prioritize-assumptions` + pytanie o najryzykowniejsze założenia, `brainstorm-experiments-new`, plan odkrywania) zostaną dopisane w tym pliku natychmiast po wyborze pomysłów przez Artura w P9 (oraz odpowiedziach na pytania zależne: co zmienić i czy któryś odrzucony pomysł wziąć w części).

<!-- skill: przeplywy-pm -->
<!-- skill: brainstorm-ideas-new -->
