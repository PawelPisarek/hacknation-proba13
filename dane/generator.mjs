// Generator sztucznego zbioru zgłoszeń EWYP + kart wypadków (ZANT).
// Zgodny z docs/materialy.md po poprawce R1 (commit f1efade):
//   - Sekcje 1 i 3: pełne pola EWYP (6 str.) oraz karta wypadku wg rozp. MRiPS z 23.01.2022 (Dz.U. 2022 poz. 223, bez pieczątek, art. 3a).
//   - Sekcja 5: katalog dokumentów wg typu zdarzenia i wzorce pól pod OCR/skany.
//   - Sekcja 6: tabela 7 przypadków granicznych z dwiema osobnymi etykietami:
//       kwalifikacja_zdarzenia: UZNAC | NIE_UZNAC | DO_UZUPELNIENIA
//       wylaczenia_swiadczen: BRAK | ART_21_1_RAZACE_NIEDBALSTWO | ART_21_2_3_NIETRZEZWOSC | ART_6_2_ZADLUZENIE
//     oraz próg zadłużenia składek art. 6 ust. 2–3 (Dz.U. 2025 poz. 1644): > 1% minimalnego wynagrodzenia, przedawnienie po 6 mies.
// Deterministyczny (ziarno), bez zewnętrznych zależności.
// Uruchomienie: node dane/generator.mjs [--ziarno 13] [--wyjscie dane/zbior]
// <!-- skill: dummy-dataset -->
import fs from 'node:fs';
import path from 'node:path';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
let s = Number(arg('--ziarno', 13)) >>> 0;
const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = (a) => a[Math.floor(rnd() * a.length)];
const int = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pad = (n, k = 2) => String(n).padStart(k, '0');
const OUT = arg('--wyjscie', path.join(path.dirname(new URL(import.meta.url).pathname), 'zbior'));

// ---------- dane osobowe (wymyślone) ----------
const IM_M = ['Jan', 'Piotr', 'Krzysztof', 'Tomasz', 'Marcin', 'Paweł', 'Michał', 'Grzegorz', 'Adam', 'Łukasz', 'Rafał', 'Dariusz', 'Wojciech', 'Mateusz'];
const IM_K = ['Anna', 'Katarzyna', 'Magdalena', 'Agnieszka', 'Joanna', 'Monika', 'Ewa', 'Barbara', 'Aleksandra', 'Karolina'];
const NAZ = [['Nowak', 'Nowak'], ['Kowalski', 'Kowalska'], ['Wiśniewski', 'Wiśniewska'], ['Wójcik', 'Wójcik'], ['Kamiński', 'Kamińska'], ['Lewandowski', 'Lewandowska'], ['Zieliński', 'Zielińska'], ['Szymański', 'Szymańska'], ['Woźniak', 'Woźniak'], ['Dąbrowski', 'Dąbrowska'], ['Kozłowski', 'Kozłowska'], ['Jankowski', 'Jankowska'], ['Mazur', 'Mazur'], ['Krawczyk', 'Krawczyk'], ['Piotrowski', 'Piotrowska'], ['Grabowski', 'Grabowska']];
const MIASTA = [['Warszawa', '00-', 'mazowieckie'], ['Kraków', '30-', 'małopolskie'], ['Łódź', '90-', 'łódzkie'], ['Wrocław', '50-', 'dolnośląskie'], ['Poznań', '60-', 'wielkopolskie'], ['Gdańsk', '80-', 'pomorskie'], ['Lublin', '20-', 'lubelskie'], ['Radom', '26-', 'mazowieckie'], ['Kielce', '25-', 'świętokrzyskie'], ['Rzeszów', '35-', 'podkarpackie'], ['Białystok', '15-', 'podlaskie'], ['Opole', '45-', 'opolskie']];
const ULICE = ['Lipowa', 'Polna', 'Leśna', 'Słoneczna', 'Krótka', 'Szkolna', 'Ogrodowa', 'Kwiatowa', 'Długa', 'Kościuszki', 'Mickiewicza', 'Sienkiewicza', 'Piłsudskiego', 'Kolejowa', 'Przemysłowa'];
const SZPITALE = ['Szpitalny Oddział Ratunkowy, Szpital Wojewódzki', 'SOR, Szpital Miejski nr 2', 'Izba Przyjęć, Szpital Powiatowy', 'Nocna i świąteczna opieka zdrowotna, Przychodnia „Zdrowie”', 'SOR, Uniwersytecki Szpital Kliniczny'];

const adres = (m = pick(MIASTA)) => ({ ulica: `ul. ${pick(ULICE)} ${int(1, 120)}${rnd() < 0.4 ? '/' + int(1, 40) : ''}`, kod: `${m[1]}${pad(int(1, 999), 3)}`, miejscowosc: m[0] });
const adresTxt = (a) => a ? `${a.ulica}, ${a.kod} ${a.miejscowosc}` : '—';

function pesel(rok, mies, dzien, kobieta) {
  const m = rok >= 2000 ? mies + 20 : mies;
  const d = `${pad(rok % 100)}${pad(m)}${pad(dzien)}${pad(int(0, 999), 3)}${kobieta ? pick([0, 2, 4, 6, 8]) : pick([1, 3, 5, 7, 9])}`;
  const w = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  const sum = [...d].reduce((a, c, i) => a + Number(c) * w[i], 0);
  return d + ((10 - (sum % 10)) % 10);
}
function nip() {
  for (;;) {
    const d = [int(1, 9), ...Array.from({ length: 8 }, () => int(0, 9))];
    const w = [6, 5, 7, 2, 3, 4, 5, 6, 7];
    const c = d.reduce((a, x, i) => a + x * w[i], 0) % 11;
    if (c < 10) return d.join('') + c;
  }
}
const regon = () => { const d = Array.from({ length: 8 }, () => int(0, 9)); const w = [8, 9, 2, 3, 4, 5, 6, 7]; return d.join('') + (d.reduce((a, x, i) => a + x * w[i], 0) % 11 % 10); };

const dokTozsamosci = () => {
  const lit = 'ABCDEFGHJKLMNPRSTUWXYZ';
  const seria = lit[int(0, lit.length - 1)] + lit[int(0, lit.length - 1)] + lit[int(0, lit.length - 1)];
  return { rodzaj: 'dowód osobisty', seria, numer: pad(int(100000, 999999), 6) };
};

function osoba() {
  const k = rnd() < 0.3;
  const naz = pick(NAZ)[k ? 1 : 0];
  const rok = int(1965, 2000), mies = int(1, 12), dz = int(1, 28);
  const m = pick(MIASTA);
  return {
    pesel: pesel(rok, mies, dz, k),
    dokument_tozsamosci: dokTozsamosci(),
    imie: pick(k ? IM_K : IM_M),
    nazwisko: naz,
    data_urodzenia: `${rok}-${pad(mies)}-${pad(dz)}`,
    miejsce_urodzenia: pick(MIASTA)[0],
    telefon: `+48 60${int(0, 9)} ${pad(int(100, 999), 3)} ${pad(int(100, 999), 3)}`,
    _kobieta: k,
    _miasto: m,
  };
}
const swiadek = () => { const o = osoba(); return { imie: o.imie, nazwisko: o.nazwisko, adres: adresTxt(adres(o._miasto)), relacja: pick(['klient / inwestor', 'pracownik sąsiedniej firmy', 'współpracownik na budowie']) }; };
const r = (k, m, f) => (k ? f : m);

// ---------- działalności ----------
const DZIAL = {
  elektryk: { pkd: '43.21.Z', opis: 'wykonywanie instalacji elektrycznych' },
  stolarz: { pkd: '16.23.Z', opis: 'produkcja wyrobów stolarskich i ciesielskich' },
  dekarz: { pkd: '43.91.Z', opis: 'wykonywanie konstrukcji i pokryć dachowych' },
  mechanik: { pkd: '45.20.Z', opis: 'konserwacja i naprawa pojazdów samochodowych' },
  gastronomia: { pkd: '56.10.A', opis: 'restauracje i inne stałe placówki gastronomiczne' },
  transport: { pkd: '49.41.Z', opis: 'transport drogowy towarów' },
  remonty: { pkd: '43.39.Z', opis: 'wykonywanie pozostałych robót budowlanych wykończeniowych' },
  ogrodnik: { pkd: '81.30.Z', opis: 'usługi związane z zagospodarowaniem terenów zieleni' },
  programista: { pkd: '62.01.Z', opis: 'działalność związana z oprogramowaniem' },
  fryzjer: { pkd: '96.02.Z', opis: 'fryzjerstwo i pozostałe zabiegi kosmetyczne' },
};

