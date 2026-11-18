# Spec: ZANT — asystent zgłoszenia wypadku i wsparcie decyzji ZUS

**Autor**: Projektant · **Data**: 2026-11-18 · **Status**: wersja robocza do makiety — wariant ekranu (P19) i główna historia demo (P20) czekają na Artura (zadane 12:20)
**Podstawa**: `docs/zadanie.md`, `docs/materialy.md` (`f1efade`), `docs/pm/01`–`03a`, `docs/pm/03-write-prd.md`, `docs/decyzje.md` (P1–P20). Dla Programisty: tu jest, co zobaczy i zrobi użytkownik; nic nie trzeba zgadywać. Co jest „założeniem”, jest tak oznaczone.

## 1. Co zobaczy i zrobi użytkownik (według Artura)
Jedna strona w przeglądarce, bez instalacji, dwie role z przełącznikiem u góry: **Przedsiębiorca** (najpierw, P3) i **Pracownik ZUS** (druga połowa tej samej historii). Etykieta u góry: „Bez zewnętrznego modelu AI — przetwarzanie na serwerze aplikacji” (P2); nie obiecujemy „dane nie wychodzą z ZUS”, bo w teście jury aplikacja działa na serwerze `ksefbot.pl` (miejsce odczytu skanów: **do potwierdzenia P21**, rekomendacja: serwer, bez OMENa — jury nic nie instaluje, zadanie §6; OMEN tylko do własnych pomiarów). W realnym wdrożeniu wszystko działa w infrastrukturze ZUS (`docs/materialy.md` §8). Język prosty, po polsku, bez żargonu prawnego po stronie przedsiębiorcy.

### Przedsiębiorca (głównie telefon 360–430 px, jedna ręka — P17)
1. Widzi ogólne uspokojenie: „Opis nie jest egzaminem — napisz swoimi słowami, co się stało” (P7) i jedno duże pole „Co się wydarzyło?”.
2. Wpisuje opis. Gdy jest ogólnikowy (np. „Poślizgnąłem się w pracy”), asystent zadaje **2–3 neutralne pytania otwarte** (P12): czynność i zlecenie; co było na podłożu/w otoczeniu i co wywołało zdarzenie; która część ciała i czy była pomoc lekarza/SOR. Odpowiedzi „Pomiń” wolno. Tekst poszkodowanego jest wyraźnie oddzielony od pytań pomocniczych („Twoje słowa” / „Pytanie pomocnicze”).
3. Widzi kompletność zgłoszenia (co gotowe, czego brakuje wg pól EWYP: `docs/materialy.md` §1) i listę załączników do dołączenia: karta ze szpitala/SOR, umowa lub zlecenie, dane świadka (P14, bez pobierania pliku).
4. „Wyślij zgłoszenie” jest zawsze aktywne (P5). Przy brakach pojawia się **jedno** łagodne okno: „Brakuje jeszcze: [lista]. Możesz wysłać teraz — przekażemy tę listę pracownikowi ZUS.” Przyciski: **„Wróć i uzupełnij”** / **„Wysyłam mimo braków”** (P11).
5. Po wysłaniu: potwierdzenie, przypomnienie listy dokumentów do dosłania, przycisk „Otwórz tę sprawę jako pracownik ZUS”.

**Zasady neutralności (P4, P7, Z2):** żadnych ocen prawnych, żadnych podpowiedzi „pod uznanie”, żadnego komunikatu o wpływie błędu na uznanie; uspokojenie tylko ogólne. Reguła o zwykłym błędzie poszkodowanego (art. 21 ust. 1) działa wyłącznie w widoku pracownika.

