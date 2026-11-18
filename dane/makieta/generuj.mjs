// Generator udawanych danych do makiety (skill dummy-dataset). Deterministyczny; dane z dane/zbior (sztuczne)
// i z faktycznego przebiegu app/logika (rekomendacja systemu). Wynik: dane/makieta/makieta-dane.json + makieta/dane.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { wczytajBazeUczaca, ocenSpraweBazowa } from '../../app/logika/bazowa.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const Z = path.join(ROOT, 'dane', 'zbior');
const IDS = ['W052', 'W006', 'W023', 'W020', 'W027', 'W038']; // spec §4, różnorodność, nie pod wynik
const baza = wczytajBazeUczaca(path.join(Z, 'uczacy'));
const csv = fs.readFileSync(path.join(Z, 'etykiety.csv'), 'utf8').trim().split('\n');
const naglowek = csv[0].split(',');
const wzorzec = {};
for (const l of csv.slice(1)) {
  const k = l.split(',').map((x) => x.replace(/^"|"$/g, ''));
  wzorzec[k[0]] = { kw: k[naglowek.indexOf('kwalifikacja_zdarzenia')], wyl: k[naglowek.indexOf('wylaczenia_swiadczen')] };
}
const SKROT = { UZNAC: 'UZNAC', NIE_UZNAC: 'NIE', DO_UZUPELNIENIA: 'DO' };
const WYL = {
  BRAK: null,
  ART_21_2_3_NIETRZEZWOSC: 'UWAGA (art. 21 ust. 2–3): odmowa badania trzeźwości — wpisać w polu III.6 karty. To nie zmienia uznania wypadku.',
  ART_21_1_RAZACE_NIEDBALSTWO: 'UWAGA (art. 21 ust. 1): rażące niedbalstwo — osobno od kwalifikacji.',
  ART_6_2_ZADLUZENIE: 'UWAGA (art. 6 ust. 2–3): zadłużenie składek — wstrzymanie świadczeń do spłaty.',
};
const klucze = ['naglosc', 'przyczyna_zewnetrzna', 'uraz', 'zwiazek_z_dzialalnoscia', 'okres_ubezpieczenia'];
const cases = IDS.map((id) => {
  const d = path.join(Z, 'testowy', id);
  const w = JSON.parse(fs.readFileSync(path.join(d, 'wejscie.json'), 'utf8'));
  const txt = fs.readFileSync(path.join(d, 'zgloszenie.txt'), 'utf8');
  const r = ocenSpraweBazowa({ tekstZgloszenia: txt, wejscie: w, baza });
  const p = w.zgloszenie.poszkodowany, wy = w.zgloszenie.wypadek;
  const unc = [];
  if (!wy.godzina || id === 'W023') unc.push('godzina');
  if (id === 'W023') unc.push('uraz');
  if (id === 'W052') unc.push('okolicznosci'); // P29: odczyt ze skanu, pewność < 70 (zaszumiony skan: okolicznosci:51)
  const opis = (w.zgloszenie.opis_okolicznosci || '').trim();
  const wyj = (w.wyjasnienia_poszkodowanego || '').trim();
  // „skan”: tekst zgłoszenia z zaznaczonymi cytatami [[...]] i niepewnymi polami [[...|klucz]]
  let skan = txt.split('\n').filter((l) => /^(Data wypadku|Miejsce|Rodzaj urazu|Opis okoliczności|WYJAŚNIENIA)/.test(l) || l === wyj).join('\n');
  skan = 'ZGŁOSZENIE WYPADKU\n' + skan;
  if (opis) skan = skan.replace(opis, id === 'W052' ? `[[${opis}|okolicznosci]]` : `[[${opis}]]`);
  if (id === 'W023') {
    skan = skan.replace('godzina: —', 'godzina: [[10:45|godzina]]').replace(w.zgloszenie.rodzaj_urazu, `[[${w.zgloszenie.rodzaj_urazu}|uraz]]`);
  }
  const pr = klucze.map((k) => (r.przeslanki[k] === true ? 'ok' : r.przeslanki[k] === false ? 'no' : 'wa'));
  const przn = [
    r.przeslanki.naglosc ? 'Zdarzenie nagłe' : 'Brak danych o nagłości',
    r.przeslanki.przyczyna_zewnetrzna === true ? (r.pola_odczytane.przyczyna || 'Przyczyna zewnętrzna') : r.przeslanki.przyczyna_zewnetrzna === false ? 'Wyłącznie przyczyna wewnętrzna' : 'Nie opisano podłoża ani przyczyny',
    r.przeslanki.uraz === true ? (w.zgloszenie.rodzaj_urazu || 'Uraz') : r.przeslanki.uraz === false ? 'Brak urazu zewnętrznego' : 'Brak karty medycznej',
    r.przeslanki.zwiazek_z_dzialalnoscia === true ? `Czynność związana z działalnością (${w.dzialalnosc.przedmiot})` : r.przeslanki.zwiazek_z_dzialalnoscia === false ? 'Brak związku z działalnością' : 'Brak umowy/zlecenia — nie wiadomo, jaka czynność',
    'CEIDG: działalność aktywna w dniu zdarzenia',
  ];
  const pods = r.podobne_sprawy.map((pod) => `${pod.id} — ${pod.przyczyny}, ${pod.kwalifikacja} (podobieństwo ${pod.podobienstwo})`);
  return {
    id, kto: `${p.imie} ${p.nazwisko}`, zaw: `${w.dzialalnosc.przedmiot} (PKD ${w.dzialalnosc.pkd})`,
    rek: SKROT[r.kwalifikacja_zdarzenia], wyl: WYL[r.wylaczenia_swiadczen] ?? (r.kwalifikacja_zdarzenia === 'NIE_UZNAC' ? 'n/d — brak podstaw do uznania; wyłączenia nie dotyczą.' : null),
    wzorzec: SKROT[wzorzec[id].kw], prz: pr, przn,
    braki: r.braki_dokumentow.map((b) => b.opis), dopytac: r.braki_dokumentow.length ? 'O brakujące pola i dokumenty z listy.' : '—',
    pod: pods[0] || 'brak trafnej podobnej sprawy', pods: pods.length ? pods : ['brak trafnej podobnej sprawy'], uzas: r.uzasadnienie,
    data: wy.data, godz: wy.godzina || (id === 'W023' ? '10:45' : '—'), miejsce: wy.miejsce, uraz: w.zgloszenie.rodzaj_urazu,
    opis: [opis, wyj].filter(Boolean).join(' '), skan, unc,
    skrot: (opis.length > 70 ? opis.slice(0, 67) + '…' : opis),
  };
});
// 5 ogólników do testu A1/Z1 (spec §5, pisze Projektant; tu tylko jako dane makiety)
const ogolniki = ['Poślizgnąłem się w pracy.', 'Miałem wypadek przy pracy, doznałem urazu.', 'Upadłem podczas pracy.', 'Coś mnie uderzyło na budowie.', 'Zrobiłem sobie krzywdę przy maszynie.'];
const wynik = { _info: 'UDAWANE DANE: sztuczny zbiór testowy ZANT; rekomendacje = faktyczny wynik app/logika', cases, ogolniki };
fs.writeFileSync(path.join(ROOT, 'dane/makieta/makieta-dane.json'), JSON.stringify(wynik, null, 1));
fs.writeFileSync(path.join(ROOT, 'makieta/dane.js'), '// GENEROWANE przez dane/makieta/generuj.mjs — udawane dane (sztuczny zbiór)\nwindow.DANE=' + JSON.stringify(wynik) + ';\n');
console.log('spraw:', cases.length, cases.map((c) => `${c.id}:${c.rek}/${c.wzorzec}`).join(' '));
