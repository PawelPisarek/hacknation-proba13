// Test dymny głównej ścieżki demo (poziom 2 „działa na pewno”): uruchamia serwer lokalnie (bez Dockera i Tesseracta)
// i przechodzi: W052 (opis ogólnikowy → pytania → lista braków → wysyłam mimo braków → numer ZG-…)
// oraz paczkę ZUS 6 spraw (W020/W027 odmowa, W038 z wyłączeniem). Użycie: node scripts/sprawdz-demo.mjs
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.DEMO_PORT || 3077);
const BASE = `http://127.0.0.1:${PORT}`;
let ok = 0, bad = 0;
const krok = (nazwa, http, warunek, szczegol = '') => {
  const dobrze = Boolean(warunek);
  dobrze ? ok++ : bad++;
  console.log(`${dobrze ? 'OK   ' : 'BŁĄD '} [HTTP ${http}] ${nazwa}${dobrze || !szczegol ? '' : ' — ' + szczegol}`);
};
const zapytaj = async (metoda, url, body) => {
  try {
    const r = await fetch(BASE + url, { method: metoda, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
    const tekst = await r.text();
    let json = null; try { json = JSON.parse(tekst); } catch { /* HTML */ }
    return { status: r.status, json, tekst };
  } catch (e) { return { status: 0, json: null, tekst: String(e.message) }; }
};

// Stan trwały w katalogu tymczasowym, żeby nie dotykać prawdziwych danych
const dane = fs.mkdtempSync(path.join(os.tmpdir(), 'demo-dane-'));
const serwer = spawn(process.execPath, ['app/server.mjs'], { cwd: ROOT, env: { ...process.env, PORT: String(PORT), DANE_DIR: dane }, stdio: 'ignore' });
const koniec = (kod) => { serwer.kill(); fs.rmSync(dane, { recursive: true, force: true }); process.exit(kod); };

try {
  let h = { status: 0 };
  for (let i = 0; i < 40 && h.status !== 200; i++) { h = await zapytaj('GET', '/health'); if (h.status !== 200) await new Promise((r) => setTimeout(r, 250)); }
  krok('serwer wstał (/health)', h.status, h.status === 200);
  const g = await zapytaj('GET', '/');
  krok('strona główna', g.status, g.status === 200 && /<html/i.test(g.tekst));

  // --- Ścieżka W052: przedsiębiorca ---
  const w052 = JSON.parse(fs.readFileSync(path.join(ROOT, 'dane/zbior/testowy/W052/wejscie.json'), 'utf8'));
  const zgl = { ...w052.zgloszenie, opis_okolicznosci: 'Poślizgnąłem się w pracy.' };
  const sp = await zapytaj('POST', '/api/asystent/sprawdz', { zgloszenie: zgl });
  const kody = (sp.json?.braki || []).map((b) => b.kod || b);
  krok('opis ogólnikowy wykryty (opis_ogolnikowy)', sp.status, sp.status === 200 && kody.includes('opis_ogolnikowy'), `braki: ${kody.join(',')}`);
  const pyt = (sp.json?.podpowiedzi || []).find((p) => p.kod === 'opis_ogolnikowy');
  krok('asystent zadaje pytania doprecyzowujące', sp.status, Array.isArray(pyt?.pytania) && pyt.pytania.length >= 1);
  krok('lista braków niepusta', sp.status, (sp.json?.liczba_brakow ?? kody.length) > 0, `liczba_brakow=${sp.json?.liczba_brakow}`);
  const wys = await zapytaj('POST', '/api/zgloszenia', { zgloszenie: zgl });
  const numer = wys.json?.numer;
  krok('„wysyłam mimo braków” → numer ZG-…', wys.status, wys.status === 201 && /^ZG-\d{4}$/.test(numer || '') && wys.json?.mimo_brakow === true, JSON.stringify(wys.json)?.slice(0, 120));
  const otw = await zapytaj('GET', `/api/zgloszenia/${numer}`);
  krok(`pracownik otwiera sprawę po numerze ${numer}`, otw.status, otw.status === 200);
  const dec = await zapytaj('POST', `/api/zgloszenia/${numer}/decyzja`, { decyzja: 'ZATWIERDZ' });
  krok('decyzja pracownika zapisana (ZATWIERDZ)', dec.status, dec.status === 200 && dec.json?.decyzja?.decyzja === 'ZATWIERDZ');

  // --- Paczka ZUS 6 spraw ---
  const ids = ['W052', 'W006', 'W023', 'W020', 'W027', 'W038'];
  const sprawy = ids.map((id) => {
    const d = path.join(ROOT, 'dane/zbior/testowy', id);
    const wej = JSON.parse(fs.readFileSync(path.join(d, 'wejscie.json'), 'utf8'));
    return { id, tekst: fs.readFileSync(path.join(d, 'zgloszenie.txt'), 'utf8'), wejscie: wej };
  });
  const pa = await zapytaj('POST', '/api/zus/rekomendacja', { sprawy });
  krok('paczka 6 spraw przyjęta', pa.status, pa.status === 200 && pa.json?.liczba === 6);
  for (const w of pa.json?.wyniki || []) {
    const karta = JSON.parse(fs.readFileSync(path.join(ROOT, 'dane/zbior/testowy', w.id, 'karta.json'), 'utf8'));
    const ref = karta.kwalifikacja_zdarzenia || karta.karta?.kwalifikacja_zdarzenia;
    krok(`${w.id}: rekomendacja ${w.kwalifikacja_zdarzenia} (wzorzec ${ref})`, pa.status, w.kwalifikacja_zdarzenia === ref);
  }
  const wyn = Object.fromEntries((pa.json?.wyniki || []).map((w) => [w.id, w]));
  krok('W020 i W027: odmowa (NIE_UZNAC)', pa.status, wyn.W020?.kwalifikacja_zdarzenia === 'NIE_UZNAC' && wyn.W027?.kwalifikacja_zdarzenia === 'NIE_UZNAC');
  krok('W038: UZNAC z wyłączeniem art. 21 ust. 2–3', pa.status, wyn.W038?.kwalifikacja_zdarzenia === 'UZNAC' && /ART_21/.test(wyn.W038?.wylaczenia_swiadczen || ''), String(wyn.W038?.wylaczenia_swiadczen));
} catch (e) {
  krok('wyjątek skryptu', 0, false, e.message);
}
console.log(`WYNIK sprawdz-demo: ${ok} OK, ${bad} BŁĄD → ${bad === 0 ? 'DZIAŁA' : 'NIE DZIAŁA'}`);
koniec(bad === 0 ? 0 : 1);
