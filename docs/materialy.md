# Materiały: wypadek przy pracy osoby prowadzącej pozarolniczą działalność (ZANT)

Stan: 18.11 (po poprawce R1 i scaleniu pól z `docs/zadania/01-pdf-ewyp-karta.md` z gałęzi `pawel/01-pdf-ewyp-karta`). Pakietu PDF ani wzorca od organizatora nie dostaliśmy (`docs/zadanie.md` §7, uwagi do próby), więc wszystko pochodzi ze zweryfikowanych publicznych źródeł. Każdy fakt ma odsyłacz `[S#]` (lista 14 źródeł na końcu), a elementy projektowe są jawnie oznaczone `(założenie)`.

## 0. Dostępne w zadaniu i ustalenia ludzi (`docs/zadanie.md`, `docs/decyzje.md`)
- **Dane i wzorce**: brak pakietu kart wypadków ZUS i wzorca organizatora — budujemy sztuczny zbiór (kilkadziesiąt przypadków, część jako PDF/skan) na bazie publicznych źródeł (uwagi do próby).
- **Zakres produktu**: jedna aplikacja webowa w dwóch częściach, bez instalacji: (1) asystent zgłoszenia i wyjaśnień dla przedsiębiorcy (prosty język, bez blokowania wysyłki — P5), (2) wsparcie decyzji dla pracownika ZUS (odczyt skanów, rekomendacja uznać/nie uznać z uzasadnieniem, projekt karty wypadku, lista braków w dokumentach sprawy — P6; decyduje człowiek).
- **Kluczowe ustalenia P2–P7**:
  - **P2**: aplikacja działa **lokalnie bez zewnętrznego modelu** (OCR na GPU OMEN 4 GB; rekomendacja z podobnych spraw w sztucznej bazie + reguł z przepisów).
  - **P3**: w demo najpierw przedsiębiorca, potem pracownik ZUS (druga połowa tej samej historii).
  - **P4, P7**: poszkodowany boi się, że źle opisze przyczynę i pisze ogólnikami („poślizgnąłem się”). Asystent **dopytuje neutralnie** (bez podpowiadania pod uznanie) i **uspokaja wyłącznie ogólnie** („opis nie jest egzaminem, napisz swoimi słowami, co się stało”), **bez ocen prawnych** po stronie przedsiębiorcy; reguła o błędzie poszkodowanego (art. 21 ust. 1) działa wyłącznie po stronie pracownika ZUS.
  - **Testy (§6)**: wgranie przez przeglądarkę dokumentacji dla min. 5 przypadków testowych.

## 1. Zgłoszenie (EWYP) i wyjaśnienia poszkodowanego
Zgłoszenie to formularz **EWYP „Zawiadomienie o wypadku”** (6 stron, aktualny PDF ZUS [S3]; jedyny formularz na liście ZUS „Ustalanie okoliczności i przyczyn wypadku przez ZUS” [S2][S3]). Odczyt PDF potwierdzony przez Pawła (`docs/zadania/01-pdf-ewyp-karta.md`). **Osobnego formularza „wyjaśnienia poszkodowanego” ZUS nie publikuje** — jest to *zapis wyjaśnień* (ustnie do protokołu lub pisemnie), dołączany do karty wypadku [S2][S4 §3 ust.1 pkt 3, §4 ust.3].

Pola formularza EWYP (z PDF [S3] i opisu [S5]; kolumna „Rola w asystencie” to nasza propozycja `(założenie)`, bo formularz papierowy nie definiuje walidacji elektronicznej — a zgodnie z zadaniem §3 i P5 brak pola **nie blokuje wysłania**):

| Sekcja EWYP | Pola w formularzu [S3] | Rola w asystencie `(założenie)` |
|---|---|---|
| Dane poszkodowanego | PESEL; dokument tożsamości (rodzaj, seria, numer); imię, nazwisko; data i miejsce urodzenia; telefon (dobrowolny) | wymagane (tożsamość), telefon opcjonalny |
| Adresy poszkodowanego | zamieszkania; ostatniego zamieszkania w Polsce / pobytu; do korespondencji (w tym poste restante, skrytka, przegródka); **miejsca prowadzenia działalności** (+ telefon dobrowolny); miejsca opieki nad dzieckiem do lat 3 (niania) | zamieszkania i **miejsca działalności** wymagane (od siedziby działalności zależy właściwy oddział ZUS [S2][S4 §2 ust.2]) |
| Osoba zawiadamiająca (jeśli nie poszkodowany) | PESEL lub dokument tożsamości; imię, nazwisko; data urodzenia; telefon; te same trzy rodzaje adresów | warunkowe (gdy zgłasza pełnomocnik / rodzina) |
| Informacja o wypadku (pkt 1–10) | 1) data i godzina wypadku; 2) miejsce wypadku; 3) planowana godzina rozpoczęcia i zakończenia pracy w dniu wypadku; 4) rodzaj doznanych urazów; 5) szczegółowy opis okoliczności, miejsca i przyczyn; 6) pierwsza pomoc medyczna (TAK/NIE + nazwa i adres placówki); 7) organ prowadzący postępowanie (policja, prokuratura); 8) wypadek przy obsłudze maszyn/urządzeń (TAK/NIE + czy sprawne i używane zgodnie z zasadami producenta); 9) atest / deklaracja zgodności (TAK/NIE); 10) maszyna w ewidencji środków trwałych (TAK/NIE) | pkt 1–5 kluczowe dla przesłanek z art. 3; pkt 6–7 wskazane (dowody); pkt 8–10 warunkowe (gdy była maszyna) |
| Świadkowie | Do 3 świadków: imię, nazwisko, adres | wskazane (ułatwia ustalenia ZUS) |
| Załączniki (do zaznaczenia) | Karta informacyjna ze szpitala / pogotowia; postanowienie prokuratury; dokumenty zgonu; dokumenty uprawniające osobę inną niż poszkodowany; inne (np. umowa na usługę, faktura, notatka policji, mandat); **lista dokumentów do dostarczenia później z terminem** | wskazane (asystent podpowiada listę wg typu zdarzenia — sekcja 5) |
| Zakończenie | Sposób odbioru odpowiedzi (placówka ZUS / poczta / PUE), oświadczenie, data, podpis | wymagane formalnie przy wysyłce |

