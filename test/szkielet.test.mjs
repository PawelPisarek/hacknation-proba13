import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { sprawdzZgloszenie } from '../app/logika/asystent.mjs';
import { parsujZgloszenieTekst } from '../app/logika/parser.mjs';
import { ocenSpraweBazowa, wczytajBazeUczaca } from '../app/logika/bazowa.mjs';
import { utworzSerwer } from '../app/server.mjs';
import { ocen } from '../ocena/ocen.mjs';

test('asystent wskazuje braki i nigdy nie blokuje wysłania', () => {
  const res = sprawdzZgloszenie({
    zgloszenie: {
      wypadek: { data: '2026-05-10', godzina: null, miejsce: 'warsztat' },
      rodzaj_urazu: 'złamanie ręki',
      opis_okolicznosci: 'Poślizgnąłem się w pracy.',
      swiadkowie: [],
      zalaczniki: [],
    },
  });
  assert.equal(res.mozna_wyslac, true);
  assert.ok(res.braki.includes('godzina'));
  assert.ok(res.braki.includes('opis_ogolnikowy'));
  assert.ok(res.braki.includes('zalacznik_dokumentacja_medyczna'));
  assert.doesNotMatch(res.komunikat_ogolny, /uznaj|odmow|błąd nie przekreśla/i);
});

test('parser odczytuje kluczowe pola z zgloszenie.txt', () => {
  const kat = path.resolve('dane/zbior/testowy');
  const pierwszy = fs.readdirSync(kat).sort()[0];
  const txt = fs.readFileSync(path.join(kat, pierwszy, 'zgloszenie.txt'), 'utf8');
  const wej = JSON.parse(fs.readFileSync(path.join(kat, pierwszy, 'wejscie.json'), 'utf8'));
  const p = parsujZgloszenieTekst(txt);
  assert.equal(p.wypadek.data, wej.zgloszenie.wypadek.data);
  assert.equal(p.wypadek.miejsce, wej.zgloszenie.wypadek.miejsce);
  assert.ok(p.okolicznosci.length > 20);
  assert.ok(p.przyczyna && p.przyczyna.length > 5);
});

test('skrypt oceny działa na odłożonym zbiorze testowym (txt i pdf, n >= 10)', () => {
  const rTxt = ocen({ zrodlo: 'txt', szczegoly: false });
  assert.ok(rTxt.n >= 10);
  assert.ok(rTxt.acc >= 0.8);
  const rPdf = ocen({ zrodlo: 'pdf', szczegoly: false });
  assert.equal(rPdf.n, rTxt.n);
  assert.ok(rPdf.acc >= 0.8);
  assert.ok(rPdf.pola.data === rPdf.n);
  assert.ok(rPdf.pola.okolicznosci >= rPdf.n - 1);
});

test('serwer HTTP obsługuje /health, asystenta i paczkę 5 zgłoszeń', async () => {
  const serwer = utworzSerwer();
  await new Promise((res) => serwer.listen(0, '127.0.0.1', res));
  const { port } = serwer.address();
  const base = `http://127.0.0.1:${port}`;
  try {
    const h = await (await fetch(`${base}/health`)).json();
    assert.equal(h.ok, true);
    assert.ok(h.przypadki_uczace >= 20);

    const p = await (await fetch(`${base}/api/przypadki`)).json();
    assert.ok(p.testowe.length >= 5);

    const paczka = p.testowe.slice(0, 5).map((t) => ({
      id: t.id,
      tekst: t.tekst,
      wejscie: { dzialalnosc: t.dzialalnosc, skladki: t.skladki, dokumentacja_medyczna: t.dokumentacja_medyczna },
    }));
    const r = await (await fetch(`${base}/api/zus/rekomendacja`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sprawy: paczka }),
    })).json();
    assert.equal(r.liczba, 5);
    assert.ok(r.wyniki.every((w) => ['UZNAC', 'NIE_UZNAC', 'DO_UZUPELNIENIA'].includes(w.kwalifikacja_zdarzenia)));
    assert.ok(r.wyniki.every((w) => ['BRAK', 'ART_21_1_RAZACE_NIEDBALSTWO', 'ART_21_2_3_NIETRZEZWOSC', 'ART_6_2_ZADLUZENIE'].includes(w.wylaczenia_swiadczen)));
    assert.ok(r.wyniki.every((w) => w.projekt_karty && w.projekt_karty.III_wypadek && /2022 poz\. 223/.test(w.projekt_karty.podstawa_wzoru)));
  } finally {
    await new Promise((res) => serwer.close(res));
  }
});