const KW_OPIS = {
  UZNAC: 'uznano',
  NIE_UZNAC: 'nie uznano',
  DO_UZUPELNIENIA: 'do uzupełnienia',
};

const WYL_OPIS = {
  BRAK: null,
  ART_21_1_RAZACE_NIEDBALSTWO: 'art. 21 ust. 1 — wyłączna przyczyna: naruszenie przepisów BHP umyślnie lub z rażącego niedbalstwa',
  ART_21_2_3_NIETRZEZWOSC: 'art. 21 ust. 2–3 — nietrzeźwość / środki odurzające (znaczne przyczynienie się lub odmowa badania)',
  ART_6_2_ZADLUZENIE: 'art. 6 ust. 2–3 (Dz.U. 2025 poz. 1644) — zadłużenie składek w dniu wypadku przekraczające 1% minimalnego wynagrodzenia (wstrzymanie świadczeń do spłaty; przedawnienie po 6 mies. od wypadku)',
};

// ---------- scenariusze (pokrywają 100% tabeli 7 przypadków granicznych z docs/materialy.md §6 + DO_UZUPELNIENIA) ----------
const P_OK = { naglosc: true, przyczyna_zewnetrzna: true, uraz: true, zwiazek_z_dzialalnoscia: true, okres_ubezpieczenia: true };
const S = [
  { kod: 'upadek_drabina', typ: 'wysokosc_remont', ile: 3, f: (k, ctx) => ({
    dz: 'elektryk', miejsce: `budynek klienta, ${adresTxt(ctx.adresKlienta)}`, uraz: pick(['złamanie kości promieniowej lewej ręki', 'skręcenie stawu skokowego prawego', 'złamanie nadgarstka prawego']), icd10: 'S52.5',
    opis: `${r(k, 'Montowałem', 'Montowałam')} oprawy oświetleniowe na suficie u klienta. Stał${r(k, 'em', 'am')} na drabinie rozstawnej na wysokości ok. 2 m. Jedna noga drabiny ześlizgnęła się po świeżo umytej płytce i ${r(k, 'spadłem', 'spadłam')} na podłogę, podpierając się ręką.`,
    wyj: `Drabina była sprawna, kupiona w zeszłym roku, z atestem. Klient umył podłogę chwilę wcześniej, nie wiedział${r(k, 'em', 'am')} o tym. Pracował${r(k, 'em', 'am')} sam${r(k, '', 'a')}, klient był w drugim pokoju i przybiegł po hałasie.`,
    maszyna: { nazwa: 'drabina rozstawna aluminiowa 3x7', sprawna: true, zgodnie_z_instrukcja: true, atest: true, w_ewidencji: true },
    umowa: true, oględziny: true,
    przyczyny: 'poślizg nogi drabiny na mokrej posadzce; brak zabezpieczenia drabiny przed przesunięciem',
    p: P_OK, kwKod: 'UZNAC', wylKod: 'BRAK',
    uz: 'Zdarzenie nagłe, wywołane przyczyną zewnętrzną (poślizg drabiny na mokrej posadzce), spowodowało uraz potwierdzony kartą SOR; nastąpiło podczas zwykłych czynności działalności (montaż instalacji u klienta) w okresie ubezpieczenia wypadkowego.' }) },
  { kod: 'pila_tarczowa', typ: 'maszyna', ile: 3, graniczny: true, przypadek6: '4a', f: (k) => ({
    dz: 'stolarz', miejsce: 'warsztat stolarski w miejscu prowadzenia działalności', uraz: pick(['rana cięta palca wskazującego lewej ręki z uszkodzeniem ścięgna', 'amputacja urazowa opuszki palca III ręki lewej']), icd10: 'S61.0',
    opis: `Przecinał${r(k, 'em', 'am')} deskę dębową na pile tarczowej. Deska zakleszczyła się i została odrzucona, ręka ześlizgnęła się w stronę tarczy.`,
    wyj: `Osłona tarczy była założona, popychacza nie użył${r(k, 'em', 'am')}, bo deska była długa. Piła ma deklarację zgodności CE i jest w ewidencji środków trwałych. ${r(k, 'Byłem', 'Byłam')} w warsztacie z pracownikiem sąsiedniej firmy.`,
    maszyna: { nazwa: 'pilarka tarczowa stołowa', sprawna: true, zgodnie_z_instrukcja: false, atest: true, w_ewidencji: true },
    oględziny: true,
    przyczyny: 'odrzut materiału na pilarce; nieużycie popychacza (zwykła nieuwaga — art. 21 ust. 1 nie zachodzi)',
    p: P_OK, kwKod: 'UZNAC', wylKod: 'BRAK',
    uz: 'Przypadek graniczny 4a (SN I UK 69/12): nagłe zdarzenie, przyczyna zewnętrzna (odrzut materiału, kontakt z tarczą), uraz ręki. Zwykła nieuwaga (nieużycie popychacza) nie była umyślna ani nie stanowiła wyłącznej przyczyny — brak wyłączenia świadczeń z art. 21 ust. 1.' }) },
  { kod: 'rusztowanie_dach', typ: 'wysokosc_remont', ile: 3, f: (k, ctx) => ({
    dz: 'dekarz', miejsce: `dach budynku mieszkalnego, ${adresTxt(ctx.adresKlienta)}`, uraz: pick(['złamanie kości piętowej prawej', 'złamanie dwóch żeber i stłuczenie klatki piersiowej', 'złamanie miednicy']), icd10: 'S92.0',
    opis: `Układał${r(k, 'em', 'am')} papę na dachu. Deska pomostu rusztowania pękła i ${r(k, 'spadłem', 'spadłam')} z wysokości ok. 3,5 m.`,
    wyj: `Rusztowanie wypożyczone z atestem, pomost z desek dostarczył inwestor. Miał${r(k, 'em', 'am')} szelki, ale punkt kotwienia był przestawiany w chwili wypadku. Widział to pomocnik inwestora.`,
    maszyna: { nazwa: 'rusztowanie ramowe (wypożyczone)', sprawna: false, zgodnie_z_instrukcja: true, atest: true, w_ewidencji: false },
    umowa: true, oględziny: true,
    przyczyny: 'pęknięcie deski pomostu roboczego',
    p: P_OK, kwKod: 'UZNAC', wylKod: 'BRAK',
    uz: 'Upadek z wysokości po pęknięciu deski pomostu — zdarzenie nagłe, przyczyna zewnętrzna, uraz potwierdzony; prace dekarskie u klienta to zwykłe czynności działalności.' }) },
  { kod: 'odprysk_oko', typ: 'maszyna', ile: 2, graniczny: true, przypadek6: '4a', f: (k) => ({
    dz: 'mechanik', miejsce: 'warsztat samochodowy w miejscu prowadzenia działalności', uraz: 'ciało obce w rogówce oka prawego, otarcie rogówki', icd10: 'T15.0',
    opis: `Szlifował${r(k, 'em', 'am')} szlifierką kątową zardzewiały element układu wydechowego. Odprysk metalu wpadł do oka.`,
    wyj: `Okulary ochronne zsunęły się na czoło, bo zaparowały. Szlifierka sprawna, z deklaracją CE, w ewidencji.`,
    maszyna: { nazwa: 'szlifierka kątowa 125 mm', sprawna: true, zgodnie_z_instrukcja: true, atest: true, w_ewidencji: true },
    oględziny: true,
    przyczyny: 'odprysk metalu podczas szlifowania; zsunięte okulary ochronne',
    p: P_OK, kwKod: 'UZNAC', wylKod: 'BRAK',
    uz: 'Nagłe zdarzenie z przyczyną zewnętrzną (odprysk metalu), uraz oka; naprawa pojazdu jest zwykłą czynnością działalności. Zsunięcie okularów to zwykły błąd, nie rażące niedbalstwo.' }) },
  { kod: 'oparzenie_kuchnia', typ: 'inne', ile: 2, f: (k) => ({
    dz: 'gastronomia', miejsce: 'kuchnia lokalu gastronomicznego (miejsce działalności)', uraz: pick(['oparzenie II stopnia przedramienia prawego', 'oparzenie I i II stopnia dłoni lewej']), icd10: 'T22.2',
    opis: `Przenosił${r(k, 'em', 'am')} garnek z wrzącym rosołem. Ucho garnka pękło i wywar wylał się na rękę.`,
    wyj: `Garnek był używany od trzech lat. W kuchni był pracownik, który od razu schłodził rękę wodą.`,
    maszyna: null, przyczyny: 'pęknięcie ucha garnka z gorącą zawartością',
    p: P_OK, kwKod: 'UZNAC', wylKod: 'BRAK',
    uz: 'Zdarzenie nagłe, przyczyna zewnętrzna (gorący płyn), oparzenie potwierdzone; gotowanie w prowadzonym lokalu to zwykła czynność działalności.' }) },
  { kod: 'kolizja_dostawa', typ: 'droga_dojazd', ile: 3, f: (k) => ({
    dz: 'transport', miejsce: `droga krajowa nr ${pick([7, 8, 17, 19, 92])}, okolice m. ${pick(MIASTA)[0]}`, uraz: pick(['skręcenie odcinka szyjnego kręgosłupa', 'złamanie mostka', 'stłuczenie kolana i rana głowy']), icd10: 'S13.4',
    opis: `Jechał${r(k, 'em', 'am')} z ładunkiem do odbiorcy (zlecenie transportowe). Na skrzyżowaniu inny kierowca wymusił pierwszeństwo i uderzył w bok pojazdu.`,
    wyj: `${r(k, 'Przewoziłem', 'Przewoziłam')} towar według listu przewozowego. Na miejscu była policja, sprawca przyjął mandat, badanie alkomatem: 0,00 promila.`,
    maszyna: { nazwa: 'samochód ciężarowy do 3,5 t', sprawna: true, zgodnie_z_instrukcja: true, atest: true, w_ewidencji: true },
    policja: 'notatka urzędowa policji, sprawca ukarany mandatem, poszkodowany trzeźwy (0,00 promila)',
    umowa: true,
    przyczyny: 'wymuszenie pierwszeństwa przez innego kierującego',
    p: P_OK, kwKod: 'UZNAC', wylKod: 'BRAK',
    uz: 'Wypadek komunikacyjny w trakcie realizacji zlecenia transportowego — przewóz towaru jest zwykłą czynnością działalności transportowej; zdarzenie nagłe, przyczyna zewnętrzna, uraz.' }) },
  { kod: 'przygniecenie_ogrod', typ: 'wysokosc_remont', ile: 2, f: (k, ctx) => ({
    dz: 'ogrodnik', miejsce: `posesja klienta, ${adresTxt(ctx.adresKlienta)}`, uraz: 'złamanie paliczków palców II i III stopy lewej', icd10: 'S92.5',
    opis: `Rozładowywał${r(k, 'em', 'am')} kamienie ogrodowe z przyczepy. Kamień wysunął się z rąk i spadł na stopę.`,
    wyj: `Miał${r(k, 'em', 'am')} buty robocze bez podnoska. Klient był na miejscu i wezwał pomoc.`,
    maszyna: null, umowa: true, przyczyny: 'upadek ciężkiego przedmiotu na stopę',
    p: P_OK, kwKod: 'UZNAC', wylKod: 'BRAK',
    uz: 'Zdarzenie nagłe, przyczyna zewnętrzna (spadający kamień), uraz; prace ogrodowe u klienta to zwykłe czynności działalności.' }) },

  // ----- Przypadek 1 (§6): czynność prywatna / „przy okazji” -----
  { kod: 'czynnosc_prywatna', typ: 'inne', ile: 3, graniczny: true, przypadek6: '1', f: (k) => ({
    dz: pick(['programista', 'transport', 'fryzjer']), miejsce: 'własny dom poszkodowanego (nie jest miejscem działalności)', uraz: 'złamanie kości przedramienia lewego', icd10: 'S52.6',
    opis: `W sobotę ${r(k, 'naprawiałem', 'naprawiałam')} rynnę przy swoim domu i ${r(k, 'spadłem', 'spadłam')} z drabiny.`,
    wyj: `Działalność prowadzę w wynajętym lokalu w mieście. Rynna przy domu ciekła od tygodnia, więc w wolny dzień postanowił${r(k, 'em', 'am')} ją naprawić.`,
    maszyna: { nazwa: 'drabina przystawna (prywatna)', sprawna: true, zgodnie_z_instrukcja: true, atest: false, w_ewidencji: false },
    przyczyny: 'upadek z drabiny podczas prac domowych',
    p: { ...P_OK, zwiazek_z_dzialalnoscia: false }, kwKod: 'NIE_UZNAC', wylKod: 'BRAK',
    uz: 'Przypadek graniczny 1 (SN I UK 567/12): brak związku funkcjonalnego ze zwykłymi czynnościami działalności — naprawa rynny przy własnym domu w dzień wolny nie należy do działalności (art. 3 ust. 3 pkt 8).' }) },

  // ----- Przypadek 2a (§6): dojazd do klienta / wyjazd po materiały -----
  { kod: 'droga_do_klienta', typ: 'droga_dojazd', ile: 2, graniczny: true, przypadek6: '2a', f: (k, ctx) => ({
    dz: 'elektryk', miejsce: `parking przed budynkiem klienta, ${adresTxt(ctx.adresKlienta)}`, uraz: 'skręcenie stawu kolanowego lewego', icd10: 'S83.6',
    opis: `Przyjechał${r(k, 'em', 'am')} do klienta na umówioną naprawę. Wyjmując skrzynkę z narzędziami z bagażnika, ${r(k, 'poślizgnąłem', 'poślizgnęłam')} się na oblodzonym parkingu.`,
    wyj: `Naprawa była zlecona dzień wcześniej (mam zlecenie od klienta i fakturę z hurtowni za materiały). Klient widział zdarzenie z okna.`,
    maszyna: null, umowa: true,
    przyczyny: 'poślizg na oblodzonej nawierzchni podczas wyładunku narzędzi u klienta',
    p: P_OK, kwKod: 'UZNAC', wylKod: 'BRAK',
    uz: 'Przypadek graniczny 2a (SN II UK 407/09, I UK 567/12): bezpośredni dojazd do kontrahenta i wyładunek narzędzi pod konkretne zlecenie należy do zwykłych czynności działalności. Dowody: zlecenie/faktura, świadek.' }) },

  // ----- Przypadek 2b (§6): zwykła droga dom ↔ stała siedziba / powrót do domu -----
  { kod: 'droga_dom_biuro', typ: 'droga_dojazd', ile: 3, graniczny: true, przypadek6: '2b', f: (k) => ({
    dz: pick(['programista', 'fryzjer']), miejsce: `chodnik przy ul. ${pick(ULICE)}, ok. 300 m od domu`, uraz: 'złamanie kostki bocznej prawej', icd10: 'S82.6',
    opis: `Rano szł${r(k, 'em', 'am')} z domu do mojego biura. Na oblodzonym chodniku ${r(k, 'poślizgnąłem', 'poślizgnęłam')} się i ${r(k, 'upadłem', 'upadłam')}.`,
    wyj: `Codziennie chodzę tą trasą do lokalu, w którym prowadzę działalność. Tego dnia nie miał${r(k, 'em', 'am')} żadnych spraw biznesowych po drodze.`,
    maszyna: null, przyczyny: 'poślizg na oblodzonym chodniku w drodze z domu do stałej siedziby działalności',
    p: { ...P_OK, zwiazek_z_dzialalnoscia: false }, kwKod: 'NIE_UZNAC', wylKod: 'BRAK',
    uz: 'Przypadek graniczny 2b (SN I UK 55/09): zdarzenie na zwykłej drodze dom ↔ stałe miejsce prowadzenia działalności nie jest wypadkiem przy pracy z art. 3 ust. 3 pkt 8 (co najwyżej wypadek w drodze).' }) },

  // ----- Przypadek 3a (§6): zasłabnięcie / choroba samoistna bez czynnika zewnętrznego -----
  { kod: 'zaslabniecie_bez_przyczyny', typ: 'inne', ile: 3, graniczny: true, przypadek6: '3a', f: (k) => ({
    dz: pick(['fryzjer', 'programista']), miejsce: 'lokal, w którym prowadzę działalność', uraz: 'brak obrażeń zewnętrznych; rozpoznanie: zawał mięśnia sercowego', icd10: 'I21.9',
    opis: `W trakcie pracy przy biurku poczuł${r(k, 'em', 'am')} silny ból w klatce piersiowej i ${r(k, 'zasłabłem', 'zasłabłam')}. Karetka zabrała mnie do szpitala.`,
    wyj: `Choruję na nadciśnienie od kilku lat. Tego dnia nic szczególnego się nie działo, praca jak zwykle.`,
    maszyna: null, przyczyny: 'przyczyna wewnętrzna — schorzenie samoistne (choroba układu krążenia)',
    p: { ...P_OK, przyczyna_zewnetrzna: false }, kwKod: 'NIE_UZNAC', wylKod: 'BRAK',
    uz: 'Przypadek graniczny 3a: brak przesłanki przyczyny zewnętrznej — zasłabnięcie spowodowane samoistną chorobą bez czynnika zewnętrznego środowiska pracy (art. 3 ust. 1).' }) },

  // ----- Przypadek 3b (§6): zasłabnięcie + czynnik zewnętrzny środowiska pracy -----
  { kod: 'zaslabniecie_upadek_wysokosc', typ: 'wysokosc_remont', ile: 2, graniczny: true, przypadek6: '3b', f: (k, ctx) => ({
    dz: 'remonty', miejsce: `mieszkanie klienta, ${adresTxt(ctx.adresKlienta)}`, uraz: 'wstrząśnienie mózgu, rana tłuczona głowy', icd10: 'S06.0',
    opis: `Malował${r(k, 'em', 'am')} sufit stojąc na podeście ok. 1,5 m. Zakręciło mi się w głowie, ${r(k, 'spadłem', 'spadłam')} i uderzył${r(k, 'em', 'am')} głową o kaloryfer.`,
    wyj: `W pomieszczeniu było duszno, pracował${r(k, 'em', 'am')} z farbą od rana przy zamkniętych oknach. Wcześniej nie ${r(k, 'mdlałem', 'mdlałam')}.`,
    maszyna: { nazwa: 'podest roboczy', sprawna: true, zgodnie_z_instrukcja: true, atest: true, w_ewidencji: true },
    umowa: true, oględziny: true,
    przyczyny: 'zasłabnięcie w warunkach pracy (duszność, opary farby) i upadek z podestu na element instalacji',
    p: P_OK, kwKod: 'UZNAC', wylKod: 'BRAK',
    uz: 'Przypadek graniczny 3b (SN I UK 505/12): czynnik zewnętrzny środowiska pracy (upadek z wysokości, uderzenie o kaloryfer, opary) współdziałał jako przyczyna bezpośredniego urazu — zdarzenie uznane.' }) },

  // ----- Brak urazu (art. 2 pkt 13) -----
  { kod: 'brak_urazu', typ: 'inne', ile: 2, graniczny: true, f: (k) => ({
    dz: pick(['remonty', 'mechanik', 'gastronomia']), miejsce: 'miejsce prowadzenia działalności', uraz: pick(['brak — ból pleców, bez wizyty u lekarza', 'nie stwierdzono obrażeń']), icd10: null,
    opis: `Podczas przenoszenia sprzętu ${r(k, 'potknąłem', 'potknęłam')} się o przedłużacz i ${r(k, 'upadłem', 'upadłam')}. Rozbił się telefon i laptop.`,
    wyj: `Do lekarza nie poszł${r(k, 'em', 'am')}, bo nic poważnego mi się nie stało, tylko pobolewały plecy. Zależy mi na zgłoszeniu ze względu na zniszczony sprzęt.`,
    maszyna: null, przyczyny: 'potknięcie o przewód elektryczny', bezMedycznej: true,
    p: { ...P_OK, uraz: false }, kwKod: 'NIE_UZNAC', wylKod: 'BRAK',
    uz: 'Brak urazu (art. 2 pkt 13): zdarzenie nie spowodowało uszkodzenia tkanek ciała ani narządów; brak dokumentacji medycznej, szkoda wyłącznie w mieniu.' }) },

  // ----- Przypadek 4b (§6): rażące niedbalstwo jako wyłączna przyczyna (art. 21 ust. 1) -----
  { kod: 'razace_niedbalstwo', typ: 'wysokosc_remont', ile: 2, graniczny: true, przypadek6: '4b', f: (k) => ({
    dz: 'elektryk', miejsce: 'rozdzielnia w budynku klienta', uraz: 'porażenie prądem, oparzenia dłoni II stopnia', icd10: 'T75.4',
    opis: `Wymieniał${r(k, 'em', 'am')} zabezpieczenia w rozdzielni bez wyłączenia zasilania, żeby nie odcinać prądu klientowi.`,
    wyj: `Mam uprawnienia SEP. Wiedział${r(k, 'em', 'am')}, że nie wolno pracować pod napięciem, ale klient prosił, żeby nie wyłączać serwerowni.`,
    maszyna: null, umowa: true, oględziny: true,
    przyczyny: 'świadoma praca pod napięciem wbrew przepisom BHP (wyłączna przyczyna)',
    p: P_OK, kwKod: 'UZNAC', wylKod: 'ART_21_1_RAZACE_NIEDBALSTWO',
    uz: 'Przypadek graniczny 4b (SN I UK 69/12): przesłanki z art. 3 spełnione — zdarzenie uznane za wypadek przy pracy, lecz wyłączną przyczyną było udowodnione naruszenie przepisów BHP z rażącego niedbalstwa (art. 21 ust. 1, wpisać w karcie III.5).' }) },

  // ----- Przypadek 5a (§6): alkohol + znaczne przyczynienie się LUB odmowa badania (art. 21 ust. 2–3) -----
  { kod: 'nietrzezwosc', typ: 'ciezki_alkohol', ile: 2, graniczny: true, przypadek6: '5a', f: (k, ctx) => ({
    dz: 'dekarz', miejsce: `dach budynku, ${adresTxt(ctx.adresKlienta)}`, uraz: 'złamanie kości udowej lewej', icd10: 'S72.0',
    opis: `Podczas obróbki komina ${r(k, 'straciłem', 'straciłam')} równowagę i ${r(k, 'spadłem', 'spadłam')} z dachu na rusztowanie.`,
    wyj: `Dzień wcześniej było przyjęcie. Rano czuł${r(k, 'em', 'am')} się dobrze. Nie miał${r(k, 'em', 'am')} szelek.`,
    maszyna: null, policja: 'badanie trzeźwości w szpitalu: 1,1 promila; notatka policji i postanowienie prokuratury', alkohol: '1,1 promila', prokuratura: true,
    przyczyny: 'utrata równowagi w stanie nietrzeźwości (1,1 promila); brak środków ochrony przed upadkiem',
    p: P_OK, kwKod: 'UZNAC', wylKod: 'ART_21_2_3_NIETRZEZWOSC',
    uz: 'Przypadek graniczny 5a (art. 21 ust. 2–3, SN I UK 46/11): przesłanki z art. 3 spełnione, ale stan nietrzeźwości (1,1‰) przyczynił się w znacznym stopniu do wypadku — świadczenia ubezpieczonemu nie przysługują (wpisać w karcie III.6).' }) },
  { kod: 'odmowa_badania_trzezwosci', typ: 'ciezki_alkohol', ile: 1, graniczny: true, przypadek6: '5a', f: (k, ctx) => ({
    dz: 'remonty', miejsce: `budowa u klienta, ${adresTxt(ctx.adresKlienta)}`, uraz: 'złamanie przedramienia prawego', icd10: 'S52.5',
    opis: `Podczas schodzenia z rusztowania ${r(k, 'poślizgnąłem', 'poślizgnęłam')} się i ${r(k, 'spadłem', 'spadłam')} na beton.`,
    wyj: `Na miejscu policja wyczuła woń alkoholu. ${r(k, 'Odmówiłem', 'Odmówiłam')} poddania się badaniu alkomatem i badaniu krwi bez wskazania przyczyn medycznych.`,
    maszyna: null, policja: 'notatka policji: nieusprawiedliwiona odmowa poddania się badaniu trzeźwości', alkohol: 'odmowa badania',
    przyczyny: 'upadek z rusztowania; nieusprawiedliwiona odmowa badania stanu trzeźwości',
    p: P_OK, kwKod: 'UZNAC', wylKod: 'ART_21_2_3_NIETRZEZWOSC',
    uz: 'Przypadek graniczny 5a (art. 21 ust. 3): przesłanki wypadku spełnione, ale nieusprawiedliwiona odmowa poddania się badaniu na obecność alkoholu pozbawia prawa do świadczeń (wpisać adnotację w karcie III.6).' }) },

  // ----- Przypadek 5b (§6): nietrzeźwość BEZ znacznego przyczynienia się -----
  { kod: 'nietrzezwosc_bez_przyczynienia', typ: 'ciezki_alkohol', ile: 2, graniczny: true, przypadek6: '5b', f: (k, ctx) => ({
    dz: 'transport', miejsce: `plac rozładunkowy magazynu klienta, ${adresTxt(ctx.adresKlienta)}`, uraz: 'stłuczenie barku i złamanie obojczyka prawego', icd10: 'S42.0',
    opis: `Stałem obok zaparkowanego samochodu dostawczego podczas rozładunku palet. Wózek widłowy operatora z firmy klienta cofnął bez sygnału i uderzył mnie z tyłu.`.replace('Stałem', r(k, 'Stałem', 'Stałam')),
    wyj: `Badanie krwi w szpitalu wykazało 0,6 promila z dnia poprzedniego, ale w notatce policji i na monitoringu wyraźnie widać, że wyłączną winę ponosi operator wózka klienta — nie przyczynił${r(k, 'em', 'am')} się do wypadku.`,
    maszyna: null, policja: 'notatka policji: wyłączna wina osoby trzeciej (operator wózka), badanie poszkodowanego 0,6 promila — brak przyczynienia poszkodowanego', alkohol: '0,6 promila (bez przyczynienia)', umowa: true,
    przyczyny: 'najechanie wózkiem widłowym przez osobę trzecią (brak przyczynienia się poszkodowanego)',
    p: P_OK, kwKod: 'UZNAC', wylKod: 'BRAK',
    uz: 'Przypadek graniczny 5b (SN I UK 46/11, art. 21 ust. 2): mimo obecności alkoholu (0,6‰) wyłączną przyczyną była wina osoby trzeciej — brak znacznego przyczynienia się poszkodowanego, więc świadczenia przysługują (wyłączenie: BRAK).' }) },

  // ----- Przypadek 5c (§6): nietrzeźwość zrywająca faktyczne wykonywanie działalności -----
  { kod: 'nietrzezwosc_brak_pracy', typ: 'ciezki_alkohol', ile: 2, graniczny: true, przypadek6: '5c', f: (k) => ({
    dz: 'remonty', miejsce: 'zaplecze lokalu remontowanego po godzinach pracy', uraz: 'rana tłuczona głowy', icd10: 'S01.8',
    opis: `Po południu ${r(k, 'przerwałem', 'przerwałam')} prace remontowe, spożywał${r(k, 'em', 'am')} alkohol ze znajomymi na zapleczu i w stanie silnego upojenia (2,4 promila) ${r(k, 'przewróciłem', 'przewróciłam')} się na skrzynki.`,
    wyj: `Świadek potwierdził, że od dwóch godzin nie ${r(k, 'świadczyłem', 'świadczyłam')} żadnych prac — nie wykonywał${r(k, 'em', 'am')} już czynności działalności.`,
    maszyna: null, policja: 'badanie alkomatem: 2,4 promila; notatka policji: poszkodowany nie świadczył pracy', alkohol: '2,4 promila',
    przyczyny: 'upadek w stanie silnego upojenia alkoholowego po zerwaniu wykonywania działalności',
    p: { ...P_OK, zwiazek_z_dzialalnoscia: false }, kwKod: 'NIE_UZNAC', wylKod: 'BRAK',
    uz: 'Przypadek graniczny 5c (wykładnia art. 3 ust. 3 pkt 8): silna nietrzeźwość całkowicie zerwała faktyczne wykonywanie zwykłych czynności działalności — zdarzenie nie jest wypadkiem przy pracy.' }) },

  // ----- Przypadek 6a (§6): brak objęcia ubezpieczeniem wypadkowym -----
  { kod: 'dzialalnosc_zawieszona', typ: 'inne', ile: 2, graniczny: true, przypadek6: '6a', f: (k, ctx) => ({
    dz: pick(['remonty', 'stolarz']), miejsce: `budynek klienta, ${adresTxt(ctx.adresKlienta)}`, uraz: 'rana cięta dłoni wymagająca szycia', icd10: 'S61.9',
    opis: `Docinał${r(k, 'em', 'am')} listwy przypodłogowe nożem. Nóż ześlizgnął się i przeciął dłoń.`,
    wyj: `Działalność mam zawieszoną od kilku miesięcy (brak ubezpieczenia wypadkowego), ale pomagał${r(k, 'em', 'am')} znajomemu klientowi.`,
    maszyna: null, przyczyny: 'ześlizgnięcie noża', zawieszona: true,
    p: { ...P_OK, okres_ubezpieczenia: false, zwiazek_z_dzialalnoscia: false }, kwKod: 'NIE_UZNAC', wylKod: 'BRAK',
    uz: 'Przypadek graniczny 6a (art. 3 ust. 3 pkt 8, art. 2 pkt 3): zdarzenie poza okresem ubezpieczenia wypadkowego — działalność zawieszona w CEIDG w dniu zdarzenia.' }) },

  // ----- Przypadek 6b (§6): krótki okres podlegania ubezpieczeniu (1. tydzień — brak okresu wyczekiwania) -----
  { kod: 'krotki_okres_ubezpieczenia', typ: 'wysokosc_remont', ile: 2, graniczny: true, przypadek6: '6b', f: (k, ctx) => ({
    dz: 'elektryk', miejsce: `lokal usługowy klienta, ${adresTxt(ctx.adresKlienta)}`, uraz: 'skręcenie nadgarstka lewego', icd10: 'S63.5',
    opis: `W czwartym dniu prowadzenia działalności podczas wciągania kabla na korytku pod sufitem poślizgnął${r(k, 'em', 'am')} się stopień stołka montażowego i ${r(k, 'upadłem', 'upadłam')} na dłoń.`,
    wyj: `Działalność założył${r(k, 'em', 'am')} i zgłosił${r(k, 'em', 'am')} do ubezpieczenia wypadkowego 4 dni przed wypadkiem (pierwszy tydzień działalności, bez ulgi na start). Mam umowę z klientem i kartę z SOR.`,
    maszyna: null, umowa: true, krotkiStaz: true,
    przyczyny: 'poślizg na stopniu stołka montażowego podczas prac instalacyjnych',
    p: P_OK, kwKod: 'UZNAC', wylKod: 'BRAK',
    uz: 'Przypadek graniczny 6b (art. 8 ust. 1 ustawy wypadkowej): w ubezpieczeniu wypadkowym nie obowiązuje okres wyczekiwania — krótki (4-dniowy) staż podlegania ubezpieczeniu nie wyklucza uznania ani świadczeń.' }) },

  // ----- Przypadek 7 (§6): zadłużenie składek > 1% minimalnego wynagrodzenia (Dz.U. 2025 poz. 1644) -----
  { kod: 'zadluzenie_skladek', typ: 'maszyna', ile: 2, graniczny: true, przypadek6: '7', f: (k) => ({
    dz: 'mechanik', miejsce: 'warsztat samochodowy w miejscu prowadzenia działalności', uraz: 'złamanie kości śródręcza prawego', icd10: 'S62.3',
    opis: `Podczas wymiany koła podnośnik się przechylił, a koło przygniotło mi rękę.`,
    wyj: `Podnośnik hydrauliczny sprawny, z przeglądem UDT i deklaracją zgodności. Składki płacę, ale w dniu wypadku miał${r(k, 'em', 'am')} zaległości powyżej 1% minimalnego wynagrodzenia.`,
    maszyna: { nazwa: 'podnośnik hydrauliczny', sprawna: true, zgodnie_z_instrukcja: true, atest: true, w_ewidencji: true },
    oględziny: true,
    przyczyny: 'przechylenie podnośnika i przygniecenie dłoni', dlugProc: Number((1.5 + rnd() * 25).toFixed(1)),
    p: P_OK, kwKod: 'UZNAC', wylKod: 'ART_6_2_ZADLUZENIE',
    uz: 'Przypadek graniczny 7 (art. 6 ust. 2–3, t.j. Dz.U. 2025 poz. 1644): przesłanki wypadku spełnione (zdarzenie uznane), ale zadłużenie z tytułu składek w dniu wypadku przekracza 1% minimalnego wynagrodzenia — świadczenia wstrzymane do spłaty całości zadłużenia (przedawnienie po 6 miesiącach od dnia wypadku).' }) },

  // ----- DO_UZUPELNIENIA (§6): brak kluczowego dowodu do oceny przesłanki (generuje listę braków wg P6) -----
  { kod: 'do_uzupelnienia_dojazd', typ: 'droga_dojazd', ile: 2, graniczny: true, przypadek6: 'DO_UZUPELNIENIA', f: (k) => ({
    dz: 'remonty', miejsce: `ul. ${pick(ULICE)} w m. ${pick(MIASTA)[0]}`, uraz: 'skręcenie stawu skokowego lewego', icd10: 'S93.4',
    opis: `Jechał${r(k, 'em', 'am')} samochodem i miał${r(k, 'em', 'am')} kolizję na skrzyżowaniu.`,
    wyj: `Nie pamiętam dokładnie, czy jechał${r(k, 'em', 'am')} wtedy po materiały na zlecenie czy wracał${r(k, 'em', 'am')} już do domu — nie dołączył${r(k, 'em', 'am')} jeszcze żadnej umowy, faktury ani notatki policji.`,
    maszyna: null, brakDowoduCelu: true, wymusBraki: ['dowod_celu_biznesowego', 'opis_ogolnikowy'],
    przyczyny: 'kolizja drogowa — brak dowodu celu biznesowego przejazdu (do uzupełnienia)',
    p: { naglosc: true, przyczyna_zewnetrzna: true, uraz: true, zwiazek_z_dzialalnoscia: null, okres_ubezpieczenia: true },
    kwKod: 'DO_UZUPELNIENIA', wylKod: 'BRAK',
    uz: 'Brak kluczowego dowodu do oceny przesłanki związku z działalnością (art. 3 ust. 3 pkt 8): opis przejazdu jest niejednoznaczny i brak dowodu celu biznesowego (umowy, zlecenia, faktury z hurtowni) oraz notatki policji — sprawa wymaga uzupełnienia dokumentacji.' }) },
  { kod: 'do_uzupelnienia_medyczna', typ: 'wysokosc_remont', ile: 2, graniczny: true, przypadek6: 'DO_UZUPELNIENIA', f: (k, ctx) => ({
    dz: 'elektryk', miejsce: `obiekt przy ${adresTxt(ctx.adresKlienta)}`, uraz: 'podejrzenie urazu barku (brak karty medycznej w aktach)', icd10: null,
    opis: `Poślizgnął${r(k, 'em', 'am')} się w pracy.`,
    wyj: `Zdarzyło się to podczas pracy, ale nie dostarczył${r(k, 'em', 'am')} jeszcze karty informacyjnej ze szpitala ani umowy na wykonanie usługi — doślę później.`,
    maszyna: null, bezMedycznej: true, brakKluczowychDowodow: true, wymusBraki: ['zalacznik_dokumentacja_medyczna', 'opis_ogolnikowy', 'umowa_zlecenie_uslugi'],
    przyczyny: 'opis ogólnikowy — brak dokumentacji medycznej i szczegółowego opisu okoliczności',
    p: { naglosc: true, przyczyna_zewnetrzna: null, uraz: null, zwiazek_z_dzialalnoscia: null, okres_ubezpieczenia: true },
    kwKod: 'DO_UZUPELNIENIA', wylKod: 'BRAK',
    uz: 'Brak kluczowych dowodów do oceny przesłanek urazu i przyczyny zewnętrznej: zgłoszenie zawiera wyłącznie ogólnikowy opis i nie zawiera dokumentacji medycznej ani umowy/zlecenia — wymagane uzupełnienie sprawy.' }) },
];

