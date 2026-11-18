# Sztuczny zbiór zgłoszeń i kart wypadków (ZANT)

Zbiór testowo-uczący wygenerowany skryptem [`dane/generator.mjs`](./generator.mjs) (deterministyczny, domyślne ziarno `--ziarno 13`). Wszystkie dane osobowe (imiona, nazwiska, PESEL-e z poprawną sumą kontrolną, NIP, REGON, adresy) są wymyślone.

## Zakres i zgodność z `docs/materialy.md` (commit `f1efade`)

- **Sekcja 1 i 3**: pełne pola EWYP (6 str., z `docs/zadania/01-pdf-ewyp-karta.md`) oraz karta wypadku wg aktualnego rozporządzenia MRiPS z 23.01.2022 (**Dz.U. 2022 poz. 223** — bez pieczątek, art. 3 ust. 3 pkt 8 / albo art. 3a, sekcje I–IV z terminem 14 dni, pouczeniem i wykazem załączników).
- **Sekcja 5**: podział spraw na typy zdarzeń (`wysokosc_remont`, `maszyna`, `droga_dojazd`, `ciezki_alkohol`, `inne`) oraz ustrukturyzowany katalog dokumentów w `wejscie.json` (`dokumenty_sprawy`: `karta_sor` z ICD-10, `notatka_policji`, `postanowienie_prokuratury`, `oswiadczenia_swiadkow`, `protokol_ogledzin`, `umowa_zlecenie`, `ceidg_zus`).
- **Sekcja 6**: dwie rozdzielone etykiety i wszystkie 7 przypadków granicznych + sprawy wymagające uzupełnienia:
  - `kwalifikacja_zdarzenia`: `UZNAC` | `NIE_UZNAC` | `DO_UZUPELNIENIA`
  - `wylaczenia_swiadczen`: `BRAK` | `ART_21_1_RAZACE_NIEDBALSTWO` | `ART_21_2_3_NIETRZEZWOSC` | `ART_6_2_ZADLUZENIE`
  - Poprawka art. 6 ust. 2–3 (t.j. **Dz.U. 2025 poz. 1644**): próg zadłużenia składek to **1% minimalnego wynagrodzenia za pracę** (bez twardych kwot PLN i bez nieaktualnego progu 2,00 zł), wstrzymanie do spłaty i przedawnienie po 6 miesiącach od dnia wypadku.

## Struktura i podział

- **52 sprawy** z 22 scenariuszy (w tym komplet przypadków granicznych 1, 2a, 2b, 3a, 3b, 4a, 4b, 5a [alkohol + przyczynienie oraz odmowa badania], 5b [nietrzeźwość bez przyczynienia], 5c [nietrzeźwość zrywająca pracę], 6a [zawieszona działalność], 6b [1. tydzień działalności — brak okresu wyczekiwania], 7 [zadłużenie > 1% min. wyn.] oraz 4 sprawy `DO_UZUPELNIENIA`).
- **Podział warstwowy** po wszystkich 3 klasach `kwalifikacja_zdarzenia`: `dane/zbior/uczacy/` (39 spraw, ~75%) i `dane/zbior/testowy/` (13 spraw, ~25%, odłożony zbiór oceniający).
- Pliki `.pdf` dla 29/52 spraw (>55%, w tym 100% testowych); zbiorcza tabela etykiet: `dane/zbior/etykiety.csv`.

## Uruchomienie

```bash
node dane/generator.mjs --ziarno 13 --wyjscie dane/zbior
node ocena/ocen.mjs --zrodlo txt
node ocena/ocen.mjs --zrodlo pdf
```

<!-- skill: dummy-dataset -->