## 2. Podstawa prawna — aktualność aktów, przesłanki i odmowa
Zweryfikowano w systemie ELI Sejmu:
- **Ustawa wypadkowa**: ustawa z 30.10.2002 o ubezpieczeniu społecznym z tytułu wypadków przy pracy i chorób zawodowych — aktualny, obowiązujący tekst jednolity to **Dz.U. 2025 poz. 1644** (obwieszczenie Marszałka Sejmu z 7.11.2025, status w ELI: `obowiązujący`) [S1].
- **Rozporządzenie o karcie wypadku**: obowiązuje rozporządzenie MRiPS z **23.01.2022 (Dz.U. 2022 poz. 223)** — szczegóły w sekcji 3 [S4].

### Przesłanki uznania zdarzenia za wypadek przy pracy (art. 3 ust. 1 i ust. 3 pkt 8–9) [S1]
Wszystkie 5 przesłanek musi być spełnione łącznie:
1. **Nagłość zdarzenia** (art. 3 ust. 1, ust. 3).
2. **Przyczyna zewnętrzna** (art. 3 ust. 1, ust. 3).
3. **Uraz lub śmierć** — ustawowa definicja „urazu” to *uszkodzenie tkanek ciała lub narządów człowieka wskutek działania czynnika zewnętrznego* (art. 2 pkt 13).
4. **Podczas wykonywania zwykłych czynności związanych z prowadzeniem działalności pozarolniczej** (art. 3 ust. 3 pkt 8; dla osoby współpracującej — pkt 9).
5. **W okresie ubezpieczenia wypadkowego** z danego tytułu (art. 2 pkt 3, art. 3 ust. 3).

### Rozróżnienie: uznanie zdarzenia ≠ wyłączenie / odmowa świadczeń [S1][S4]
Model i karta wypadku muszą rozdzielać dwie warstwy:
- **Warstwa A — kwalifikacja zdarzenia (karta wypadku, część III pkt 4)**: czy zdarzenie *jest* / *nie jest* wypadkiem przy pracy z art. 3 ust. 3 pkt 8. Stwierdzenie, że nie jest wypadkiem, wymaga **uzasadnienia i wskazania dowodów** [S4 §3 ust.3].
- **Warstwa B — wyłączenie lub odmowa świadczeń (karta III pkt 5–6; art. 6, 21, 22 ustawy)** — zdarzenie nadal może być uznane za wypadek przy pracy, ale świadczenia nie przysługują ubezpieczonemu:
  - **art. 21 ust. 1**: **wyłączną przyczyną** wypadku było udowodnione naruszenie przez ubezpieczonego przepisów dotyczących ochrony życia i zdrowia, spowodowane **umyślnie lub wskutek rażącego niedbalstwa** (ciężar dowodu spoczywa na ZUS [S10]);
  - **art. 21 ust. 2–3**: ubezpieczony w stanie **nietrzeźwości** lub pod wpływem środków odurzających/psychotropowych **przyczynił się w znacznym stopniu** do spowodowania wypadku; **odmowa poddania się badaniu** pozbawia prawa do świadczeń (chyba że ubezpieczony udowodni przyczyny uniemożliwiające badanie). Wyłączenie z ust. 2 nie pozbawia świadczeń członków rodziny w razie śmierci poszkodowanego [S11];
  - **art. 6 ust. 2–3 (korekta z Dz.U. 2025 poz. 1644)**: dla prowadzących działalność pozarolniczą i współpracujących świadczenia nie przysługują przy **zadłużeniu z tytułu składek na ubezpieczenia społeczne w dniu wypadku przekraczającym 1% minimalnego wynagrodzenia za pracę** (nie stare „2,00 zł” z tekstu z 2002 r.) — do czasu spłaty całości zadłużenia. Prawo do świadczeń (zasiłek, rehabilitacyjne, jednorazowe odszkodowanie, leczenie) **przedawnia się, jeśli zadłużenie nie zostanie uregulowane w ciągu 6 miesięcy od dnia wypadku** [S1];
  - **art. 22 ust. 1–3**: ZUS odmawia przyznania świadczeń w drodze decyzji przy: (1) nieprzedstawieniu karty wypadku, (2) nieuznaniu zdarzenia w karcie, (3) stwierdzeniach bezpodstawnych w karcie; przy brakach formalnych ZUS zwraca kartę do uzupełnienia [S1].