// ---------- celowe braki w zgłoszeniu (dla asystenta i listy braków P6) ----------
const BRAKI = ['planowane_godziny_pracy', 'swiadkowie', 'pierwsza_pomoc', 'godzina', 'adres_dzialalnosci', 'zalacznik_dokumentacja_medyczna', 'opis_ogolnikowy', 'maszyna_szczegoly'];

function dataWypadku() { const m = int(1, 10), d = int(1, 28); return { data: `2026-${pad(m)}-${pad(d)}`, m, d }; }
const plusDni = (iso, n) => { const t = new Date(iso + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };

const przypadki = [];
let nr = 0;
for (const sc of S) for (let v = 0; v < sc.ile; v++) {
  nr++;
  const o = osoba(); const k = o._kobieta;
  const ctx = { adresKlienta: adres() };
  const x = sc.f(k, ctx);
  const d = dataWypadku();
  const godz = `${pad(int(7, 17))}:${pad(pick([0, 10, 15, 20, 30, 40, 45, 50]))}`;
  const adrZam = adres(o._miasto);
  const adrDz = rnd() < 0.5 ? adrZam : adres(o._miasto);
  const firma = {
    nip: nip(), regon: regon(), pkd: DZIAL[x.dz].pkd, przedmiot: DZIAL[x.dz].opis,
    adres: adrDz, zawieszona: !!x.zawieszona, krotki_staz_dni: x.krotkiStaz ? 4 : int(120, 1800),
  };
  const med = x.bezMedycznej ? null : {
    placowka: `${pick(SZPITALE)}, ${o._miasto[0]}`,
    data_przyjecia: `${d.data} ${godz}`,
    pacjent: `${o.imie} ${o.nazwisko} (PESEL ${o.pesel})`,
    rozpoznanie: x.uraz,
    kod_icd10: x.icd10 || null,
    badanie_alkohol: x.alkohol || 'nie wykonywano',
    e_zla: true,
  };
  const sw = (sc.kod === 'zaslabniecie_bez_przyczyny' || x.brakKluczowychDowodow || rnd() < 0.25) ? [] : Array.from({ length: int(1, 2) }, swiadek);

  // Załączniki wg typu zdarzenia (docs/materialy.md §5)
  const zalaczniki = ['wydruk CEIDG'];
  if (med) zalaczniki.push('karta informacyjna ze szpitala / SOR');
  if (x.umowa) zalaczniki.push('umowa / zlecenie / faktura (dowód wykonania usługi)');
  if (x.oględziny) zalaczniki.push('protokół oględzin miejsca / maszyny');
  if (x.policja) zalaczniki.push('notatka urzędowa policji');
  if (x.prokuratura) zalaczniki.push('postanowienie prokuratury');
  if (sw.length) zalaczniki.push('oświadczenie świadka');

  const dataZgl = plusDni(d.data, int(1, 10));
  const zgl = {
    poszkodowany: {
      pesel: o.pesel, dokument_tozsamosci: o.dokument_tozsamosci, imie: o.imie, nazwisko: o.nazwisko,
      data_urodzenia: o.data_urodzenia, miejsce_urodzenia: o.miejsce_urodzenia, telefon: o.telefon,
    },
    adres_zamieszkania: adrZam,
    adres_ostatniego_zamieszkania_pl: null,
    adres_korespondencyjny: rnd() < 0.15 ? adres() : null,
    adres_dzialalnosci: adrDz,
    adres_opieki_dziecko_niania: null,
    pelnomocnik: rnd() < 0.15 ? { ...(({ imie, nazwisko }) => ({ imie, nazwisko }))(osoba()), adres: adresTxt(adres()), pelnomocnictwo: 'PEL' } : null,
    wypadek: { data: d.data, godzina: godz, miejsce: x.miejsce },
    planowane_godziny_pracy: { od: '08:00', do: pick(['16:00', '17:00', '18:00']) },
    rodzaj_urazu: x.uraz,
    opis_okolicznosci: x.opis,
    pierwsza_pomoc: med ? { kto_gdzie: med.placowka, data: d.data } : null,
    policja_prokuratura: x.policja || null,
    maszyna: x.maszyna || null,
    swiadkowie: sw,
    zalaczniki,
    dokumenty_do_dostarczenia_pozniej: x.brakKluczowychDowodow ? [{ dokument: 'karta informacyjna ze szpitala', termin: plusDni(dataZgl, 7) }] : [],
    sposob_odbioru: pick(['PUE ZUS', 'poczta', 'placówka ZUS']),
    data_zgloszenia: dataZgl,
  };

  // Wzorzec pól dokumentów wtórnych pod OCR/skany (docs/materialy.md §5)
  const dokumentySprawy = {
    typ_zdarzenia: sc.typ,
    karta_sor: med,
    notatka_policji: x.policja ? { jednostka: `KMP ${o._miasto[0]}`, data: d.data, opis: x.policja, wynik_trzezwosci: x.alkohol || '0,00 promila' } : null,
    postanowienie_prokuratury: x.prokuratura ? { jednostka: `Prokuratura Rejonowa ${o._miasto[0]}`, sygnatura: `PR Ds.${int(100, 999)}.2026`, sentencja: 'wszczęcie postępowania wyjaśniającego' } : null,
    oswiadczenia_swiadkow: sw.map((w) => ({ imie: w.imie, nazwisko: w.nazwisko, adres: w.adres, relacja: w.relacja, data: dataZgl })),
    protokol_ogledzin: x.oględziny ? { data: plusDni(d.data, 2), miejsce: x.miejsce, stan_techniczny: x.maszyna ? (x.maszyna.sprawna ? 'sprawna' : 'uszkodzona / niesprawna') : 'stanowisko pracy' } : null,
    umowa_zlecenie: x.umowa ? { rodzaj: 'zlecenie / faktura', data: d.data, zakres: firma.przedmiot, adres_uslugi: x.miejsce } : null,
    ceidg_zus: {
      nip: firma.nip, regon: firma.regon, pkd: firma.pkd, status_ceidg: firma.zawieszona ? 'zawieszona' : 'aktywna',
      ubezpieczenie_wypadkowe: !x.zawieszona,
      zadluzenie_przekracza_1_proc_min_wyn: Boolean(x.dlugProc && x.dlugProc > 1),
      zadluzenie_proc_min_wyn: x.dlugProc || 0,
    },
  };

  // Celowe braki w zgłoszeniu (dla DO_UZUPELNIENIA wymuszone; dla reszty w ok. 35% przypadków)
  const braki = [];
  if (x.wymusBraki) {
    braki.push(...x.wymusBraki);
  } else if (rnd() < 0.35) {
    const n = int(1, 3);
    for (const b of [...BRAKI].sort(() => rnd() - 0.5)) {
      if (braki.length >= n) break;
      if (b === 'planowane_godziny_pracy') zgl.planowane_godziny_pracy = null;
      else if (b === 'swiadkowie') { if (!zgl.swiadkowie.length) continue; zgl.swiadkowie = []; }
      else if (b === 'pierwsza_pomoc') { if (!zgl.pierwsza_pomoc) continue; zgl.pierwsza_pomoc = null; }
      else if (b === 'godzina') zgl.wypadek.godzina = null;
      else if (b === 'adres_dzialalnosci') zgl.adres_dzialalnosci = null;
      else if (b === 'zalacznik_dokumentacja_medyczna') { if (!med) continue; zgl.zalaczniki = zgl.zalaczniki.filter((z) => !z.startsWith('karta')); }
      else if (b === 'opis_ogolnikowy') zgl.opis_okolicznosci = pick([`${r(k, 'Poślizgnąłem', 'Poślizgnęłam')} się w pracy.`, `${r(k, 'Miałem', 'Miałam')} wypadek przy pracy, ${r(k, 'doznałem', 'doznałam')} urazu.`, `${r(k, 'Upadłem', 'Upadłam')} podczas pracy.`]);
      else if (b === 'maszyna_szczegoly') { if (!zgl.maszyna) continue; zgl.maszyna = { nazwa: zgl.maszyna.nazwa }; }
      braki.push(b);
    }
  }

  const dataKarty = plusDni(zgl.data_zgloszenia, int(5, 14));
  const wylOpis = WYL_OPIS[x.wylKod];
  const kwOpis = KW_OPIS[x.kwKod];

  // Karta wypadku wg aktualnego rozporządzenia MRiPS z 23.01.2022 (Dz.U. 2022 poz. 223 — bez pieczątek, art. 3a)
  const karta = {
    podstawa_wzoru: 'Rozporządzenie MRiPS z 23.01.2022 (Dz.U. 2022 poz. 223 — bez pieczątek)',
    podmiot_sporzadzajacy: `ZUS, Oddział w m. ${o._miasto[0]} (dane wymyślone)`,
    platnik_skladek: { nazwa: `${o.imie} ${o.nazwisko} — działalność gospodarcza`, adres: adresTxt(adrDz), nip: firma.nip, regon: firma.regon, pesel: o.pesel, dokument_tozsamosci: o.dokument_tozsamosci },
    poszkodowany: { ...zgl.poszkodowany, adres: adresTxt(adrZam), tytul_ubezpieczenia: 'art. 3 ust. 3 pkt 8 ustawy wypadkowej (albo art. 3a) — wykonywanie zwykłych czynności związanych z prowadzeniem działalności pozarolniczej' },
    dzialalnosc: { nip: firma.nip, regon: firma.regon, pkd: firma.pkd, przedmiot: firma.przedmiot, adres: adresTxt(adrDz) },
    wypadek: { data: d.data, godzina: godz, miejsce: x.miejsce },
    rodzaj_urazu: x.uraz,
    okolicznosci: x.opis + ' ' + x.wyj,
    przyczyny: x.przyczyny,
    pierwsza_pomoc: med ? med.placowka : 'nie udzielono',
    swiadkowie: sw.map((w) => `${w.imie} ${w.nazwisko}, ${w.adres}`),
    czynnosci_ustalajace: ['zapis wyjaśnień poszkodowanego', ...(sw.length ? ['informacje od świadków'] : []), ...(med ? ['dokumentacja medyczna (karta SOR)'] : []), 'wydruk CEIDG', ...(x.dlugProc ? ['konto płatnika składek ZUS'] : [])],
    przeslanki: x.p,
    kwalifikacja_zdarzenia: x.kwKod,
    kwalifikacja: kwOpis,
    wylaczenia_swiadczen: x.wylKod,
    wylaczna_przyczyna_bhp: x.wylKod === 'ART_21_1_RAZACE_NIEDBALSTWO' ? wylOpis : null,
    nietrzezwosc_srodki: x.wylKod === 'ART_21_2_3_NIETRZEZWOSC' ? wylOpis : null,
    wylaczenie_swiadczen: wylOpis,
    uzasadnienie: x.uz,
    zapoznanie_pouczenie: 'Od karty wypadku nie przysługuje odwołanie. Poszkodowany może zgłosić uwagi i zastrzeżenia do ustaleń zawartych w karcie (pisemnie lub do protokołu).',
    przeszkody_14_dni: x.kwKod === 'DO_UZUPELNIENIA' ? 'Oczekiwanie na uzupełnienie brakującej dokumentacji przez poszkodowanego.' : 'nie dotyczy (termin 14 dni zachowany)',
    data_sporzadzenia: dataKarty,
    sporzadzajacy: 'ZUS, pracownik upoważniony (imię, nazwisko, podpis — bez pieczątki wg Dz.U. 2022 poz. 223)',
    data_odbioru: plusDni(dataKarty, 3),
    wykaz_zalacznikow: zgl.zalaczniki,
  };

  przypadki.push({
    id: `W${pad(nr, 3)}`,
    scenariusz: sc.kod,
    typ_zdarzenia: sc.typ,
    graniczny: !!sc.graniczny,
    przypadek_sekcja6: sc.przypadek6 || null,
    wejscie: {
      typ_zdarzenia: sc.typ,
      zgloszenie: zgl,
      wyjasnienia_poszkodowanego: x.wyj,
      dokumentacja_medyczna: med,
      dokumenty_sprawy: dokumentySprawy,
      dzialalnosc: firma,
      skladki: {
        ubezpieczenie_wypadkowe: !x.zawieszona,
        zadluzenie_przekracza_1_proc_min_wyn: Boolean(x.dlugProc && x.dlugProc > 1),
        zadluzenie_proc_min_wyn: x.dlugProc || 0,
      },
    },
    oczekiwane: {
      kwalifikacja_zdarzenia: x.kwKod,
      wylaczenia_swiadczen: x.wylKod,
      braki_zgloszenia: braki,
      karta,
    },
  });
}

// Tasowanie i podział warstwowy po 3 klasach kwalifikacja_zdarzenia (~25–30% testowy, min. 1 z każdej klasy)
przypadki.sort(() => rnd() - 0.5);
const test = new Set();
for (const kw of ['UZNAC', 'NIE_UZNAC', 'DO_UZUPELNIENIA']) {
  const g = przypadki.filter((p) => p.oczekiwane.kwalifikacja_zdarzenia === kw);
  const ileT = Math.max(1, Math.round(g.length * 0.25));
  g.slice(0, ileT).forEach((p) => test.add(p.id));
}
przypadki.forEach((p) => (p.zbior = test.has(p.id) ? 'testowy' : 'uczacy'));
przypadki.sort((a, b) => a.id.localeCompare(b.id));

// ---------- zapis ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const tekstZgl = (p) => {
  const z = p.wejscie.zgloszenie, w = z.poszkodowany, dok = w.dokument_tozsamosci;
  return [`ZAWIADOMIENIE O WYPADKU (EWYP) — dane sztuczne, przypadek ${p.id}`, '',
    `Poszkodowany: ${w.imie} ${w.nazwisko}, PESEL ${w.pesel}, ${dok.rodzaj} ${dok.seria} ${dok.numer}, ur. ${w.data_urodzenia} w m. ${w.miejsce_urodzenia}`,
    `Adres zamieszkania: ${adresTxt(z.adres_zamieszkania)}`, `Adres do korespondencji: ${adresTxt(z.adres_korespondencyjny)}`,
    `Adres prowadzenia działalności: ${adresTxt(z.adres_dzialalnosci)}`,
    `Pełnomocnik: ${z.pelnomocnik ? `${z.pelnomocnik.imie} ${z.pelnomocnik.nazwisko}, ${z.pelnomocnik.adres}` : '—'}`,
    `Data wypadku: ${z.wypadek.data}, godzina: ${z.wypadek.godzina ?? '—'}`, `Miejsce wypadku: ${z.wypadek.miejsce}`,
    `Planowane godziny pracy: ${z.planowane_godziny_pracy ? `${z.planowane_godziny_pracy.od}–${z.planowane_godziny_pracy.do}` : '—'}`,
    `Rodzaj urazu: ${z.rodzaj_urazu}`, `Opis okoliczności i przyczyn: ${z.opis_okolicznosci}`,
    `Pierwsza pomoc: ${z.pierwsza_pomoc ? z.pierwsza_pomoc.kto_gdzie : '—'}`, `Policja/prokuratura: ${z.policja_prokuratura ?? '—'}`,
    `Maszyna/urządzenie: ${z.maszyna ? JSON.stringify(z.maszyna) : '—'}`,
    `Świadkowie: ${z.swiadkowie.length ? z.swiadkowie.map((s) => `${s.imie} ${s.nazwisko}, ${s.adres}`).join('; ') : '—'}`,
    `Załączniki: ${z.zalaczniki.join('; ')}`, `Sposób odbioru odpowiedzi: ${z.sposob_odbioru}`, `Data zgłoszenia: ${z.data_zgloszenia}`, '',
    'WYJAŚNIENIA POSZKODOWANEGO', p.wejscie.wyjasnienia_poszkodowanego, ''].join('\n');
};

