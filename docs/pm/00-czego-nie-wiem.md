# Czego nie wiem o produkcie

Pozycje rozstrzygnięte przez zadanie (nie pytamy): aplikacja webowa z dwiema częściami (asystent dla obywatela + wsparcie decyzji dla pracownika ZUS), sztuczne dane, wgrywanie min. 5 przypadków przez przeglądarkę bez instalacji, asystent „wspiera, nie blokuje”, język prosty, po polsku. Ustalenia techniczne Pawła (nie pytamy Artura): działanie lokalne bez zewnętrznego modelu (P2).

## Przed momentem (a) — po analizie konkurencji
1. Kto jest głównym użytkownikiem pokazu: przedsiębiorca czy pracownik ZUS (kogo pokazujemy pierwszego)? → P3 (rozstrzygnięte)
2. Jaki jest największy problem poszkodowanego przedsiębiorcy przy zgłoszeniu? → P4 (rozstrzygnięte)
3. Co ma zyskać poszkodowany? → P5 (rozstrzygnięte)
4. Co ma zyskać pracownik ZUS? → P6 (rozstrzygnięte)
5. Jak neutralnie uspokajać przedsiębiorcę przy opisie przyczyny (bez ocen prawnych)? → P7 (rozstrzygnięte)

## Przed momentem (b) — w `/discover`
Niewiadome niezależne (zadane Arturowi przed wyborem zakresu odkrywania):
1. Które 3–5 z 10 pomysłów wybieramy do dalszej pracy (albo wszystkie)? → P9
2. Jakie rodzaje przypadków chcemy pokazać w puli testowej (min. 5 spraw): same oczywiste uznania, czy mieszankę (uznanie, odmowa, sprawa graniczna z brakami)? → P10
3. Co ma się dziać, gdy poszkodowany wyśle zgłoszenie mimo braków: od razu zapis + przekazanie braków pracownikowi ZUS, czy najpierw jedno łagodne potwierdzenie „wysyłam mimo braków”? → P11
4. Jak głęboko asystent ma dopytywać osobę po urazie o okoliczności i przyczynę: krótka runda 2–3 pytań tylko przy ogólnikowym opisie, czy pełny wywiad krok po kroku? → P12

Niewiadome zależne (do zadania dopiero po odpowiedzi Artura na P9):
5. Co zmienić w wybranych pomysłach? → po P9
6. Czy któryś z odrzuconych pomysłów warto wziąć w części? → po P9
7. Które z najryzykowniejszych założeń (z kroku 4 `/discover`) są najważniejsze do sprawdzenia? → po analizie założeń dla wybranych pomysłów

## Przed momentem (c) — przed `/write-prd`
- Ekran główny, główna ścieżka, co pokazujemy w demo (3 warianty makiety).
