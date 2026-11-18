// Szkielet serwera aplikacji ZANT (Node.js, bez zewnętrznych zależności).
// Nasłuchuje na porcie 3000 (process.env.PORT || 3000).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sprawdzZgloszenie } from './logika/asystent.mjs';
import { wczytajBazeUczaca, ocenSpraweBazowa } from './logika/bazowa.mjs';
import { wyciagnijTekstZPdf } from './logika/parser.mjs';
import { ocen } from '../ocena/ocen.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(__dirname, 'public');
const ZBIOR_DIR = path.join(ROOT, 'dane', 'zbior');

function czytajBody(req, limitBytes = 5 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (c) => {
      total += c.length;
      if (total > limitBytes) {
        reject(new Error('Przekroczono limit rozmiaru żądania'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function wyslijJson(res, status, dane) {
  const body = JSON.stringify(dane, null, 2);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

function wczytajTestowe(limit = 1000) {
  const kat = path.join(ZBIOR_DIR, 'testowy');
  if (!fs.existsSync(kat)) return [];
  return fs.readdirSync(kat)
    .sort()
    .slice(0, limit)
    .map((id) => {
      const p = path.join(kat, id);
      if (!fs.statSync(p).isDirectory()) return null;
      const txtPath = path.join(p, 'zgloszenie.txt');
      const wejPath = path.join(p, 'wejscie.json');
      return {
        id,
        tekst: fs.existsSync(txtPath) ? fs.readFileSync(txtPath, 'utf8') : '',
        wejscie: fs.existsSync(wejPath) ? JSON.parse(fs.readFileSync(wejPath, 'utf8')) : null,
      };
    })
    .filter(Boolean);
}

export function utworzSerwer({ katalogZbioru = ZBIOR_DIR } = {}) {
  const baza = wczytajBazeUczaca(path.join(katalogZbioru, 'uczacy'));

  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://localhost');

    if (req.method === 'GET' && url.pathname === '/health') {
      return wyslijJson(res, 200, {
        ok: true,
        aplikacja: 'ZANT (szkielet 0P)',
        przypadki_uczace: baza.sprawy.length,
      });
    }

    if (req.method === 'GET' && url.pathname === '/api/przypadki') {
      const testowe = wczytajTestowe().map((t) => ({
        id: t.id,
        tekst: t.tekst,
        dzialalnosc: t.wejscie?.dzialalnosc || null,
        skladki: t.wejscie?.skladki || null,
        dokumentacja_medyczna: t.wejscie?.dokumentacja_medyczna || null,
      }));
      return wyslijJson(res, 200, {
        uczace_liczba: baza.sprawy.length,
        testowe_liczba: testowe.length,
        testowe,
      });
    }

    if (req.method === 'POST' && url.pathname === '/api/asystent/sprawdz') {
      try {
        const body = JSON.parse((await czytajBody(req)) || '{}');
        const wynik = sprawdzZgloszenie(body);
        return wyslijJson(res, 200, wynik);
      } catch (err) {
        return wyslijJson(res, 400, { blad: err.message });
      }
    }

    if (req.method === 'POST' && url.pathname === '/api/zus/rekomendacja') {
      try {
        const body = JSON.parse((await czytajBody(req)) || '{}');
        // Obsługa jednej sprawy lub paczki (min. 5 spraw testowych z zadania §6)
        const lista = Array.isArray(body.sprawy)
          ? body.sprawy
          : [body];
        const wyniki = lista.map((item, idx) => {
          let tekst = item.tekst || item.tekstZgloszenia || '';
          if (!tekst && item.pdfBase64) {
            tekst = wyciagnijTekstZPdf(Buffer.from(item.pdfBase64, 'base64'));
          }
          return {
            id: item.id || `S${String(idx + 1).padStart(3, '0')}`,
            ...ocenSpraweBazowa({
              tekstZgloszenia: tekst,
              wejscie: item.wejscie || item,
              baza,
            }),
          };
        });
        return wyslijJson(res, 200, Array.isArray(body.sprawy) ? { liczba: wyniki.length, wyniki } : wyniki[0]);
      } catch (err) {
        return wyslijJson(res, 400, { blad: err.message });
      }
    }

    // Licznik zgodności ze wzorcem: ta sama funkcja co `npm run ocen`, ograniczona do podanych spraw testowych.
    if (req.method === 'POST' && url.pathname === '/api/zus/zgodnosc') {
      try {
        const body = JSON.parse((await czytajBody(req)) || '{}');
        const zadane = Array.isArray(body.ids) ? body.ids.map(String) : [];
        const dostepne = new Set(fs.readdirSync(path.join(katalogZbioru, 'testowy')));
        const znane = [...new Set(zadane.filter((id) => dostepne.has(id)))];
        const bez = zadane.filter((id) => !dostepne.has(id));
        if (!znane.length) return wyslijJson(res, 200, { x: 0, y: 0, bez_wzorca: bez, tekst: 'Brak wzorca dla wgranych spraw' });
        const r = ocen({ zbior: katalogZbioru, zrodlo: 'txt', ids: znane });
        return wyslijJson(res, 200, {
          x: r.exactKw, y: r.n, fp: r.fp, fn: r.fn, bez_wzorca: bez,
          tekst: `${r.exactKw} z ${r.n}`, podsumowanie: r.podsumowanie,
        });
      } catch (err) {
        return wyslijJson(res, 400, { blad: err.message });
      }
    }

    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      const htmlPath = path.join(PUBLIC_DIR, 'index.html');
      if (!fs.existsSync(htmlPath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Brak index.html');
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(htmlPath, 'utf8'));
    }

    wyslijJson(res, 404, { blad: 'Nie znaleziono zasobu' });
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  const serwer = utworzSerwer();
  serwer.listen(port, '0.0.0.0', () => {
    console.log(`ZANT szkielet działa na http://0.0.0.0:${port}`);
  });
}
