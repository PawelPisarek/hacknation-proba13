// Parser zgłoszenia EWYP + wyjaśnień poszkodowanego (z tekstu lub OCR).
// Wyciąga kluczowe pola: data, godzina, miejsce, rodzaj_urazu, okolicznosci, wyjasnienia, przyczyna itp.

// Prosty odczyt tekstu z niekompresowanego PDF tekstowego (operatory Tj/TJ).
// Dla skanów (obrazów w PDF) używany jest OCR na OMENie (ocena/ocr_omen.py).
export function wyciagnijTekstZPdf(buf) {
  const raw = Buffer.isBuffer(buf) ? buf.toString('latin1') : String(buf || '');
  const linie = [];
  const re = /\(((?:\\.|[^\\)])*)\)\s*Tj/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    const s = m[1].replace(/\\([()\\])/g, '$1');
    linie.push(s);
  }
  return linie.join('\n').trim();
}

export function normalizujTekst(t) {
  return String(t || '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

export function bezPolskich(t) {
  const mapa = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' };
  return String(t || '').toLowerCase().replace(/[ąćęłńóśźż]/g, (c) => mapa[c] || c);
}

const NAGLOWEK_POLA_RE = /^(ZAWIADOMIENIE|Poszkodowany|Adres |Pe[łl]nomocnik|Data wypadku|Miejsce wypadku|Planowane godziny|Rodzaj urazu|Opis okoliczno|Pierwsza pomoc|Policja\s*\/\s*prokuratura|Maszyna\s*\/\s*urz|[ŚS]wiadkowie|Za[łl][ąa]czniki|Spos[óo]b odbioru|Data zg[łl]oszenia|WYJA[ŚS]NIENIA)/i;

function znajdzLinie(tekst, wzorce) {
  const linie = tekst.split('\n');
  for (const w of wzorce) {
    for (let i = 0; i < linie.length; i++) {
      const m = linie[i].match(w);
      if (m && m[1] !== undefined) {
        const czesci = [m[1].trim()];
        for (let j = i + 1; j < linie.length; j++) {
          const nast = linie[j].trim();
          if (!nast || NAGLOWEK_POLA_RE.test(nast)) break;
          czesci.push(nast);
        }
        const val = czesci.join(' ').trim();
        if (val && !/^[—–\-_=~]+$/.test(val) && val.toLowerCase() !== 'brak') return val;
        return null;
      }
    }
  }
  return null;
}

// Prosta ekstrakcja zwięzłej przyczyny ze zdań opisu i wyjaśnień (reguły wzorcowe, bez LLM).
export function wyodrebnijPrzyczyne(opis, wyjasnienia, policja, maszynaTekst) {
  const calosc = `${opis || ''} ${wyjasnienia || ''} ${policja || ''}`.trim();
  const norm = bezPolskich(calosc);
  const sygnaly = [];

  if (/wozek widlowy.*uderzyl|wina osoby trzeciej/.test(norm)) sygnaly.push('najechanie wózkiem widłowym przez osobę trzecią');
  if (/odmow.*badani.*trzezw|odmowil.*alkomat/.test(norm)) sygnaly.push('upadek z rusztowania; odmowa badania trzeźwości');
  if (/siln.*upojeni|przerwal.*prace.*alkohol|nie swiadczyl pracy/.test(norm)) sygnaly.push('upadek w stanie silnego upojenia alkoholowego poza wykonywaniem działalności');
  else if (/promil|nietrzezw|alkohol/.test(norm) && !/0,00 promil|trzezwy/.test(norm)) sygnaly.push('stan nietrzeźwości / alkohol');
  if (/bez wylaczenia zasilania|pod napieciem/.test(norm)) sygnaly.push('praca pod napięciem wbrew przepisom BHP');
  if (/stolek montazow|stolka montazow/.test(norm)) sygnaly.push('poślizg na stopniu stołka montażowego podczas prac instalacyjnych');
  if (/drabin.*zeslizgn|poslizg.*drabin|mokrej posadz|umytej plyt/.test(norm)) sygnaly.push('poślizg drabiny na mokrej posadzce');
  if (/deska.*pomost.*pekla|pekla.*rusztow/.test(norm)) sygnaly.push('pęknięcie deski pomostu roboczego');
  if (/zakleszcz.*odrzucon|odrzut.*tarcz|pila tarczow/.test(norm)) sygnaly.push('odrzut materiału na pilarce tarczowej');
  if (/odprysk.*metal|szlifierk.*oko/.test(norm)) sygnaly.push('odprysk metalu podczas szlifowania');
  if (/ucho garnka peklo|wrzac|gorac.*plyn|wywar wyla/.test(norm)) sygnaly.push('pęknięcie ucha garnka z gorącą zawartością');
  if (/wymusil pierwszenstwo|uderzyl w bok|kolizj/.test(norm)) sygnaly.push('wymuszenie pierwszeństwa przez innego kierującego');
  if (/kamien.*wysunal.*spadl na stope|ciezk.*przedmiot.*stope/.test(norm)) sygnaly.push('upadek ciężkiego przedmiotu na stopę');
  if (/zakrecilo.*glowie|duszno.*farb|opary/.test(norm) && /spadl|uderzyl.*glow|podest/.test(norm)) {
    sygnaly.push('zasłabnięcie w warunkach pracy (duszność, opary) i upadek z podestu');
  } else if (/zawal|bol w klatce|zaslab|nadcisni|samoistn/.test(norm)) {
    sygnaly.push('przyczyna wewnętrzna — schorzenie samoistne');
  }
  if (/oblodzon.*chodnik|poslizgn.*chodnik/.test(norm)) sygnaly.push('poślizg na oblodzonym chodniku');
  if (/oblodzon.*parking|poslizgn.*parking/.test(norm)) sygnaly.push('poślizg na oblodzonej nawierzchni podczas wyładunku narzędzi');
  if (/potkn.*przedluzacz|przewod/.test(norm)) sygnaly.push('potknięcie o przedłużacz / przewód elektryczny');
  if (/rynn.*drabin|naprawial.*rynn/.test(norm)) sygnaly.push('upadek z drabiny podczas prac domowych');
  if (/noz.*zeslizgn|przecial dlon/.test(norm)) sygnaly.push('ześlizgnięcie noża podczas cięcia');
  if (/podnosnik.*przechylil|kolo przygniotl/.test(norm)) sygnaly.push('przechylenie podnośnika i przygniecenie dłoni');
  if (/stracil.*rownowag.*spadl.*dach/.test(norm)) sygnaly.push('utrata równowagi i upadek z dachu');
  if (/nie pamietam.*czy.*po materialy|brak dowodu celu/.test(norm)) sygnaly.push('kolizja drogowa — brak dowodu celu biznesowego przejazdu (do uzupełnienia)');
  if (/nie dostarczyl.*karty informacyjnej|brak karty medycznej/.test(norm) && String(opis || '').trim().length < 55) {
    sygnaly.push('opis ogólnikowy — brak dokumentacji medycznej i szczegółowego opisu okoliczności');
  }

  if (sygnaly.length) return sygnaly.join('; ');
  if (opis) {
    // Fallback: ostatnie zdanie opisu zdarzenia
    const zdania = opis.split(/(?<=[.!?])\s+/).filter(Boolean);
    return zdania[zdania.length - 1] || opis;
  }
  return maszynaTekst ? `zdarzenie przy obsłudze urządzenia: ${maszynaTekst}` : null;
}

export function parsujZgloszenieTekst(surowyTekst) {
  const tekst = normalizujTekst(surowyTekst);

  // Podział na część EWYP i WYJAŚNIENIA POSZKODOWANEGO
  const idxWyj = tekst.search(/\n\s*WYJA[ŚS]NIENIA\s+POSZKODOWANEGO\s*\n/i);
  const czescEwyp = idxWyj >= 0 ? tekst.slice(0, idxWyj) : tekst;
  const wyjasnienia = idxWyj >= 0
    ? tekst.slice(idxWyj).replace(/^\s*WYJA[ŚS]NIENIA\s+POSZKODOWANEGO\s*/i, '').trim()
    : '';

  const poszkodowanyLinia = znajdzLinie(czescEwyp, [/^Poszkodowany\s*:\s*(.+)$/i]);
  let pesel = null;
  let imieNazwisko = null;
  if (poszkodowanyLinia) {
    const mPesel = poszkodowanyLinia.match(/PESEL\s*(\d{11})/i);
    if (mPesel) pesel = mPesel[1];
    imieNazwisko = poszkodowanyLinia.split(',')[0].trim();
  }

  // Data i godzina wypadku (z linii lub fallback po formacie YYYY-MM-DD)
  const liniaData = znajdzLinie(czescEwyp, [/^Data wypadku\s*:\s*(.+)$/i]);
  let data = null;
  let godzina = null;
  if (liniaData) {
    const mData = liniaData.match(/(\d{4}-\d{2}-\d{2}|\d{2}[./-]\d{2}[./-]\d{4})/);
    if (mData) data = mData[1];
    const mGodz = liniaData.match(/godzina\s*:\s*(\d{1,2}:\d{2})/i);
    if (mGodz) godzina = mGodz[1];
  } else {
    const mData = czescEwyp.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
    if (mData) data = mData[1];
  }

  const miejsce = znajdzLinie(czescEwyp, [/^Miejsce wypadku\s*:\s*(.+)$/i]);
  const adresZamieszkania = znajdzLinie(czescEwyp, [/^Adres zamieszkania\s*:\s*(.+)$/i]);
  const adresKorespondencyjny = znajdzLinie(czescEwyp, [/^Adres do korespondencji\s*:\s*(.+)$/i]);
  const adresDzialalnosci = znajdzLinie(czescEwyp, [/^Adres prowadzenia dzia[łl]alno[śs]ci\s*:\s*(.+)$/i]);
  const pelnomocnik = znajdzLinie(czescEwyp, [/^Pe[łl]nomocnik\s*:\s*(.+)$/i]);
  const planowaneGodziny = znajdzLinie(czescEwyp, [/^Planowane godziny pracy\s*:\s*(.+)$/i]);
  const rodzajUrazu = znajdzLinie(czescEwyp, [/^Rodzaj urazu\s*:\s*(.+)$/i]);
  const opisOkolicznosci = znajdzLinie(czescEwyp, [/^Opis okoliczno[śs]ci i przyczyn\s*:\s*(.+)$/i]);
  const pierwszaPomoc = znajdzLinie(czescEwyp, [/^Pierwsza pomoc\s*:\s*(.+)$/i]);
  const policja = znajdzLinie(czescEwyp, [/^Policja\s*\/\s*prokuratura\s*:\s*(.+)$/i]);
  const maszynaRaw = znajdzLinie(czescEwyp, [/^Maszyna\s*\/\s*urz[ąa]dzenie\s*:\s*(.+)$/i]);
  const swiadkowieRaw = znajdzLinie(czescEwyp, [/^[ŚS]wiadkowie\s*:\s*(.+)$/i]);
  const zalacznikiRaw = znajdzLinie(czescEwyp, [/^Za[łl][ąa]czniki\s*:\s*(.+)$/i]);
  const sposobOdbioru = znajdzLinie(czescEwyp, [/^Spos[óo]b odbioru odpowiedzi\s*:\s*(.+)$/i]);
  const dataZgloszenia = znajdzLinie(czescEwyp, [/^Data zg[łl]oszenia\s*:\s*(.+)$/i]);

  let maszyna = null;
  if (maszynaRaw) {
    try {
      maszyna = JSON.parse(maszynaRaw);
    } catch {
      // Odporne wyłuskiwanie pól JSON po ewentualnych zniekształceniach OCR (cudzysłowy, spacje)
      const normM = bezPolskich(maszynaRaw);
      const mNazwa = maszynaRaw.match(/nazwa["”' ]*:\s*["„' ]*([^",}]+)/i);
      const mSprawna = normM.match(/sprawna[^a-z]*(true|false)/);
      const mInst = normM.match(/zgodnie_?z_?instrukcj[^a-z]*(true|false)/);
      maszyna = { nazwa: mNazwa ? mNazwa[1].trim() : maszynaRaw };
      if (mSprawna) maszyna.sprawna = mSprawna[1] === 'true';
      if (mInst) maszyna.zgodnie_z_instrukcja = mInst[1] === 'true';
    }
  }
  const swiadkowie = swiadkowieRaw ? swiadkowieRaw.split(';').map((s) => s.trim()).filter(Boolean) : [];
  const zalaczniki = zalacznikiRaw ? zalacznikiRaw.split(';').map((s) => s.trim()).filter(Boolean) : [];

  const okolicznosci = [opisOkolicznosci, wyjasnienia].filter(Boolean).join(' ').trim();
  const przyczyna = wyodrebnijPrzyczyne(opisOkolicznosci, wyjasnienia, policja, maszyna?.nazwa);

  return {
    poszkodowany: { imie_nazwisko: imieNazwisko, pesel, surowa_linia: poszkodowanyLinia },
    adres_zamieszkania: adresZamieszkania,
    adres_korespondencyjny: adresKorespondencyjny,
    adres_dzialalnosci: adresDzialalnosci,
    pelnomocnik,
    wypadek: { data, godzina, miejsce },
    planowane_godziny_pracy: planowaneGodziny,
    rodzaj_urazu: rodzajUrazu,
    opis_okolicznosci: opisOkolicznosci,
    wyjasnienia_poszkodowanego: wyjasnienia,
    okolicznosci,
    przyczyna,
    pierwsza_pomoc: pierwszaPomoc,
    policja_prokuratura: policja,
    maszyna,
    swiadkowie,
    zalaczniki,
    sposob_odbioru: sposobOdbioru,
    data_zgloszenia: dataZgloszenia,
  };
}
