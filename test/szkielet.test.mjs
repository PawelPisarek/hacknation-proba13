import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { sprawdzZgloszenie } from '../app/logika/asystent.mjs';
import { parsujZgloszenieTekst } from '../app/logika/parser.mjs';
import { ocenSpraweBazowa } from '../app/logika/bazowa.mjs';
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
