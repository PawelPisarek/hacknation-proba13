# Demo ZANT — scenariusz do 2 minut

Nagrywa człowiek. Jedna historia: **wypadek → zgłoszenie na telefonie → rekomendacja dla ZUS → jedna liczba.**
Adres: makieta na gh-pages / wersja na ksefbot.pl (link do uzupełnienia — domena jeszcze nie działa; lokalnie `npm start`, http://localhost:3000). Rozmiar telefonu: okno przeglądarki w widoku mobilnym.

| Czas | Pokaż (link / ekran) | Powiedz |
|---|---|---|
| 0:00–0:15 | Ekran startowy | „Pan Marek prowadzi jednoosobową firmę. Przy remoncie spadł z drabiny i złamał rękę. Jest w gipsie, ma telefon i niewiele sił. ZUS dostaje takich zgłoszeń ogromnie dużo i każde opisane inaczej.” |
| 0:15–0:55 | Widok **przedsiębiorcy na telefonie**: wpisuje ogólnik („spadłem z drabiny, boli”) → asystent zadaje 2–3 neutralne pytania (co robił tuż przed, jak doszło do upadku, co było przyczyną) → lista załączników (karta ze szpitala) | „Pisze jedno zdanie. Asystent nie ocenia i nie podpowiada, jak odpowiedzieć na uznanie — pyta tylko o przebieg i przyczynę. Dwie, trzy odpowiedzi i opis jest konkretny.” |
| 0:55–1:10 | Wysyłka z jednym brakiem → łagodne potwierdzenie „wysyłam mimo braków” | „Niczego nie blokujemy. Braki nie giną — trafiają na listę pracownika ZUS.” |
| 1:10–1:45 | Widok **pracownika ZUS**: rekomendacja (uznać / nie uznać / do uzupełnienia), uzasadnienie z 5 przesłanek, podobne sprawy, lista braków, uwaga o wyłączeniach świadczeń, edytowalny projekt karty wypadku | „Pracownik widzi nie tylko wynik, ale dlaczego: pięć przesłanek z przepisów, podobne sprawy i to, czego brakuje. Projekt karty jest gotowy do poprawienia. Decyzję podejmuje człowiek.” |
| 1:45–2:00 | Zakładka „Wsparcie pracownika ZUS” → przycisk „Załaduj i oceń 6 spraw testowych” (W052, W006, W023, W020, W027, W038; albo wgranie własnych plików, min. 5 — te bez numeru sprawy nie wchodzą do Y) → wynik per sprawa i nad nim granatowy pasek **„Trafne rekomendacje: X z Y”** (pokaż go na ekranie) | „Jury wgrywa własne sprawy albo klika paczkę testową. Na paczce 6 spraw z naszego sztucznego zbioru testowego **X z Y rekomendacji jest trafnych** — to zgodność ze zbiorem wzorcowym, nie ocena ZUS. Wszystko lokalnie, bez zewnętrznego modelu. Wdrożenie wymaga DPIA i pilotażu na realnych danych ZUS.” |

## Liczba na koniec

Powiedz liczbę **odczytaną z ekranu aplikacji** po kliknięciu „Załaduj i oceń 6 spraw testowych” (pasek „Trafne rekomendacje: X z Y”; sprawdź na sucho tuż przed nagraniem) i zawsze nazwij ją „zgodność ze wzorcem sztucznego zbioru”. Opcjonalnie, dla chętnych: `npm run ocen` w terminalu (cały zbiór testowy, 13 spraw — liczbę odczytaj z wyniku, nie z pamięci). Zbiór może się jeszcze zmienić — nie wpisuj liczby z pamięci.

## Przed nagraniem

- Przejść całą ścieżkę raz na sucho; użyć sprawy z oczywistym ogólnikiem w opisie.
- Mówić „zgłoszenie”, „rekomendacja”, „braki” — bez żargonu; nie obiecywać decyzji za ZUS.
- Gdy któryś ekran nie jest gotowy, pokazać go na makiecie i powiedzieć to wprost.
