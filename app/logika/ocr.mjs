// Odczyt skanów na serwerze aplikacji: Tesseract (pol, 200 dpi), bez zewnętrznego modelu AI.
// Wynik: { status: 'ok', tekst, pewnosc_srednia, pola_niepewne[], czas_ms, zrodlo }
//     albo { status: 'nie_udalo_sie_odczytac', powod, komunikat } — nigdy nie udaje, że odczyt się udał.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import { spawnSync } from 'node:child_process';
import { wyciagnijTekstZPdf } from './parser.mjs';

export const PROG_NIEPEWNOSCI = 70; // pole poniżej 70/100 jest podświetlane (spec A5)
const MIN_ZNAKOW = 40;
const MIN_PEWNOSC = 35; // średnia pewność poniżej = nieczytelny plik
export const KOMUNIKAT_BLEDU = 'Nie udało się odczytać tego pliku. Wgraj czytelniejszy skan albo wpisz dane ręcznie.';

const POLA = [
  ['data', /^data wypadku/i], ['miejsce', /^miejsce wypadku/i], ['uraz', /^rodzaj urazu/i],
  ['okolicznosci', /^opis okoliczno/i], ['godziny', /^planowane godziny/i], ['poszkodowany', /^poszkodowany/i],
  ['adres_dzialalnosci', /^adres prowadzenia/i],
];

const blad = (powod) => ({ status: 'nie_udalo_sie_odczytac', powod, komunikat: KOMUNIKAT_BLEDU });
const ma = (cmd) => spawnSync('sh', ['-c', `command -v ${cmd}`]).status === 0;

// Obrazy stron: pdftoppm 200 dpi; gdy go brak — osadzone strumienie JPEG (DCTDecode) z pliku PDF.
function obrazyStron(buf, dir) {
  const pdf = path.join(dir, 'in.pdf');
  fs.writeFileSync(pdf, buf);
  if (ma('pdftoppm')) {
    const r = spawnSync('pdftoppm', ['-r', '200', '-png', pdf, path.join(dir, 'str')], { timeout: 60000 });
    if (r.status === 0) {
      const pliki = fs.readdirSync(dir).filter((f) => /^str.*\.png$/.test(f)).sort().map((f) => path.join(dir, f));
      if (pliki.length) return pliki;
    }
  }
  const out = [];
  const s = buf.toString('latin1');
  const re = /<<([^>]*?\/Subtype\s*\/Image[^>]*?)>>\s*stream\r?\n/g;
  let m;
  while ((m = re.exec(s))) {
    const start = m.index + m[0].length;
    const koniec = s.indexOf('endstream', start);
    let dane = buf.subarray(start, koniec);
    if (/\/DCTDecode/.test(m[1])) {
      const p = path.join(dir, `emb${out.length}.jpg`); fs.writeFileSync(p, dane); out.push(p);
    } else if (/\/FlateDecode/.test(m[1])) {
      try { dane = zlib.inflateSync(dane); } catch { continue; }
      const w = Number(/\/Width\s+(\d+)/.exec(m[1])?.[1]), h = Number(/\/Height\s+(\d+)/.exec(m[1])?.[1]);
      const kan = /DeviceRGB/.test(m[1]) ? 3 : 1;
      if (!w || !h || dane.length !== w * h * kan) continue;
      const p = path.join(dir, `emb${out.length}.pnm`);
      fs.writeFileSync(p, Buffer.concat([Buffer.from(`${kan === 3 ? 'P6' : 'P5'}\n${w} ${h}\n255\n`), dane])); out.push(p);
    }
  }
  return out;
}

function tesseractTsv(plik) {
  const r = spawnSync('tesseract', [plik, 'stdout', '-l', 'pol', '--dpi', '200', '--psm', '4', 'tsv'], { encoding: 'utf8', timeout: 120000, maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) return null;
  const slowa = [];
  for (const l of r.stdout.split('\n').slice(1)) {
    const c = l.split('\t');
    if (c.length < 12 || c[0] !== '5') continue;
    const tekst = c.slice(11).join('\t').trim();
    if (!tekst) continue;
    slowa.push({ blok: `${c[2]}.${c[3]}.${c[4]}`, tekst, conf: Number(c[10]) });
  }
  return slowa;
}

export function odczytajPdf(buf) {
  const t0 = Date.now();
  const warstwa = wyciagnijTekstZPdf(buf);
  if (warstwa.length >= MIN_ZNAKOW) {
    return { status: 'ok', zrodlo: 'warstwa_tekstowa', tekst: warstwa, pewnosc_srednia: 100, pola_niepewne: [], czas_ms: Date.now() - t0 };
  }
  if (!ma('tesseract')) return blad('brak_tesseract');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'zant-ocr-'));
  try {
    const strony = obrazyStron(buf, dir);
    if (!strony.length) return blad('brak_obrazu');
    const linie = []; const wszystkie = [];
    for (const s of strony) {
      const sl = tesseractTsv(s);
      if (!sl) return blad('blad_tesseract');
      const wg = new Map();
      for (const w of sl) { if (!wg.has(w.blok)) wg.set(w.blok, []); wg.get(w.blok).push(w); wszystkie.push(w); }
      for (const ws of wg.values()) linie.push(ws);
    }
    const tekst = linie.map((ws) => ws.map((w) => w.tekst).join(' ')).join('\n');
    const pewne = wszystkie.filter((w) => w.conf >= 0);
    const srednia = pewne.length ? pewne.reduce((a, w) => a + w.conf, 0) / pewne.length : 0;
    if (tekst.replace(/\s/g, '').length < MIN_ZNAKOW || srednia < MIN_PEWNOSC) return blad('nieczytelny');
    // Pole niepewne: najniższa pewność słowa w linii pola < 70
    const pola = [];
    let biezace = null;
    for (const ws of linie) {
      const tx = ws.map((w) => w.tekst).join(' ');
      const p = POLA.find(([, re]) => re.test(tx));
      if (p) biezace = p[0];
      const min = Math.min(...ws.filter((w) => w.conf >= 0).map((w) => w.conf));
      if (biezace && Number.isFinite(min) && min < PROG_NIEPEWNOSCI) {
        const nisk = ws.filter((w) => w.conf >= 0 && w.conf < PROG_NIEPEWNOSCI).map((w) => w.tekst);
        const ist = pola.find((x) => x.pole === biezace);
        if (ist) { ist.pewnosc = Math.min(ist.pewnosc, Math.round(min)); ist.slowa.push(...nisk); }
        else pola.push({ pole: biezace, pewnosc: Math.round(min), slowa: nisk });
      }
    }
    return { status: 'ok', zrodlo: 'tesseract_pol_200dpi', tekst, pewnosc_srednia: Math.round(srednia), pola_niepewne: pola, czas_ms: Date.now() - t0 };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
