# Spec: ZANT — asystent zgłoszenia wypadku i wsparcie decyzji ZUS

**Autor**: Projektant · **Data**: 2026-11-18 · **Status**: wersja robocza do makiety — wariant ekranu (P19) i główna historia demo (P20) czekają na Artura (zadane 12:20)
**Podstawa**: `docs/zadanie.md`, `docs/materialy.md` (`f1efade`), `docs/pm/01`–`03a`, `docs/pm/03-write-prd.md`, `docs/decyzje.md` (P1–P20). Dla Programisty: tu jest, co zobaczy i zrobi użytkownik; nic nie trzeba zgadywać. Co jest „założeniem”, jest tak oznaczone.

## 1. Co zobaczy i zrobi użytkownik (według Artura)
Jedna strona w przeglądarce, bez instalacji, dwie role z przełącznikiem u góry: **Przedsiębiorca** (najpierw, P3) i **Pracownik ZUS** (druga połowa tej samej historii). Etykieta u góry: „Przetwarzanie lokalne — dane nie wychodzą z ZUS (bez zewnętrznego modelu)” (P2). Język prosty, po polsku, bez żargonu prawnego po stronie przedsiębiorcy.

### Przedsiębiorca (głównie telefon 360–430 px, jedna ręka — P17)
1. Widzi ogólne uspokojenie: „Opis nie jest egzaminem — napisz swoimi słowami, co się stało” (P7) i jedno duże pole „Co się wydarzyło?”.
2. Wpisuje opis. Gdy jest ogólnikowy (np. „Poślizgnąłem się w pracy”), asystent zadaje **2–3 neutralne pytania otwarte** (P12): czynność i zlecenie; co było na podłożu/w otoczeniu i co wywołało zdarzenie; która część ciała i czy była pomoc lekarza/SOR. Odpowiedzi „Pomiń” wolno. Tekst poszkodowanego jest wyraźnie oddzielony od pytań pomocniczych („Twoje słowa” / „Pytanie pomocnicze”).
3. Widzi kompletność zgłoszenia (co gotowe, czego brakuje wg pól EWYP: `docs/materialy.md` §1) i listę załączników do dołączenia: karta ze szpitala/SOR, umowa lub zlecenie, dane świadka (P14, bez pobierania pliku).
4. „Wyślij zgłoszenie” jest zawsze aktywne (P5). Przy brakach pojawia się **jedno** łagodne okno: „Brakuje jeszcze: [lista]. Możesz wysłać teraz — przekażemy tę listę pracownikowi ZUS.” Przyciski: **„Wróć i uzupełnij”** / **„Wysyłam mimo braków”** (P11).
5. Po wysłaniu: potwierdzenie, przypomnienie listy dokumentów do dosłania, przycisk „Otwórz tę sprawę jako pracownik ZUS”.

**Zasady neutralności (P4, P7, Z2):** żadnych ocen prawnych, żadnych podpowiedzi „pod uznanie”, żadnego komunikatu o wpływie błędu na uznanie; uspokojenie tylko ogólne. Reguła o zwykłym błędzie poszkodowanego (art. 21 ust. 1) działa wyłącznie w widoku pracownika.

