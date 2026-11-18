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
  return String(t || '').toLowerCase().replace(/[ąćęłńśźż]/g, (c) => mapa[c] || c);
}

const NAGLOWEK_POLA_RE = /^(ZAWIADOMIENIE|Poszkodowany|Adres |Pe[łl]nomocnik|Data wypadku|Miejsce wypadku|Planowane godziny|Rodzaj urazu|Opis okoliczno|Pierwsza pomoc|Policja\/prokuratura|Maszyna\/urz|[ŚS]wiadkowie|Za[łl][ąa]czniki|Spos[óo]b odbioru|Data zg[łl]oszenia|WYJA[ŚS]NIENIA)/i;

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
        if (val && val !== '—' && val !== '-' && val !== 'brak') return val;
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

  if (/promil|nietrzezw|alkohol/.test(norm)) sygnaly.push('stan nietrzeźwości / alkohol');
  if (/bez wylaczenia zasilania|pod napieciem/.test(norm)) sygnaly.push('praca pod napięciem wbrew przepisom BHP');
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
  const idxWyj = tekst.search(/\n\s*WYJA[ŚS]NIENIA POSZKODOWANEGO\s*\n/i);
  const czescEwyp = idxWyj >= 0 ? tekst.slice(0, idxWyj) : tekst;
  const wyjasnienia = idxWyj >= 0
    ? tekst.slice(idxWyj).replace(/^\s*WYJA[ŚS]NIENIA POSZKODOWANEGO\s*/i, '').trim()
    : '';

  const poszkodowanyLinia = znajdzLinie(czescEwyp, [/^Poszkodowany:\s*(.+)$/i]);
  let pesel = null;
  let imieNazwisko = null;
  if (poszkodowanyLinia) {
    const mPesel = poszkodowanyLinia.match(/PESEL\s*(\d{11})/i);
    if (mPesel) pesel = mPesel[1];
    imieNazwisko = poszkodowanyLinia.split(',')[0].trim();
  }

  // Data i godzina wypadku (z linii lub fallback po formacie YYYY-MM-DD)
  const liniaData = znajdzLinie(czescEwyp, [/^Data wypadku:\s*(.+)$/i]);
  let data = null;
  let godzina = null;
  if (liniaData) {
    const mData = liniaData.match(/(\d{4}-\d{2}-\d{2}|\d{2}[./-]\d{2}[./-]\d{4})/);
    if (mData) data = mData[1];
    const mGodz = liniaData.match(/godzina:\s*(\d{1,2}:\d{2})/i);
    if (mGodz) godzina = mGodz[1];
  } else {
    const mData = czescEwyp.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
    if (mData) data = mData[1];
  }

  const miejsce = znajdzLinie(czescEwyp, [/^Miejsce wypadku:\s*(.+)$/i]);
  const adresZamieszkania = znajdzLinie(czescEwyp, [/^Adres zamieszkania:\s*(.+)$/i]);
  const adresKorespondencyjny = znajdzLinie(czescEwyp, [/^Adres do korespondencji:\s*(.+)$/i]);
  const adresDzialalnosci = znajdzLinie(czescEwyp, [/^Adres prowadzenia dzia[łl]alno[śs]ci:\s*(.+)$/i]);
  const pelnomocnik = znajdzLinie(czescEwyp, [/^Pe[łl]nomocnik:\s*(.+)$/i]);
  const planowaneGodziny = znajdzLinie(czescEwyp, [/^Planowane godziny pracy:\s*(.+)$/i]);
  const rodzajUrazu = znajdzLinie(czescEwyp, [/^Rodzaj urazu:\s*(.+)$/i]);
  const opisOkolicznosci = znajdzLinie(czescEwyp, [/^Opis okoliczno[śs]ci i przyczyn:\s*(.+)$/i]);
  const pierwszaPomoc = znajdzLinie(czescEwyp, [/^Pierwsza pomoc:\s*(.+)$/i]);
  const policja = znajdzLinie(czescEwyp, [/^Policja\/prokuratura:\s*(.+)$/i]);
  const maszynaRaw = znajdzLinie(czescEwyp, [/^Maszyna\/urz[ąa]dzenie:\s*(.+)$/i]);
  const swiadkowieRaw = znajdzLinie(czescEwyp, [/^Świadkowie:\s*(.+)$/i, /^Swiadkowie:\s*(.+)$/i]);
  const zalacznikiRaw = znajdzLinie(czescEwyp, [/^Za[łl][ąa]czniki:\s*(.+)$/i]);
  const sposobOdbioru = znajdzLinie(czescEwyp, [/^Spos[óo]b odbioru odpowiedzi:\s*(.+)$/i]);
  const dataZgloszenia = znajdzLinie(czescEwyp, [/^Data zg[łl]oszenia:\s*(.+)$/i]);

  let maszyna = null;
  if (maszynaRaw) {
    try { maszyna = JSON.parse(maszynaRaw); } catch { maszyna = { nazwa: maszynaRaw }; }
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
