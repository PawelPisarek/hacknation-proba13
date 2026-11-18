// Metoda bazowa wsparcia decyzji pracownika ZUS (bez modelu zewnętrznego — decyzja P2).
// Łączy: (1) reguły przesłanek ustawowych i wyłączeń z docs/materialy.md,
//        (2) wyszukiwanie podobnych spraw w bazie uczącej (TF-IDF + cosinus),
//        (3) listę braków w dokumentacji (P6) i projekt karty wypadku (pola z 01-pdf-ewyp-karta.md).

import fs from 'node:fs';
import path from 'node:path';
import { bezPolskich, parsujZgloszenieTekst } from './parser.mjs';
import { sprawdzZgloszenie } from './asystent.mjs';

const STOP = new Set([
  'i', 'w', 'z', 'na', 'do', 'o', 'od', 'po', 'za', 'ze', 'nie', 'sie', 'to', 'jest', 'byl', 'byla', 'bylo',
  'byly', 'oraz', 'lub', 'ale', 'przy', 'dla', 'przez', 'pod', 'nad', 'bez', 'jak', 'jako', 'ten', 'ta', 'te',
  'tym', 'tego', 'tej', 'mi', 'mnie', 'mojej', 'mojego', 'swym', 'swoim', 'ktory', 'ktora', 'ktore', 'ktorym',
  'dnia', 'tego', 'juz', 'tylko', 'bardzo', 'tez', 'wiec', 'ok', 'ul', 'nr', 'dane', 'sztuczne', 'przypadek',
]);

function tokenizuj(tekst) {
  return bezPolskich(tekst)
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP.has(w))
    .map((w) => w.slice(0, 6)); // proste skracanie końcówek fleksyjnych
}

export function wczytajBazeUczaca(katalogUczacy) {
  if (!fs.existsSync(katalogUczacy)) return { sprawy: [], idf: new Map() };
  const foldery = fs.readdirSync(katalogUczacy).sort();
  const sprawy = [];
  const df = new Map();

  for (const id of foldery) {
    const sciezka = path.join(katalogUczacy, id);
    if (!fs.statSync(sciezka).isDirectory()) continue;
    const txtPath = path.join(sciezka, 'zgloszenie.txt');
    const kartaPath = path.join(sciezka, 'karta.json');
    const wejsciePath = path.join(sciezka, 'wejscie.json');
    if (!fs.existsSync(txtPath) || !fs.existsSync(kartaPath)) continue;

    const tekst = fs.readFileSync(txtPath, 'utf8');
    const kartaWrap = JSON.parse(fs.readFileSync(kartaPath, 'utf8'));
    const wejscie = fs.existsSync(wejsciePath) ? JSON.parse(fs.readFileSync(wejsciePath, 'utf8')) : null;
    const pars = parsujZgloszenieTekst(tekst);
    const trescDoIndeksu = [
      pars.wypadek.miejsce,
      pars.rodzaj_urazu,
      pars.opis_okolicznosci,
      pars.wyjasnienia_poszkodowanego,
      pars.policja_prokuratura,
      wejscie?.dzialalnosc?.przedmiot,
    ].filter(Boolean).join(' ');
    const tok = tokenizuj(trescDoIndeksu);
    const tf = new Map();
    for (const t of tok) tf.set(t, (tf.get(t) || 0) + 1);
    for (const t of new Set(tok)) df.set(t, (df.get(t) || 0) + 1);

    sprawy.push({
      id,
      kwalifikacja: kartaWrap.karta.kwalifikacja,
      wylaczenie_swiadczen: kartaWrap.karta.wylaczenie_swiadczen,
      przyczyny: kartaWrap.karta.przyczyny,
      uzasadnienie: kartaWrap.karta.uzasadnienie,
      miejsce: pars.wypadek.miejsce,
      uraz: pars.rodzaj_urazu,
      tf,
      dlugosc: tok.length || 1,
    });
  }

  const N = sprawy.length || 1;
  const idf = new Map();
  for (const [t, count] of df.entries()) {
    idf.set(t, Math.log((N + 1) / (count + 1)) + 1);
  }
  for (const s of sprawy) {
    let norma = 0;
    s.vec = new Map();
    for (const [t, c] of s.tf.entries()) {
      const w = (c / s.dlugosc) * (idf.get(t) || 1);
      s.vec.set(t, w);
      norma += w * w;
    }
    s.norma = Math.sqrt(norma) || 1;
  }

  return { sprawy, idf };
}

