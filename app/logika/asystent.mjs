// Asystent obywatela (część 1): wskazuje braki w zgłoszeniu, nie blokuje wysłania.
// Zasady P4/P5/P7: prosty język, neutralne dopytywanie, ogólne uspokojenie bez ocen prawnych i bez podpowiadania „pod uznanie”.

import { bezPolskich } from './parser.mjs';

const OPIS_OGOLNIKOWY_WZORCE = [
  /^poslizgn[aą]l(em|am) sie w pracy\.?$/i,
  /^mial(em|am) wypadek przy pracy,? doznal(em|am) urazu\.?$/i,
  /^upadl(em|am) podczas pracy\.?$/i,
];

export function czyOpisOgolnikowy(opis) {
  const t = String(opis || '').trim();
  if (!t) return true;
  if (t.length < 55) return true;
  const norm = bezPolskich(t);
  return OPIS_OGOLNIKOWY_WZORCE.some((re) => re.test(norm));
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
  if (czyOpisOgolnikowy(z.opis_okolicznosci)) {
    dodaj(
      'opis_ogolnikowy',
      'Opis okoliczności i przyczyn',
      'Opis jest bardzo krótki. Warto opisać zdarzenie krok po kroku własnymi słowami.',
      'Co dokładnie robiłeś/robiłaś przed zdarzeniem, co się wydarzyło po kolei i co doprowadziło do urazu?'
    );
  }
  if (!z.pierwsza_pomoc && !/brak|nie stwierdzono/i.test(String(z.rodzaj_urazu || ''))) {
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
  if (/nie dostarczyl.*umow|umow.*uslug/.test(opisNorm) && !/umow|zleceni|faktur/.test(zalNorm)) {
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