### Świadczenia po uznaniu (zweryfikowane w Dz.U. 2025 poz. 1644) [S1]
- **Zasiłek chorobowy**: **100% podstawy wymiaru** (art. 9 ust. 1), od 1. dnia niezdolności do pracy, **niezależnie od okresu podlegania ubezpieczeniu** — bez okresu wyczekiwania (art. 8 ust. 1–2).
- **Jednorazowe odszkodowanie**: **20% przeciętnego wynagrodzenia za każdy 1% stałego lub długotrwałego uszczerbku na zdrowiu** (art. 12 ust. 1; ocena po zakończeniu leczenia i rehabilitacji — art. 11 ust. 4; kwoty w zł ogłasza Minister w Monitorze Polskim — art. 14 ust. 9).

## 3. Karta wypadku — obowiązujące rozporządzenie (2022) i porównanie z wersją 2013
- **Potwierdzenie aktualności**: obowiązuje **Rozporządzenie Ministra Rodziny i Polityki Społecznej z dnia 23 stycznia 2022 r.** (Dz.U. 2022 poz. 223; weszło w życie 1.02.2022; status w ELI: `obowiązujący`) [S4]. Poprzednie rozporządzenie z 19.12.2002 (t.j. Dz.U. 2013 poz. 1618) **utraciło moc 1.02.2022** [S4 §7 przypis 2][S6].
- **Czym różni się karta wypadku z 2022 [S4] od wzoru z 2013 [S6]** (porównanie obu PDF-ów ELI):
  1. **Usunięto pieczątki**: w nagłówku zniknęło „lub pieczątka, jeżeli ją posiada”, a w części IV pkt 2 ppkt 1 i 2 usunięto „pieczątka, jeżeli ją posiada” (została nazwa podmiotu, imię/nazwisko i podpis).
  2. **Dodano art. 3a ustawy** (małżonek Prezydenta RP): w części II pkt 5 („zgodnie z art. 3 ust. 3 **albo art. 3a**…”, zaktualizowany publikator ustawy) oraz w części III pkt 4 („…art. 3 ust. 3 pkt … **/ albo art. 3a**”, bez ramek wokół „jest / nie jest”, dodany przypis 4 „Niepotrzebne skreślić”).
  3. **Dla przedsiębiorców (art. 3 ust. 3 pkt 8, art. 5 ust. 1 pkt 8) brak zmian merytorycznych**: te same 4 części (I–IV), te same pola o okolicznościach, przyczynach, świadkach, kwalifikacji i wyłączeniach z art. 21, ten sam termin **14 dni**, 3 egzemplarze i obowiązek uzasadnienia odmowy z dowodami.

### Pełna zweryfikowana lista pól wzoru karty wypadku (załącznik do Dz.U. 2022 poz. 223) [S4]
- **Nagłówek**: Nazwa i adres podmiotu sporządzającego kartę wypadku (dla przedsiębiorców: właściwy oddział ZUS [S1 art. 5 ust.1 pkt 8][S2]).
- **I. Dane identyfikacyjne płatnika składek** *(nie wypełniają podmioty niebędące płatnikami)*: 1) imię i nazwisko lub nazwa; 2) adres siedziby; 3) NIP, REGON, PESEL; dokument tożsamości (rodzaj, seria, numer).
- **II. Dane identyfikacyjne poszkodowanego**: 1) imię i nazwisko; 2) PESEL; dokument tożsamości (rodzaj, seria, numer); 3) data i miejsce urodzenia; 4) adres zamieszkania; 5) tytuł ubezpieczenia wypadkowego (numer pozycji i pełny tytuł wg art. 3 ust. 3 albo art. 3a — dla przedsiębiorcy: *art. 3 ust. 3 pkt 8: wykonywanie zwykłych czynności związanych z prowadzeniem działalności pozarolniczej*).
- **III. Informacje o wypadku**:
  1. Data zgłoszenia oraz imię i nazwisko osoby zgłaszającej wypadek.
  2. Informacje dotyczące okoliczności, przyczyn, czasu i miejsca wypadku, rodzaju i umiejscowienia urazu.
  3. Świadkowie wypadku (imię i nazwisko, miejsce zamieszkania — 2 wiersze wzoru).
  4. Kwalifikacja: *Wypadek jest / nie jest wypadkiem przy pracy określonym w art. 3 ust. 3 pkt … / albo art. 3a* (uzasadnić i wskazać dowody, jeżeli zdarzenia nie uznano za wypadek przy pracy).
  5. Stwierdzenie, że wyłączną przyczyną wypadku było udowodnione naruszenie przez poszkodowanego przepisów dotyczących ochrony życia i zdrowia, spowodowane umyślnie lub wskutek rażącego niedbalstwa (wskazać dowody).
  6. Stwierdzenie, że poszkodowany, będąc w stanie nietrzeźwości lub pod wpływem środków odurzających/psychotropowych, przyczynił się w znacznym stopniu do spowodowania wypadku (wskazać dowody; przy odmowie badania — zamieścić informację o tym fakcie).
- **IV. Pozostałe informacje**:
  1. Zapoznanie poszkodowanego (członka rodziny) z treścią karty i pouczenie o prawie zgłaszania uwag i zastrzeżeń (imię i nazwisko, data, podpis).
  2. Data sporządzenia karty; 1) nazwa podmiotu obowiązanego; 2) imię i nazwisko sporządzającego oraz podpis.
  3. Przeszkody i trudności uniemożliwiające sporządzenie karty w wymaganym terminie 14 dni.
  4. Data odbioru karty i podpis uprawnionego.
  5. Wykaz załączników.

