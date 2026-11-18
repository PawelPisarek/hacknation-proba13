// Asystent obywatela (część 1): wskazuje braki w zgłoszeniu, nie blokuje wysłania.
// Zasady P4/P5/P7: prosty język, neutralne dopytywanie, ogólne uspokojenie bez ocen prawnych i bez podpowiadania „pod uznanie”.

import { bezPolskich } from './parser.mjs';

const OPIS_OGOLNIKOWY_WZORCE = [
  /^poslizgn[aą]l(em|am) sie w pracy\.?$/i,
  /^mial(em|am) wypadek przy pracy,? doznal(em|am) urazu\.?$/i,
  /^upadl(em|am) podczas pracy\.?$/i,
];

// Konkretna czynność (co robił) — nie „w pracy”, „na budowie”, „w trakcie zlecenia”.
const CZYNNOSC = /(przecina|wioz|woz[ilm]|dowoz|dostarcz|kierow|parkow|zawozi|skreca|hamowa|zszed|wszed|zjezdz|wjezdz|podjezdz|wysiad|wsiad|szlifowa|jecha|jezdzi|prowadzi|rozladow|rozladun|zaladow|zaladun|wyjmowa|wyjmuj|przenosi|przenosz|nosil|niosl|montowa|monta[zr]|wymienia|wymian|malowa|ukladal|docina|przycina|wciaga|obrob|naprawia|naprawa|remont|spawa|wierci|ciac|cial|kosi|czysci|mycia|myl|sprzatal|pakowa|obslug|ustawia|podnosi|podnosz|schodz|wchodz|wspina|stal(em|am) (na|obok)|przy biurku|siedzia|przy komputer|szedl|szla|szlem|przyjecha|dojezdz|wracal|pracowal.* (przy|na) [a-z]+ [a-z]+|gotowa|krajal|smaz|tnac|tnac|rozbiera|rozkladal|ladowa|doczepia|zakladal|zdejmowa|dokrecal|odkrecal|instalowa|kladl|kopal|kopa|tynkowa|betonow|zbroi)/;
const PRZYCZYNA = /(poslizgn|spadl|spad|upad|potkn|uderz|przewroc|wymus|przygniot|odprysk|odrzu|zakleszcz|zsun|zjech|pekl|przeci|skalecz|ranil|poparz|oparz|porazi|wypadl|zasleb|zaslabl|bol w klatce|kolizj|zderz|wylal|wpadl|zawal|straci.*rownowag|zakrecilo)/;
const CZESC_CIALA = /(reka|reke|rece|reki|dlon|nadgarst|palec|palc|noga|noge|nogi|nodze|stop|kolan|kostk|glow|oko|oka|oczu|plec|krzyz|bark|ramie|ramion|klatk|zebr|kark|szyj|twarz|zeb|biodr|lokiec|lokci|przedrami|udo|uda|brzuch)/;

export function analizaOpisu(opis, uraz = '') {
  const t = String(opis || '').trim();
  const norm = bezPolskich(t);
  const normUraz = bezPolskich(uraz || '');
  return {
    czynnosc: CZYNNOSC.test(norm),
    przyczyna: PRZYCZYNA.test(norm),
    czesc_ciala: CZESC_CIALA.test(norm) || CZESC_CIALA.test(normUraz),
  };
}

