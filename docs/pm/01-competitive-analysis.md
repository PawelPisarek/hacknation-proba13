# Analiza konkurencji i alternatyw: asystent zgłoszenia wypadku + wsparcie decyzji ZUS

**Data**: 2026-11-18 (wersja po recenzji R1) · **Analizowano**: 5 alternatyw bezpośrednich + 4 pośrednie · **Źródło**: wyszukiwanie w sieci (stan na dziś), `docs/zadanie.md`, ustalenia P1–P6 z `docs/decyzje.md`
**Kontekst (z zadania i ustaleń)**: aplikacja webowa z dwiema częściami — (1) asystent dla przedsiębiorcy po wypadku przy pracy (pierwszy kontakt, prosty język, wspiera, nie blokuje), (2) wsparcie decyzji dla pracownika ZUS (odczyt skanów, rekomendacja uznania lub nie, projekt karty wypadku). Ustalone z Arturem: w demo najpierw przedsiębiorca, pracownik ZUS to druga połowa tej samej historii (P3); problem poszkodowanego to brak wiedzy, co i jak opisać, plus lęk, że źle opisana przyczyna przekreśli uznanie wypadku, więc pisze ogólnikami typu „poślizgnąłem się” (P4); zysk poszkodowanego to kompletne zgłoszenie za pierwszym razem, prostym językiem, bez blokowania wysłania (P5); zysk pracownika ZUS to rekomendacja z uzasadnieniem, projekt karty i **lista braków w dokumentach sprawy** (P6). Ustalone z Pawłem (P2): **aplikacja działa bez zewnętrznego modelu** — odczyt skanów na lokalnej karcie (GTX 1050, 4 GB), rozstrzygnięcie z podobnych przypadków z bazy + reguł z przepisów. To wariant **domyślny**, nie opcja.
Zastosowanie analizy: wybór pomysłów w `/discover`. Perspektywa: pozycjonowanie i funkcje; cena nie dotyczy (konkurs). Oznaczenie **„nie znaleziono”** = nie znalazłem w publicznych źródłach; to nie dowód braku.

## Przegląd rynku
Dziś przedsiębiorca zgłasza wypadek formularzem EWYP (PDF z datą aktualizacji 21.05.2026) pocztą, w oddziale albo przez PUE, dokładając dokumenty i wyjaśnienia świadków. Pomoc to głównie poradniki, wzory i szkolenia; **nie znaleziono** narzędzia, które prowadzi człowieka przez opis okoliczności i przyczyn. Po stronie ZUS komunikat z 18.02.2026 mówi, że AI ma „wspomagać decyzje ludzkie, a nie podejmować je automatycznie”; chatboty i voiceboty są planem (umawianie wizyt, proste pytania z infolinii), pilotaże trwają, a **nie znaleziono** potwierdzenia, że w PUE/eZUS działa automatyczna klasyfikacja dokumentów lub asystent wypadkowy. Na rynku ubezpieczeń istnieją komercyjne narzędzia do przyjmowania szkód i odczytu dokumentów (opisy producentów, bez niezależnych pomiarów).

