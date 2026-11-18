# Analiza konkurencji i alternatyw: asystent zgłoszenia wypadku + wsparcie decyzji ZUS

**Data**: 2026-11-18 · **Analizowano**: 5 alternatyw bezpośrednich + 4 pośrednie · **Źródło**: wyszukiwanie w sieci (stan na dziś), zadanie z `docs/zadanie.md`
**Kontekst (z zadania, bez pytania Artura)**: produkt to aplikacja webowa z dwiema częściami — (1) asystent dla przedsiębiorcy po wypadku przy pracy (pierwszy kontakt, prosty język, wspiera, nie blokuje), (2) wsparcie decyzji dla pracownika ZUS (odczyt skanów, rekomendacja uznania lub nie, projekt karty wypadku). Zastosowanie analizy: ustalenie, w czym jesteśmy lepsi, i wybór pomysłów w `/discover`. Perspektywa: pozycjonowanie i funkcje; cena nie dotyczy (konkurs).

## Przegląd rynku
Dziś przedsiębiorca zgłasza wypadek formularzem EWYP (PDF publikowany przez ZUS, z datą aktualizacji 21.05.2026) pocztą, w oddziale albo przez PUE; do tego dokłada dokumenty i wyjaśnienia świadków. Pomoc to głównie poradniki, wzory i szkolenia — nikt nie prowadzi człowieka przez opis okoliczności. Po stronie ZUS komunikat z 18.02.2026 mówi o AI, które ma „wspomagać decyzje ludzkie, a nie podejmować je automatycznie”; chatboty i voiceboty są planem (umawianie wizyt, proste pytania z infolinii), pilotaże trwają, a **nie znalazłem potwierdzenia**, że w PUE/eZUS działa automatyczna klasyfikacja dokumentów ani asystent wypadkowy. Na rynku ubezpieczeń gotowe narzędzia do przyjmowania zgłoszeń szkód i odczytu dokumentów istnieją i dojrzały, ale to oferty komercyjne (deklaracje producentów).

