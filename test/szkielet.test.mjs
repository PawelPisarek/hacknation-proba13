import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { sprawdzZgloszenie } from '../app/logika/asystent.mjs';
import { parsujZgloszenieTekst } from '../app/logika/parser.mjs';
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
    assert.ok(r.wyniki.every((w) => w.rekomendacja === 'uznano' || w.rekomendacja === 'nie uznano'));
    assert.ok(r.wyniki.every((w) => w.projekt_karty && w.projekt_karty.III_wypadek));
  } finally {
    await new Promise((res) => serwer.close(res));
  }
});