## Krajobraz
| Alternatywa | Rodzaj | Dla kogo | Pozycjonowanie | Mocna strona | Słaba strona |
|---|---|---|---|---|---|
| Formularz EWYP: PDF / oddział / poczta ([zus.pl](https://www.zus.pl/-/zawiadomienie-zus-er-zow-01)) | bezpośrednia | przedsiębiorca | oficjalny wzór zawiadomienia | jedyna droga formalna, znana | pusty formularz; nie podpowiada, co opisać; braki wychodzą w wezwaniu do uzupełnienia |
| PUE ZUS (zgłoszenie elektroniczne) | bezpośrednia | przedsiębiorca z profilem | załatwianie spraw online | bez papieru | ten sam formularz cyfrowo; wymaga profilu |
| Poradniki i wzory z omówieniem ([poradnikprzedsiebiorcy.pl](https://poradnikprzedsiebiorcy.pl/-zawiadomienie-o-wypadku-przy-pracy-przedsiebiorcy-wzor-z-omowieniem)) | bezpośrednia | przedsiębiorca | wyjaśnienie krok po kroku | darmowe, po ludzku; opisują zasady i przesłanki jako tekst | statyczne; nie sprawdzają zgłoszenia; źródła różnią się w podstawach prawnych |
| Szkolenie online ZUS o zawiadomieniu o wypadku ([zus.pl](https://www.zus.pl/-/szkolenie-online-zawiadomienie-o-wypadku-definicja-wypadku-i-dokumentowanie-wypadku-dla-prowadz%C4%85cych-dzia%C5%82alno%C5%9B%C4%87-gospodarcz%C4%85?delta=40)) | bezpośrednia | przedsiębiorca | edukacja o definicji wypadku | oficjalne, wiarygodne | nauka z wyprzedzeniem, nie pomoc po wypadku |
| Księgowy / biuro rachunkowe / infolinia ZUS | bezpośrednia | przedsiębiorca | człowiek pomaga wypełnić | zna realia | koszt, czas, zależność od osoby; poszkodowany jest po urazie |
| Systemy ubezpieczeniowe do przyjmowania szkód i odczytu dokumentów (Indico Data, omni:us, Nomad Data, FurtherAI; dane od producentów) | pośrednia | ubezpieczyciele | automatyzacja przyjęcia i triage | odczyt dokumentów, ścieżka audytu, nadzór człowieka | nie znaleziono wersji dla polskiego EWYP i karty wypadku; oferty komercyjne w chmurze, więc sprzeczne z zasadą „bez zewnętrznego modelu” |
| Usługi odczytu dokumentów w chmurze (Azure AI Document Intelligence, Google Document AI) | pośrednia | programiści | odczyt pól ze skanów | elementy do budowy | dane trafiają do chmury; sam odczyt, bez reguł wypadkowych i rekomendacji |
| Ogólny czat z AI (np. ChatGPT) | pośrednia | każdy | rozmowa | dostępny od ręki | w chmurze; nie zna wzoru ZUS; nie sprawdza kompletności; brak ochrony danych |
| Własne systemy AI w ZUS (pilotaże, [komunikat 18.02.2026](https://www.zus.pl/-/informacja-na-temat-system%C3%B3w-z-elementami-ai-w-zus)) | pośrednia / przyszła | pracownicy ZUS | wspomaganie decyzji człowieka | dane i zaufanie po stronie ZUS | nie znaleziono opisu asystenta wypadkowego |

## Macierz funkcji (✔ potwierdzone w źródle · ◐ częściowo · n.z. = nie znaleziono · n/d = nie dotyczy · ⚙ nasze założenie do zbudowania i pokazania na teście)
| Zdolność | Nasz produkt | EWYP/PUE | Poradniki | Systemy ubezpieczeniowe | Chmura (odczyt) / czat AI |
|---|---|---|---|---|---|
| Prosty język, rozmowa | ⚙ | n.z. | ◐ | ◐ | ✔ czat |
| **Kompletność pól** wg wzoru ZUS (lista braków) | ⚙ | n.z. | ◐ (lista w tekście) | n.z. dla wzoru ZUS | n.z. |
| **Dopytywanie o okoliczności i przyczynę** (konkret zamiast „poślizgnąłem się”) | ⚙ | n.z. | n.z. | n.z. | ◐ czat (ogólnie, bez wzoru ZUS) |
| Wysłanie mimo braków | ⚙ | ◐ (można złożyć, braki wychodzą później) | n/d | n.z. | n/d |
| Odczyt skanów | ⚙ lokalnie (GTX 1050, 4 GB — do potwierdzenia przez Programistę) | n.z. | n/d | ✔ (deklaracja producentów) | ✔ chmura (Azure/Google, wymaga wysłania danych poza ZUS) |
| Baza reguł (definicja wypadku, przesłanki uznania) | ⚙ | n.z. | ◐ (opis tekstem, bez maszynowej oceny) | ◐ reguły szkód ubezpieczeniowych, nie wypadkowych (deklaracja) | n.z. |
| Rekomendacja = podobne sprawy z bazy + reguły z przepisów, z uzasadnieniem | ⚙ | n.z. | n.z. | ◐ scoring i triage (deklaracja) | n.z. |
| Projekt karty wypadku | ⚙ | n.z. | n.z. | n.z. | n.z. |
| **Lista braków w dokumentach sprawy dla pracownika ZUS** (np. brak dokumentacji medycznej, świadków; o co dopytać) | ⚙ | n.z. | n.z. | ◐ wykrywanie niekompletnych zgłoszeń (deklaracja) | n.z. |
| Decyzja zostaje u człowieka | ⚙ | n/d | n/d | ✔ (deklaracja) | n/d |
| Praca bez wysyłania danych poza ZUS | ⚙ domyślnie | ✔ (system ZUS) | ✔ | n.z. (chmura) | ✘ chmura |
| Dwie strony w jednej aplikacji (obywatel + urzędnik) | ⚙ | n.z. | n.z. | n.z. | n.z. |

## Alternatywy wobec punktów 5–6 zadania
| Wymóg z zadania | EWYP/PUE | Poradniki | Systemy ubezpieczeniowe | Chmura / czat AI | Nasze podejście (⚙) |
|---|---|---|---|---|---|
| Test na min. 5 wgranych przypadkach, liczba trafnych rekomendacji | n.z. (brak rekomendacji) | n.z. | n.z. publicznych wyników na przypadkach ZUS; wyniki producentów to deklaracje | n.z. | wgranie ≥ 5 sztucznych zgłoszeń w przeglądarce; wynik = liczba zgodnych z rozstrzygnięciem wzorcowym |
| Czas wdrożenia i spodziewane problemy | działa dziś | działa dziś | n.z. czasów dla ZUS; typowo integracja z systemem urzędu i uczenie na własnych danych | gotowe od ręki, lecz sprzeczne z ochroną danych | czas i problemy do opisania w prezentacji (dane prawdziwe, integracja z systemami ZUS, jakość skanów, utrzymanie reguł po zmianach przepisów) |
| Ochrona danych osobowych | ✔ system ZUS | ✔ | n.z. (chmura) | ✘ dane medyczne i okoliczności wypadku wychodzą poza ZUS | **wniosek**: wariant lokalny (bez zewnętrznego modelu) jest jedynym zgodnym z zasadą ścisłej ochrony; to przewaga nad chmurą |

## Mapa pozycjonowania
Oś pionowa: kto korzysta (obywatel ↔ urzędnik); pozioma: poziom pomocy (formularz/tekst ↔ aktywny asystent).
- Obywatel × tekst: EWYP, PUE, poradniki, szkolenie.
- Obywatel × asystent: czat AI (w chmurze, bez wzoru ZUS) — **nasz asystent zgłoszenia**.
- Urzędnik × asystent: systemy ubezpieczeniowe i plany ZUS — **nasze wsparcie decyzji**.
- Urzędnik × tekst: ręczna praca na skanach.
Nie znaleziono rozwiązania łączącego obie strony na tych samych danych.

## Możliwości wyróżnienia
1. **Zgłoszenie kompletne za pierwszym razem** — braki wskazane według wzoru, zanim zgłoszenie dotrze do ZUS (dziś wychodzą w wezwaniu do uzupełnienia).
2. **Dopytywanie o okoliczności i przyczynę** — potwierdzony problem (P4): poszkodowany nie wie, co opisać, i boi się złego opisu przyczyny, więc pisze ogólnikami. Asystent zadaje konkretne pytania („co robiłeś chwilę przed?”) i uspokaja: opis nie jest egzaminem. Nie znaleziono alternatywy, która to robi dla wzoru ZUS.
3. **Nie blokuje** — sugeruje korektę, nie odmawia (zadanie, P5).
4. **Rekomendacja = podobne sprawy z bazy + reguły z przepisów** (definicja wypadku, przesłanki uznania, wzmocnione uzasadnieniem i cytatem z dokumentu), z projektem karty. Sprawdzenie baz reguł u alternatyw: poradniki opisują zasady tekstem, systemy ubezpieczeniowe mają reguły szkód ubezpieczeniowych, **nie znaleziono** gotowej bazy reguł wypadków przy pracy przedsiębiorców. Reguły i przypadki są naszym materiałem (Analityk).
5. **Lista braków w dokumentach sprawy dla pracownika ZUS** (P6): brak dokumentacji medycznej, świadków, niespójne daty — z podpowiedzią, o co dopytać. Podobne „wykrywanie niekompletnych zgłoszeń” oferują systemy ubezpieczeniowe (deklaracja), nie dla wzorów ZUS.
6. **Domyślnie praca lokalna, dane nie wychodzą z ZUS** (P2): odczyt skanów na lokalnej karcie, rozstrzygnięcie z bazy i reguł, bez zewnętrznego modelu. Chmura (Azure, Google, czat AI) jest silniejsza w odczycie, ale łamie ochronę danych; nasze podejście jest słabsze w odczycie (4 GB), za to wdrażalne — kompromis do opisania w prezentacji.
7. **Jedna historia, dwie strony** — dane z asystenta przechodzą do wsparcia decyzji; pasuje do demo do 2 min.

## Zagrożenia
1. **ZUS buduje własne AI** — reakcja: nasze elementy gotowe do wpięcia, opis wdrożenia.
2. **Dojrzałe narzędzia ubezpieczeniowe** — reakcja: polski wzór, karta wypadku, reguły wypadkowe, dwie strony.
3. **Czat AI jako domyślny wybór obywatela** — reakcja: pokazać różnicę (kompletność wg wzoru, dopytywanie o przyczynę) i brak wysyłania danych do chmury.
4. **Lokalny odczyt na 4 GB może być słabszy niż chmura** (P2 — ustalone, nie opcja) — skutek: gorsze rozpoznawanie słabych skanów i mniej trafnych rekomendacji; reakcja: oparcie rozstrzygnięcia na bazie i regułach, pomiar liczby trafnych rekomendacji na ≥ 5 przypadkach, ręczna korekta pól przez pracownika, szczere opisanie granic.
5. **Błędna rekomendacja** — reakcja: uzasadnienie, fragmenty dokumentu, decyzja człowieka.

## Rekomendacje
- **Postawić na**: dopytywanie o okoliczności i przyczynę oraz kompletność (obywatel); rekomendację z bazy i reguł, projekt karty i listę braków w dokumentach sprawy (ZUS); pracę lokalną jako domyślną; spójne demo.
- **Dogonić (minimum)**: odczyt skanów i pól wzoru EWYP w ramach 4 GB, jasne wskazanie potrzebnych dokumentów (wyjaśnienia świadków, dokumentacja medyczna).
- **Zignorować**: konta, logowanie, integracje z PUE, ceny — poza zakresem konkursu.

## Ograniczenia tej analizy
Dane z wyszukiwania publicznego; opisy producentów ubezpieczeniowych to deklaracje, nie pomiary. „Nie znaleziono” znaczy brak wyników w wyszukiwaniu, nie dowód braku. Pozycje ⚙ to założenia o naszym produkcie, nie fakty; do potwierdzenia w makiecie i MVP (m.in. czy odczyt mieści się w 4 GB — Programista).

<!-- skill: przeplywy-pm -->
<!-- skill: competitor-analysis -->
