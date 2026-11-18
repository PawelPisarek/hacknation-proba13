# 02 — MVP: lista na budowę (po makiecie)

Źródło: spec `afe2bed` (recenzja odbiorcy R2 czysta), sondy Programisty (`348443e`), scenariusze testów Analityka (`d9ff5da`).
Kolejność = ważność. Każdy punkt kończy się linią wyniku narzędzia (test, `ocen.mjs`, kod HTTP).

1. **Uogólnienie reguł** — parafrazy (`dane/parafrazy`) dają 3/5 (W020→UZNAC, W052→UZNAC, W038 bez wyłączenia). Cel: parafrazy ≥ 4/5 bez spadku oryginałów 13/13. Gotowe: dwie linie `ocen.mjs` (oryginały, parafrazy).
2. **Ogólnik > 55 znaków** — `dane/parafrazy/ogolniki.txt` 0/5 wykrytych. Cel: 5/5 dostaje pytania (czynność, przyczyna, część ciała), pełne opisy z testowego bez fałszywych pytań. Gotowe: test.
3. **Ścieżka przedsiębiorca → ZUS** — „Wyślij zgłoszenie” (z oknem „Wysyłam mimo braków”), zapis w pamięci serwera, „Otwórz tę sprawę jako pracownik ZUS” po numerze, decyzja Zatwierdź / Odrzuć / Zmień na… z powodem, projekt karty. Gotowe: test API + przeklik.
4. **Odczyt skanu** — Tesseract pol 200 dpi w Dockerfile; PDF-obraz i plik nieczytelny → komunikat „nie udało się odczytać”, nie NIE_UZNAC. Pole niepewne < 70 podświetlone. Gotowe: test na PDF-obrazie, czas na sprawę.
5. **Licznik z ekranu** — liczy rekomendację systemu dla treści wgranego pliku (nie oryginału z dysku). Gotowe: plik z podmienionym opisem zmienia licznik.
6. **Telefon** — przyciski ≥ 48 px (`min-height`), widok 360 px. Gotowe: Paweł sprawdza na telefonie.

Wdrożenie na hacknation.ksefbot.pl po DNS (P23).
