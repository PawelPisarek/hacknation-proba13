// Metoda bazowa wsparcia decyzji pracownika ZUS (bez modelu zewnętrznego — decyzja P2).
// Zgodna z docs/materialy.md (commit f1efade):
//   - Ustawa wypadkowa: t.j. Dz.U. 2025 poz. 1644 (art. 2, 3, 6 ust. 2–3 [próg 1% min. wyn., 6 mies.], 8, 21, 22).
//   - Rozporządzenie MRiPS z 23.01.2022 (Dz.U. 2022 poz. 223 — karta wypadku bez pieczątek, art. 3a).
//   - Dwie rozdzielone etykiety z §6:
//       kwalifikacja_zdarzenia: UZNAC | NIE_UZNAC | DO_UZUPELNIENIA
//       wylaczenia_swiadczen: BRAK | ART_21_1_RAZACE_NIEDBALSTWO | ART_21_2_3_NIETRZEZWOSC | ART_6_2_ZADLUZENIE
//   - Wyszukiwanie podobnych spraw w bazie uczącej (TF-IDF + cosinus) + lista braków P6.

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

const KW_OPIS = {
  UZNAC: 'uznano',
  NIE_UZNAC: 'nie uznano',
  DO_UZUPELNIENIA: 'do uzupełnienia',
};

function tokenizuj(tekst) {
  return bezPolskich(tekst)
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOP.has(w))
    .map((w) => w.slice(0, 6));
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
      kwalifikacja_zdarzenia: kartaWrap.kwalifikacja_zdarzenia || kartaWrap.karta.kwalifikacja_zdarzenia,
      kwalifikacja: kartaWrap.karta.kwalifikacja,
      wylaczenia_swiadczen: kartaWrap.wylaczenia_swiadczen || kartaWrap.karta.wylaczenia_swiadczen || 'BRAK',
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
        kwalifikacja_zdarzenia: s.kwalifikacja_zdarzenia,
        kwalifikacja: s.kwalifikacja,
        wylaczenia_swiadczen: s.wylaczenia_swiadczen,
        wylaczenie_swiadczen: s.wylaczenie_swiadczen,
        przyczyny: s.przyczyny,
        uzasadnienie: s.uzasadnienie,
      };
    })
    .sort((a, b) => b.podobienstwo - a.podobienstwo)
    .slice(0, k);
}

