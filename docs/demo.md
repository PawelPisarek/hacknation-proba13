# Demo ZANT — scenariusz do 2 minut

Nagrywa człowiek. Jedna historia: **wypadek → zgłoszenie na telefonie → rekomendacja dla ZUS → jedna liczba.**
Adres: makieta na gh-pages / ksefbot.pl (linki dojdą po wdrożeniu; lokalnie `npm start`, http://localhost:3000). Rozmiar telefonu: okno przeglądarki w widoku mobilnym.

| Czas | Pokaż (link / ekran) | Powiedz |
|---|---|---|
| 0:00–0:15 | Ekran startowy | „Pan Marek prowadzi jednoosobową firmę. Przy remoncie spadł z drabiny i złamał rękę. Jest w gipsie, ma telefon i niewiele sił. ZUS dostaje takich zgłoszeń ogromnie dużo i każde opisane inaczej.” |
| 0:15–0:55 | Widok **przedsiębiorcy na telefonie**: wpisuje ogólnik („spadłem z drabiny, boli”) → asystent zadaje 2–3 neutralne pytania (co robił tuż przed, jak doszło do upadku, co było przyczyną) → lista załączników (karta ze szpitala) | „Pisze jedno zdanie. Asystent nie ocenia i nie podpowiada, jak odpowiedzieć na uznanie — pyta tylko o przebieg i przyczynę. Dwie, trzy odpowiedzi i opis jest konkretny.” |
| 0:55–1:10 | Wysyłka z jednym brakiem → łagodne potwierdzenie „wysyłam mimo braków” | „Niczego nie blokujemy. Braki nie giną — trafiają na listę pracownika ZUS.” |
| 1:10–1:45 | Widok **pracownika ZUS**: rekomendacja (uznać / nie uznać / do uzupełnienia), uzasadnienie z 5 przesłanek, podobne sprawy, lista braków, uwaga o wyłączeniach świadczeń, edytowalny projekt karty wypadku | „Pracownik widzi nie tylko wynik, ale dlaczego: pięć przesłanek z przepisów, podobne sprawy i to, czego brakuje. Projekt karty jest gotowy do poprawienia. Decyzję podejmuje człowiek.” |
| 1:45–2:00 | Wgranie paczki spraw testowych (min. 5: uznanie, odmowa, sprawa graniczna) → wynik zgodności; ewentualnie `npm run ocen` | „Jury wgrywa własne sprawy. Na naszym zbiorze testowym trafną rekomendację dostało **X z Y spraw**. Wszystko lokalnie, bez zewnętrznego modelu.” |

## Liczba na koniec

Powiedz liczbę **odczytaną z ekranu tuż przed nagraniem** (z aplikacji lub `node ocena/ocen.mjs`). Stan na 12:16: `kwalifikacja_3kl=13/13` (zbiór z tekstowych zgłoszeń, n=13). Zbiór może się jeszcze zmienić — nie wpisuj liczby z pamięci.

## Przed nagraniem

- Przejść całą ścieżkę raz na sucho; użyć sprawy z oczywistym ogólnikiem w opisie.
- Mówić „zgłoszenie”, „rekomendacja”, „braki” — bez żargonu; nie obiecywać decyzji za ZUS.
- Gdy któryś ekran nie jest gotowy, pokazać go na makiecie i powiedzieć to wprost.
