// Skrypt oceny na odłożonym zbiorze testowym (ZANT).
// Ocenia obie rozdzielone etykiety z docs/materialy.md §6:
//   - kwalifikacja_zdarzenia: UZNAC | NIE_UZNAC | DO_UZUPELNIENIA (plus macierz FP/FN dla UZNAC vs pozostałe)
//   - wylaczenia_swiadczen: BRAK | ART_21_1_RAZACE_NIEDBALSTWO | ART_21_2_3_NIETRZEZWOSC | ART_6_2_ZADLUZENIE
// oraz trafność odczytu pól (data, miejsce, okoliczności, przyczyna) i wykrywania braków (P6).
// Uruchomienie: node ocena/ocen.mjs [--zbior dane/zbior] [--zrodlo txt|pdf|ocr] [--szczegoly]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bezPolskich, wyciagnijTekstZPdf } from '../app/logika/parser.mjs';
import { wczytajBazeUczaca, ocenSpraweBazowa } from '../app/logika/bazowa.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ZBIOR = path.resolve(ROOT, arg('--zbior', 'dane/zbior'));
const ZRODLO = arg('--zrodlo', 'txt'); // txt | pdf | ocr
const SZCZEGOLY = process.argv.includes('--szczegoly');

function tokeny(t) {
  return new Set(
    bezPolskich(t)
      .replace(/[^a-z0-9]+/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3)
  );
}

function f1Tokenow(pred, ref) {
  const p = tokeny(pred);
  const r = tokeny(ref);
  if (!p.size && !r.size) return 1;
  if (!p.size || !r.size) return 0;
  let wsp = 0;
  for (const x of p) if (r.has(x)) wsp++;
  const prec = wsp / p.size;
  const rec = wsp / r.size;
  return prec + rec ? (2 * prec * rec) / (prec + rec) : 0;
}

export function ocen({ zbior = ZBIOR, zrodlo = ZRODLO, szczegoly = SZCZEGOLY, ids = null } = {}) {
  const baza = wczytajBazeUczaca(path.join(zbior, 'uczacy'));
  const katTest = path.join(zbior, 'testowy');
  const idList = fs.readdirSync(katTest).sort().filter((id) => fs.statSync(path.join(katTest, id)).isDirectory())
    .filter((id) => !ids || ids.includes(id));

  let exactKw = 0;
  let tp = 0, tn = 0, fp = 0, fn = 0;
  let wylOk = 0;
  const pola = { data: 0, miejsce: 0, okolicznosci: 0, przyczyna: 0 };
  let brakiTp = 0, brakiFp = 0, brakiFn = 0;
  const raport = [];

  for (const id of idList) {
    const dir = path.join(katTest, id);
    let tekst;
    if (zrodlo === 'ocr' && fs.existsSync(path.join(dir, 'ocr.txt'))) {
      tekst = fs.readFileSync(path.join(dir, 'ocr.txt'), 'utf8');
    } else if (zrodlo === 'pdf' && fs.existsSync(path.join(dir, 'zgloszenie.pdf'))) {
      tekst = wyciagnijTekstZPdf(fs.readFileSync(path.join(dir, 'zgloszenie.pdf')));
    } else {
      tekst = fs.readFileSync(path.join(dir, 'zgloszenie.txt'), 'utf8');
    }
    const wejsciePelne = JSON.parse(fs.readFileSync(path.join(dir, 'wejscie.json'), 'utf8'));
    const oczekiwane = JSON.parse(fs.readFileSync(path.join(dir, 'karta.json'), 'utf8'));

    // Przekazujemy wyłącznie tekst zgłoszenia + dane rejestrowe (CEIDG/składki/dokumentacja medyczna) — bez etykiet
    const wynik = ocenSpraweBazowa({
      tekstZgloszenia: tekst,
      wejscie: {
        dzialalnosc: wejsciePelne.dzialalnosc,
        skladki: wejsciePelne.skladki,
        dokumentacja_medyczna: wejsciePelne.dokumentacja_medyczna,
      },
      baza,
    });

    const refKw = oczekiwane.kwalifikacja_zdarzenia || oczekiwane.karta.kwalifikacja_zdarzenia;
    const predKw = wynik.kwalifikacja_zdarzenia;
    if (refKw === predKw) exactKw++;

    const refPos = refKw === 'UZNAC';
    const predPos = predKw === 'UZNAC';
    if (refPos && predPos) tp++;
    else if (!refPos && !predPos) tn++;
    else if (!refPos && predPos) fp++;
    else fn++;

    const refWyl = oczekiwane.wylaczenia_swiadczen || oczekiwane.karta.wylaczenia_swiadczen || 'BRAK';
    const predWyl = wynik.wylaczenia_swiadczen || 'BRAK';
    if (refWyl === predWyl) wylOk++;

    // Trafność odczytu kluczowych pól
    const dataOk = wynik.pola_odczytane.data === oczekiwane.karta.wypadek.data;
    const miejsceOk = bezPolskich(wynik.pola_odczytane.miejsce || '') === bezPolskich(oczekiwane.karta.wypadek.miejsce || '');
    const okolRef = `${wejsciePelne.zgloszenie.opis_okolicznosci} ${wejsciePelne.wyjasnienia_poszkodowanego}`.trim();
    const okolOk = f1Tokenow(wynik.pola_odczytane.okolicznosci, okolRef) >= 0.85;
    const przyczOk = f1Tokenow(wynik.pola_odczytane.przyczyna, oczekiwane.karta.przyczyny) >= 0.30;

    if (dataOk) pola.data++;
    if (miejsceOk) pola.miejsce++;
    if (okolOk) pola.okolicznosci++;
    if (przyczOk) pola.przyczyna++;

    const refBraki = new Set(oczekiwane.braki_zgloszenia || []);
    const predBraki = new Set(wynik.braki_dokumentow.map((b) => b.kod));
    for (const b of refBraki) {
      if (predBraki.has(b)) brakiTp++;
      else brakiFn++;
    }
    for (const b of predBraki) {
      if (!refBraki.has(b)) brakiFp++;
    }

    raport.push({ id, refKw, predKw, refWyl, predWyl, dataOk, miejsceOk, okolOk, przyczOk });
  }

  const n = idList.length || 1;
  const acc = exactKw / n;
  const prec = tp + fp ? tp / (tp + fp) : 0;
  const rec = tp + fn ? tp / (tp + fn) : 0;
  const f1 = prec + rec ? (2 * prec * rec) / (prec + rec) : 0;
  const brakiF1 = (2 * brakiTp) / (2 * brakiTp + brakiFp + brakiFn || 1);

  if (szczegoly) {
    console.table(raport);
  }

  const podsumowanie =
    `OCENA (${zrodlo}, n=${n}): kwalifikacja_3kl=${exactKw}/${n} (${(acc * 100).toFixed(1)}%) | ` +
    `UZNAC TP=${tp} TN=${tn} FP=${fp} FN=${fn} F1=${f1.toFixed(3)} | ` +
    `wylaczenia=${wylOk}/${n} | pola data=${pola.data}/${n} miejsce=${pola.miejsce}/${n} okolicznosci=${pola.okolicznosci}/${n} przyczyna=${pola.przyczyna}/${n} | braki_F1=${brakiF1.toFixed(3)}`;

  return { n, exactKw, tp, tn, fp, fn, acc, f1, wylOk, pola, brakiF1, podsumowanie, raport };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = ocen();
  console.log(r.podsumowanie);
}