test('reguły z docs/materialy.md §6: próg 1% min. wyn. (art. 6 ust. 2), 5b (bez przyczynienia), 5c (brak pracy), DO_UZUPELNIENIA', () => {
  const zadluzony = ocenSpraweBazowa({
    wejscie: {
      zgloszenie: { wypadek: { data: '2026-04-10', miejsce: 'warsztat' }, rodzaj_urazu: 'złamanie ręki', opis_okolicznosci: 'Podnośnik przechylił się i przygniótł dłoń podczas wymiany koła.' },
      skladki: { ubezpieczenie_wypadkowe: true, zadluzenie_przekracza_1_proc_min_wyn: true, zadluzenie_proc_min_wyn: 4.2 },
      dokumentacja_medyczna: { rozpoznanie: 'złamanie ręki' },
    },
    baza: { sprawy: [], idf: new Map() },
  });
  assert.equal(zadluzony.kwalifikacja_zdarzenia, 'UZNAC');
  assert.equal(zadluzony.wylaczenia_swiadczen, 'ART_6_2_ZADLUZENIE');
  assert.match(zadluzony.wylaczenie_swiadczen, /1% minimalnego wynagrodzenia/);
  assert.doesNotMatch(zadluzony.wylaczenie_swiadczen, /2,00 zł|2 zł/);

  const bezPrzyczynienia = ocenSpraweBazowa({
    wejscie: {
      zgloszenie: { wypadek: { data: '2026-05-02', miejsce: 'magazyn klienta' }, rodzaj_urazu: 'złamanie obojczyka', opis_okolicznosci: 'Wózek widłowy operatora klienta uderzył mnie z tyłu podczas rozładunku.' },
      wyjasnienia_poszkodowanego: 'Badanie wykazało 0,6 promila, ale wina osoby trzeciej — brak przyczynienia się poszkodowanego.',
      skladki: { ubezpieczenie_wypadkowe: true, zadluzenie_przekracza_1_proc_min_wyn: false },
      dokumentacja_medyczna: { rozpoznanie: 'złamanie obojczyka' },
    },
    baza: { sprawy: [], idf: new Map() },
  });
  assert.equal(bezPrzyczynienia.kwalifikacja_zdarzenia, 'UZNAC');
  assert.equal(bezPrzyczynienia.wylaczenia_swiadczen, 'BRAK');

  const zerwanaPraca = ocenSpraweBazowa({
    wejscie: {
      zgloszenie: { wypadek: { data: '2026-05-03', miejsce: 'zaplecze' }, rodzaj_urazu: 'rana głowy', opis_okolicznosci: 'Przerwałem prace remontowe, spożywałem alkohol i upadłem.' },
      wyjasnienia_poszkodowanego: 'Świadek potwierdził, że nie świadczyłem pracy.',
      skladki: { ubezpieczenie_wypadkowe: true },
      dokumentacja_medyczna: { rozpoznanie: 'rana głowy' },
    },
    baza: { sprawy: [], idf: new Map() },
  });
  assert.equal(zerwanaPraca.kwalifikacja_zdarzenia, 'NIE_UZNAC');
  assert.equal(zerwanaPraca.wylaczenia_swiadczen, 'BRAK');
});

test('licznik zgodności w API = wynik skryptu oceny dla tych samych spraw; UI ma licznik', async () => {
  const serwer = utworzSerwer();
  await new Promise((res) => serwer.listen(0, '127.0.0.1', res));
  const base = `http://127.0.0.1:${serwer.address().port}`;
  try {
    const p = await (await fetch(`${base}/api/przypadki`)).json();
    assert.equal(p.testowe_liczba, 13);
    const ids = ["W052", "W006", "W023", "W020", "W027", "W038"];
    const z = await (await fetch(`${base}/api/zus/zgodnosc`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: [...ids, 'MOJA.txt'] }),
    })).json();
    const r = ocen({ zrodlo: 'txt', ids });
    assert.equal(z.y, 6);
    assert.equal(z.x, r.exactKw);
    assert.equal(z.tekst, `${r.exactKw} z ${r.n}`);
    assert.deepEqual(z.bez_wzorca, ['MOJA.txt']);
    const pusty = await (await fetch(`${base}/api/zus/zgodnosc`, { method: 'POST', body: JSON.stringify({ ids: ['X'] }) })).json();
    assert.equal(pusty.y, 0);
    const html = await (await fetch(`${base}/`)).text();
    assert.match(html, /id="z-licznik"/);
    assert.match(html, /Trafne rekomendacje/);
    assert.match(html, /6 spraw testowych/);
  } finally {
    await new Promise((res) => serwer.close(res));
  }
});