Od samej karty wypadku **nie przysługuje odwołanie** — poszkodowany może zgłosić uwagi i zastrzeżenia (pisemnie lub do protokołu) [S2][S4 §4 ust.2]. Odwołanie do sądu przysługuje dopiero od decyzji ZUS o odmowie świadczeń [S1 art. 15 ust. 4, art. 22 ust. 2].

## 4. Dopytywanie poszkodowanego (pod P4 i P7) — zamiana ogólników w konkret
Zgodnie z ustaleniami **P4 i P7** (`docs/decyzje.md`):
- **Po stronie przedsiębiorcy (asystent)**: dopytuje wyłącznie **neutralnie** (nie sugeruje faktów „pod uznanie”), pomaga zamienić ogólnik w konkretny opis przebiegu i **uspokaja wyłącznie ogólnie** (*„opis nie jest egzaminem, napisz swoimi słowami, co dokładnie się wydarzyło”*), **bez ocen prawnych** i bez zapewnień o wpływie błędu na uznanie.
- **Po stronie pracownika ZUS (wsparcie decyzji)**: system stosuje regułę z **art. 21 ust. 1 [S1] i SN `I UK 69/12` [S10]** — zwykły błąd, potknięcie lub nieuwaga poszkodowanego **nie przekreślają** uznania wypadku ani świadczeń; wyłączenie świadczeń w polu III.5 karty wymaga udowodnienia łącznie: naruszenia konkretnego przepisu o ochronie życia/zdrowia + winy umyślnej lub rażącego niedbalstwa + że było to **wyłączną** przyczyną zdarzenia.

### Przełożenie przesłanek na neutralne pytania asystenta `(założenie oparte na [S1][S3][S4])`
| Przesłanka / obszar | Typowy ogólnik poszkodowanego | Neutralne pytania dopytujące (bez ocen prawnych) |
|---|---|---|
| Czas, miejsce, nagłość (art. 3 ust. 1, EWYP pkt 1–3) | „Wczoraj w pracy” | Kiedy dokładnie (data i godzina) to się stało? Gdzie dokładnie (adres i pomieszczenie/miejsce)? W jakich godzinach planowałeś tego dnia pracować? |
| Związek z działalnością (art. 3 ust. 3 pkt 8) | „Byłem w pracy / na zleceniu” | Jaką dokładnie czynność wykonywałeś w momencie zdarzenia? Dla jakiego zlecenia lub w ramach którego obszaru swojej działalności? |
| Przyczyna zewnętrzna — konkret zamiast ogólnika (art. 3 ust. 1, EWYP pkt 5) | „Poślizgnąłem się”, „spadłem”, „zrobiło mi się słabo” | Co dokładnie działo się krok po kroku tuż przed zdarzeniem? Na jakiej powierzchni stałeś / co było na podłożu lub w otoczeniu? Czy zadziałał konkretny przedmiot, narzędzie, pojazd, ruchoma część lub usterka? |
| Uraz i pomoc medyczna (art. 2 pkt 13, EWYP pkt 4, 6) | „Uderzyłem się w rękę” | Która dokładnie część ciała ucierpiała i jaki uraz rozpoznał lekarz (jeśli byłeś na SOR/u lekarza)? Czy i gdzie udzielono pierwszej pomocy? |
| Maszyny, służby, świadkowie (EWYP pkt 7–10) | *(pominięte)* | Czy w zdarzeniu brała udział maszyna lub elektronarzędzie (jeśli tak: czy była sprawna, używana wg instrukcji, czy ma atest i jest w środkach trwałych)? Czy ktoś to widział? Czy była policja lub pogotowie? |

### Typowe kategorie zdarzeń z zadania (§2) + droga — wymagane informacje `(założenie na bazie [S1][S3][S7][S8][S9])`
1. **Prace na wysokości** (drabina, rusztowanie, dach): na czym poszkodowany stał i na jakiej wysokości; stan podłoża/rozstawienia podparcia; co wywołało utratę równowagi lub upadek; jakie zabezpieczenia były obecne; na jaką powierzchnię upadł; jakie zadanie firmowe wykonywał.
2. **Remont / prace budowlano-wykończeniowe**: adres obiektu i dokument zlecenia/umowy; dokładna czynność (cięcie, kucie, przenoszenie, montaż); narzędzie lub materiał sprawczy; bezpośredni mechanizm urazu (np. odprysk, przygniecenie, porażenie); obecność klienta lub innych świadków.
3. **Naprawa / obsługa maszyny lub urządzenia**: typ/model maszyny i czy należy do środków trwałych (EWYP pkt 10); czy była sprawna, z atestem/deklaracją zgodności i używana wg instrukcji (EWYP pkt 8–9); czy napęd/zasilanie było odłączone; który element zadziałał (np. pochwycenie, odrzut, pęknięcie tarczy).
4. **Droga / dojazd (klient, hurtownia, powrót)**: dokładny punkt startu i cel przejazdu (czy bezpośredni dojazd do kontrahenta/po materiały na konkretne zlecenie, czy powrót do domu po pracy — rozstrzygające wg [S7][S8][S9]); relacja do planowanych godzin pracy; obecność policji/mandatu; dowód celu biznesowego (zlecenie, faktura, korespondencja z klientem).

