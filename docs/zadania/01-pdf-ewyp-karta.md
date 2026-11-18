# 01 — Paweł: sprawdź ręcznie dwa PDF-y (wzór zgłoszenia i karty wypadku)

**Cel:** potwierdzić pola zgłoszenia (EWYP) i karty wypadku, których boty nie odczytały automatycznie (PDF-y nieczytelne maszynowo, ISAP blokuje automaty). Od tego zależy lista pól asystenta i projekt karty.

**Linki:**
- załącznik do rozporządzenia o karcie wypadku: https://api.sejm.gov.pl/eli/acts/DU/2013/1618/text.pdf
- formularz EWYP na zus.pl (link w `docs/materialy.md`, sekcja źródeł)

**Po czym poznać, że gotowe:** w tym pliku, niżej, lista pól karty wypadku i lista pól EWYP (albo „zgodne z docs/materialy.md” / różnice), plus informacja, czy jest nowsza wersja rozporządzenia (ZUS podaje „z 23 stycznia 2022”). Napisz „gotowe” Szefowi.

**Czego nie ruszać:** `docs/materialy.md` (poprawi Analityk na podstawie Twoich uwag).

## Uwagi Pawła

**EWYP (ZUS, „Zawiadomienie o wypadku”, 6 stron; plik z linku w materialy.md otwiera się i czyta normalnie):**
- Dane poszkodowanego: PESEL, dokument tożsamości (rodzaj, seria, numer), imię, nazwisko, data i miejsce urodzenia, telefon (dobrowolny).
- Adresy poszkodowanego: zamieszkania; ostatniego zamieszkania w Polsce / pobytu; do korespondencji (także poste restante, skrytka, przegródka); miejsca prowadzenia działalności (+ telefon dobrowolny); miejsca opieki nad dzieckiem do lat 3 (niania).
- Osoba zawiadamiająca, jeśli to nie poszkodowany: PESEL lub dokument, imię, nazwisko, data urodzenia, telefon, te same trzy rodzaje adresów.
- Informacja o wypadku: 1) data i godzina; 2) miejsce; 3) planowana godzina rozpoczęcia i zakończenia pracy w dniu wypadku; 4) rodzaj urazów; 5) szczegółowy opis okoliczności, miejsca i przyczyn; 6) pierwsza pomoc TAK/NIE + nazwa i adres placówki; 7) organ prowadzący postępowanie (policja, prokuratura); 8) przy obsłudze maszyn/urządzeń TAK/NIE + czy sprawne i używane zgodnie z zasadami producenta; 9) atest / deklaracja zgodności TAK/NIE; 10) maszyna w ewidencji środków trwałych TAK/NIE.
- Świadkowie: do 3 — imię, nazwisko, adres.
- Załączniki (do zaznaczenia): karta informacyjna ze szpitala / pogotowia; postanowienie prokuratury; dokumenty zgonu; dokumenty uprawniające osobę inną niż poszkodowany; inne (np. umowa na usługę, faktura, notatka policji, mandat); lista dokumentów do dostarczenia później z terminem.
- Sposób odbioru odpowiedzi (placówka / poczta / PUE), oświadczenie, data, podpis.

**Karta wypadku (Dz.U. 2013 poz. 1618 — tekst jednolity rozporządzenia z 19.12.2002, załącznik; link Sejmu czyta się normalnie):**
- I. Płatnik składek: imię i nazwisko lub nazwa, adres siedziby, NIP, REGON, PESEL, dokument tożsamości.
- II. Poszkodowany: imię i nazwisko, PESEL, dokument tożsamości, data i miejsce urodzenia, adres, tytuł ubezpieczenia wypadkowego (pozycja z art. 3 ust. 3 ustawy wypadkowej).
- III. Wypadek: 1) data zgłoszenia i kto zgłosił; 2) okoliczności, przyczyny, czas i miejsce, rodzaj i umiejscowienie urazu; 3) świadkowie (imię, nazwisko, miejsce zamieszkania); 4) JEST / NIE JEST wypadkiem przy pracy z art. 3 ust. 3 pkt … (gdy nie — uzasadnienie i dowody); 5) wyłączna przyczyna: udowodnione naruszenie przepisów BHP przez poszkodowanego umyślnie lub przez rażące niedbalstwo (dowody); 6) nietrzeźwość / środki odurzające przyczyniły się w znacznym stopniu (dowody albo informacja o odmowie badania).
- IV. Pozostałe: zapoznanie poszkodowanego z kartą i pouczenie o uwagach; data sporządzenia, podmiot i sporządzający; przeszkody w terminie 14 dni; data odbioru; załączniki.

**Nowsza wersja rozporządzenia:** nie sprawdziłem — plik Sejmu to tekst jednolity z 2013. Wersję „z 23 stycznia 2022”, o której pisze ZUS, niech Analityk potwierdzi w źródle i porówna pola.