### Pracownik ZUS (komputer; czytelny też na mniejszym ekranie)
1. **Wgranie paczki:** przycisk „Wgraj 6 spraw testowych” (albo wybór plików; min. 5 spraw — zadanie §6). Odczyt skanów lokalny; niepewne pola odczytu są podświetlone do kliknięcia i poprawy, przycisk „Przelicz”.
2. **Licznik na pokaz (P16):** na ekranie widoczna jedna wyraźna liczba **„Trafne rekomendacje: X z Y”** (np. 6 z 6) z dopiskiem „sztuczny zbiór testowy — zgodność z regułami ZANT”. X i Y liczy aplikacja z faktycznie wgranych spraw (porównanie z etykietą wzorcową); nie wpisujemy ich na sztywno. Dziś liczba jest tylko w terminalu (`npm run ocen`) — wymóg na MVP (wpis Szefa 12:20; zadanie §4, §6: jury bez instalowania).
3. **Rekomendacja sprawy:** `UZNAĆ` / `NIE UZNAĆ` / `DO UZUPEŁNIENIA` + status 5 przesłanek (nagłość, przyczyna zewnętrzna, uraz, związek z działalnością, okres ubezpieczenia — zielone/czerwone/brak danych) + uzasadnienie z cytatami z dokumentów + 1–2 podobne sprawy z bazy.
4. **Osobna ramka „Wyłączenia świadczeń — nie mylić z uznaniem”** (część #9): `art. 21 ust. 1`, `art. 21 ust. 2–3`, `art. 6 ust. 2–3`, albo „brak”; w pliku etykiet `wylaczenia_swiadczen`. Wyraźnie oddzielona od kwalifikacji (karta III.4 vs III.5–6).
5. **Lista braków i niespójności** (P6): brakujące dokumenty wg typu zdarzenia (`docs/materialy.md` §5), sprzeczności (np. daty) i „o co dopytać”. Braki z „Wysyłam mimo braków” są już na liście.
6. **Edytowalny projekt karty wypadku** (części I–IV wg Dz.U. 2022 poz. 223, **bez pieczątek**): pola wstępnie wypełnione ze zgłoszenia i skanu, przy każdym etykieta źródła („z EWYP”, „z wyjaśnień”, „ze skanu”). Przycisk decyzji **„Zatwierdź projekt karty”** po stronie człowieka; aplikacja niczego nie rozstrzyga sama (RODO art. 22).

## 2. Układ ekranu — czeka na Artura
Trzy makiety: wariant 1 (jeden obraz na ekran) https://pawelpisarek.github.io/hacknation-proba13/warianty/1/ · wariant 2 (lista/kolejka) …/warianty/2/ · wariant 3 (obok siebie) …/warianty/3/. Opisy: `docs/pm/03a-warianty.md`. **Wybrany wariant: _(brak — P19 czeka)_.** Treść sekcji 1 jest wspólna dla wszystkich wariantów. Po odpowiedzi dopiszę tu wybór, uwagi Artura i doprecyzowanie wybranego wariantu.

## 3. Główna ścieżka demo (≤ 2 min, P3, P9)
Kolejność: (1) przedsiębiorca na telefonie — ogólnik → 2–3 pytania → braki i załączniki → „Wysyłam mimo braków” (≈ 60 s) → (2) ta sama sprawa u pracownika — rekomendacja, ramka wyłączeń, lista braków, projekt karty (≈ 40 s) → (3) „Wgraj 6 spraw” i licznik „X z Y” (≈ 20 s). Sprawa startowa wg P20 (czeka na Artura; rekomendacja: ogólnik elektryka `W052`).

## 4. Udawane dane do makiety i demo (z `dane/zbior/testowy/`, szczegóły: `docs/pm/03a-warianty.md`)
- **Start (`W052`):** Rafał Dąbrowski, elektryk (PKD 43.21.Z); wpis „Poślizgnąłem się w pracy i boli mnie bark.” (07.01.2026, 14:20, obiekt przy ul. Przemysłowa 101, Lublin); przycisk „Wstaw przykład”. Wynik u ZUS: `DO UZUPEŁNIENIA`, 3 braki (karta medyczna, opis ogólnikowy, umowa/zlecenie).
- **Paczka 6 spraw (mieszanka P10):** `W052` do uzupełnienia; `W006` uznać (zwykła nieuwaga, bez wyłączenia); `W023` uznać (dojazd do klienta; 2 niepewne pola OCR: godzina 10:45, uraz „skręcenie kolana lewego”); `W020` nie uznać (naprawa własnego domu, brak związku z działalnością); `W027` nie uznać (zasłabnięcie bez czynnika zewnętrznego); `W038` uznać + uwaga wyłączenia art. 21 ust. 2–3 (odmowa badania trzeźwości). Docelowo licznik z faktycznego przebiegu (np. 6 z 6; cała pula testowa 13 z 13 wg ostatniego przebiegu Programisty).
- Dane sztuczne — nie realne osoby.

## 5. Kryteria akceptacji
Progi to **założenia zespołu bez źródła**; zatwierdzają je Paweł (technika) i Artur (produkt) przed 20:00 (`docs/pm/02-discover.md` Krok 6). Na pokaz idzie tylko liczba z P16.
| # | Kryterium | Założenie / test |
|---|---|---|
| A1 | Przy ogólnym opisie asystent zadaje najwyżej 3 neutralne pytania; wysyłka nigdy nie jest zablokowana; przy brakach dokładnie jedno łagodne potwierdzenie | **Z1/E3**: ≥ 4 z 5 ogólników kończy się pełnym opisem po ≤ 3 pytaniach, ≤ 60 s, **na telefonie** |
| A2 | Żaden tekst po stronie przedsiębiorcy nie zawiera oceny prawnej ani podpowiedzi „pod uznanie” | **Z2/R-Z2**: przegląd tekstów (Analityk + Artur) przed zamrożeniem makiety |
| A3 | Rekomendacja trafia na mieszance spraw; 0 błędów na jasnych odmowach; uzasadnienie z cytatami | **Z4/E1+E2**: ≥ 80% zgodności na puli testowej (12–13 spraw); 5 z 5 czytelnych uzasadnień |
| A4 | Licznik „X z Y” widoczny na ekranie pracownika po wgraniu ≥ 5 spraw, liczony z faktycznego wyniku | P16 |
| A5 | Odczyt skanu ≤ 30 s na sprawę, ≥ 80% kluczowych pól bez przepisywania; niepewne pola podświetlone do korekty | **Z3/E4** (OMEN, po WoL); gdy zawiedzie: tryb szybkiego podglądu i odczyt wstępny dla spraw pokazowych, ograniczenie opisane w prezentacji |
| A6 | Ramka wyłączeń świadczeń jest osobno od kwalifikacji; karta bez pieczątek wg Dz.U. 2022 poz. 223 | **Z7/R-Z7**: kontrola etykiet w makiecie |
| A7 | Cała historia ≤ 2 min | **Z9**: próba ze stoperem |
| A8 | Projekt karty: pola edytowalne, źródło przy polu, zatwierdza człowiek | **Z8** |

## 6. Ryzyka
- Rekomendacja mierzy zgodność z **naszymi regułami i sztucznymi rozstrzygnięciami**, nie z praktyką ZUS; nie obiecujemy zgodności z ZUS (`01`, zagrożenie 6).
- Odczyt skanów na 4 GB może być wolny/słaby; przebieg OCR PDF na OMEN nie został jeszcze wykonany (Programista).
- **P7:** asystent uspokaja tylko ogólnie, więc przedsiębiorca może nadal bać się błędu w opisie przyczyny — ryzyko zapisane świadomie.
- Rynek (Z12–Z14): własne AI ZUS, czat AI jako wybór domyślny, „braki wychodzą późno” (bez źródła) — opisujemy jawnie, bez twierdzeń o rynku.
- Dane zdrowotne (RODO art. 9, 22, 32, 35): lokalnie, decyzja człowieka, DPIA i IOD w planie wdrożenia (`docs/materialy.md` §8).
- Baza sztuczna może nie oddawać różnorodności realnych zgłoszeń (Z10).

## 7. Poza pierwszą wersją
Warunkowe ukrywanie sekcji wg rodzaju zdarzenia (#3); pobieranie podsumowania (#4); logowanie, konta, integracja z PUE/eZUS; zewnętrzny model w działającej aplikacji; automatyczna decyzja bez człowieka.

## 8. Otwarte
- **P19** wariant ekranu, **P20** historia demo — czekają na Artura (od 12:20); po odpowiedzi doprecyzujemy wybrany wariant.
- Zatwierdzenie progów (Paweł/Artur) przed 20:00.
- Czas wdrożenia w prezentacji: bez liczby bez źródła; ścieżka formalna (DPIA, audyt, IOD, pilotaż) — Prezenter.

<!-- skill: przeplywy-pm -->
<!-- skill: create-prd -->