export function czyOpisOgolnikowy(opis, uraz = '') {
  const t = String(opis || '').trim();
  if (!t) return true;
  const norm = bezPolskich(t);
  if (OPIS_OGOLNIKOWY_WZORCE.some((re) => re.test(norm))) return true;
  const a = analizaOpisu(t, uraz);
  // Konkretne zdarzenie z czynnikiem sprawczym i okolicznością (min. 4 słowa), np. „Piła tarczowa ścięła mi kciuk.”,
  // „Poślizgnąłem się na mokrej posadzce w magazynie.” — krótkie, ale nie ogólnik. Samo „Upadłem.” nim jest.
  const slowa = norm.split(/\s+/).filter(Boolean).length;
  const czynnikSprawczy = /\b[a-z]{3,}(?:la|lo|l)\s+(?:mi|go|ja)\b/.test(norm) && !/(zdarzyl|przytraf|stalo|wydarzyl|nastapi|dolega)/.test(norm);
  // Warunek niebezpieczny wskazany w opisie (mokra posadzka, zdjęta osłona, uszkodzony…) to konkretna okoliczność, nie samo „poślizgnąłem się”.
  const warunek = /\b(mokr|slisk|oblodz|gololed|zdjet|uszkodz|zepsut|wadliw|luzn|ostr|rozlan|rozsypan|nieosloni)/.test(norm);
  if (slowa >= 4 && (czynnikSprawczy || warunek)) return false;
  // Czynność wyrażona rzeczownikiem po „w trakcie / podczas / przy” (cięcia, montażu…) albo narzędzie/maszyna z nazwy to konkret;
  // ogólne „wykonywanie prac / pracy / czynności” nim nie jest.
  const czynnoscRzeczownik = /\b(?:w trakcie|podczas|przy)\s+(?!wykonywani|wykonani|robieni|realizacj|pracy\b|prac\b|czynnosci|zlecen|dzialaln|obowiazk)(?:[a-z]+\s+)?[a-z]{3,}(?:ania|enia|ecia|ocia|ucia|ycia|cia|nia)\b/.test(norm);
  const narzedzieMaszyna = /\b(?:pil[aeyo]|pilk|tarcz|szlifierk|wiertark|mlot|frezark|prasa|prasie|wozek|nozyc|gilotyn|dzwig|koparka|traktor|spawark|kosiark|betoniark|podnosnik)/.test(norm);
  // Skutek urazu z obiektem („uderzył głową o framugę”) wraz z miejscem to konkretny opis także w 3. osobie.
  const skutekZObiektem = /uderzyl\w*[^.;]{0,25}\bo\s+[a-z]{4,}/.test(norm);
  if (slowa >= 4 && (czynnoscRzeczownik || narzedzieMaszyna || skutekZObiektem)) return false;
  // ogólnik = brak konkretnej czynności; sama przyczyna i część ciała bez czynności to ogólnik
  // Ogólna czynność: czasownik w 1. os. przeszłej opisujący własne działanie (nie sam skutek/stan: miałem, byłem, doznałem, poślizgnąłem…)
  const czasowniki = norm.match(/\b[a-z]{4,}[ae]?l(?:em|am)\b/g) || [];
  const dzialanie = czasowniki.some((v) => !/^(mial|bylem|bylam|czul|dozna|zrobil|poslizgn|upadl|spadl|posli[zs]|potkn|uderz|przewroc|skalecz|zlama|skrecil|zranil|ranil|poparz|oparz|wypadl|zasleb|zaslab|zemdl|omdl|stracil)/.test(v));
  if (dzialanie && !a.czynnosc) return false;
  return !a.czynnosc;
}