export function znajdzPodobne(baza, tekstZapytania, k = 3) {
  if (!baza?.sprawy?.length) return [];
  const tok = tokenizuj(tekstZapytania);
  const tf = new Map();
  for (const t of tok) tf.set(t, (tf.get(t) || 0) + 1);
  const dl = tok.length || 1;
  const qVec = new Map();
  let qNorma = 0;
  for (const [t, c] of tf.entries()) {
    const w = (c / dl) * (baza.idf.get(t) || 1);
    qVec.set(t, w);
    qNorma += w * w;
  }
  qNorma = Math.sqrt(qNorma) || 1;

  return baza.sprawy
    .map((s) => {
      let dot = 0;
      for (const [t, qw] of qVec.entries()) {
        const sw = s.vec.get(t);
        if (sw) dot += qw * sw;
      }
      return {
        id: s.id,
        podobienstwo: Number((dot / (qNorma * s.norma)).toFixed(3)),
        kwalifikacja: s.kwalifikacja,
        wylaczenie_swiadczen: s.wylaczenie_swiadczen,
        przyczyny: s.przyczyny,
        uzasadnienie: s.uzasadnienie,
      };
    })
    .sort((a, b) => b.podobienstwo - a.podobienstwo)
    .slice(0, k);
}

// Reguły przesłanek ustawowych (ustawa z 30.10.2002, docs/materialy.md §2)
export function ocenSpraweBazowa({ tekstZgloszenia, wejscie, baza }) {
  const pars = tekstZgloszenia
    ? parsujZgloszenieTekst(tekstZgloszenia)
    : normalizujZWejscia(wejscie);

  const dz = wejscie?.dzialalnosc || {};
  const skladki = wejscie?.skladki || {};
  const med = wejscie?.dokumentacja_medyczna ?? null;

  const calyTekst = [
    pars.wypadek.miejsce,
    pars.rodzaj_urazu,
    pars.opis_okolicznosci,
    pars.wyjasnienia_poszkodowanego,
    pars.policja_prokuratura,
    dz.przedmiot,
  ].filter(Boolean).join(' ');
  const norm = bezPolskich(calyTekst);
  const normUraz = bezPolskich(pars.rodzaj_urazu || '');
  const normMiejsce = bezPolskich(pars.wypadek.miejsce || '');

  // 1. Nagłość
  const brakNaglosci = /wieloletni|przewlekl|stopniow.*pogarsz|choroba zawodowa/.test(norm);
  const naglosc = !brakNaglosci;

  // 2. Uraz lub śmierć
  const wyraznyBrakUrazu =
    /brak obrazen|nie stwierdzono obrazen|brak —|bez wizyty u lekarza|wylacznie.*sprzet|zniszczony sprzet|nic powaznego mi sie nie stalo/.test(norm) ||
    (/^brak\b/.test(normUraz) && !med);
  const uraz = !wyraznyBrakUrazu && (Boolean(med) || Boolean(pars.rodzaj_urazu));

  // 3. Przyczyna zewnętrzna
  const czynnikZewnetrzny =
    /spadl|upad|poslizg|potkn|uderzyl|odrzut|odprysk|oparzen|wrzac|kolizj|wymusil|przygniot|noz|tarcz|drabin|rusztow|podest|podnosnik|porazeni|pradem|opary|duszno|kamien|przedluzacz/.test(norm);
  const samoistnaChoroba =
    /zawal|bol w klatce piersiowej|zaslabl|choroba ukladu krazenia|samoistn|nadcisnieni/.test(norm);
  // Przypadek graniczny: zasłabnięcie + współdziałający czynnik zewnętrzny (upadek z podestu/wysokości, uderzenie, opary) → przyczyna zewnętrzna TAK
  const przyczynaZewnetrzna = samoistnaChoroba ? czynnikZewnetrzny : true;

  // 4. Okres ubezpieczenia wypadkowego
  const dzialalnoscZawieszona =
    skladki.ubezpieczenie_wypadkowe === false ||
    dz.zawieszona === true ||
    /dzialalnosc.*zawieszon|zawieszon.*dzialalnosc|zawieszon.*ceidg/.test(norm);
  const okresUbezpieczenia = !dzialalnoscZawieszona;

  // 5. Związek ze zwykłymi czynnościami działalności (art. 3 ust. 3 pkt 8)
  const drogaDomBiuro =
    /z domu do (mojego )?biura|droga.*dom.*biur|chodnik.*od domu/.test(norm) &&
    !/klient|zleceni|dostaw|narzedzi|faktur/.test(norm);
  const czynnoscPrywatna =
    /wlasny dom|przy swoim domu|przy domu|nie jest miejscem dzialalnosci|w wolny dzien|w sobote.*naprawial.*rynn/.test(norm) &&
    !/klient|zleceni/.test(norm);
  const zwiazekZDzialalnoscia = okresUbezpieczenia && !drogaDomBiuro && !czynnoscPrywatna;

  const przeslanki = {
    naglosc,
    przyczyna_zewnetrzna: przyczynaZewnetrzna,
    uraz,
    zwiazek_z_dzialalnoscia: zwiazekZDzialalnoscia,
    okres_ubezpieczenia: okresUbezpieczenia,
  };

  const wszystkieSpelnione = Object.values(przeslanki).every(Boolean);
  const kwalifikacja = wszystkieSpelnione ? 'uznano' : 'nie uznano';

  // Wyłączenia świadczeń (nie wykluczają uznania zdarzenia za wypadek — docs/materialy.md §2)
  const wylaczenia = [];
  if (/promil|nietrzezw|badanie trzezwosci|odmowa badania|srodki odurzaj/.test(norm)) {
    wylaczenia.push('art. 21 ust. 2 — nietrzeźwość lub środki odurzające (znaczne przyczynienie się)');
  }
  if (/bez wylaczenia zasilania|pod napieciem.*wiedzial|wiedzial.*nie wolno.*pod napieciem|razac.*niedbalstw/.test(norm)) {
    wylaczenia.push('art. 21 ust. 1 — wyłączna przyczyna: naruszenie przepisów BHP umyślnie lub z rażącego niedbalstwa');
  }
  if (Number(skladki.zadluzenie_zl || 0) > 2) {
    wylaczenia.push(`art. 6 ust. 2 — zadłużenie z tytułu składek (${skladki.zadluzenie_zl} zł > 2,00 zł) w dniu wypadku`);
  }
  const wylaczenieSwiadczen = wylaczenia.length ? wylaczenia.join('; ') : null;

  // Podobne sprawy z bazy uczącej
  const podobne = znajdzPodobne(baza, calyTekst, 3);

  // Braki w dokumentacji sprawy (P6 — dla pracownika ZUS)
  const ocenaZgl = sprawdzZgloszenie({ zgloszenie: pars });
  const brakiDokumentow = ocenaZgl.podpowiedzi.map((p) => ({
    kod: p.kod,
    pole: p.pole,
    opis: p.komunikat,
  }));

  // Uzasadnienie łączące przesłanki i podobne sprawy
  const niespelnione = [];
  if (!naglosc) niespelnione.push('brak nagłości zdarzenia');
  if (!przyczynaZewnetrzna) niespelnione.push('brak przyczyny zewnętrznej (samoistne schorzenie bez czynnika zewnętrznego)');
  if (!uraz) niespelnione.push('brak stwierdzonego urazu');
  if (!zwiazekZDzialalnoscia) {
    if (drogaDomBiuro) niespelnione.push('brak związku ze zwykłymi czynnościami działalności (zdarzenie w drodze z domu do biura)');
    else if (czynnoscPrywatna) niespelnione.push('brak związku z działalnością (czynność prywatna poza działalnością)');
    else niespelnione.push('brak związku ze zwykłymi czynnościami działalności');
  }
  if (!okresUbezpieczenia) niespelnione.push('zdarzenie poza okresem ubezpieczenia wypadkowego (działalność zawieszona)');

  const tekstPodobnych = podobne.length
    ? `Podobne sprawy z bazy: ${podobne.map((p) => `${p.id} (${p.kwalifikacja}, podobieństwo ${p.podobienstwo})`).join(', ')}.`
    : 'Brak spraw w bazie porównawczej.';

  let uzasadnienie;
  if (kwalifikacja === 'uznano') {
    uzasadnienie = `Rekomendacja: uznać zdarzenie za wypadek przy pracy (art. 3 ust. 1 i ust. 3 pkt 8 ustawy z 30.10.2002). Spełnione wszystkie 5 przesłanek: nagłość, przyczyna zewnętrzna (${pars.przyczyna || 'wskazana w opisie'}), uraz (${pars.rodzaj_urazu || 'potwierdzony'}), związek ze zwykłymi czynnościami działalności, aktywne ubezpieczenie wypadkowe.`;
    if (wylaczenieSwiadczen) {
      uzasadnienie += ` Uwaga — przesłanka wyłączenia świadczeń: ${wylaczenieSwiadczen}.`;
    }
    uzasadnienie += ` ${tekstPodobnych}`;
  } else {
    uzasadnienie = `Rekomendacja: nie uznać zdarzenia za wypadek przy pracy. Niespełnione przesłanki: ${niespelnione.join('; ')}. ${tekstPodobnych}`;
  }

  // Projekt karty wypadku (wg pól z docs/zadania/01-pdf-ewyp-karta.md)
  const projektKarty = {
    I_platnik_skladek: {
      nazwa: pars.poszkodowany.imie_nazwisko ? `${pars.poszkodowany.imie_nazwisko} — działalność gospodarcza` : null,
      adres: pars.adres_dzialalnosci || null,
      nip: dz.nip || null,
      regon: dz.regon || null,
      pesel: pars.poszkodowany.pesel || null,
    },
    II_poszkodowany: {
      imie_nazwisko: pars.poszkodowany.imie_nazwisko,
      pesel: pars.poszkodowany.pesel,
      adres: pars.adres_zamieszkania,
      tytul_ubezpieczenia: 'art. 3 ust. 3 pkt 8 ustawy wypadkowej (pozarolnicza działalność)',
    },
    III_wypadek: {
      data_zgloszenia: pars.data_zgloszenia,
      data_wypadku: pars.wypadek.data,
      godzina_wypadku: pars.wypadek.godzina,
      miejsce_wypadku: pars.wypadek.miejsce,
      rodzaj_urazu: pars.rodzaj_urazu,
      okolicznosci: pars.okolicznosci,
      przyczyny: pars.przyczyna,
      swiadkowie: pars.swiadkowie,
      kwalifikacja: kwalifikacja === 'uznano' ? 'JEST wypadkiem przy pracy (art. 3 ust. 3 pkt 8)' : 'NIE JEST wypadkiem przy pracy',
      wylaczna_przyczyna_bhp: wylaczenia.find((w) => w.includes('art. 21 ust. 1')) || 'nie stwierdzono',
      nietrzezwosc_srodki: wylaczenia.find((w) => w.includes('art. 21 ust. 2')) || 'nie stwierdzono',
      uzasadnienie,
    },
    IV_pozostale: {
      pouczenie: 'Od karty wypadku nie przysługuje odwołanie. Poszkodowany może wnieść uwagi i zastrzeżenia do ustaleń zawartych w karcie.',
      zalaczniki: pars.zalaczniki,
      status: 'PROJEKT DO AKCEPTACJI PRACOWNIKA ZUS',
    },
  };

  return {
    metoda: 'bazowa-reguly-tfidf',
    rekomendacja: kwalifikacja,
    wylaczenie_swiadczen: wylaczenieSwiadczen,
    przeslanki,
    pola_odczytane: {
      data: pars.wypadek.data,
      godzina: pars.wypadek.godzina,
      miejsce: pars.wypadek.miejsce,
      okolicznosci: pars.okolicznosci,
      przyczyna: pars.przyczyna,
      rodzaj_urazu: pars.rodzaj_urazu,
    },
    braki_dokumentow: brakiDokumentow,
    podobne_sprawy: podobne,
    uzasadnienie,
    projekt_karty: projektKarty,
    uwaga_decyzyjna: 'Rekomendacja ma charakter pomocniczy — ostateczną decyzję podejmuje pracownik ZUS.',
  };
}

