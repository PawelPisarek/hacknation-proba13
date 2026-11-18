// Szkielet serwera aplikacji ZANT (Node.js, bez zewnętrznych zależności).
// Nasłuchuje na porcie 3000 (process.env.PORT || 3000).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sprawdzZgloszenie } from './logika/asystent.mjs';
import { wczytajBazeUczaca, ocenSpraweBazowa } from './logika/bazowa.mjs';
import { wyciagnijTekstZPdf, parsujZgloszenieTekst } from './logika/parser.mjs';
import { odczytajPdf } from './logika/ocr.mjs';
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

const KWALIFIKACJE = ['UZNAC', 'NIE_UZNAC', 'DO_UZUPELNIENIA'];

export function utworzSerwer({ katalogZbioru = ZBIOR_DIR } = {}) {
  const baza = wczytajBazeUczaca(path.join(katalogZbioru, 'uczacy'));
  // Pamięć serwera: zgłoszenia przedsiębiorców i decyzje pracowników (do restartu procesu).
  const zgloszenia = new Map();

  const rekomendujZapisane = (rek) => ocenSpraweBazowa({
    tekstZgloszenia: rek.tekst || '',
    wejscie: rek.wejscie || {},
    baza,
  });
  const widok = (rek) => ({
    numer: rek.numer,
    wyslano: rek.wyslano,
    mimo_brakow: rek.mimo_brakow,
    braki: rek.braki,
    zgloszenie: rek.wejscie?.zgloszenie || null,
    rekomendacja: rekomendujZapisane(rek),
    decyzja: rek.decyzja,
  });

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
          let odczyt = null;
          if (!tekst && item.pdfBase64) {
            odczyt = odczytajPdf(Buffer.from(item.pdfBase64, 'base64'));
            if (odczyt.status !== 'ok') {
              // Nieczytelny plik to NIE rekomendacja NIE_UZNAC — pokazujemy komunikat i nic nie rekomendujemy.
              return { id: item.id || `S${String(idx + 1).padStart(3, '0')}`, odczyt, kwalifikacja_zdarzenia: null, rekomendacja: null };
            }
            tekst = odczyt.tekst;
          }
          return {
            id: item.id || `S${String(idx + 1).padStart(3, '0')}`,
            ...ocenSpraweBazowa({
              tekstZgloszenia: tekst,
              wejscie: item.wejscie || item,
              baza,
            }),
            odczyt: odczyt ? { status: odczyt.status, zrodlo: odczyt.zrodlo, pewnosc_srednia: odczyt.pewnosc_srednia, pola_niepewne: odczyt.pola_niepewne, czas_ms: odczyt.czas_ms } : null,
          };
        });
        return wyslijJson(res, 200, Array.isArray(body.sprawy) ? { liczba: wyniki.length, wyniki } : wyniki[0]);
      } catch (err) {
        return wyslijJson(res, 400, { blad: err.message });
      }
    }

    // Licznik zgodności ze wzorcem: rekomendacja systemu dla TREŚCI wgranego pliku (nie oryginału z dysku)
    // porównana z etykietą wzorca sprawy o tym ID (nazwa pliku Wxxx). Y = wgrane sprawy ze znanym wzorcem.
    if (req.method === 'POST' && url.pathname === '/api/zus/zgodnosc') {
      try {
        const body = JSON.parse((await czytajBody(req)) || '{}');
        const dostepne = new Set(fs.readdirSync(path.join(katalogZbioru, 'testowy')));
        const pozycje = Array.isArray(body.sprawy) ? body.sprawy : (Array.isArray(body.ids) ? body.ids.map((id) => ({ id })) : []);
        const bez = []; const nieodczytane = []; const wiersze = [];
        let x = 0, fp = 0, fn = 0;
        for (const it of pozycje) {
          const id = String(it.id || '').replace(/\.[^.]*$/, '').match(/^W\d+/)?.[0] || String(it.id || '');
          if (!dostepne.has(id)) { bez.push(id); continue; }
          const katalog = path.join(katalogZbioru, 'testowy', id);
          const wzorzec = JSON.parse(fs.readFileSync(path.join(katalog, 'karta.json'), 'utf8'));
          const wej = JSON.parse(fs.readFileSync(path.join(katalog, 'wejscie.json'), 'utf8'));
          let tekst = it.tekst || '';
          if (!tekst && it.pdfBase64) {
            const o = odczytajPdf(Buffer.from(it.pdfBase64, 'base64'));
            if (o.status !== 'ok') { nieodczytane.push(id); continue; }
            tekst = o.tekst;
          }
          // samo ID bez treści (np. test): oryginał z dysku
          if (!tekst && !it.wejscie?.zgloszenie) tekst = fs.readFileSync(path.join(katalog, 'zgloszenie.txt'), 'utf8');
          // wgrany JSON ma pierwszeństwo (jego zgloszenie), w przeciwnym razie tekst; dane rejestrowe (CEIDG/składki) z bazy
          const w = it.wejscie || {};
          const wynik = ocenSpraweBazowa({
            tekstZgloszenia: tekst,
            wejscie: { dzialalnosc: w.dzialalnosc || wej.dzialalnosc, skladki: w.skladki || wej.skladki, dokumentacja_medyczna: w.dokumentacja_medyczna ?? wej.dokumentacja_medyczna, zgloszenie: w.zgloszenie },
            baza,
          });
          const ref = wzorzec.kwalifikacja_zdarzenia || wzorzec.karta.kwalifikacja_zdarzenia;
          const trafna = ref === wynik.kwalifikacja_zdarzenia;
          if (trafna) x++;
          else if (ref !== 'UZNAC' && wynik.kwalifikacja_zdarzenia === 'UZNAC') fp++;
          else if (ref === 'UZNAC' && wynik.kwalifikacja_zdarzenia !== 'UZNAC') fn++;
          wiersze.push({ id, rekomendacja: wynik.kwalifikacja_zdarzenia, wzorzec: ref, trafna });
        }
        const y = wiersze.length;
        if (!y) return wyslijJson(res, 200, { x: 0, y: 0, bez_wzorca: bez, nieodczytane, tekst: 'Brak wzorca dla wgranych spraw' });
        return wyslijJson(res, 200, { x, y, fp, fn, bez_wzorca: bez, nieodczytane, wiersze, tekst: `${x} z ${y}`, podsumowanie: `rekomendacja dla wgranej treści: ${x}/${y}, FP=${fp}, FN=${fn}` });
      } catch (err) {
        return wyslijJson(res, 400, { blad: err.message });
      }
    }

    // Ścieżka przedsiębiorca → ZUS: zapis zgłoszenia w pamięci serwera, numer sprawy
    if (req.method === 'POST' && url.pathname === '/api/zgloszenia') {
      try {
        const body = JSON.parse((await czytajBody(req)) || '{}');
        const zgl = body.zgloszenie || body.wejscie?.zgloszenie || null;
        const tekst = body.tekst || '';
        if (!zgl && !tekst) return wyslijJson(res, 400, { blad: 'Brak treści zgłoszenia' });
        const sprawdzenie = sprawdzZgloszenie(zgl ? { zgloszenie: zgl } : { zgloszenie: parsujZgloszenieTekst(tekst) });
        const numer = 'ZG-' + String(zgloszenia.size + 1).padStart(4, '0');
        const rek = {
          numer,
          wyslano: new Date().toISOString(),
          mimo_brakow: sprawdzenie.liczba_brakow > 0,
          braki: sprawdzenie.braki,
          tekst,
          wejscie: { ...(body.wejscie || {}), zgloszenie: zgl || undefined },
          decyzja: null,
        };
        zgloszenia.set(numer, rek);
        return wyslijJson(res, 201, { numer, mimo_brakow: rek.mimo_brakow, braki: rek.braki });
      } catch (err) {
        return wyslijJson(res, 400, { blad: err.message });
      }
    }

    const mZg = url.pathname.match(/^\/api\/zgloszenia\/([A-Za-z0-9-]+)(\/decyzja)?$/);
    if (mZg) {
      const rek = zgloszenia.get(mZg[1].toUpperCase());
      if (!rek) return wyslijJson(res, 404, { blad: 'Nie ma sprawy o tym numerze' });
      if (req.method === 'GET' && !mZg[2]) return wyslijJson(res, 200, widok(rek));
      if (req.method === 'POST' && mZg[2]) {
        try {
          const body = JSON.parse((await czytajBody(req)) || '{}');
          const decyzja = String(body.decyzja || '').toUpperCase();
          const powod = String(body.powod || '').trim();
          if (!['ZATWIERDZ', 'ODRZUC', 'ZMIEN'].includes(decyzja)) return wyslijJson(res, 400, { blad: 'decyzja: ZATWIERDZ | ODRZUC | ZMIEN' });
          if (decyzja !== 'ZATWIERDZ' && !powod) return wyslijJson(res, 400, { blad: 'Powód jest wymagany przy odrzuceniu i zmianie' });
          const rekomendacja = rekomendujZapisane(rek).kwalifikacja_zdarzenia;
          let wynik = rekomendacja;
          if (decyzja === 'ZMIEN') {
            wynik = String(body.nowa_kwalifikacja || '').toUpperCase();
            if (!KWALIFIKACJE.includes(wynik) || wynik === rekomendacja) return wyslijJson(res, 400, { blad: 'Zmień na: inną z UZNAC | NIE_UZNAC | DO_UZUPELNIENIA' });
          } else if (decyzja === 'ODRZUC') {
            wynik = null; // odrzucona rekomendacja systemu, bez własnej kwalifikacji
          }
          rek.decyzja = { decyzja, rekomendacja_systemu: rekomendacja, kwalifikacja_pracownika: wynik, powod: powod || null, czas: new Date().toISOString() };
          return wyslijJson(res, 200, widok(rek));
        } catch (err) {
          return wyslijJson(res, 400, { blad: err.message });
        }
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
