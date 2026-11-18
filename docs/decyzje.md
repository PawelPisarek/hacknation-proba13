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