## 5. Dokumenty sprawy i układ skanów (pod P6 i generator sztucznego zbioru)
### Jakie dokumenty występują przy danym typie zdarzenia [S2][S3][S4]
| Typ zdarzenia | Dokumenty bazowe (zawsze oczekiwane) | Dokumenty specyficzne (ich brak trafia na listę braków dla pracownika ZUS — P6) |
|---|---|---|
| Każde zdarzenie | Formularz EWYP [S3]; zapis wyjaśnień poszkodowanego [S4 §4 ust.3]; dokumentacja medyczna pierwszej pomocy / SOR (jeśli udzielono) [S2][S3]; potwierdzenie działalności (CEIDG / licencja jeśli wymagana) [S2] | Oświadczenia świadków (jeśli wskazani w EWYP) [S4 §3 ust.1 pkt 4] |
| Prace na wysokości / remont | jw. | Umowa / zlecenie / faktura potwierdzająca wykonywanie usługi na miejscu [S2][S3]; oświadczenie klienta lub świadka; protokół oględzin miejsca (jeśli sporządzony) [S4 §3 ust.1 pkt 2] |
| Naprawa / obsługa maszyny | jw. | Protokół oględzin stanu technicznego maszyny i osłon [S4 §3 ust.1 pkt 2]; deklaracja zgodności / atest, wpis do ewidencji środków trwałych (wg EWYP pkt 8–10) [S3] |
| Wypadek drogowy / dojazd do klienta | jw. | Notatka urzędowa policji drogowej / mandat [S2][S3]; postanowienie prokuratury (jeśli postępowanie) [S3]; dowód celu biznesowego przejazdu (umowa, zamówienie, faktura z hurtowni) [S2][S7][S9] |
| Wypadek śmiertelny / ciężki / podejrzenie alkoholu | jw. | Karta zgonu lub zaświadczenie lekarskie i akt zgonu, dokumenty uprawniające rodzinę (akt małżeństwa/urodzenia, PEL) [S2][S3]; postanowienie prokuratury; wynik badania trzeźwości lub adnotacja o odmowie badania [S1 art. 21 ust. 2–3] |

### Jakie dane zawiera każdy dokument — wzorzec pod OCR i sztuczne skany
Podstawa katalogu: [S2][S3][S4]; szczegółowy układ pól dokumentów wtórnych (szpital, policja, świadek, CEIDG) to robocza specyfikacja dla generatora `(założenie)`:
- **EWYP (skan / PDF)**: wszystkie sekcje z tabeli w sekcji 1 [S3].
- **Zapis wyjaśnień poszkodowanego**: dane poszkodowanego, data/godzina/miejsce zdarzenia, szczegółowy opis czynności przed i w trakcie wypadku, mechanizm i przyczyna, uraz, pierwsza pomoc, świadkowie, data i podpis [S4 §3 ust.1 pkt 3] `(założenie układu)`.
- **Karta informacyjna ze szpitala / SOR**: nazwa placówki, data i godzina przyjęcia/wypisu, dane pacjenta (imię, nazwisko, PESEL), wywiad / mechanizm urazu, rozpoznanie (słowne + kod ICD-10, dokładne umiejscowienie urazu), wynik badania na alkohol (jeśli wykonano), zalecenia i ewentualne e-ZLA `(założenie układu)`.
- **Notatka urzędowa policji / mandat**: jednostka policji, data/godzina/miejsce zdarzenia, dane uczestników i pojazdów, krótki opis przebiegu i sprawcy, podstawa prawna wykroczenia (jeśli mandat), wynik badania alkomatem/krwi lub wzmianka o odmowie `(założenie układu)`.
- **Postanowienie prokuratury**: jednostka, sygnatura akt, data, sentencja (wszczęcie/zawieszenie/umorzenie), opis czynu i ustalenia dot. naruszenia przepisów BHP/ruchu drogowego `(założenie układu)`.
- **Oświadczenie świadka**: imię, nazwisko, adres zamieszkania (wymagane w karcie III.3 [S4]), relacja do poszkodowanego, data/godzina/miejsce, opis tego, co świadek widział bezpośrednio, data i podpis `(założenie układu)`.
- **Protokół oględzin miejsca / maszyny**: data, miejsce, opis stanowiska/podłoża/maszyny, stan techniczny i osłon ochronnych, zgodność z instrukcją/atestem [S4 §3 ust.1 pkt 2] `(założenie układu)`.
- **Dokumenty formalne i ZUS**: wpis CEIDG (NIP, REGON, PKD, adres, status aktywny/zawieszony); umowa/zlecenie/faktura (strony, data, adres wykonania usługi, zakres); notatka/wyciąg z systemu ZUS o podleganiu ubezpieczeniu wypadkowemu w dniu wypadku i saldzie składek (czy zadłużenie > 1% min. wynagrodzenia) [S1 art. 3 ust. 3, art. 6 ust. 2] `(założenie układu)`.

## 6. Reguły przypadków granicznych do etykietowania zbioru (dla Programisty)
Każdy przypadek w sztucznym zbiorze powinien mieć rozdzielone etykiety `(założenie)`:
- `kwalifikacja_zdarzenia`: `UZNAC` | `NIE_UZNAC` | `DO_UZUPELNIENIA` (gdy brak kluczowego dowodu do oceny przesłanki — generuje listę braków wg P6);
- `wylaczenia_swiadczen`: `BRAK` | `ART_21_1_RAZACE_NIEDBALSTWO` | `ART_21_2_3_NIETRZEZWOSC` | `ART_6_2_ZADLUZENIE`.