export function sprawdzZgloszenie(dane) {
  const z = dane?.zgloszenie || dane || {};
  const braki = [];
  const podpowiedzi = [];

  const dodaj = (kod, pole, komunikat, pytanie) => {
    braki.push(kod);
    podpowiedzi.push({ kod, pole, komunikat, pytanie });
  };

  if (!z.wypadek?.data) {
    dodaj('data', 'Data wypadku', 'Brakuje daty zdarzenia.', 'Kiedy dokładnie doszło do zdarzenia (dzień, miesiąc, rok)?');
  }
  if (!z.wypadek?.godzina) {
    dodaj('godzina', 'Godzina wypadku', 'Brakuje godziny wypadku.', 'O której mniej więcej godzinie to się wydarzyło?');
  }
  if (!z.wypadek?.miejsce) {
    dodaj('miejsce', 'Miejsce wypadku', 'Brakuje miejsca wypadku.', 'Gdzie dokładnie byłeś/byłaś w chwili zdarzenia?');
  }
  if (!z.adres_dzialalnosci) {
    dodaj('adres_dzialalnosci', 'Adres prowadzenia działalności', 'Brakuje adresu prowadzenia działalności (potrzebny do ustalenia właściwego oddziału ZUS).', 'Pod jakim adresem prowadzisz działalność?');
  }
  if (!z.planowane_godziny_pracy) {
    dodaj('planowane_godziny_pracy', 'Planowane godziny pracy', 'Nie podano planowanych godzin pracy w dniu zdarzenia.', 'W jakich godzinach planowałeś/planowałaś pracować tego dnia?');
  }
  if (!z.rodzaj_urazu) {
    dodaj('rodzaj_urazu', 'Rodzaj urazu', 'Nie wpisano rodzaju urazu.', 'Jakiego urazu doznałeś/doznałaś (lub czy był uraz)?');
  }
  if (czyOpisOgolnikowy(z.opis_okolicznosci, z.rodzaj_urazu)) {
    dodaj(
      'opis_ogolnikowy',
      'Opis okoliczności i przyczyn',
      'Opis jest bardzo krótki. Warto opisać zdarzenie krok po kroku własnymi słowami.',
      'Co dokładnie robiłeś/robiłaś przed zdarzeniem, co się wydarzyło po kolei i co doprowadziło do urazu?'
    );
    podpowiedzi[podpowiedzi.length - 1].pytania = [
      'Jaką czynność wykonywałeś/wykonywałaś tuż przed zdarzeniem (co dokładnie robiłeś/robiłaś)?',
      'Co było przyczyną — co się stało (poślizg, upadek, uderzenie, odrzut…)?',
      'Którą część ciała uraziłeś/uraziłaś?',
    ];
  }
  // Brak pytania o pierwszą pomoc, gdy poszkodowany pisze, że nie był jeszcze u lekarza (to osobny brak: dokumentacja medyczna)
  const jeszczeBezLekarza = /(nie bylem|nie bylam|nie byl|nie byla|nie widzial\w*|bez wizyty)[^.]{0,25}lekarz/.test(bezPolskich(`${z.rodzaj_urazu || ''} ${z.wyjasnienia_poszkodowanego || ''}`));
  const opisOgolnikowy = czyOpisOgolnikowy(z.opis_okolicznosci, z.rodzaj_urazu);
  // Najpierw opis zdarzenia: gdy opis jest ogólnikowy, o pierwszą pomoc nie pytamy (kolejność pytań, nie brak danych)
  if (!z.pierwsza_pomoc && !jeszczeBezLekarza && !opisOgolnikowy && !/brak|nie stwierdzono/i.test(String(z.rodzaj_urazu || ''))) {
    dodaj('pierwsza_pomoc', 'Pierwsza pomoc medyczna', 'Nie podano, kto i gdzie udzielił pierwszej pomocy.', 'Czy korzystałeś/korzystałaś z pomocy medycznej (SOR, przychodnia, szpital)? Jeśli tak — gdzie?');
  }
  if (z.maszyna && (z.maszyna.sprawna === undefined || z.maszyna.zgodnie_z_instrukcja === undefined)) {
    dodaj(
      'maszyna_szczegoly',
      'Szczegóły maszyny/urządzenia',
      'Wspomniano o maszynie/urządzeniu, ale brakuje informacji o jej stanie i atestach.',
      'Czy urządzenie było sprawne, używane zgodnie z instrukcją producenta, ma atest/deklarację zgodności i jest w ewidencji środków trwałych?'
    );
  }
  const zal = Array.isArray(z.zalaczniki) ? z.zalaczniki : [];
  const zalNorm = bezPolskich(zal.join(' '));
  const opisNorm = bezPolskich(`${z.opis_okolicznosci || ''} ${z.wyjasnienia_poszkodowanego || ''} ${z.wypadek?.miejsce || ''}`);
  const opcjonalnePytania = [];
  const brakSwiadkow = !Array.isArray(z.swiadkowie) || z.swiadkowie.length === 0;
  const maOswiadczenieSwiadka = /oswiadczeni.*swiadk|swiadk/.test(zalNorm);
  if (brakSwiadkow && maOswiadczenieSwiadka) {
    // Niespójność: dołączono oświadczenie świadka, ale brak danych świadka w EWYP
    dodaj('swiadkowie', 'Świadkowie', 'W załącznikach wskazano oświadczenie świadka, ale w formularzu brak danych świadka.', 'Wpisz imię, nazwisko i adres świadka, którego oświadczenie dołączasz.');
  } else if (brakSwiadkow) {
    // Pole świadków w EWYP jest opcjonalne (przedsiębiorca mógł pracować sam) — nie zaliczamy do braków formalnych
    opcjonalnePytania.push({
      kod: 'swiadkowie_opcjonalnie',
      pole: 'Świadkowie (opcjonalnie)',
      komunikat: 'Nie wpisano żadnego świadka — jeśli pracowałeś/pracowałaś sam(a), zostaw puste.',
      pytanie: 'Czy ktoś widział zdarzenie albo był na miejscu zaraz po nim? (Jeśli nie, zostaw puste.)',
    });
  }
  const maMedyczna = /szpital|medyczn|pierwszej pomocy|sor/.test(zalNorm);
  const bezUrazu = /brak —|brak -|nie stwierdzono obrazen|nie stwierdzono/.test(bezPolskich(z.rodzaj_urazu || '')) && !/podejrzeni/.test(bezPolskich(z.rodzaj_urazu || ''));
  if (!maMedyczna && !bezUrazu) {
    dodaj(
      'zalacznik_dokumentacja_medyczna',
      'Dokumentacja medyczna',
      'Na liście załączników brakuje karty informacyjnej ze szpitala lub dokumentu z pierwszej pomocy.',
      'Czy masz kartę ze szpitala, SOR-u albo od lekarza, którą możesz dołączyć?'
    );
  }
  // Dokumenty specyficzne wg typu zdarzenia (docs/materialy.md §5)
  if (/kolizj|jechal.*samochod|dojazd|przejazd/.test(opisNorm) && /nie pamietam|nie dolaczyl.*umow|brak.*faktur|czy wracal/.test(opisNorm) && !/umow|zleceni|faktur|list przewoz/.test(zalNorm)) {
    dodaj(
      'dowod_celu_biznesowego',
      'Dowód celu biznesowego przejazdu',
      'Przy zdarzeniu w drodze brakuje dokumentu potwierdzającego cel biznesowy przejazdu (np. umowy, zlecenia, faktury z hurtowni).',
      'Czy masz zlecenie, umowę lub fakturę potwierdzającą cel tego przejazdu?'
    );
  }
  // Brak umowy/zlecenia: przyznany w opisie albo — przy ogólnikowym opisie — nie da się ustalić, jaką usługę wykonywał (brak dowodu w załącznikach)
  if ((/nie dostarczyl.*umow|umow.*uslug|umow\w*[^.]{0,30}nie (mam|dolaczy|dostarczy)|nie (mam|dolaczy|dostarczy)\w*[^.]{0,30}umow|brak[^.]{0,15}umow|nie (mam|dolaczy|dostarczy)[^.]{0,80}\bani umow/.test(opisNorm) || (opisOgolnikowy && !/szpital|medyczn|sor|policj|swiadk|protokol|notatk/.test(zalNorm))) && !/umow|zleceni|faktur/.test(zalNorm)) {
    dodaj(
      'umowa_zlecenie_uslugi',
      'Umowa / zlecenie usługi',
      'Brakuje umowy, zlecenia lub faktury potwierdzającej wykonywanie usługi na miejscu zdarzenia.',
      'Czy możesz dołączyć umowę, zlecenie lub fakturę za wykonywaną usługę?'
    );
  }

  return {
    mozna_wyslac: true, // Zasada z zadania §3: asystent nigdy nie blokuje wysłania zgłoszenia
    komunikat_ogolny: 'Opis nie jest egzaminem — napisz po prostu własnymi słowami, co się stało. Możesz wysłać zgłoszenie od razu albo uzupełnić wskazane pola.',
    liczba_brakow: braki.length,
    braki,
    podpowiedzi,
    opcjonalne_pytania: opcjonalnePytania,
  };
}
