# Demo ZANT — scenariusz do 2 minut

Nagrywa człowiek. Jedna historia: **wypadek → zgłoszenie na telefonie → rekomendacja dla ZUS → jedna liczba.**
Adres: publicznie działa makieta https://pawelpisarek.github.io/hacknation-proba13/makieta/ ; pełną aplikację uruchamia się lokalnie (`npm start`, http://localhost:3000), wdrożenie na serwer w toku. Rozmiar telefonu: okno przeglądarki w widoku mobilnym.

| Czas | Pokaż (link / ekran) | Powiedz |
|---|---|---|
| 0:00–0:15 | Ekran startowy | „Pan Marek prowadzi jednoosobową firmę. Przy remoncie spadł z drabiny i złamał rękę. Jest w gipsie, ma telefon i niewiele sił. ZUS dostaje takich zgłoszeń ogromnie dużo i każde opisane inaczej.” |
| 0:15–0:55 | Widok **przedsiębiorcy na telefonie**: wpisuje ogólnik („spadłem z drabiny, boli”) → asystent zadaje 2–3 neutralne pytania (co robił tuż przed, jak doszło do upadku, co było przyczyną) → lista załączników (karta ze szpitala) | „Pisze jedno zdanie. Asystent nie ocenia i nie podpowiada, jak odpowiedzieć na uznanie — pyta tylko o przebieg i przyczynę. Dwie, trzy odpowiedzi i opis jest konkretny.” |
| 0:55–1:10 | Wysyłka z jednym brakiem → łagodne potwierdzenie „Wysyłam mimo braków” → ekran z numerem zgłoszenia (np. **ZG-0001**) → „Otwórz tę sprawę jako pracownik ZUS” | „Niczego nie blokujemy. Zgłoszenie dostaje numer, a braki nie giną — trafiają na listę pracownika ZUS.” |
| 1:10–1:45 | Widok **pracownika ZUS**: rekomendacja (uznać / nie uznać / do uzupełnienia), uzasadnienie z 5 przesłanek i **cytatem z dokumentu sprawy**, 1–2 podobne sprawy, lista braków, uwaga o wyłączeniach świadczeń, pola ze skanu oznaczone **„niepewne — sprawdź”**, edytowalny projekt karty → przyciski **Zatwierdź / Odrzuć / Zmień** (pokaż „Zatwierdź”) | „Pracownik widzi nie tylko wynik, ale dlaczego: przesłanki z przepisów, cytat z dokumentu, podobne sprawy i to, czego brakuje. Pola, których skan nie pozwolił pewnie odczytać, system oznacza, a nie zgaduje. Decyzję — zatwierdzić, odrzucić albo zmienić z powodem — podejmuje człowiek.” |
| 1:45–2:00 | Zakładka „Wsparcie pracownika ZUS” → licznik przed wgraniem pokazuje „0 z 0 — wgraj pliki” → przycisk „Załaduj i oceń 6 spraw testowych” (W052, W006, W023, W020, W027, W038; albo wgranie własnych plików, min. 5 — te bez numeru sprawy nie wchodzą do Y) → wynik per sprawa i nad nim granatowy pasek **„Trafne rekomendacje: X z Y”** (pokaż go na ekranie) | „Jury wgrywa własne sprawy albo klika paczkę testową. Na paczce 6 spraw z naszego sztucznego zbioru testowego **X z Y rekomendacji jest trafnych** — to zgodność ze zbiorem wzorcowym, nie ocena ZUS. Wszystko lokalnie, bez zewnętrznego modelu. Wdrożenie wymaga DPIA i pilotażu na realnych danych ZUS.” |

## Liczba na koniec

Jedno zdanie na pokaz: „Poza 13 sprawami sprawdzaliśmy to na siedmiu seriach parafraz: serie 1–6 to wynik po poprawkach reguł, a siódma dała 6/6 w kwalifikacji za pierwszym razem, ale wykrywanie braków wyszło na niej 0,70 i dopiero po ogólnej poprawce 1,0 — więc nie mamy już serii niewidzianej, a następny niezależny test to nowa seria; to zgodność ze wzorcem sztucznego zbioru, nie ocena na realnych danych ZUS. Seria 8, potoczna i w trzeciej osobie, dała za pierwszym razem tylko 3/6 — nowy styl obniża wynik.”

Powiedz liczbę **odczytaną z ekranu aplikacji** po kliknięciu „Załaduj i oceń 6 spraw testowych” (pasek „Trafne rekomendacje: X z Y”; sprawdź na sucho tuż przed nagraniem) i zawsze nazwij ją „zgodność ze wzorcem sztucznego zbioru”. Opcjonalnie, dla chętnych: `npm run ocen` w terminalu (cały zbiór testowy, 13 spraw — liczbę odczytaj z wyniku, nie z pamięci). Zbiór może się jeszcze zmienić — nie wpisuj liczby z pamięci.

## Przed nagraniem

- Zapas, gdy serwer nie działa: `node scripts/sprawdz-demo.mjs` (świeży klon: 17 OK, 0 błędów) przechodzi ścieżkę pokazu w terminalu.

- Przejść całą ścieżkę raz na sucho; użyć sprawy z oczywistym ogólnikiem w opisie.
- Skan nieczytelny to nie „nie uznać”: aplikacja pisze „Nie udało się odczytać tego pliku…” i nie wydaje rekomendacji — można to pokazać, jeśli zostanie czas.
- Odczyt skanów PDF wymaga Tesseracta (Docker albo `apt-get install tesseract-ocr tesseract-ocr-pol poppler-utils`); sprawdzić na sucho przed nagraniem.
- Mówić „zgłoszenie”, „rekomendacja”, „braki” — bez żargonu; nie obiecywać decyzji za ZUS.
- Gdy któryś ekran nie jest gotowy, pokazać go na makiecie i powiedzieć to wprost.