| # | Przypadek graniczny | Kwalifikacja zdarzenia (karta III.4) | Wyłączenie świadczeń (karta III.5–6 / art. 6) | Podstawa i źródło |
|---|---|---|---|---|
| 1 | **Czynność prywatna w trakcie pracy / „przy okazji”** (np. zakupy prywatne, sprawa osobista w przerwie) | `NIE_UZNAC` — brak związku funkcjonalnego ze zwykłymi czynnościami działalności | n/d (odmowa uznania) | Art. 3 ust. 3 pkt 8 [S1]; SN `I UK 567/12` („nie przy okazji innych czynności”) [S9] |
| 2a | **Dojazd do klienta / wyjazd po materiały** (działalność mobilna, bezpośredni cel biznesowy, umowa/zlecenie) | `UZNAC` — dojazd do kontrahenta lub po narzędzia/materiały ściśle pod zlecenie należy do zwykłych czynności | `BRAK` (o ile nie zachodzą art. 21/6) | Art. 3 ust. 3 pkt 8 [S1]; SN `II UK 407/09` [S7]; SN `I UK 567/12` [S9] |
| 2b | **Zwykła droga dom ↔ stała siedziba / powrót do domu po pracy** | `NIE_UZNAC` — zdarzenie po zakończeniu czynności w drodze do domu nie jest wypadkiem przy działalności | n/d (co najwyżej wypadek w drodze) | Art. 3 ust. 3 pkt 8 [S1]; SN `I UK 55/09` [S8] |
| 3a | **Zasłabnięcie / choroba samoistna bez czynnika zewnętrznego** (wyłączna przyczyna wewnętrzna, brak urazu od środowiska pracy) | `NIE_UZNAC` — brak przesłanki przyczyny zewnętrznej | n/d | Art. 3 ust. 1 [S1] |
| 3b | **Zasłabnięcie / choroba samoistna + czynnik zewnętrzny środowiska pracy** (np. atak choroby powoduje upadek z rusztowania / uderzenie o maszynę) | `UZNAC` — czynnik zewnętrzny pracy jest współprzyczyną bezpośredniego urazu | `BRAK` | Art. 3 ust. 1 [S1]; SN `I UK 505/12` [S12] |
| 4a | **Własny błąd / zwykła nieuwaga** (brak winy umyślnej/rażącego niedbalstwa lub istnieją też inne przyczyny) | `UZNAC` | `BRAK` (pole III.5 puste) | Art. 21 ust. 1 [S1]; SN `I UK 69/12` [S10] |
| 4b | **Udowodnione naruszenie przepisów BHP umyślnie lub rażącym niedbalstwem jako wyłączna przyczyna** | `UZNAC` (jeśli spełnione przesłanki art. 3) | `ART_21_1_RAZACE_NIEDBALSTWO` — wpisać dowody w karcie III.5 | Art. 21 ust. 1 [S1]; wzór karty III.5 [S4]; SN `I UK 69/12` [S10] |
| 5a | **Alkohol / środki odurzające + znaczne przyczynienie się** LUB **nieusprawiedliwiona odmowa badania** | `UZNAC` (jeśli wykonywał pracę i zaszła przyczyna zewnętrzna) | `ART_21_2_3_NIETRZEZWOSC` — wpisać dowody / odmowę badania w III.6 *(uwaga: przy śmierci rodzina nie traci świadczeń)* | Art. 21 ust. 2–3 [S1]; wzór karty III.6 [S4]; SN `I UK 46/11` [S11] |
| 5b | **Nietrzeźwość bez znacznego przyczynienia się** (np. zawiniła wyłącznie osoba trzecia / wada stanowiska) | `UZNAC` | `BRAK` (ciężar dowodu przyczynienia po stronie ZUS) | Art. 21 ust. 2 [S1]; SN `I UK 46/11` [S11] |
| 5c | **Nietrzeźwość zrywająca faktyczne wykonywanie działalności** (poszkodowany nie świadczył pracy) | `NIE_UZNAC` — brak przesłanki wykonywania zwykłych czynności | n/d | `(założenie z wykładni art. 3 ust. 3 pkt 8 [S1])` |
| 6a | **Brak objęcia ubezpieczeniem wypadkowym w dniu wypadku** (np. działalność zawieszona, ulga na start) | `NIE_UZNAC` — brak przesłanki „w okresie ubezpieczenia wypadkowego” | n/d | Art. 3 ust. 3 pkt 8, art. 2 pkt 3 [S1] |
| 6b | **Krótki okres podlegania ubezpieczeniu (np. 1. tydzień działalności)** | `UZNAC` — brak okresu wyczekiwania w ubezpieczeniu wypadkowym | `BRAK` | Art. 8 ust. 1 [S1] |
| 7 | **Zadłużenie składek w dniu wypadku > 1% minimalnego wynagrodzenia** | `UZNAC` (jeśli spełnione przesłanki art. 3) | `ART_6_2_ZADLUZENIE` — wstrzymanie świadczeń do spłaty (przedawnienie po 6 mies. od wypadku) | Art. 6 ust. 2–3 [S1] |

