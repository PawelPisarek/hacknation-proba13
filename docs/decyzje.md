# Decyzje

10:45 Szef: start próby 13 — zadanie ZANT (ZUS), treść w docs/zadanie.md.
10:45 Szef: zbiór zgłoszeń i kart wypadków budujemy sami (sztuczny, kilkadziesiąt przypadków, część jako PDF/skan) — od ludzi.
10:45 Szef: wzorzec zgłoszenia i zasady karty wypadku — Analityk z publicznych źródeł, z odsyłaczami (krok 0).
10:45 Szef: aplikacja webowa, jeden adres z dwiema częściami: asystent dla obywatela i wsparcie decyzji dla pracownika ZUS — wprost z zadania.
10:45 Szef: wgrywanie dokumentów testowych (min. 5 przypadków) przez przeglądarkę, bez instalowania czegokolwiek — wprost z zadania.
P1 10:45 Paweł: kto jest kim — jaki podpis urządzenia ma Twoja i Artura wiadomość (np. „Opera on Mac”), czy jest ktoś trzeci? — czeka
P2 10:45 Paweł: odczyt skanów i ocena zgłoszeń — model przez API (np. Claude) czy lokalny na OMEN (GTX 1050, 4 GB)? Rekomendacja: API do odczytu i rozstrzygnięcia, bo 4 GB nie uniesie dobrego modelu do polskiego tekstu; dane sztuczne, więc bez ryzyka danych osobowych; lokalny tylko jako wariant „dane nie wychodzą z ZUS” w prezentacji — czeka
P3 10:46 Artur: Kogo pokazujemy w demo jako pierwszego — poszkodowanego przedsiębiorcę czy pracownika ZUS? Rekomendacja: przedsiębiorcę (zadanie stawia go na pierwszym miejscu, a pracownika pokazujemy jako drugą połowę tej samej historii) — czeka
P4 10:46 Artur: Co jest dla poszkodowanego przedsiębiorcy największym problemem przy zgłaszaniu wypadku? Rekomendacja: nie wie, co i jak opisać (okoliczności, przyczyna), więc zgłoszenie wraca do poprawy — czeka
P5 10:46 Artur: Co ma zyskać poszkodowany dzięki asystentowi? Rekomendacja: kompletne zgłoszenie za pierwszym razem, napisane prostym językiem, bez blokowania wysłania — czeka
P6 10:46 Artur: Co ma zyskać pracownik ZUS? Rekomendacja: gotową rekomendację z uzasadnieniem i projekt karty wypadku do poprawy; decyzję zawsze podejmuje człowiek — czeka
P1 10:47 odpowiedź: w rozmowie z Szefem (bez podpisu) pisze Paweł; w pokoju Produkt odpowiada Artur; nikt trzeci nie dochodzi.
P2 10:47 odpowiedź: aplikacja działa bez zewnętrznego modelu (brak klucza API dla aplikacji). Odczyt skanów na karcie OMENa (4 GB); rozstrzygnięcie z podobnych przypadków z bazy + zasad z przepisów; mały model na karcie tylko, gdy Programista pokaże, że się mieści i daje lepszy wynik. Claude — tylko do przygotowania danych i tekstów, nie w działającej aplikacji.
P3 10:48 odpowiedź: Artur w pokoju: najpierw przedsiębiorca, pracownik ZUS jako druga połowa historii.
P4 10:48 odpowiedź: Artur w pokoju: tak — nie wie, co i jak opisać; dodatkowo boi się, że źle opisze przyczynę i wypadku nie uznają, więc pisze ogólnikami („poślizgnąłem się”).
P5 10:48 odpowiedź: Artur w pokoju: tak — kompletne zgłoszenie za pierwszym razem, prostym językiem, bez blokowania wysłania.
P6 10:48 odpowiedź: Artur w pokoju: tak, plus lista braków w dokumentach sprawy (np. brak dokumentacji medycznej, brak świadków), żeby pracownik wiedział, o co dopytać.
10:49 Szef: krok 1a — meldunek Projektanta przyjęty (znacznik przeplywy-pm jest); recenzja przejścia R1 → Analityk.
10:49 Szef: krok 1a recenzja R1 (Analityk): 5 braków (P2 lokalnie domyślnie, reguły z przepisów, P4, P6, test 5 przypadków/wdrożenie/RODO) → poprawka Projektanta, potem R2.
10:51 Szef: krok 0 przyjęty (docs/materialy.md, 6 źródeł; niepewne: pola EWYP i karty z PDF — zadanie dla Pawła docs/zadania/01-pdf-ewyp-karta.md). Recenzja materiałów → Projektant. 1a R2 → Analityk. Recenzja hacktribe → Analityk.
10:52 Szef: 1a R2 (Analityk): R1 zamknięta; 4 nowe braki (uznanie vs wyłączenia świadczeń, neutralne dopytywanie, pola EWYP niepotwierdzone, wynik testu = zgodność z naszymi regułami) → poprawka Projektanta, potem R3 (ostatnia).
10:52 Szef: recenzja materialy.md R1 (Projektant): 5 braków (pola karty/EWYP i aktualność przepisów, pytania pod P4, dokumenty wg typu zdarzenia, reguły przypadków granicznych, ochrona danych) → poprawka Analityka.
10:52 Szef: recenzja hacktribe.md R1 (Analityk): 5 braków (nie „wzorzec ZUS”, podstawa rekomendacji wg P2, bez podpowiadania pod uznanie, bez nadmiernych obietnic, Problem bez źródeł) → poprawka Prezentera.
10:52 Szef: zasada dla asystenta: dopytuje neutralnie, opis słowami poszkodowanego, niczego nie podpowiada „pod uznanie” — z P4 i ryzyka z recenzji.
10:52 Prezenter: hacktribe.md poprawiony po R1 (5 braków: pola z publicznych źródeł, baza sztuczna + przepisy, bez modelu zewnętrznego, opis przyczyn bez podpowiadania pod uznanie, usunięte twierdzenia bez źródła) — z zadania i P2/P4/P6.
10:53 Szef: 1a po R2 poprawione (znacznik jest) → R3 (Analityk, ostatnia). hacktribe po R1 poprawione (961/1000, 1828/2000) → R2 (Analityk).
10:59 Szef: 1a R3 (Analityk): 4 braki z R2 usunięte; 1 nowy brak dot. neutralności komunikatu asystenta („błąd nie przekreśla uznania” vs ogólne uspokojenie) oraz zawężenie zdania o błędzie poszkodowanego. Po 3. rundzie pytamy Artura (P7).
10:59 Szef: Paweł oddał zadanie 01 na gałęzi `pawel/01-pdf-ewyp-karta` (oba PDF-y otwierają się normalnie, `pdftotext` czyta oba; pełna lista pól EWYP i karty wypadku w `docs/zadania/01-pdf-ewyp-karta.md`). Do scalenia przez Programistę i potwierdzenia rozporządzenia „z 23 stycznia 2022” przez Analityka.
10:59 Szef: konto Claude osiągnęło 100% 5-godzinnego limitu (reset 12:00) — zatrzymało krok 0P Programisty, poprawkę materiałów R1 i R2 hacktribe u Analityka; zagrożony kamień 11:45 → alarm i P8 do Pawła.
P7 10:59 Artur: Po 3. rundzie recenzji analizy konkurencji został 1 punkt: czy asystent dla przedsiębiorcy ma uspokajać tylko ogólnie („opis nie jest egzaminem, napisz po prostu, co się stało”) bez ocen prawnych, czy pisać wprost, że własny błąd nie przekreśla uznania wypadku? Rekomendacja: puszczamy dalej i zapisujemy ten punkt jako ryzyko w opisie produktu — asystent uspokaja wyłącznie ogólnie, a reguła o błędzie działa tylko po stronie pracownika ZUS — czeka
P8 10:59 Paweł: Konto Claude osiągnęło 100% 5-godzinnego limitu (reset 12:00), co zatrzymuje pracę przed kamieniem 11:45 — czy przełączyć zespół (Programistę, Analityka, Projektanta, Prezentera) teraz na Antigravity, czy czekamy do 12:00? Rekomendacja: przełączyć zespół teraz na Antigravity, żeby nie tracić godziny przed kamieniem 11:45 — czeka
P8 11:03 odpowiedź: Paweł przełączył zespół (Szef, Programista, Analityk, Projektant, Prezenter) na Antigravity — wznawiamy pracę w nowych wątkach (stare wątki trzymają Claude do 12:00).
11:05 Szef: uściślenie Pawła do P8 — cały zespół zostaje na Antigravity (agy) do końca, także po 12:00 (nie wracamy na Claude po resecie); Prezenter uwzględni Antigravity na liście użytych narzędzi w README i prezentacji.
P7 11:06 odpowiedź: Artur w pokoju: tak, jak w rekomendacji — asystent dla przedsiębiorcy uspokaja wyłącznie ogólnie, bez ocen prawnych (reguła o błędzie działa tylko po stronie pracownika ZUS; punkt zapisujemy jako ryzyko w opisie produktu).
<!-- skill: przesluchanie-hackathon -->
11:07 Szef: P7 zamknięte → krok 1a zamknięty, gotowe do kroku 1b (/discover + pytania (b) u Artura). BLOKADA na Antigravity: Szef nie ma w tym silniku możliwości zlecania pracy kolegom w nowych wątkach, więc Programista (0P + scalenie `pawel/01-pdf-ewyp-karta`), Analityk (poprawka `docs/materialy.md` + R2 `docs/hacktribe.md`) i Projektant (krok 1b) czekają na uruchomienie przez Pawła (lub naprawę uprawnień zlecania na Antigravity) → alarm do Pawła.