function asciiPdf(t) {
  const m = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z', Ą: 'A', Ć: 'C', Ę: 'E', Ł: 'L', Ń: 'N', Ó: 'O', Ś: 'S', Ź: 'Z', Ż: 'Z', '—': '-', '–': '-', '„': '"', '”': '"', '‰': ' prom.' };
  return String(t).replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ—–„”‰]/g, (c) => m[c] || c).replace(/[^\x20-\x7E]/g, ' ');
}
function zawinLinie(linia, max = 88) {
  const slowa = linia.split(/\s+/);
  const out = [];
  let cur = '';
  for (const w of slowa) {
    if (!cur) cur = w;
    else if (cur.length + 1 + w.length <= max) cur += ' ' + w;
    else { out.push(cur); cur = w; }
  }
  if (cur) out.push(cur);
  return out.length ? out : [''];
}
function zapiszPdfProsty(sciezka, tekst) {
  const linie = [];
  for (const raw of tekst.split('\n')) {
    for (const l of zawinLinie(asciiPdf(raw), 88)) linie.push(l);
  }
  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const komendy = ['BT', '/F1 10 Tf', '50 790 Td', '13 TL'];
  linie.slice(0, 56).forEach((l, i) => {
    komendy.push(`${i === 0 ? '' : 'T* '}(${esc(l)}) Tj`);
  });
  komendy.push('ET');
  const stream = komendy.join('\n') + '\n';
  const obiekty = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    `5 0 obj\n<< /Length ${Buffer.byteLength(stream, 'latin1')} >>\nstream\n${stream}endstream\nendobj\n`,
  ];
  let buf = '%PDF-1.4\n';
  const offsets = [0];
  for (const o of obiekty) {
    offsets.push(Buffer.byteLength(buf, 'latin1'));
    buf += o;
  }
  const xrefPos = Buffer.byteLength(buf, 'latin1');
  buf += `xref\n0 ${obiekty.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    buf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  buf += `trailer\n<< /Size ${obiekty.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;
  fs.writeFileSync(sciezka, buf, 'latin1');
}