## 7. Terminy i obieg
1. Poszkodowany (lub pełnomocnik) zawiadamia właściwą terenową jednostkę ZUS (wg siedziby działalności) **niezwłocznie** po zdarzeniu — liczby dni przepisy nie określają [S2][S4 §2].
2. Złożenie EWYP: osobiście/przez pełnomocnika (pisemnie lub ustnie do protokołu), pocztą, przez konsulat; możliwy odbiór odpowiedzi przez PUE [S2][S3].
3. ZUS ustala okoliczności (zabezpieczenie miejsca, oględziny, wysłuchanie poszkodowanego, informacje od świadków, inne dowody) [S4 §3 ust.1].
4. **Karta wypadku w terminie 14 dni od dnia uzyskania zawiadomienia** [S4 §4 ust.1]; przeszkody uniemożliwiające dotrzymanie terminu wpisuje się w pkt IV.3 karty [S4].
5. Pouczenie o prawie do uwag/zastrzeżeń [S4 §4 ust.2]; 3 egzemplarze karty (poszkodowany, podmiot ustalający, ZUS przy uznaniu) [S4 §4 ust.4].
6. Po uznaniu — wypłata świadczeń dla przedsiębiorców w ciągu 30 dni od wyjaśnienia ostatniej okoliczności (nie później niż 60 dni od spłaty ewentualnego zadłużenia) [S1 art. 6 ust. 4]; decyzja o jednorazowym odszkodowaniu w ciągu 14 dni od orzeczenia lekarza orzecznika/wyjaśnienia ostatniej okoliczności, wypłata w 30 dni [S1 art. 15 ust. 2–3].
Kontakt ZUS: 22 560 16 00 [S2].

## 8. Ochrona danych osobowych (RODO) i wnioski wdrożeniowe
- **Dane szczególnej kategorii**: zgłoszenie, wyjaśnienia i załączniki (karta SOR, rozpoznania, badania trzeźwości) zawierają **dane dotyczące zdrowia** — ich przetwarzanie jest co do zasady zakazane na mocy **art. 9 ust. 1 RODO**, o ile nie zachodzi wyjątek z art. 9 ust. 2 [S13].
- **Podstawa prawna przetwarzania w ZUS**: **art. 6 ust. 1 lit. c RODO** (wypełnienie obowiązku prawnego administratora) w powiązaniu z **art. 9 ust. 2 lit. b RODO** (wypełnienie obowiązków w dziedzinie zabezpieczenia społecznego i ochrony socjalnej; pomocniczo lit. g — ważny interes publiczny) oraz przepisami krajowymi: ustawą o systemie ubezpieczeń społecznych (t.j. Dz.U. 2026 poz. 1474, art. 68 — zadania ZUS) [S14] i ustawą wypadkową (t.j. Dz.U. 2025 poz. 1644, art. 5 ust. 1 pkt 8) [S1]. Przetwarzanie ustawowe nie wymaga zgody poszkodowanego [S13].
- **Kluczowe ograniczenia RODO dla projektu**:
  - **Art. 22 RODO**: ograniczenie decyzji wywołujących skutki prawne opartych wyłącznie na zautomatyzowanym przetwarzaniu → w ZANT system wyłącznie rekomenduje i przygotowuje projekt karty, a **decyzję podejmuje pracownik ZUS** (zgodne z zadaniem §3 i P6) [S13].
  - **Art. 28 i rozdział V (art. 44–49) RODO**: wysyłanie skanów i opisów urazów do zewnętrznego API LLM wymagałoby umowy powierzenia przetwarzania danych wrażliwych, oceny ryzyka transferu poza EOG oraz zgody IOD [S13].
  - **Art. 32 i art. 35 RODO**: przetwarzanie danych o zdrowiu na dużą skalę z użyciem nowych technologii wymaga odpowiednich zabezpieczeń technicznych/rozliczalności (art. 32) oraz uprzedniej **oceny skutków dla ochrony danych — DPIA** (art. 35) [S13].
- **Wnioski dla architektury (P2) i czasu wdrożenia (zadanie §5)** `(założenie projektowe)`:
  - **Wariant lokalny bez zewnętrznego modelu** (OCR na własnym sprzęcie + baza podobnych spraw + reguły z przepisów) eliminuje wypływ danych osobowych i medycznych poza infrastrukturę ZUS — brak powierzenia zewnętrznemu dostawcy LLM i brak transferu poza EOG.
  - **Wpływ na czas wdrożenia w prezentacji (§5)**: oprócz integracji technicznej (PUE/eZUS, testy OCR na realnych skanach ZUS) harmonogram wdrożenia w ZUS musi uwzględniać ścieżkę formalną — DPIA (art. 35 RODO), audyt bezpieczeństwa i akceptację IOD, kontrolę uprawnień i logowanie dostępu (art. 32) oraz pilotaż z pracownikami (weryfikacja jakości przed produkcją).

## 9. Niepewne / nadal nieustalone
- Brak rzeczywistego zbioru ZUS (skanów i kart) — sekcje 5–6 opisują wzorzec do wygenerowania sztucznego zbioru; jakość OCR i skuteczność na realnych dokumentach ZUS nie zostały zmierzone.
- Walidacja pól elektronicznego formularza EWYP w PUE/eZUS (poza oznaczeniem pól dobrowolnych jak telefon w PDF [S3]) — nie wpływa na asystenta, który nie blokuje wysyłki (zadanie §3, P5).
- Brak publicznych statystyk ZUS dotyczących najczęstszych powodów odmów w praktyce — reguły opierają się na ustawie [S1] i przeczytanym orzecznictwie SN [S7–S12].
- Kwoty progowe zmienne rocznie (1% minimalnego wynagrodzenia z art. 6 ust. 2; 20% przeciętnego wynagrodzenia z art. 12 ust. 1 ogłaszane w Monitorze Polskim) — w regułach trzymamy stawki procentowe z ustawy, bez wpisywania twardych kwot PLN bez bieżącego obwieszczenia.