### Pracownik ZUS (komputer; czytelny też na mniejszym ekranie)
1. **Wgranie paczki:** przycisk „Wgraj 6 spraw testowych” (albo wybór własnych plików; min. 5 spraw — zadanie §6). Odczyt skanów na serwerze aplikacji (P21); niepewne pola odczytu są podświetlone do kliknięcia i poprawy, przycisk „Przelicz”.
2. **Licznik na pokaz (P16, napis wg Szefa; kod do zmiany przez Programistę):** jedna wyraźna liczba **„Trafne rekomendacje: X z Y”** z dopiskiem „sztuczny zbiór testowy, kwalifikacja zdarzenia”. **Y = liczba wgranych spraw o znanym ID wzorca** (nie podzbiór dobrany pod wynik), X = ile z nich ma rekomendację zgodną ze wzorcem; liczy aplikacja, nic na sztywno. Wgrane własne pliki bez wzorca nie wchodzą do Y; gdy nie ma żadnej sprawy z wzorcem, ekran pokazuje **„Brak wzorca dla wgranych spraw”**. Zbiór pokazowy to 6 spraw z puli 13 (mieszanka P10: uznać / nie uznać / do uzupełnienia; ID niżej w §4); pozostałe 7 można wgrać dodatkowo i Y rośnie. Napis w kodzie (`ad9431f`: „Zgodność ze wzorcem”) Programista zmienia na ten ze specu.
3. **Rekomendacja sprawy:** `UZNAĆ` / `NIE UZNAĆ` / `DO UZUPEŁNIENIA` + status 5 przesłanek (nagłość, przyczyna zewnętrzna, uraz, związek z działalnością, okres ubezpieczenia — zielone/czerwone/brak danych) + uzasadnienie z cytatami z dokumentów + 1–2 podobne sprawy z bazy.
4. **Osobna ramka „Wyłączenia świadczeń — nie mylić z uznaniem”** (część #9): `art. 21 ust. 1`, `art. 21 ust. 2–3`, `art. 6 ust. 2–3`, albo „brak”; w pliku etykiet `wylaczenia_swiadczen`. Wyraźnie oddzielona od kwalifikacji (karta III.4 vs III.5–6).
5. **Lista braków i niespójności** (P6): brakujące dokumenty wg typu zdarzenia (`docs/materialy.md` §5), sprzeczności (np. daty) i „o co dopytać”. Braki z „Wysyłam mimo braków” są już na liście.
6. **Decyzja o rekomendacji (człowiek, RODO art. 22):** pod rekomendacją trzy przyciski: **„Zatwierdź rekomendację”**, **„Odrzuć”**, **„Zmień na…”** (UZNAĆ / NIE UZNAĆ / DO UZUPEŁNIENIA, z krótkim polem „powód zmiany”). Do czasu wyboru status sprawy to „Rekomendacja — czeka na decyzję pracownika”; po wyborze zapisuje się decyzja człowieka obok rekomendacji systemu. W demo wystarczy pokazać „Zatwierdź”; „Odrzuć/Zmień” działają na makiecie.
7. **Edytowalny projekt karty wypadku** (części I–IV wg Dz.U. 2022 poz. 223, **bez pieczątek**): pola wstępnie wypełnione ze zgłoszenia i skanu, przy każdym etykieta źródła („z EWYP”, „z wyjaśnień”, „ze skanu”). Osobny przycisk **„Zatwierdź projekt karty”** (zatwierdzenie karty ≠ decyzja o rekomendacji z punktu 6); aplikacja niczego nie rozstrzyga sama.

## 2. Układ ekranu — czeka na Artura
Trzy makiety: wariant 1 (jeden obraz na ekran) https://pawelpisarek.github.io/hacknation-proba13/warianty/1/ · wariant 2 (lista/kolejka) …/warianty/2/ · wariant 3 (obok siebie) …/warianty/3/. Opisy: `docs/pm/03a-warianty.md`. **Wybrany wariant: _(brak — P19 czeka)_.** Treść sekcji 1 jest wspólna dla wszystkich wariantów. Po odpowiedzi dopiszę tu wybór, uwagi Artura i doprecyzowanie wybranego wariantu.

## 3. Główna ścieżka demo (≤ 2 min, P3, P9)
Kolejność: (1) przedsiębiorca na telefonie — ogólnik → 2–3 pytania → braki i załączniki → „Wysyłam mimo braków” (≈ 50 s) → (2) ta sama sprawa u pracownika — rekomendacja, ramka wyłączeń, lista braków, projekt karty (≈ 40 s) → (3) „Wgraj 6 spraw testowych” i „Trafne rekomendacje: X z Y” (≈ 15 s; **tryb pokazowy: skany tych 6 spraw są wcześniej odczytane i zapamiętane**, więc na żywo tylko przeliczenie — odczyt „na żywo” trwa dłużej i nie mieści się w 2 min). Łącznie ≈ 105 s + 15 s zapasu = 120 s. Sprawa startowa wg P20 (czeka na Artura; rekomendacja: ogólnik elektryka `W052`).

## 4. Udawane dane do makiety i demo (z `dane/zbior/testowy/`, szczegóły: `docs/pm/03a-warianty.md`)
- **Start (`W052`):** Rafał Dąbrowski, elektryk (PKD 43.21.Z); wpis „Poślizgnąłem się w pracy i boli mnie bark.” (07.01.2026, 14:20, obiekt przy ul. Przemysłowa 101, Lublin); przycisk „Wstaw przykład”. Wynik u ZUS: `DO UZUPEŁNIENIA`, 3 braki (karta medyczna, opis ogólnikowy, umowa/zlecenie).
- **Paczka pokazowa 6 spraw (z puli 13): `W052`, `W006`, `W023`, `W020`, `W027`, `W038`** — `W052` do uzupełnienia (ogólnik elektryka; start demo u przedsiębiorcy i u pracownika); `W006` uznać (zwykła nieuwaga, bez wyłączenia); `W023` uznać (dojazd do klienta; 2 niepewne pola odczytu: godzina 10:45, uraz „skręcenie kolana lewego”); `W020` nie uznać (naprawa własnego domu, brak związku z działalnością); `W027` nie uznać (zasłabnięcie bez czynnika zewnętrznego); `W038` uznać + uwaga wyłączenia art. 21 ust. 2–3 (odmowa badania trzeźwości). Wynik licznika bierzemy z faktycznego przebiegu (ostatnio Programista: cała pula 13 z 13); mieszanka jest wybrana pod **różnorodność przypadków, nie pod wynik**, a Y to zawsze liczba faktycznie wgranych.
- Dane sztuczne — nie realne osoby.

## 5. Kryteria akceptacji
Progi to **założenia zespołu bez źródła**; zatwierdzają je Paweł (technika) i Artur (produkt) przed 20:00 (`docs/pm/02-discover.md` Krok 6). Na pokaz idzie tylko liczba z P16.
| # | Kryterium | Założenie / test |
|---|---|---|
| A1 | Przy ogólnym opisie asystent zadaje najwyżej 3 neutralne pytania; wysyłka nigdy nie jest zablokowana; przy brakach dokładnie jedno łagodne potwierdzenie | **Z1/E3**: ≥ 4 z 5 ogólników kończy się pełnym opisem po ≤ 3 pytaniach, ≤ 60 s, **na telefonie** |
| A2 | Żaden tekst po stronie przedsiębiorcy nie zawiera oceny prawnej ani podpowiedzi „pod uznanie” | **Z2/R-Z2**: przegląd tekstów (Analityk + Artur) przed zamrożeniem makiety |
| A3 | Rekomendacja trafia na mieszance spraw; 0 błędów na jasnych odmowach; uzasadnienie z cytatami | **Z4/E1+E2**: ≥ 80% zgodności na puli testowej (12–13 spraw); 5 z 5 czytelnych uzasadnień |
| A4 | Po wgraniu ≥ 5 spraw ekran pracownika pokazuje „Trafne rekomendacje: X z Y”, Y = wgrane sprawy ze wzorcem; bez wzorca → „Brak wzorca dla wgranych spraw” | P16, test w `npm test` (Programista) |
| A5 | Odczyt skanu na serwerze ≤ 30 s na sprawę (założenie, do pomiaru), ≥ 80% kluczowych pól bez przepisywania; niepewne pola podświetlone do korekty. **W demo 2 min używamy skanów wcześniej odczytanych** (tryb pokazowy), nie odczytu na żywo | **Z3/E4** (miejsce: P21; gdy serwer za wolny → tryb szybkiego podglądu + odczyt wstępny, ograniczenie opisane w prezentacji) |
| A6 | Ramka wyłączeń świadczeń jest osobno od kwalifikacji; karta bez pieczątek wg Dz.U. 2022 poz. 223 | **Z7/R-Z7**: kontrola etykiet w makiecie |
| A7 | Cała historia ≤ 120 s z trybem pokazowym; plan 105 s + 15 s zapasu; bez odczytu skanów na żywo | **Z9**: próba ze stoperem |
| A8 | Pracownik może zatwierdzić / odrzucić / zmienić rekomendację (z powodem) oraz osobno zatwierdzić projekt karty; pola karty edytowalne, źródło przy polu | **Z8**, P6 |

### Ramy decyzyjne (z `docs/pm/02-discover.md`, Krok 6 — co robimy po teście)
- **Z4 (A3) zdane → utrzymujemy** lokalną metodę (reguły 5 przesłanek + TF-IDF podobnych spraw) jako silnik MVP. **Niezdane → poprawiamy** wagi/reguły przesłanek albo testujemy mały model lokalny (warunek Pawła w P2) — bez zmiany ekranu.
- **Z1 (A1) zdane → zamrażamy** treść 2–3 pytań i łagodnego potwierdzenia. **Niezdane → poprawiamy** sformułowania z Arturem i testujemy ponownie na makiecie; nie dokładamy pytań ponad 2–3 (P12).
- **Z3 (A5) niezdane →** tryb szybkiego podglądu + odczyt wstępny dla spraw pokazowych; ograniczenie jawnie w prezentacji (zadanie §5).
- **R-Z2 / R-Z7 (A2, A6) wykryją lukę →** poprawka tekstów i etykiet przed makietą o 20:00.

## 6. Ryzyka
- Rekomendacja mierzy zgodność z **naszymi regułami i sztucznymi rozstrzygnięciami**, nie z praktyką ZUS; nie obiecujemy zgodności z ZUS (`01`, zagrożenie 6).
- Miejsce odczytu skanów przy teście jury: **do potwierdzenia P21 (Paweł)**; rekomendacja: serwer `ksefbot.pl`. Odczyt może być wolny/słaby (OMEN 4 GB nie przeszedł próby PDF) — stąd tryb pokazowy w demo.
- **P7:** asystent uspokaja tylko ogólnie, więc przedsiębiorca może nadal bać się błędu w opisie przyczyny — ryzyko zapisane świadomie.
- Rynek (Z12–Z14): własne AI ZUS, czat AI jako wybór domyślny, „braki wychodzą późno” (bez źródła) — opisujemy jawnie, bez twierdzeń o rynku.
- Dane zdrowotne (RODO art. 9, 22, 32, 35): bez zewnętrznego modelu, decyzja człowieka, DPIA i IOD w planie wdrożenia (`docs/materialy.md` §8).
- Baza sztuczna może nie oddawać różnorodności realnych zgłoszeń (Z10).

## 7. Poza pierwszą wersją
Warunkowe ukrywanie sekcji wg rodzaju zdarzenia (#3); pobieranie podsumowania (#4); logowanie, konta, integracja z PUE/eZUS; zewnętrzny model w działającej aplikacji; automatyczna decyzja bez człowieka.

## 8. Otwarte
- **P21** (Paweł): miejsce odczytu skanów przy teście jury.
- **P19** wariant ekranu, **P20** historia demo — czekają na Artura (od 12:20); po odpowiedzi doprecyzujemy wybrany wariant.
- Zatwierdzenie progów (Paweł/Artur) przed 20:00.
- Czas wdrożenia w prezentacji: bez liczby bez źródła; ścieżka formalna (DPIA, audyt, IOD, pilotaż) — Prezenter.

<!-- skill: przeplywy-pm -->
<!-- skill: create-prd -->