## Krajobraz
| Alternatywa | Rodzaj | Dla kogo | Pozycjonowanie | Mocna strona | Słaba strona |
|---|---|---|---|---|---|
| Formularz EWYP w PDF / w oddziale / pocztą ([zus.pl](https://www.zus.pl/-/zawiadomienie-zus-er-zow-01)) | bezpośrednia | przedsiębiorca | oficjalny wzór zawiadomienia | jedyna droga formalna, znana | pusty formularz; nic nie podpowiada, co opisać; błędy wychodzą dopiero z wezwaniem do uzupełnienia |
| PUE ZUS (zgłoszenie elektroniczne) | bezpośrednia | przedsiębiorca z profilem | załatwianie spraw online | bez papieru, istniejące konto | ten sam formularz w wersji cyfrowej; wymaga profilu; „odświeżenie interfejsu” dopiero zapowiadane |
| Poradniki i wzory z omówieniem ([poradnikprzedsiebiorcy.pl](https://poradnikprzedsiebiorcy.pl/-zawiadomienie-o-wypadku-przy-pracy-przedsiebiorcy-wzor-z-omowieniem)) | bezpośrednia | przedsiębiorca | wyjaśnienie krok po kroku | darmowe, po ludzku | statyczny tekst, nie sprawdza zgłoszenia poszkodowanego; źródła różnią się w podstawach prawnych |
| Szkolenie online ZUS o zawiadomieniu o wypadku ([zus.pl](https://www.zus.pl/-/szkolenie-online-zawiadomienie-o-wypadku-definicja-wypadku-i-dokumentowanie-wypadku-dla-prowadz%C4%85cych-dzia%C5%82alno%C5%9B%C4%87-gospodarcz%C4%85?delta=40)) | bezpośrednia | przedsiębiorca | edukacja o definicji wypadku | oficjalne, wiarygodne | nauka przed wypadkiem, nie pomoc w trakcie; długie |
| Księgowy / biuro rachunkowe / infolinia ZUS | bezpośrednia | przedsiębiorca | człowiek pomaga wypełnić | zna realia | koszt, czas, zależność od jednej osoby; poszkodowany jest po urazie |
| Systemy ubezpieczeniowe do przyjmowania szkód i odczytu dokumentów (Indico Data, omni:us, Nomad Data, FurtherAI) — dane od producentów | pośrednia | ubezpieczyciele | automatyzacja przyjęcia i triage | dojrzały odczyt dokumentów, zapis decyzji, nadzór człowieka | nie znają polskiego wzoru EWYP ani karty wypadku; dane poza ZUS; komercyjne |
| Gotowe usługi odczytu dokumentów (Azure AI Document Intelligence, Google Document AI) | pośrednia | programiści | odczyt pól ze skanów | elementy do budowy | sam odczyt; brak reguł wypadkowych i rekomendacji |
| Ogólny czat z AI (np. ChatGPT) | pośrednia | każdy | rozmowa | dostępny od ręki | nie zna wzoru ZUS, nie sprawdza kompletności, brak ochrony danych |
| Własne systemy AI w ZUS (pilotaże, komunikat 18.02.2026) ([zus.pl](https://www.zus.pl/-/informacja-na-temat-system%C3%B3w-z-elementami-ai-w-zus)) | pośrednia / przyszła | pracownicy ZUS | wspomaganie decyzji człowieka | dane i zaufanie po stronie ZUS | wypadki powyżej opisanych planów nie są potwierdzone w źródłach |

## Macierz funkcji (✔ jest · ◐ częściowo · ✘ brak · ? niepotwierdzone)
| Zdolność | Nasz produkt | EWYP/PUE | Poradniki | Rozwiązania ubezpieczeniowe | Ogólny czat AI |
|---|---|---|---|---|---|
| Prowadzenie rozmową prostym językiem | ✔ | ✘ | ◐ | ◐ | ✔ |
| Wskazanie braków wg wzoru ZUS | ✔ | ✘ | ◐ (lista) | ◐ (cudze wzory) | ✘ |
| Pomoc w opisie okoliczności i przyczyn | ✔ | ✘ | ◐ | ✘ | ◐ |
| Wysłanie mimo braków (nie blokuje) | ✔ | ◐ | n/d | ? | n/d |
| Odczyt skanów dokumentacji | ✔ | ✘ | ✘ | ✔ | ◐ |
| Rekomendacja uznania z uzasadnieniem | ✔ | ✘ | ✘ | ◐ | ✘ |
| Projekt karty wypadku | ✔ | ✘ | ✘ | ✘ | ✘ |
| Decyzja zostaje u człowieka | ✔ | n/d | n/d | ✔ | n/d |
| Dwie strony w jednej aplikacji (obywatel + urzędnik) | ✔ | ✘ | ✘ | ✘ | ✘ |

## Mapa pozycjonowania
Oś pionowa: kto korzysta (obywatel ↔ urzędnik); oś pozioma: poziom pomocy (formularz/tekst ↔ aktywny asystent).
- Obywatel × tekst: EWYP, PUE, poradniki, szkolenie.
- Obywatel × asystent: ogólny czat AI (bez wzoru ZUS) — **nasz asystent zgłoszenia**.
- Urzędnik × asystent: rozwiązania ubezpieczeniowe i plany ZUS — **nasze wsparcie decyzji**.
- Urzędnik × tekst: ręczna praca na skanach.
Pusta kratka: jedno rozwiązanie łączące obie strony na tych samych danych.

## Możliwości wyróżnienia
1. **Zgłoszenie kompletne za pierwszym razem** — braki wskazane według wzoru, zanim zgłoszenie dotrze do ZUS; aktualnie braki wychodzą w wezwaniu do uzupełnienia. Trudne do skopiowania przez poradnik czy czat bez wzoru.
2. **Pomoc przy opisie okoliczności i przyczyn** — pytania uzupełniające zamiast pustego pola; to najtrudniejszy element dla poszkodowanego (hipoteza do potwierdzenia u Artura).
3. **Nie blokuje** — sugeruje, nie odmawia; zgodne z zadaniem i z podejściem „człowiek decyduje”.
4. **Rekomendacja z uzasadnieniem i projekt karty** — oparte na wiedzy z przypadków; nikt w analizie tego nie oferuje dla wypadków przy pracy przedsiębiorców.
5. **Jedna historia, dwie strony** — dane z asystenta przechodzą do wsparcia decyzji; dobrze wygląda w demo do 2 min.
6. **Wariant „dane nie wychodzą z ZUS”** — odpowiedź na ochronę danych osobowych wymaganą w zadaniu.

## Zagrożenia
1. **ZUS buduje własne AI** — pilotaże trwają; reakcja: pokazać, że nasze elementy są gotowe do wpięcia i opisać wdrożenie.
2. **Dojrzałe narzędzia ubezpieczeniowe** — reakcja: różnica w polskim wzorze, karcie wypadku i dwóch stronach.
3. **Ogólny czat AI jako domyślny wybór obywatela** — reakcja: pokazać różnicę (sprawdzenie braków wg wzoru).
4. **Ochrona danych osobowych** — blokuje wdrożenie, jeśli nie opisana; reakcja: wariant lokalny, sztuczne dane.
5. **Błędna rekomendacja** — reakcja: zawsze uzasadnienie, pokazane fragmenty dokumentu i decyzja człowieka.

## Rekomendacje
- **Postawić na**: kompletność zgłoszenia i pomoc w opisie (strona obywatela), rekomendację z uzasadnieniem i projekt karty (strona ZUS), spójne demo.
- **Dogonić (minimum)**: odczyt skanów i pól wzoru EWYP, jasne podpowiedzi o dokumentach (np. wyjaśnienia świadków, dokumenty wymienione w poradnikach).
- **Zignorować**: konta, logowanie, integracje z PUE, ceny — poza zakresem konkursu.

## Ograniczenia tej analizy
Dane z wyszukiwania publicznego; opisy producentów ubezpieczeniowych to deklaracje, nie niezależne pomiary. Nie znalazłem potwierdzenia, że ZUS ma dziś w PUE asystenta wypadkowego — to wniosek z braku wyników, nie dowód braku.

<!-- skill: przeplywy-pm -->
<!-- skill: competitor-analysis -->
