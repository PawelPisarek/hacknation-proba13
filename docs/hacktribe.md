# HackTribe – tekst do formularza (DRAFT)

Wersja wstępna: produkt jeszcze się kształtuje, nazwa i hasło dojdą po kroku 6. Liczby znaków policzone skryptem (ze spacjami i znakami nowej linii).

## Nazwa projektu (limit 50 znaków)

1. ZANT – asystent zgłoszeń wypadku przy pracy — 43 zn.
2. Pierwsza Pomoc po Wypadku: zgłoszenie ZUS — 41 zn.
3. ZUS Accident Notification Tool (ZANT) — 37 zn.

**Rekomendacja: 1** — krótka, zawiera nazwę z zadania (ZANT) i mówi, co robi.

## Nazwa zespołu

_(do uzupełnienia przez Pawła)_

## Link do repozytorium

https://github.com/PawelPisarek/hacknation-proba13 — 50 zn.

## Opis krótki (limit 300 znaków) — 251 zn.

Aplikacja webowa w dwóch częściach: asystent prostym językiem pomaga przedsiębiorcy po wypadku przy pracy opisać zdarzenie i wskazuje braki (zgłoszenie można wysłać i z brakami), a pracownikowi ZUS daje rekomendację z uzasadnieniem. Decyduje człowiek.

## Opis średni (limit 1000 znaków) — 961 zn.

Odpowiedź na zadanie ZUS o wypadkach przy pracy przedsiębiorców: aplikacja webowa w dwóch częściach, bez instalacji.

1. Asystent dla poszkodowanego przedsiębiorcy: przyjmuje zgłoszenie i wyjaśnienia prostym językiem, wskazuje braki w polach zgłoszenia (ustalonych z publicznych źródeł ZUS) i pomaga opisać to, co naprawdę się stało – miejsce, czas, okoliczności, przyczynę. Nie podpowiada pod uznanie wypadku. Zgłoszenie z brakami można wysłać.

2. Wsparcie decyzji dla pracownika ZUS: odczytuje dokumentację, w tym skany, i proponuje uznanie lub nie zdarzenia za wypadek przy pracy – z uzasadnieniem (przesłanki z przepisów, podobne sprawy) i listą braków w dokumentach sprawy. Przygotowuje projekt karty wypadku. Narzędzie nie wydaje decyzji – decyduje pracownik.

Rekomendacja opiera się na podobnych sprawach z bazy – naszego sztucznego zbioru, a nie danych ZUS – oraz na zasadach z przepisów. Aplikacja działa bez zewnętrznego modelu, na własnym sprzęcie.

## Opis pełny (limit 2000 znaków) — 1828 zn.

PROBLEM
Według zadania ZUS liczba zgłoszeń wypadków przy pracy jest ogromna, a okoliczności i przyczyny bardzo różnorodne. Dotyczy to m.in. prac na wysokościach, remontów i napraw maszyn u osób prowadzących pozarolniczą działalność. Poszkodowany musi wskazać m.in. miejsce i czas oraz szczegółowo opisać okoliczności i przyczyny. Pracownik ZUS ocenia niejednorodną dokumentację, także skany, z informacjami medycznymi.

ROZWIĄZANIE
ZANT to aplikacja webowa z dwiema częściami pod jednym adresem.

Asystent dla poszkodowanego przedsiębiorcy rozmawia prostym językiem, bez żargonu. Porównuje zgłoszenie z polami zgłoszenia ustalonymi z publicznych źródeł ZUS (wzorca ZUS nie dostaliśmy), wskazuje braki i pomaga opisać to, co naprawdę się stało. Nie podpowiada odpowiedzi pod uznanie wypadku. Zgłoszenie z brakami można wysłać – asystent sugeruje uzupełnienia, ale niczego nie blokuje.

Wsparcie decyzji dla pracownika ZUS odczytuje dokumentację ze skanów, proponuje rozstrzygnięcie (uznać lub nie zdarzenie za wypadek przy pracy) i przygotowuje projekt karty wypadku. Rekomendacja ma uzasadnienie: spełnione i niespełnione przesłanki z przepisów oraz podobne sprawy. Pokazujemy też braki w dokumentach sprawy, o które warto dopytać. Narzędzie nie wydaje decyzji – decyduje pracownik.

JAK TO DZIAŁA
Podstawą rekomendacji są podobne sprawy z bazy i zasady z przepisów. Baza to nasz sztuczny zbiór zgłoszeń i rozstrzygnięć przygotowany na podstawie publicznych źródeł; nie zawiera danych ZUS ani danych osobowych. Aplikacja działa bez zewnętrznego modelu, na własnym sprzęcie, więc dane nie opuszczają środowiska.

JAK PRZETESTOWAĆ
Jeden link w przeglądarce, bez instalacji. Jury może wgrać dokumentację testową co najmniej 5 przypadków i ocenić rekomendacje.

Kod i dokumentacja: https://github.com/PawelPisarek/hacknation-proba13

<!-- skill: brak (szkic; nazwa i hasło skillami na kroku 6) -->
