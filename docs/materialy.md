# Materiały: wypadek przy pracy osoby prowadzącej pozarolniczą działalność (ZANT)

Stan: 18.11, krok 0. Wzorca ZUS nie dostaliśmy (zadanie §7), więc wszystko z publicznych źródeł. Każdy fakt ma odsyłacz [S#]; lista źródeł na końcu. **Czego nie udało się ustalić — sekcja 5.**

## 0. Dostępne w zadaniu (docs/zadanie.md)
- Dane: brak zbioru ZUS (PDF-y kart wypadków) — budujemy sztuczny (uwagi od ludzi). Zadanie obiecuje pakiet PDF-ów i „materiały o zasadach” — nie dotarły.
- Do zbudowania: (a) asystent zgłoszenia + wyjaśnień poszkodowanego, bez blokowania zgłoszenia, prosty język; (b) wsparcie decyzji dla pracownika ZUS: rekomendacja uznać/nie uznać + projekt karty wypadku; test na ≥5 wgranych przypadkach.
- Brak: wzoru wyjaśnień poszkodowanego, wzoru karty (pola), kryteriów oceny, API partnera.

## 1. Zgłoszenie i wyjaśnienia poszkodowanego
Zgłoszenie = formularz **EWYP „Zawiadomienie o wypadku”** (jedyny formularz na liście ZUS „Ustalanie okoliczności i przyczyn wypadku przez ZUS”; wersja z 21.05.2026) [S2][S3]. **Osobnego formularza „wyjaśnienia poszkodowanego” ZUS nie publikuje** — jest to *zapis wyjaśnień* (protokół, ustnie lub pisemnie), dołączany do karty [S2][S4]; poszkodowany jest wysłuchany, „jeżeli stan zdrowia na to pozwala” [S4 §3 ust.1 pkt 3].

Pola zawiadomienia (wg opisu poradnika [S5]; same pola PDF-u EWYP nieodczytywalne maszynowo — patrz 5). **Które pola są obowiązkowe — źródła nie mówią**; poniżej „rola” to nasza propozycja, nie wiedza ZUS:

| # | Pole (prostym językiem) | Rola dla asystenta |
|---|---|---|
| 1 | PESEL, imię, nazwisko, data i miejsce urodzenia poszkodowanego | wymagane (tożsamość) [S5] |
| 2 | Adres zamieszkania; adres do korespondencji, jeśli inny | wymagane / opcjonalne [S5] |
| 3 | Adres prowadzenia działalności (u niań: miejsce opieki nad dzieckiem do 3 lat) | wymagane — od niego zależy właściwy oddział ZUS [S2] |
| 4 | Kto wypełnia, jeśli nie poszkodowany (np. pełnomocnik) + jego adresy | warunkowe [S5] |
| 5 | Data, godzina i miejsce wypadku | wymagane (zadanie: „miejsce i czas”) |
| 6 | Planowana godzina rozpoczęcia i zakończenia pracy w dniu wypadku | wskazane (pomaga ocenić związek z działalnością) [S5] |
| 7 | Rodzaj urazu | wymagane (przesłanka „uraz”) [S5] |
| 8 | Opis okoliczności, miejsca i przyczyn (co robił, jak doszło, co było przyczyną) | wymagane, tu asystent pomaga najbardziej (zadanie §3) [S5] |
| 9 | Pierwsza pomoc medyczna — kto i gdzie udzielił | wskazane [S5] |
| 10 | Czy sprawę prowadzi policja/prokuratura | wskazane [S5] |
| 11 | Jeśli maszyna: sprawna? używana zgodnie z zasadami producenta? atesty/deklaracje zgodności? w ewidencji środków trwałych? | warunkowe [S5] |
| 12 | Świadkowie: imiona, nazwiska, adresy | wskazane [S5] |
| 13 | Wykaz załączników | patrz niżej [S5] |

**Załączniki** [S2][S5]: kopia wpisu CEIDG; licencja/koncesja (jeśli wymagana); karta informacyjna ze szpitala lub dokument o pierwszej pomocy; notatka policji drogowej (wypadek komunikacyjny); postanowienie prokuratury o wszczęciu/zawieszeniu/umorzeniu (jeśli było); przy śmierci: karta zgonu lub zaświadczenie lekarskie i akt zgonu; dokumenty uprawniające do odbioru karty przez inną osobę (akt urodzenia/małżeństwa, pełnomocnictwo PEL); zaświadczenie o statusie marynarza; dokument o szkoleniu BHP (jeśli było); zapis wyjaśnień poszkodowanego; informacje od świadka/rodziny; inne (umowa, faktura, rachunek) [S2].

**Zasada dla asystenta** (z zadania §3, nie z ZUS): brak pola nie blokuje wysłania — asystent podpowiada uzupełnienie.

## 2. Wypadek przy pracy osoby prowadzącej działalność — przesłanki i odmowa
- **Definicja (art. 3 ust. 1)**: „nagłe zdarzenie wywołane przyczyną zewnętrzną” powodujące uraz lub śmierć [S1]. Przesłanki: (1) **nagłość**, (2) **przyczyna zewnętrzna**, (3) **uraz lub śmierć**.
- **Związek z działalnością (art. 3 ust. 3 pkt 8)**: zdarzenie podczas „wykonywania zwykłych czynności związanych z prowadzeniem działalności pozarolniczej” w okresie ubezpieczenia wypadkowego; analogicznie pkt 9 dla osób współpracujących [S1]. Przesłanka (4) **związek z działalnością** + (5) **okres ubezpieczenia wypadkowego** (opłacane składki/ubezpieczenie z tego tytułu) [S1].
- **Powody odmowy (świadczeń) z ustawy** [S1]:
  - art. 21 ust. 1: **wyłączną przyczyną** wypadku było naruszenie przepisów o ochronie życia i zdrowia, spowodowane **umyślnie lub rażącym niedbalstwem** (wymóg „wyłącznej” przyczyny);
  - art. 21 ust. 2: **nietrzeźwość lub środki odurzające**, jeśli ubezpieczony **przyczynił się w znacznym stopniu**; art. 21 ust. 3: odmowa badania = utrata świadczeń;
  - art. 6 ust. 2: **zadłużenie z tytułu składek > 2,00 zł** w dniu wypadku (dotyczy świadczeń, nie uznania zdarzenia);
  - art. 22 ust. 1 pkt 1: brak karty wypadku/protokołu.
- **Odmowa uznania zdarzenia** (brak którejś przesłanki, np. zdarzenie poza „zwykłymi czynnościami” działalności, przyczyna wewnętrzna jak zasłabnięcie bez czynnika zewnętrznego, brak urazu) musi być **uzasadniona z podaniem dowodów** [S4 §3 ust.3]. Katalogu „typowych odmów” z praktyki ZUS w źródłach nie ma — wnioski z kart wypadków będą dopiero z naszego zbioru (sztucznego).
- **Rozróżnienie do ujęcia w modelu**: *uznanie zdarzenia* (karta wypadku) ≠ *wyłączenie świadczeń* (art. 21, 6) — oba wpływają na „odmowę” z punktu widzenia obywatela.
- **Świadczenia po uznaniu**: zasiłek chorobowy od pierwszego dnia niezdolności; jednorazowe odszkodowanie za stały/długotrwały uszczerbek (ocena po zakończeniu leczenia; 20% przeciętnego wynagrodzenia za 1% uszczerbku) [S1 art. 6, 8, 11, 12].

## 3. Karta wypadku
- Dla przedsiębiorców kartę sporządza **ZUS** (art. 5 ust. 1 pkt 8) [S1]; właściwy oddział wg siedziby działalności [S2].
- Treść: tryb uznawania, kwalifikacja prawna, wzór karty i termin — rozporządzenie MPiPS z 19.12.2002 (tekst jedn. obwieszczenie z 9.07.2013) [S4]. **Pola wzoru z załącznika: nie odczytane** (PDF) — patrz 5.
- Wiadomo z § 3–4 rozporządzenia [S4]: karta zawiera ustalenie okoliczności i przyczyn oraz **kwalifikację prawną** (uznane / nieuznane za wypadek przy pracy, z uzasadnieniem i wskazaniem dowodów przy nieuznaniu); dołączane: zapis wyjaśnień poszkodowanego, informacje od świadków, dokumenty z oględzin, inne dowody, uwagi i zastrzeżenia poszkodowanego. 3 egzemplarze: poszkodowany/uprawniona osoba, organ ustalający, ZUS (przy uznaniu).
- **Robocza lista pól projektu karty (NASZE założenie, niezweryfikowane ze wzorem)**: dane poszkodowanego; dane działalności (NIP, REGON, adres, PKD); data/godzina/miejsce; rodzaj urazu; opis okoliczności; przyczyny; udzielenie pierwszej pomocy; świadkowie; czynności ustalające (oględziny, wyjaśnienia, świadkowie); kwalifikacja prawna z uzasadnieniem; pouczenie o prawie zastrzeżeń; data i podpis sporządzającego.
- Od karty **nie przysługuje odwołanie**; poszkodowany może wnieść zastrzeżenia do organu rentowego (pisemnie lub ustnie do protokołu) [S2][S4 §4 ust.2].

## 4. Terminy i obieg
1. Poszkodowany (lub pełnomocnik) zawiadamia ZUS **„niezwłocznie po zaistnieniu zdarzenia”** — liczby dni brak w źródłach [S2][S4 §2].
2. Złożenie: osobiście/pełnomocnik w dowolnej jednostce ZUS (pisemnie lub ustnie do protokołu), pocztą, przez konsulat [S2].
3. ZUS ustala okoliczności: zabezpieczenie miejsca, oględziny miejsca/maszyn/zabezpieczeń, wyjaśnienia poszkodowanego, informacje od świadków, inne dowody [S4 §3 ust.1].
4. **Karta w ciągu 14 dni od uzyskania zawiadomienia** [S4 §4 ust.1] (art. 5 ust.4 ustawy deleguje termin do rozporządzenia [S1]). Termin liczy się od zawiadomienia, więc brakujące dokumenty wydłużają sprawę w praktyce — to wniosek, nie źródło.
5. Poszkodowany może wnieść uwagi/zastrzeżenia; ZUS ma go o tym pouczyć [S4 §4 ust.2].
6. Po uznaniu — wnioski o świadczenia (zasiłek, odszkodowanie).
Kontakt ZUS: 22 560 16 00 [S2].

## 5. Niepewne / nieustalone
- **Pola EWYP w PDF** [S3]: pobrany PDF ma czcionki bez odczytywalnego tekstu; lista w sekcji 1 pochodzi z poradnika [S5] (data art. 07.01.2025, ZUS zaktualizował formularz 21.05.2026 — mogły wejść zmiany). Obowiązkowość pól — nieznana.
- **Pola wzoru karty (załącznik rozp.)** — nieodczytane; sekcja 3 „robocza lista” to nasze założenie. Do weryfikacji po otwarciu https://api.sejm.gov.pl/eli/acts/DU/2013/1618/text.pdf ręcznie.
- **Aktualność rozporządzenia**: ZUS na stronie [S2] podaje rozporządzenie „z 23 stycznia 2022” (prawdopodobnie inny/nowszy akt albo literówka) — nie potwierdziliśmy; ISAP blokuje automaty. Tekst [S4] to wersja z 2013 r.
- **Aktualność ustawy**: czytany tekst [S1] to wersja ze zmianami do 2002 r. w nagłówkach (nie tekst jednolity); art. 21/6 mogły być zmienione — sprawdzić w ISAP przed prezentacją. Zbieżność z cytatem SN [S6] dla art. 3 ust. 3 pkt 8: tak.
- Brak „typowych powodów odmowy” z praktyki ZUS i orzecznictwa — poza art. 21, 6, 3; orzecznictwo SN (np. [S6]) można dociągnąć.
- Brak wzoru wyjaśnień poszkodowanego: przyjmujemy, że to wolny opis + pytania asystenta (decyzja produktowa, nie źródło).
- Terminu zgłoszenia w dniach brak; progi kwot (przeciętne wynagrodzenie) zmienne rocznie — liczb nie wpisujemy.

## Źródła (6)
- [S1] Ustawa z 30.10.2002 o ubezpieczeniu społecznym z tytułu wypadków przy pracy i chorób zawodowych — https://api.sejm.gov.pl/eli/acts/DU/2002/1673/text.html (art. 3, 5, 6, 8, 11, 12, 21, 22)
- [S2] ZUS, Sporządzanie karty wypadku … działalności pozarolniczej — https://www.zus.pl/sporzadzanie-karty-wypadku-zaistnialego-podczas-wykonywania-zwyklych-czynnosci-zwiazanych-z-prowadzeniem-dzialalnosci-pozarolniczej ; ogólnie https://www.zus.pl/karta-wypadku
- [S3] ZUS, formularz EWYP (lista i PDF) — https://www.zus.pl/wzory-formularzy/emerytury-renty/ustalanie-okolicznosci-i-przyczyn-wypadku-przez-zus ; https://www.zus.pl/-/zawiadomienie-zus-er-zow-01 ; PDF https://www.zus.pl/documents/10182/0/EWYP_pobierz+i+wydrukuj.pdf/40827c23-cd6c-a701-4cf3-4dc2a8f7db7d?t=1779348307345
- [S4] Rozporządzenie MPiPS z 19.12.2002 (tekst jedn. obwieszczenie 9.07.2013, Dz.U. 2013 poz. 1618) — https://api.sejm.gov.pl/eli/acts/DU/2013/1618/text.html (§ 1–6; załącznik: …/text.pdf)
- [S5] Poradnik Przedsiębiorcy, Zawiadomienie o wypadku przy pracy przedsiębiorcy — https://poradnikprzedsiebiorcy.pl/-zawiadomienie-o-wypadku-przy-pracy-przedsiebiorcy-wzor-z-omowieniem
- [S6] SN, II USKP 91/23 (cytat art. 3 ust. 3 pkt 8, odmowa odszkodowania) — https://www.sn.pl/sites/orzecznictwo/Orzeczenia3/II%20USKP%2091-23.pdf (znane tylko z wyniku wyszukiwania; treści nie czytano)
<!-- skill: brak (krok 0 — materiały) -->
