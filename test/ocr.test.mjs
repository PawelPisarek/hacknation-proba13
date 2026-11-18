import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { odczytajPdf, KOMUNIKAT_BLEDU } from '../app/logika/ocr.mjs';

const maTesseract = spawnSync('sh', ['-c', 'command -v tesseract']).status === 0;
const opcje = { skip: maTesseract ? false : 'brak tesseract (test OCR biegnie na OMENie / w obrazie Docker)' };

test('plik nieczytelny → „nie udało się odczytać”, nie rekomendacja', opcje, () => {
  const r = odczytajPdf(fs.readFileSync('test/fixtures/nieczytelny.pdf'));
  assert.equal(r.status, 'nie_udalo_sie_odczytac');
  assert.equal(r.komunikat, KOMUNIKAT_BLEDU);
});

test('PDF-obraz (skan) W023 i W052: odczyt, pola niepewne < 70, czas na sprawę', opcje, () => {
  for (const id of ['W023', 'W052']) {
    const r = odczytajPdf(fs.readFileSync(`test/fixtures/skan-${id}.pdf`));
    assert.equal(r.status, 'ok', id);
    assert.equal(r.zrodlo, 'tesseract_pol_200dpi');
    assert.match(r.tekst, /Data wypadku/i);
    for (const p of r.pola_niepewne) assert.ok(p.pewnosc < 70);
    console.log(`# ${id}: czas ${r.czas_ms} ms, pewność średnia ${r.pewnosc_srednia}, pól niepewnych ${r.pola_niepewne.length}`);
  }
});

test('serwer: nieczytelny PDF nie daje NIE_UZNAC', async () => {
  const { utworzSerwer } = await import('../app/server.mjs');
  const serwer = utworzSerwer();
  await new Promise((res) => serwer.listen(0, '127.0.0.1', res));
  try {
    const r = await fetch(`http://127.0.0.1:${serwer.address().port}/api/zus/rekomendacja`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sprawy: [{ id: 'x.pdf', pdfBase64: fs.readFileSync('test/fixtures/nieczytelny.pdf').toString('base64') }] }),
    });
    const d = await r.json();
    assert.equal(d.wyniki[0].kwalifikacja_zdarzenia, null);
    assert.equal(d.wyniki[0].odczyt.status, 'nie_udalo_sie_odczytac');
  } finally { serwer.close(); }
}, { skip: false });