let pdfCount = 0;
let uczacyPdf = 0;
const celPdfUczacy = Math.ceil(przypadki.length * 0.55) - test.size;
for (const p of przypadki) {
  const dir = path.join(OUT, p.zbior, p.id);
  fs.mkdirSync(dir, { recursive: true });
  const txt = tekstZgl(p);
  fs.writeFileSync(path.join(dir, 'wejscie.json'), JSON.stringify({ id: p.id, ...p.wejscie }, null, 2));
  fs.writeFileSync(path.join(dir, 'zgloszenie.txt'), txt);
  fs.writeFileSync(path.join(dir, 'karta.json'), JSON.stringify({ id: p.id, ...p.oczekiwane }, null, 2));
  if (p.zbior === 'testowy' || uczacyPdf < Math.max(14, celPdfUczacy)) {
    zapiszPdfProsty(path.join(dir, 'zgloszenie.pdf'), txt);
    pdfCount++;
    if (p.zbior === 'uczacy') uczacyPdf++;
  }
}

const csv = [
  'id,zbior,typ_zdarzenia,scenariusz,graniczny,przypadek_sekcja6,kwalifikacja_zdarzenia,wylaczenia_swiadczen,braki_zgloszenia',
  ...przypadki.map((p) => [
    p.id, p.zbior, p.typ_zdarzenia, p.scenariusz, p.graniczny, p.przypadek_sekcja6 ?? '',
    p.oczekiwane.kwalifikacja_zdarzenia, p.oczekiwane.wylaczenia_swiadczen,
    p.oczekiwane.braki_zgloszenia.join(' '),
  ].map((v) => `"${v}"`).join(',')),
];
fs.writeFileSync(path.join(OUT, 'etykiety.csv'), csv.join('\n') + '\n');
const ile = (f) => przypadki.filter(f).length;
console.log(
  `przypadki: ${przypadki.length} (uczący ${ile((p) => p.zbior === 'uczacy')}, testowy ${ile((p) => p.zbior === 'testowy')}); ` +
  `pdf ${pdfCount}; UZNAC ${ile((p) => p.oczekiwane.kwalifikacja_zdarzenia === 'UZNAC')}, ` +
  `NIE_UZNAC ${ile((p) => p.oczekiwane.kwalifikacja_zdarzenia === 'NIE_UZNAC')}, ` +
  `DO_UZUPELNIENIA ${ile((p) => p.oczekiwane.kwalifikacja_zdarzenia === 'DO_UZUPELNIENIA')}; ` +
  `graniczne ${ile((p) => p.graniczny)}; z brakami ${ile((p) => p.oczekiwane.braki_zgloszenia.length)}`
);