function normalizujZWejscia(wejscie) {
  const z = wejscie?.zgloszenie || {};
  const opis = z.opis_okolicznosci || '';
  const wyj = wejscie?.wyjasnienia_poszkodowanego || '';
  const adresTxt = (a) => (typeof a === 'string' ? a : a ? `${a.ulica}, ${a.kod} ${a.miejscowosc}` : null);
  return {
    poszkodowany: {
      imie_nazwisko: z.poszkodowany ? `${z.poszkodowany.imie || ''} ${z.poszkodowany.nazwisko || ''}`.trim() : null,
      pesel: z.poszkodowany?.pesel || null,
    },
    adres_zamieszkania: adresTxt(z.adres_zamieszkania),
    adres_korespondencyjny: adresTxt(z.adres_korespondencyjny),
    adres_dzialalnosci: adresTxt(z.adres_dzialalnosci),
    pelnomocnik: z.pelnomocnik ? `${z.pelnomocnik.imie} ${z.pelnomocnik.nazwisko}` : null,
    wypadek: { data: z.wypadek?.data || null, godzina: z.wypadek?.godzina || null, miejsce: z.wypadek?.miejsce || null },
    planowane_godziny_pracy: z.planowane_godziny_pracy ? `${z.planowane_godziny_pracy.od}–${z.planowane_godziny_pracy.do}` : null,
    rodzaj_urazu: z.rodzaj_urazu || null,
    opis_okolicznosci: opis,
    wyjasnienia_poszkodowanego: wyj,
    okolicznosci: [opis, wyj].filter(Boolean).join(' ').trim(),
    przyczyna: parsujZgloszenieTekst(`Opis okoliczności i przyczyn: ${opis}\nPolicja/prokuratura: ${z.policja_prokuratura || '—'}\n\nWYJAŚNIENIA POSZKODOWANEGO\n${wyj}`).przyczyna,
    pierwsza_pomoc: z.pierwsza_pomoc?.kto_gdzie || (typeof z.pierwsza_pomoc === 'string' ? z.pierwsza_pomoc : null),
    policja_prokuratura: z.policja_prokuratura || null,
    maszyna: z.maszyna || null,
    swiadkowie: Array.isArray(z.swiadkowie) ? z.swiadkowie.map((s) => (typeof s === 'string' ? s : `${s.imie} ${s.nazwisko}, ${s.adres}`)) : [],
    zalaczniki: Array.isArray(z.zalaczniki) ? z.zalaczniki : [],
    sposob_odbioru: z.sposob_odbioru || null,
    data_zgloszenia: z.data_zgloszenia || null,
  };
}
