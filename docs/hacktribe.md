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

## Opis krótki (limit 300 znaków) — 229 zn.

Dwie części w jednej aplikacji webowej: asystent, który prostym językiem pomaga poszkodowanemu przedsiębiorcy zgłosić wypadek przy pracy i wskazuje braki, oraz wsparcie dla pracownika ZUS w decyzji o uznaniu zdarzenia za wypadek.

## Opis średni (limit 1000 znaków) — 852 zn.

Po wypadku przy pracy przedsiębiorca – często pierwszy raz w życiu – musi wypełnić zgłoszenie według wzorca ZUS, a urzędnik rozpatrzyć ogromną liczbę różnorodnych spraw. Nasza aplikacja webowa pomaga obu stronom.

1. Asystent obywatela: przyjmuje zgłoszenie i wyjaśnienia poszkodowanego, prostym językiem, bez żargonu. Wskazuje brakujące elementy wzorca (miejsce, czas, okoliczności, przyczyny), pomaga opisać zdarzenie i sugeruje uzupełnienia – nie blokuje wysłania zgłoszenia.

2. Wsparcie decyzji dla pracownika ZUS: czyta dokumentację zgłoszenia (także skany), proponuje rozstrzygnięcie – uznać lub nie zdarzenie za wypadek przy pracy – i przygotowuje projekt karty wypadku. Decyzja zawsze należy do człowieka.

Całość działa w przeglądarce, bez instalowania programów; zgłoszenia testowe można wgrać z poziomu strony. Dane w projekcie są sztuczne.

## Opis pełny (limit 2000 znaków) — 1707 zn.

PROBLEM
Każdego dnia do ZUS trafiają zgłoszenia wypadków przy pracy osób prowadzących pozarolniczą działalność gospodarczą: prace na wysokościach, remonty, naprawy maszyn. Poszkodowany jest w szoku, nie zna wzorca zgłoszenia ani języka urzędowego, często pomija miejsce, czas lub przyczyny zdarzenia. Pracownik ZUS dostaje niejednorodną dokumentację – skany, informacje medyczne, opisy własnymi słowami – i musi ocenić, czy to wypadek przy pracy.

ROZWIĄZANIE
ZANT to aplikacja webowa z dwiema częściami pod jednym adresem.

Asystent obywatela prowadzi poszkodowanego przez zgłoszenie jak życzliwy rozmówca: przyjmuje zgłoszenie i wyjaśnienia, porównuje je ze wzorcem ZUS, wskazuje, czego brakuje, i podpowiada, jak opisać okoliczności i przyczyny wypadku. Pomaga i sugeruje korekty, ale nie zamyka drogi do zgłoszenia, gdy czegoś brakuje.

Wsparcie decyzji dla pracownika ZUS odczytuje dokumentację zgłoszenia, także ze skanów, analizuje zawarte w niej dane, proponuje rozstrzygnięcie (uznać lub nie zdarzenie za wypadek przy pracy) w oparciu o dostępną bazę zgłoszeń i kart wypadków oraz przygotowuje projekt karty wypadku. To rekomendacja do weryfikacji – decyzję podejmuje człowiek.

JAK PRZETESTOWAĆ
Wszystko działa pod jednym linkiem w przeglądarce, bez instalacji. Jury może wgrać dokumentację testową co najmniej 5 przypadków i ocenić jakość rekomendacji.

DANE I WDROŻENIE
W projekcie używamy wyłącznie sztucznych zgłoszeń i rozstrzygnięć, przygotowanych przez nas na podstawie publicznych źródeł. W prezentacji pokażemy oczekiwany czas wdrożenia i przewidywane problemy, w szczególności wymogi ochrony danych osobowych w ZUS.

Kod i dokumentacja: https://github.com/PawelPisarek/hacknation-proba13

<!-- skill: brak (szkic; nazwa i hasło skillami na kroku 6) -->