## Źródła (14)
- [S1] Ustawa z 30.10.2002 o ubezpieczeniu społecznym z tytułu wypadków przy pracy i chorób zawodowych, tekst jednolity Dz.U. 2025 poz. 1644 (ELI Sejmu, status: obowiązujący) — https://api.sejm.gov.pl/eli/acts/DU/2025/1644/text.pdf (art. 2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 21, 22)
- [S2] ZUS, Sporządzanie karty wypadku zaistniałego podczas wykonywania zwykłych czynności związanych z prowadzeniem działalności pozarolniczej — https://www.zus.pl/sporzadzanie-karty-wypadku-zaistnialego-podczas-wykonywania-zwyklych-czynnosci-zwiazanych-z-prowadzeniem-dzialalnosci-pozarolniczej ; https://www.zus.pl/karta-wypadku
- [S3] ZUS, formularz EWYP „Zawiadomienie o wypadku” (6 stron, PDF zweryfikowany przez Pawła w `docs/zadania/01-pdf-ewyp-karta.md`, gałąź `pawel/01-pdf-ewyp-karta`) — https://www.zus.pl/documents/10182/0/EWYP_pobierz+i+wydrukuj.pdf/40827c23-cd6c-a701-4cf3-4dc2a8f7db7d?t=1779348307345 ; lista: https://www.zus.pl/wzory-formularzy/emerytury-renty/ustalanie-okolicznosci-i-przyczyn-wypadku-przez-zus
- [S4] Rozporządzenie MRiPS z 23.01.2022 w sprawie trybu uznawania zdarzenia powstałego w okresie ubezpieczenia wypadkowego za wypadek przy pracy, kwalifikacji prawnej zdarzenia, wzoru karty wypadku i terminu jej sporządzenia (Dz.U. 2022 poz. 223, ELI Sejmu, status: obowiązujący od 1.02.2022; treść i załącznik — wzór karty) — https://api.sejm.gov.pl/eli/acts/DU/2022/223/text.pdf
- [S5] Poradnik Przedsiębiorcy, Zawiadomienie o wypadku przy pracy przedsiębiorcy — https://poradnikprzedsiebiorcy.pl/-zawiadomienie-o-wypadku-przy-pracy-przedsiebiorcy-wzor-z-omowieniem
- [S6] Rozporządzenie MPiPS z 19.12.2002 (t.j. Dz.U. 2013 poz. 1618, ELI Sejmu, status: uznany za uchylony 1.02.2022 — użyte do porównania zmian wzoru karty) — https://api.sejm.gov.pl/eli/acts/DU/2013/1618/text.pdf
- [S7] Wyrok Sądu Najwyższego z 8.06.2010, II UK 407/09 (przeczytany w SAOS — dojazd do kontrahenta w celu wykonania umowy) — https://www.saos.org.pl/judgments/92419
- [S8] Wyrok Sądu Najwyższego z 24.07.2009, I UK 55/09 (przeczytany w SAOS — droga powrotna do domu po zakończeniu działalności) — https://www.saos.org.pl/judgments/90642
- [S9] Wyrok Sądu Najwyższego z 12.03.2013, I UK 567/12 (przeczytany w SAOS — zakup materiałów/narzędzi vs czynność „przy okazji” spraw prywatnych) — https://www.saos.org.pl/judgments/101037
- [S10] Wyrok Sądu Najwyższego z 18.07.2012, I UK 69/12 (przeczytany w SAOS — art. 21 ust. 1: wyłączna przyczyna, rażące niedbalstwo, ciężar dowodu ZUS) — https://www.saos.org.pl/judgments/98646
- [S11] Wyrok Sądu Najwyższego z 13.07.2011, I UK 46/11 (przeczytany w SAOS — art. 21 ust. 2: nietrzeźwość a znaczne przyczynienie się i świadczenia dla rodziny) — https://www.saos.org.pl/judgments/95431
- [S12] Wyrok Sądu Najwyższego z 4.03.2013, I UK 505/12 (przeczytany w SAOS — choroba samoistna/zasłabnięcie + upadek z wysokości jako przyczyna zewnętrzna) — https://www.saos.org.pl/judgments/100939
- [S13] Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO) z 27.04.2016 — https://eur-lex.europa.eu/eli/reg/2016/679/oj/pol (art. 6 ust. 1 lit. c, art. 9 ust. 1 i 2 lit. b/g, art. 22, art. 28, art. 32, art. 35, art. 44–49)
- [S14] Ustawa z 13.10.1998 o systemie ubezpieczeń społecznych, tekst jednolity Dz.U. 2026 poz. 1474 (ELI Sejmu, status: obowiązujący) — https://api.sejm.gov.pl/eli/acts/DU/2026/1474 (art. 68 — zadania ZUS)
<!-- skill: brak (krok 0 — materiały po poprawce R1) -->