// Reguły przesłanek ustawowych i wyłączeń (ustawa z 30.10.2002 t.j. Dz.U. 2025 poz. 1644, docs/materialy.md §2, §6)
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

  // Wykrywanie spraw wymagających uzupełnienia (brak kluczowego dowodu do oceny przesłanki — §6)
  const brakDowoduCeluPrzejazdu =
    /nie pamietam.*czy.*po materialy|czy wracal.*do domu|nie dolaczyl.*zadnej umowy|brak dowodu celu/.test(norm);
  const brakDowoduUrazuIOpisu =
    !med &&
    (/podejrzenie urazu|brak karty medycznej|karty medycznej brak|dosle pozniej|nie dostarczyl.*karty|lekarza jeszcze nie widzial|nie bylem jeszcze u lekarza/.test(norm)) &&
    (String(pars.opis_okolicznosci || '').trim().length < 40 ||
      /cos mi sie stalo|cos sie stalo|nie wiem co sie stalo/.test(bezPolskich(pars.opis_okolicznosci || '')));

  // 1. Nagłość
  const brakNaglosci = /wieloletni|przewlekl|stopniow.*pogarsz|choroba zawodowa/.test(norm);
  const naglosc = !brakNaglosci;

  // 2. Uraz lub śmierć (art. 2 pkt 13)
  const wyraznyBrakUrazu =
    /brak obrazen|nie stwierdzono obrazen|brak —|bez wizyty u lekarza|wylacznie.*sprzet|zniszczony sprzet|nic powaznego mi sie nie stalo/.test(norm) ||
    (/^brak\b/.test(normUraz) && !med);
  const uraz = brakDowoduUrazuIOpisu
    ? null
    : (!wyraznyBrakUrazu && (Boolean(med) || Boolean(pars.rodzaj_urazu)));

  // 3. Przyczyna zewnętrzna (art. 3 ust. 1; 3a vs 3b SN I UK 505/12)
  const czynnikZewnetrzny =
    /spadl|upad|poslizg|potkn|uderzyl|odrzut|odprysk|oparzen|wrzac|kolizj|wymusil|przygniot|noz|tarcz|drabin|rusztow|podest|podnosnik|porazeni|pradem|opary|duszno|kamien|przedluzacz|wozek widlowy|stolek/.test(norm);
  const samoistnaChoroba =
    /zawal|bol w klatce piersiowej|zaslabl|choroba ukladu krazenia|samoistn|nadcisnieni/.test(norm);
  const przyczynaZewnetrzna = brakDowoduUrazuIOpisu
    ? null
    : (samoistnaChoroba ? czynnikZewnetrzny : true);

  // 4. Okres ubezpieczenia wypadkowego (6a brak vs 6b krótki staż — art. 8 ust. 1 bez okresu wyczekiwania)
  const dzialalnoscZawieszona =
    skladki.ubezpieczenie_wypadkowe === false ||
    dz.zawieszona === true ||
    /dzialalnosc.*zawieszon|zawieszon.*dzialalnosc|zawieszon.*ceidg|ulga na start/.test(norm);
  const okresUbezpieczenia = !dzialalnoscZawieszona;

  // 5. Związek ze zwykłymi czynnościami działalności (art. 3 ust. 3 pkt 8; przypadki 1, 2a, 2b, 5c)
  const drogaDomBiuro =
    /z domu do (mojego )?biura|droga.*dom.*biur|chodnik.*od domu|powrot do domu po pracy/.test(norm) &&
    !/klient|zleceni|dostaw|narzedzi|faktur/.test(norm);
  const czynnoscPrywatna =
    /wlasny dom|przy swoim domu|przy domu|u siebie w domu|dom jednorodzinny.*mieszkam|w weekend.*firma nie pracowal|firma nie pracowal|nie jest miejscem dzialalnosci|w wolny dzien|w sobote.*naprawial.*rynn|zakupy prywatne/.test(norm) &&
    !/klient|zleceni/.test(norm);
  const nietrzezwoscZerwalaPrace =
    /przerwal.*prace.*alkohol|nie swiadczyl.*prac|nie wykonywal.*czynnosci dzialalnosci|po godzinach pracy.*alkohol/.test(norm);

  let zwiazekZDzialalnoscia;
  if (brakDowoduCeluPrzejazdu || brakDowoduUrazuIOpisu) {
    zwiazekZDzialalnoscia = null;
  } else {
    zwiazekZDzialalnoscia = okresUbezpieczenia && !drogaDomBiuro && !czynnoscPrywatna && !nietrzezwoscZerwalaPrace;
  }

  const przeslanki = {
    naglosc,
    przyczyna_zewnetrzna: przyczynaZewnetrzna,
    uraz,
    zwiazek_z_dzialalnoscia: zwiazekZDzialalnoscia,
    okres_ubezpieczenia: okresUbezpieczenia,
  };

  // Warstwa A — kwalifikacja_zdarzenia: UZNAC | NIE_UZNAC | DO_UZUPELNIENIA
  const wartosci = Object.values(przeslanki);
  let kwalifikacjaZdarzenia;
  if (wartosci.some((v) => v === false)) {
    kwalifikacjaZdarzenia = 'NIE_UZNAC';
  } else if (wartosci.some((v) => v === null)) {
    kwalifikacjaZdarzenia = 'DO_UZUPELNIENIA';
  } else {
    kwalifikacjaZdarzenia = 'UZNAC';
  }
  const kwalifikacja = KW_OPIS[kwalifikacjaZdarzenia];

  // Warstwa B — wylaczenia_swiadczen (wyłącznie gdy zdarzenie zakwalifikowane jako UZNAC; §2, §6)
  let wylaczeniaSwiadczen = 'BRAK';
  const wylaczeniaOpisy = [];

  if (kwalifikacjaZdarzenia === 'UZNAC') {
    const odmowaBadania = /odmow.*badani.*trzezw|odmowil.*alkomat|odmowil.*badani.*krwi|nie zgodzil.*(badani|alkomat|dmuchani|pobrani.*krwi)|odmow.*(alkomat|dmuchani|pobrani.*krwi)/.test(norm);
    const maAlkoholDodatni =
      /promil|nietrzezw|srodki odurzaj/.test(norm) &&
      !/0,00 promil|0\.00 promil|poszkodowany trzezwy/.test(norm);
    const brakPrzyczynienia =
      /brak przyczynienia|nie przyczynil.*sie|wylaczn.*win.*osob.*trzeci|wina osoby trzeciej/.test(norm);

    if (odmowaBadania || (maAlkoholDodatni && !brakPrzyczynienia)) {
      wylaczeniaSwiadczen = 'ART_21_2_3_NIETRZEZWOSC';
      wylaczeniaOpisy.push(
        odmowaBadania
          ? 'art. 21 ust. 3 — nieusprawiedliwiona odmowa poddania się badaniu trzeźwości'
          : 'art. 21 ust. 2 — stan nietrzeźwości lub środki odurzające (znaczne przyczynienie się)'
      );
    } else if (/bez wylaczenia zasilania|pod napieciem.*wiedzial|wiedzial.*nie wolno.*pod napieciem|razac.*niedbalstw/.test(norm)) {
      wylaczeniaSwiadczen = 'ART_21_1_RAZACE_NIEDBALSTWO';
      wylaczeniaOpisy.push('art. 21 ust. 1 — wyłączna przyczyna: udowodnione naruszenie przepisów BHP umyślnie lub z rażącego niedbalstwa');
    } else if (
      skladki.zadluzenie_przekracza_1_proc_min_wyn === true ||
      Number(skladki.zadluzenie_proc_min_wyn || 0) > 1 ||
      /zaleglosci powyzej 1% minimalnego wynagrodzenia|zadluzenie.*1% minimalnego/.test(norm)
    ) {
      wylaczeniaSwiadczen = 'ART_6_2_ZADLUZENIE';
      const procInfo = skladki.zadluzenie_proc_min_wyn ? ` (${skladki.zadluzenie_proc_min_wyn}% min. wyn.)` : '';
      wylaczeniaOpisy.push(
        `art. 6 ust. 2–3 (Dz.U. 2025 poz. 1644) — zadłużenie składek w dniu wypadku > 1% minimalnego wynagrodzenia${procInfo}; wstrzymanie świadczeń do spłaty, przedawnienie po 6 mies. od wypadku`
      );
    }
  }

  const wylaczenieSwiadczen = wylaczeniaOpisy.length ? wylaczeniaOpisy.join('; ') : null;

  // Podobne sprawy z bazy uczącej (TF-IDF + cosinus)
  const podobne = znajdzPodobne(baza, calyTekst, 2);

  // Braki w dokumentacji sprawy (P6 — dla pracownika ZUS)
  const ocenaZgl = sprawdzZgloszenie({ zgloszenie: pars });
  const brakiDokumentow = ocenaZgl.podpowiedzi.map((p) => ({
    kod: p.kod,
    pole: p.pole,
    opis: p.komunikat,
  }));

  // Uzasadnienie łączące przesłanki, wyłączenia i podobne sprawy
  const niespelnione = [];
  if (naglosc === false) niespelnione.push('brak nagłości zdarzenia');
  if (przyczynaZewnetrzna === false) niespelnione.push('brak przyczyny zewnętrznej (samoistne schorzenie bez czynnika zewnętrznego)');
  if (uraz === false) niespelnione.push('brak stwierdzonego urazu (art. 2 pkt 13)');
  if (zwiazekZDzialalnoscia === false) {
    if (drogaDomBiuro) niespelnione.push('brak związku ze zwykłymi czynnościami działalności (zwykła droga dom ↔ stała siedziba — SN I UK 55/09)');
    else if (czynnoscPrywatna) niespelnione.push('brak związku z działalnością (czynność prywatna / „przy okazji” — SN I UK 567/12)');
    else if (nietrzezwoscZerwalaPrace) niespelnione.push('nietrzeźwość zerwała faktyczne wykonywanie działalności (brak świadczenia pracy)');
    else niespelnione.push('brak związku ze zwykłymi czynnościami działalności');
  }
  if (okresUbezpieczenia === false) niespelnione.push('zdarzenie poza okresem ubezpieczenia wypadkowego (działalność zawieszona / brak tytułu)');

  // Cytat z dokumentu sprawy (spec A3): fragment opisu okoliczności albo wyjaśnień poszkodowanego
  const zrodloCytatu = [pars.opis_okolicznosci, pars.wyjasnienia_poszkodowanego].map((t) => String(t || '').replace(/\s+/g, ' ').trim()).find((t) => t.length >= 10) || '';
  const cytat = zrodloCytatu.length > 220 ? zrodloCytatu.slice(0, 217).replace(/\s+\S*$/, '') + '…' : zrodloCytatu;
  const zdaniemCytatu = cytat ? ` Cytat z dokumentu sprawy: „${cytat}”.` : '';

  const tekstPodobnych = podobne.length
    ? `Podobne sprawy z bazy: ${podobne.map((p) => `${p.id} (${p.kwalifikacja_zdarzenia || p.kwalifikacja}, podobieństwo ${p.podobienstwo})`).join(', ')}.`
    : 'Brak spraw w bazie porównawczej.';

  let uzasadnienie;
  if (kwalifikacjaZdarzenia === 'UZNAC') {
    uzasadnienie = `Rekomendacja: UZNAC (art. 3 ust. 1 i ust. 3 pkt 8 ustawy z 30.10.2002, t.j. Dz.U. 2025 poz. 1644). Spełnione wszystkie 5 przesłanek: nagłość, przyczyna zewnętrzna (${pars.przyczyna || 'wskazana w opisie'}), uraz (${pars.rodzaj_urazu || 'potwierdzony'}), związek ze zwykłymi czynnościami działalności, okres ubezpieczenia wypadkowego.${zdaniemCytatu}`;
    if (wylaczenieSwiadczen) {
      uzasadnienie += ` Osobna uwaga — wyłączenie / wstrzymanie świadczeń (${wylaczeniaSwiadczen}): ${wylaczenieSwiadczen}.`;
    }
    uzasadnienie += ` ${tekstPodobnych}`;
  } else if (kwalifikacjaZdarzenia === 'DO_UZUPELNIENIA') {
    uzasadnienie = `Rekomendacja: DO_UZUPELNIENIA — brak kluczowych dowodów do jednoznacznej oceny przesłanek ustawowych (sprawdź listę braków: ${brakiDokumentow.map((b) => b.pole).join(', ') || 'dokumentacja źródłowa'}).${zdaniemCytatu} ${tekstPodobnych}`;
  } else {
    uzasadnienie = `Rekomendacja: NIE_UZNAC. Niespełnione przesłanki: ${niespelnione.join('; ')}.${zdaniemCytatu} ${tekstPodobnych}`;
  }

  // Projekt karty wypadku wg aktualnego rozporządzenia MRiPS z 23.01.2022 (Dz.U. 2022 poz. 223 — bez pieczątek, art. 3a)
  const projektKarty = {
    podstawa_wzoru: 'Rozporządzenie MRiPS z 23.01.2022 (Dz.U. 2022 poz. 223 — bez pieczątek)',
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
      tytul_ubezpieczenia: 'art. 3 ust. 3 pkt 8 (albo art. 3a) ustawy wypadkowej — wykonywanie zwykłych czynności związanych z prowadzeniem działalności pozarolniczej',
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
      kwalifikacja_zdarzenia: kwalifikacjaZdarzenia,
      kwalifikacja:
        kwalifikacjaZdarzenia === 'UZNAC'
          ? 'Wypadek JEST wypadkiem przy pracy określonym w art. 3 ust. 3 pkt 8'
          : kwalifikacjaZdarzenia === 'NIE_UZNAC'
            ? 'Wypadek NIE JEST wypadkiem przy pracy określonym w art. 3 ust. 3 pkt 8'
            : 'DO UZUPEŁNIENIA przed końcową kwalifikacją',
      wylaczna_przyczyna_bhp: wylaczeniaSwiadczen === 'ART_21_1_RAZACE_NIEDBALSTWO' ? wylaczenieSwiadczen : 'nie stwierdzono',
      nietrzezwosc_srodki: wylaczeniaSwiadczen === 'ART_21_2_3_NIETRZEZWOSC' ? wylaczenieSwiadczen : 'nie stwierdzono',
      uzasadnienie,
    },
    IV_pozostale: {
      zapoznanie_pouczenie: 'Od karty wypadku nie przysługuje odwołanie. Poszkodowany może zgłosić uwagi i zastrzeżenia (pisemnie lub do protokołu).',
      przeszkody_14_dni: kwalifikacjaZdarzenia === 'DO_UZUPELNIENIA' ? 'Oczekiwanie na uzupełnienie brakujących dowodów przez poszkodowanego.' : 'nie dotyczy',
      sporzadzajacy: 'ZUS — imię, nazwisko i podpis sporządzającego (bez pieczątki wg Dz.U. 2022 poz. 223)',
      wykaz_zalacznikow: pars.zalaczniki,
      status: 'PROJEKT DO AKCEPTACJI PRACOWNIKA ZUS',
    },
  };

  return {
    metoda: 'bazowa-reguly-tfidf',
    kwalifikacja_zdarzenia: kwalifikacjaZdarzenia,
    wylaczenia_swiadczen: wylaczeniaSwiadczen,
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
    uwaga_decyzyjna: 'Rekomendacja ma charakter pomocniczy (art. 22 RODO) — ostateczną decyzję podejmuje pracownik ZUS.',
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