test('ogólniki > 55 znaków (5/5) dostają pytanie o opis; pełne opisy z testowego nie', async () => {
  const { czyOpisOgolnikowy } = await import('../app/logika/asystent.mjs');
  const lines = fs.readFileSync('dane/parafrazy/ogolniki.txt', 'utf8').split('\n').filter(Boolean);
  assert.equal(lines.length, 5);
  for (const l of lines) {
    assert.ok(l.length > 55);
    const r = sprawdzZgloszenie({ zgloszenie: { opis_okolicznosci: l, wypadek: { data: 'x', godzina: 'x', miejsce: 'x' }, rodzaj_urazu: 'x' } });
    assert.ok(r.braki.includes('opis_ogolnikowy'), l);
    const p = r.podpowiedzi.find((x) => x.kod === 'opis_ogolnikowy');
    assert.match(p.pytanie, /czynność|robił/i);
  }
  const kat = path.resolve('dane/zbior/testowy');
  for (const id of fs.readdirSync(kat)) {
    const w = JSON.parse(fs.readFileSync(path.join(kat, id, 'wejscie.json'), 'utf8'));
    const o = w.zgloszenie.opis_okolicznosci;
    if (o.length >= 55) assert.equal(czyOpisOgolnikowy(o, w.zgloszenie.rodzaj_urazu), false, id);
  }
});

test('ścieżka: wyślij zgłoszenie → numer → pracownik otwiera po numerze → decyzja zapisana w pamięci serwera', async () => {
  const serwer = utworzSerwer();
  await new Promise((res) => serwer.listen(0, '127.0.0.1', res));
  const base = `http://127.0.0.1:${serwer.address().port}`;
  const post = (u, b) => fetch(base + u, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) });
  try {
    const zgl = {
      wypadek: { data: '2026-06-15', godzina: '10:00', miejsce: 'budynek klienta, ul. Lipowa 10' },
      adres_dzialalnosci: 'ul. Lipowa 1, Kielce', planowane_godziny_pracy: { od: '08:00', do: '16:00' },
      rodzaj_urazu: 'skręcenie kostki', opis_okolicznosci: 'Montowałem półki u klienta, stałem na drabinie i poślizgnąłem się, uderzyłem kostką o szczebel.',
      pierwsza_pomoc: { kto_gdzie: 'SOR Kielce' }, zalaczniki: ['karta informacyjna ze szpitala'], swiadkowie: [],
    };
    const w = await post('/api/zgloszenia', { zgloszenie: zgl });
    assert.equal(w.status, 201);
    const { numer } = await w.json();
    assert.match(numer, /^ZG-\d{4}$/);
    const o = await (await fetch(`${base}/api/zgloszenia/${numer}`)).json();
    assert.equal(o.numer, numer);
    assert.ok(o.rekomendacja.kwalifikacja_zdarzenia);
    assert.ok(o.rekomendacja.projekt_karty);
    assert.equal(o.decyzja, null);
    assert.equal((await post(`/api/zgloszenia/${numer}/decyzja`, { decyzja: 'ODRZUC' })).status, 400); // powód wymagany
    assert.equal((await post(`/api/zgloszenia/${numer}/decyzja`, { decyzja: 'ZMIEN', powod: 'x', nowa_kwalifikacja: o.rekomendacja.kwalifikacja_zdarzenia })).status, 400);
    const z = await post(`/api/zgloszenia/${numer}/decyzja`, { decyzja: 'ZMIEN', powod: 'brak dowodu', nowa_kwalifikacja: 'DO_UZUPELNIENIA' === o.rekomendacja.kwalifikacja_zdarzenia ? 'UZNAC' : 'DO_UZUPELNIENIA' });
    assert.equal(z.status, 200);
    const po = await (await fetch(`${base}/api/zgloszenia/${numer}`)).json(); // „odświeżenie”
    assert.equal(po.decyzja.decyzja, 'ZMIEN');
    assert.equal(po.decyzja.powod, 'brak dowodu');
    assert.equal((await fetch(`${base}/api/zgloszenia/ZG-9999`)).status, 404);
    const brak = await (await post('/api/zgloszenia', { zgloszenie: { opis_okolicznosci: 'Upadłem.' } })).json();
    assert.equal(brak.mimo_brakow, true);
  } finally { serwer.close(); }
});

test('licznik liczy treść wgranego pliku: podmieniony opis zmienia licznik', async () => {
  const serwer = utworzSerwer();
  await new Promise((res) => serwer.listen(0, '127.0.0.1', res));
  const base = `http://127.0.0.1:${serwer.address().port}`;
  const zg = (id) => fs.readFileSync(`dane/zbior/testowy/${id}/zgloszenie.txt`, 'utf8');
  const licz = async (sprawy) => (await fetch(`${base}/api/zus/zgodnosc`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sprawy }) })).json();
  try {
    const orygin = await licz([{ id: 'W006.txt', tekst: zg('W006') }]);
    assert.deepEqual([orygin.x, orygin.y], [1, 1]);
    const podmieniony = await licz([{ id: 'W006.txt', tekst: zg('W020') }]); // treść innej sprawy pod ID W006
    assert.deepEqual([podmieniony.x, podmieniony.y], [0, 1]);
    const obcy = await licz([{ id: 'MOJA.txt', tekst: zg('W006') }]);
    assert.equal(obcy.y, 0);
    assert.equal(obcy.tekst, 'Brak wzorca dla wgranych spraw');
  } finally { serwer.close(); }
});

