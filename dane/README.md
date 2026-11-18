# Sztuczny zbiór zgłoszeń i kart wypadków (ZANT)

Zbiór testowo-uczący wygenerowany skryptem [`dane/generator.mjs`](./generator.mjs) (deterministyczny, domyślne ziarno `--ziarno 13`). Wszystkie dane osobowe (imiona, nazwiska, PESEL-e z poprawną sumą kontrolną, NIP, REGON, adresy) są wymyślone.

## Zakres i pola

Pola oparte o `docs/materialy.md` (sekcje 1–3) oraz zweryfikowane formularze EWYP i Karty wypadku z `docs/zadania/01-pdf-ewyp-karta.md`:
- **Zgłoszenie EWYP** (`wejscie.json`, `zgloszenie.txt`, oraz dla min. połowy spraw `zgloszenie.pdf` / `skan.png` generowane na OMENie): dane poszkodowanego (PESEL, dokument tożsamości, data/miejsce ur.), adresy (zamieszkania, korespondencyjny, działalności), pełnomocnik, data/godzina/miejsce wypadku, planowane godziny pracy, rodzaj urazu, opis okoliczności i przyczyn, pierwsza pomoc, policja/prokuratura, maszyna/urządzenie, świadkowie, załączniki, sposób odbioru, data zgłoszenia + wyjaśnienia poszkodowanego.
- **Karta wypadku** (`karta.json`): płatnik składek, poszkodowany (z tytułem ubezpieczenia art. 3 ust. 3 pkt 8), działalność, dane wypadku, okoliczności, przyczyny, pierwsza pomoc, świadkowie, czynności ustalające, przesłanki ustawowe (nagłość, przyczyna zewnętrzna, uraz, związek z działalnością, okres ubezpieczenia), kwalifikacja (`uznano` / `nie uznano`), wyłączenia świadczeń (art. 21 ust. 1, art. 21 ust. 2, art. 6 ust. 2), uzasadnienie, pouczenie.

## Struktura i podział

- **44 sprawy** z 16 scenariuszy (prace na wysokości, pilarka, rusztowanie, odprysk, oparzenie, kolizja drogowa w dostawie, przygniecenie, zasłabnięcie samoistne, zasłabnięcie z upadkiem z podestu, droga dom–biuro, droga/wyładunek u klienta, brak urazu, czynność prywatna, działalność zawieszona, nietrzeźwość, zadłużenie składek > 2 zł, rażące niedbalstwo).
- **Podział warstwowy** po kwalifikacji: `dane/zbior/uczacy/` (~75%, baza przypadków referencyjnych) oraz `dane/zbior/testowy/` (~25%, odłożony zbiór oceniający, ≥ 10 spraw).
- Celowe braki w ok. 40% zgłoszeń (do testowania asystenta obywatela i wykrywania braków po stronie pracownika ZUS).
- Zbiorcza tabela etykiet: `dane/zbior/etykiety.csv`.

## Uruchomienie

```bash
node dane/generator.mjs --ziarno 13 --wyjscie dane/zbior
```

<!-- skill: dummy-dataset -->