test('telefon: przyciski i pola ≥ 48 px (min-height w CSS), viewport 360 px bez poziomego przewijania', async () => {
  const html = fs.readFileSync('app/public/index.html', 'utf8');
  assert.match(html, /\.btn, \.tabs button, summary \{ min-height: 48px; \}/);
  assert.match(html, /input, textarea, select \{ min-height: 48px;/);
  assert.match(html, /name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /@media \(max-width: 480px\)/);
});

test('uzasadnienie: 1–2 podobne sprawy tylko z uczącego, cytat z dokumentu sprawy, pełne opisy z testowego', () => {
  const baza = wczytajBazeUczaca('dane/zbior/uczacy');
  const kat = 'dane/zbior/testowy';
  for (const id of ['W006', 'W023', 'W020', 'W027', 'W038']) {
    const txt = fs.readFileSync(`${kat}/${id}/zgloszenie.txt`, 'utf8');
    const w = JSON.parse(fs.readFileSync(`${kat}/${id}/wejscie.json`, 'utf8'));
    const r = ocenSpraweBazowa({ tekstZgloszenia: txt, wejscie: { dzialalnosc: w.dzialalnosc, skladki: w.skladki, dokumentacja_medyczna: w.dokumentacja_medyczna }, baza });
    assert.ok(r.podobne_sprawy.length >= 1 && r.podobne_sprawy.length <= 2, id);
    for (const p of r.podobne_sprawy) assert.ok(baza.sprawy.some((s) => s.id === p.id) && !fs.existsSync(`${kat}/${p.id}`), `${id}: ${p.id} nie z uczącego`);
    const m = r.uzasadnienie.match(/Cytat z dokumentu sprawy: „(.+?)”\./);
    assert.ok(m, `${id}: brak cytatu`);
    const norm = (t) => t.replace(/\s+/g, ' ');
    assert.ok(norm(txt).includes(m[1].replace(/…$/, '')), `${id}: cytat nie występuje w dokumencie`);
  }
});

test('uzasadnienie E2: W038 bez wyłączenia w przyczynie, podobne ≥0.3, W006 bez duplikatu', () => {
  const baza = wczytajBazeUczaca('dane/zbior/uczacy');
  const oc = (id) => {
    const w = JSON.parse(fs.readFileSync(`dane/zbior/testowy/${id}/wejscie.json`, 'utf8'));
    return ocenSpraweBazowa({ tekstZgloszenia: fs.readFileSync(`dane/zbior/testowy/${id}/zgloszenie.txt`, 'utf8'), wejscie: { dzialalnosc: w.dzialalnosc, skladki: w.skladki, dokumentacja_medyczna: w.dokumentacja_medyczna }, baza });
  };
  const r38 = oc('W038');
  const przyczyna = r38.uzasadnienie.match(/przyczyna zewnętrzna \(([^)]*)\)/)?.[1] || '';
  assert.ok(!/nietrze|odmow|alkohol|badani/i.test(przyczyna), przyczyna);
  for (const id of ['W038', 'W006', 'W052', 'W023', 'W027']) {
    const r = oc(id);
    r.podobne_sprawy.slice(1).forEach((p) => assert.ok(p.podobienstwo >= 0.3, `${id} ${p.id}`));
    const u = r.podobne_sprawy.map((p) => p.uzasadnienie).filter(Boolean);
    assert.equal(new Set(u).size, u.length, `${id} duplikat uzasadnienia`);
  }
  assert.equal(oc('W006').podobne_sprawy.length, 1);
});

test('E2 R2: W038 (wyłączenie art. 21 ust. 3) — brak podobnej bez tego samego wyłączenia', () => {
  const baza = wczytajBazeUczaca('dane/zbior/uczacy');
  const w = JSON.parse(fs.readFileSync('dane/zbior/testowy/W038/wejscie.json', 'utf8'));
  const r = ocenSpraweBazowa({ tekstZgloszenia: fs.readFileSync('dane/zbior/testowy/W038/zgloszenie.txt', 'utf8'), wejscie: { dzialalnosc: w.dzialalnosc, skladki: w.skladki, dokumentacja_medyczna: w.dokumentacja_medyczna }, baza });
  assert.equal(r.wylaczenia_swiadczen, 'ART_21_2_3_NIETRZEZWOSC');
  r.podobne_sprawy.forEach((p) => assert.equal(p.wylaczenia_swiadczen, 'ART_21_2_3_NIETRZEZWOSC'));
  if (!r.podobne_sprawy.length) assert.match(r.uzasadnienie, /brak trafnej podobnej sprawy/);
});
