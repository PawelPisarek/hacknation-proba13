// Generator sztucznego zbioru zgłoszeń EWYP + kart wypadków (ZANT).
// Pola wg docs/materialy.md (sekcje 1–3) oraz docs/zadania/01-pdf-ewyp-karta.md (pola EWYP i karty wypadku).
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
  return { pesel: pesel(rok, mies, dz, k), dokument_tozsamosci: dokTozsamosci(), imie: pick(k ? IM_K : IM_M), nazwisko: naz, data_urodzenia: `${rok}-${pad(mies)}-${pad(dz)}`, miejsce_urodzenia: pick(MIASTA)[0], _kobieta: k, _miasto: m };
}
const swiadek = () => { const o = osoba(); return { imie: o.imie, nazwisko: o.nazwisko, adres: adresTxt(adres(o._miasto)) }; };
const r = (k, m, f) => (k ? f : m); // forma rodzajowa: r(kobieta, 'spadłem', 'spadłam')

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

// ---------- scenariusze ----------
// Każdy zwraca: dzialalnosc, miejsce, uraz, opis (zgłoszenie), wyjasnienia, maszyna, policja, przeslanki, kwalifikacja, wylaczenie, uzasadnienie, przyczyny.
const P_OK = { naglosc: true, przyczyna_zewnetrzna: true, uraz: true, zwiazek_z_dzialalnoscia: true, okres_ubezpieczenia: true };
const S = [
  { kod: 'upadek_drabina', ile: 4, f: (k, ctx) => ({
    dz: 'elektryk', miejsce: `budynek klienta, ${adresTxt(ctx.adresKlienta)}`, uraz: pick(['złamanie kości promieniowej lewej ręki', 'skręcenie stawu skokowego prawego', 'złamanie nadgarstka prawego']),
    opis: `Montowałem${r(k, '', '')} oprawy oświetleniowe na suficie u klienta. Stał${r(k, 'em', 'am')} na drabinie rozstawnej na wysokości ok. 2 m. Jedna noga drabiny ześlizgnęła się po świeżo umytej płytce i ${r(k, 'spadłem', 'spadłam')} na podłogę, podpierając się ręką.`.replace('Montowałem', r(k, 'Montowałem', 'Montowałam')),
    wyj: `Drabina była sprawna, kupiona w zeszłym roku, z atestem. Klient umył podłogę chwilę wcześniej, nie wiedział${r(k, 'em', 'am')} o tym. Pracował${r(k, 'em', 'am')} sam${r(k, '', 'a')}, klient był w drugim pokoju i przybiegł po hałasie.`,
    maszyna: { nazwa: 'drabina rozstawna aluminiowa 3x7', sprawna: true, zgodnie_z_instrukcja: true, atest: true, w_ewidencji: true },
    przyczyny: 'poślizg nogi drabiny na mokrej posadzce; brak zabezpieczenia drabiny przed przesunięciem',
    p: P_OK, kw: 'uznano', wyl: null, uz: 'Zdarzenie nagłe, wywołane przyczyną zewnętrzną (poślizg drabiny na mokrej posadzce), spowodowało uraz potwierdzony dokumentacją medyczną; nastąpiło podczas zwykłych czynności działalności (montaż instalacji u klienta) w okresie ubezpieczenia wypadkowego.' }) },
  { kod: 'pila_tarczowa', ile: 3, f: (k) => ({
    dz: 'stolarz', miejsce: 'warsztat stolarski w miejscu prowadzenia działalności', uraz: pick(['rana cięta palca wskazującego lewej ręki z uszkodzeniem ścięgna', 'amputacja urazowa opuszki palca III ręki lewej']),
    opis: `Przecinał${r(k, 'em', 'am')} deskę dębową na pile tarczowej. Deska zakleszczyła się i została odrzucona, ręka ześlizgnęła się w stronę tarczy.`,
    wyj: `Osłona tarczy była założona, popychacza nie użył${r(k, 'em', 'am')}, bo deska była długa. Piła ma deklarację zgodności CE i jest w ewidencji środków trwałych. Byłem w warsztacie z pracownikiem sąsiedniej firmy.`.replace('Byłem', r(k, 'Byłem', 'Byłam')),
    maszyna: { nazwa: 'pilarka tarczowa stołowa', sprawna: true, zgodnie_z_instrukcja: false, atest: true, w_ewidencji: true },
    przyczyny: 'odrzut materiału na pilarce; nieużycie popychacza',
    p: P_OK, kw: 'uznano', wyl: null, uz: 'Nagłe zdarzenie, przyczyna zewnętrzna (odrzut materiału, kontakt z tarczą), uraz ręki; czynność należy do zwykłych czynności działalności stolarskiej. Nieużycie popychacza nie było umyślne ani nie stanowiło wyłącznej przyczyny — brak podstaw z art. 21 ust. 1.' }) },
  { kod: 'rusztowanie_dach', ile: 3, f: (k, ctx) => ({
    dz: 'dekarz', miejsce: `dach budynku mieszkalnego, ${adresTxt(ctx.adresKlienta)}`, uraz: pick(['złamanie kości piętowej prawej', 'złamanie dwóch żeber i stłuczenie klatki piersiowej', 'złamanie miednicy']),
    opis: `Układał${r(k, 'em', 'am')} papę na dachu. Deska pomostu rusztowania pękła i ${r(k, 'spadłem', 'spadłam')} z wysokości ok. 3,5 m.`,
    wyj: `Rusztowanie wypożyczone z atestem, pomost z desek dostarczył inwestor. Miał${r(k, 'em', 'am')} szelki, ale punkt kotwienia był przestawiany w chwili wypadku. Widział to pomocnik inwestora.`,
    maszyna: { nazwa: 'rusztowanie ramowe (wypożyczone)', sprawna: false, zgodnie_z_instrukcja: true, atest: true, w_ewidencji: false },
    przyczyny: 'pęknięcie deski pomostu roboczego',
    p: P_OK, kw: 'uznano', wyl: null, uz: 'Upadek z wysokości po pęknięciu deski pomostu — zdarzenie nagłe, przyczyna zewnętrzna, uraz potwierdzony; prace dekarskie u klienta to zwykłe czynności działalności.' }) },
  { kod: 'odprysk_oko', ile: 3, f: (k) => ({
    dz: 'mechanik', miejsce: 'warsztat samochodowy w miejscu prowadzenia działalności', uraz: 'ciało obce w rogówce oka prawego, otarcie rogówki',
    opis: `Szlifował${r(k, 'em', 'am')} szlifierką kątową zardzewiały element układu wydechowego. Odprysk metalu wpadł do oka.`,
    wyj: `Okulary ochronne zsunęły się na czoło, bo zaparowały. Szlifierka sprawna, w ewidencji.`,
    maszyna: { nazwa: 'szlifierka kątowa 125 mm', sprawna: true, zgodnie_z_instrukcja: true, atest: true, w_ewidencji: true },
    przyczyny: 'odprysk metalu podczas szlifowania; zsunięte okulary ochronne',
    p: P_OK, kw: 'uznano', wyl: null, uz: 'Nagłe zdarzenie z przyczyną zewnętrzną (odprysk metalu), uraz oka; naprawa pojazdu jest zwykłą czynnością działalności.' }) },
  { kod: 'oparzenie_kuchnia', ile: 3, f: (k) => ({
    dz: 'gastronomia', miejsce: 'kuchnia lokalu gastronomicznego (miejsce działalności)', uraz: pick(['oparzenie II stopnia przedramienia prawego', 'oparzenie I i II stopnia dłoni lewej']),
    opis: `Przenosił${r(k, 'em', 'am')} garnek z wrzącym rosołem. Ucho garnka pękło i wywar wylał się na rękę.`,
    wyj: `Garnek był używany od trzech lat. W kuchni był pracownik, który od razu schłodził rękę wodą.`,
    maszyna: null, przyczyny: 'pęknięcie ucha garnka z gorącą zawartością',
    p: P_OK, kw: 'uznano', wyl: null, uz: 'Zdarzenie nagłe, przyczyna zewnętrzna (gorący płyn), oparzenie potwierdzone; gotowanie w prowadzonym lokalu to zwykła czynność działalności.' }) },
  { kod: 'kolizja_dostawa', ile: 3, f: (k, ctx) => ({
    dz: 'transport', miejsce: `droga krajowa nr ${pick([7, 8, 17, 19, 92])}, okolice m. ${pick(MIASTA)[0]}`, uraz: pick(['skręcenie odcinka szyjnego kręgosłupa', 'złamanie mostka', 'stłuczenie kolana i rana głowy']),
    opis: `Jechał${r(k, 'em', 'am')} z ładunkiem do odbiorcy (zlecenie transportowe). Na skrzyżowaniu inny kierowca wymusił pierwszeństwo i uderzył w bok pojazdu.`,
    wyj: `Przewoziłem towar według listu przewozowego. Na miejscu była policja, sprawca przyjął mandat.`.replace('Przewoziłem', r(k, 'Przewoziłem', 'Przewoziłam')),
    maszyna: { nazwa: 'samochód ciężarowy do 3,5 t', sprawna: true, zgodnie_z_instrukcja: true, atest: true, w_ewidencji: true },
    policja: 'notatka urzędowa policji, sprawca ukarany mandatem', przyczyny: 'wymuszenie pierwszeństwa przez innego kierującego',
    p: P_OK, kw: 'uznano', wyl: null, uz: 'Wypadek komunikacyjny w trakcie realizacji zlecenia transportowego — przewóz towaru jest zwykłą czynnością działalności transportowej; zdarzenie nagłe, przyczyna zewnętrzna, uraz.' }) },
  { kod: 'przygniecenie_ogrod', ile: 2, f: (k, ctx) => ({
    dz: 'ogrodnik', miejsce: `posesja klienta, ${adresTxt(ctx.adresKlienta)}`, uraz: 'złamanie paliczków palców II i III stopy lewej',
    opis: `Rozładowywał${r(k, 'em', 'am')} kamienie ogrodowe z przyczepy. Kamień wysunął się z rąk i spadł na stopę.`,
    wyj: `Miał${r(k, 'em', 'am')} buty robocze bez podnoska. Klient był na miejscu i wezwał pomoc.`,
    maszyna: null, przyczyny: 'upadek ciężkiego przedmiotu na stopę', p: P_OK, kw: 'uznano', wyl: null,
    uz: 'Zdarzenie nagłe, przyczyna zewnętrzna (spadający kamień), uraz; prace ogrodowe u klienta to zwykłe czynności działalności.' }) },
  // ----- nieuznane -----
  { kod: 'zaslabniecie_bez_przyczyny', ile: 3, graniczny: true, f: (k) => ({
    dz: pick(['fryzjer', 'programista']), miejsce: 'lokal, w którym prowadzę działalność', uraz: 'brak obrażeń zewnętrznych; rozpoznanie: zawał mięśnia sercowego',
    opis: `W trakcie pracy przy biurku poczuł${r(k, 'em', 'am')} silny ból w klatce piersiowej i ${r(k, 'zasłabłem', 'zasłabłam')}. Karetka zabrała mnie do szpitala.`,
    wyj: `Choruję na nadciśnienie od kilku lat. Tego dnia nic szczególnego się nie działo, praca jak zwykle.`,
    maszyna: null, przyczyny: 'przyczyna wewnętrzna — schorzenie samoistne (choroba układu krążenia)',
    p: { ...P_OK, przyczyna_zewnetrzna: false }, kw: 'nie uznano', wyl: null,
    uz: 'Brak przyczyny zewnętrznej: zasłabnięcie spowodowane samoistną chorobą (zawał), bez czynnika zewnętrznego i bez szczególnego wysiłku lub stresu w pracy. Dowód: karta informacyjna leczenia szpitalnego, wyjaśnienia poszkodowanego.' }) },
  { kod: 'zaslabniecie_upadek_wysokosc', ile: 2, graniczny: true, f: (k, ctx) => ({
    dz: 'remonty', miejsce: `mieszkanie klienta, ${adresTxt(ctx.adresKlienta)}`, uraz: 'wstrząśnienie mózgu, rana tłuczona głowy',
    opis: `Malował${r(k, 'em', 'am')} sufit stojąc na podeście ok. 1,5 m. Zakręciło mi się w głowie, ${r(k, 'spadłem', 'spadłam')} i uderzył${r(k, 'em', 'am')} głową o kaloryfer.`,
    wyj: `W pomieszczeniu było duszno, pracował${r(k, 'em', 'am')} z farbą od rana przy zamkniętych oknach. Wcześniej nie ${r(k, 'mdlałem', 'mdlałam')}.`,
    maszyna: { nazwa: 'podest roboczy', sprawna: true, zgodnie_z_instrukcja: true, atest: true, w_ewidencji: true },
    przyczyny: 'zasłabnięcie w warunkach pracy (duszność, opary farby) i upadek z podestu na element instalacji',
    p: P_OK, kw: 'uznano', wyl: null,
    uz: 'Przypadek graniczny: choć zdarzenie zaczęło się od zasłabnięcia, uraz spowodował upadek z wysokości i uderzenie o kaloryfer w warunkach pracy (opary, praca na podeście) — czynnik zewnętrzny współdziałający. Uznano.' }) },
  { kod: 'droga_dom_biuro', ile: 3, graniczny: true, f: (k) => ({
    dz: pick(['programista', 'fryzjer']), miejsce: `chodnik przy ul. ${pick(ULICE)}, ok. 300 m od domu`, uraz: 'złamanie kostki bocznej prawej',
    opis: `Rano szł${r(k, 'em', 'am')} z domu do mojego biura. Na oblodzonym chodniku ${r(k, 'poślizgnąłem', 'poślizgnęłam')} się i ${r(k, 'upadłem', 'upadłam')}.`,
    wyj: `Codziennie chodzę tą trasą do lokalu, w którym prowadzę działalność. Tego dnia nie miał${r(k, 'em', 'am')} żadnych spraw po drodze.`,
    maszyna: null, przyczyny: 'poślizg na oblodzonym chodniku w drodze z domu do miejsca prowadzenia działalności',
    p: { ...P_OK, zwiazek_z_dzialalnoscia: false }, kw: 'nie uznano', wyl: null,
    uz: 'Brak związku ze zwykłymi czynnościami działalności: zdarzenie w drodze z domu do stałego miejsca prowadzenia działalności nie jest wypadkiem przy pracy w rozumieniu art. 3 ust. 3 pkt 8 ustawy wypadkowej. Dowód: zawiadomienie, wyjaśnienia poszkodowanego.' }) },
  { kod: 'droga_do_klienta', ile: 2, graniczny: true, f: (k, ctx) => ({
    dz: 'elektryk', miejsce: `parking przed budynkiem klienta, ${adresTxt(ctx.adresKlienta)}`, uraz: 'skręcenie stawu kolanowego lewego',
    opis: `Przyjechał${r(k, 'em', 'am')} do klienta na umówioną naprawę. Wyjmując skrzynkę z narzędziami z bagażnika, ${r(k, 'poślizgnąłem', 'poślizgnęłam')} się na oblodzonym parkingu.`,
    wyj: `Naprawa była zlecona dzień wcześniej (mam SMS od klienta i fakturę). Klient widział zdarzenie z okna.`,
    maszyna: null, przyczyny: 'poślizg na oblodzonej nawierzchni podczas wyładunku narzędzi u klienta', p: P_OK, kw: 'uznano', wyl: null,
    uz: 'Przypadek graniczny: zdarzenie poza siedzibą, ale w trakcie czynności przygotowawczych do zleconej usługi (wyładunek narzędzi u klienta) — związek ze zwykłymi czynnościami działalności zachowany. Dowody: faktura, SMS, świadek.' }) },
  { kod: 'brak_urazu', ile: 3, graniczny: true, f: (k) => ({
    dz: pick(['remonty', 'mechanik', 'gastronomia']), miejsce: 'miejsce prowadzenia działalności', uraz: pick(['brak — ból pleców, bez wizyty u lekarza', 'nie stwierdzono obrażeń']),
    opis: `Podczas przenoszenia sprzętu ${r(k, 'potknąłem', 'potknęłam')} się o przedłużacz i ${r(k, 'upadłem', 'upadłam')}. Rozbił się telefon i laptop.`,
    wyj: `Do lekarza nie poszł${r(k, 'em', 'am')}, bo nic poważnego mi się nie stało, tylko pobolewały plecy. Zależy mi na zgłoszeniu ze względu na zniszczony sprzęt.`,
    maszyna: null, przyczyny: 'potknięcie o przewód elektryczny', bezMedycznej: true,
    p: { ...P_OK, uraz: false }, kw: 'nie uznano', wyl: null,
    uz: 'Brak urazu: zdarzenie nie spowodowało uszkodzenia tkanek ciała ani narządów; brak dokumentacji medycznej, poszkodowany sam wskazuje wyłącznie szkody w mieniu. Dowód: wyjaśnienia poszkodowanego.' }) },
  { kod: 'czynnosc_prywatna', ile: 3, f: (k) => ({
    dz: pick(['programista', 'transport', 'fryzjer']), miejsce: 'własny dom poszkodowanego (nie jest miejscem działalności)', uraz: 'złamanie kości przedramienia lewego',
    opis: `W sobotę ${r(k, 'naprawiałem', 'naprawiałam')} rynnę przy swoim domu i ${r(k, 'spadłem', 'spadłam')} z drabiny.`,
    wyj: `Działalność prowadzę w wynajętym lokalu w mieście. Rynna przy domu ciekła od tygodnia, więc w wolny dzień postanowił${r(k, 'em', 'am')} ją naprawić.`,
    maszyna: { nazwa: 'drabina przystawna (prywatna)', sprawna: true, zgodnie_z_instrukcja: true, atest: false, w_ewidencji: false },
    przyczyny: 'upadek z drabiny podczas prac domowych', p: { ...P_OK, zwiazek_z_dzialalnoscia: false }, kw: 'nie uznano', wyl: null,
    uz: 'Brak związku z działalnością: naprawa rynny przy własnym domu w dzień wolny nie należy do zwykłych czynności związanych z prowadzeniem działalności (PKD i miejsce działalności inne). Dowody: wyjaśnienia poszkodowanego, wpis CEIDG.' }) },
  { kod: 'dzialalnosc_zawieszona', ile: 2, f: (k, ctx) => ({
    dz: pick(['remonty', 'stolarz']), miejsce: `budynek klienta, ${adresTxt(ctx.adresKlienta)}`, uraz: 'rana cięta dłoni wymagająca szycia',
    opis: `Docinał${r(k, 'em', 'am')} listwy przypodłogowe nożem. Nóż ześlizgnął się i przeciął dłoń.`,
    wyj: `Działalność mam zawieszoną od kilku miesięcy, ale pomagał${r(k, 'em', 'am')} znajomemu klientowi.`,
    maszyna: null, przyczyny: 'ześlizgnięcie noża', zawieszona: true,
    p: { ...P_OK, okres_ubezpieczenia: false, zwiazek_z_dzialalnoscia: false }, kw: 'nie uznano', wyl: null,
    uz: 'Zdarzenie poza okresem ubezpieczenia wypadkowego: działalność zawieszona w CEIDG w dniu zdarzenia, brak tytułu do ubezpieczenia. Dowody: wydruk CEIDG, dane z konta płatnika.' }) },
  // ----- uznane z wyłączeniem świadczeń (art. 21, art. 6) -----
  { kod: 'nietrzezwosc', ile: 2, f: (k, ctx) => ({
    dz: 'dekarz', miejsce: `dach budynku, ${adresTxt(ctx.adresKlienta)}`, uraz: 'złamanie kości udowej lewej',
    opis: `Podczas obróbki komina ${r(k, 'straciłem', 'straciłam')} równowagę i ${r(k, 'spadłem', 'spadłam')} z dachu na rusztowanie.`,
    wyj: `Dzień wcześniej było przyjęcie. Rano czuł${r(k, 'em', 'am')} się dobrze. Nie miał${r(k, 'em', 'am')} szelek.`,
    maszyna: null, policja: 'badanie trzeźwości w szpitalu: 1,1 promila', przyczyny: 'utrata równowagi w stanie nietrzeźwości; brak środków ochrony przed upadkiem',
    p: P_OK, kw: 'uznano', wyl: 'art. 21 ust. 2 — nietrzeźwość, znaczne przyczynienie się',
    uz: 'Przesłanki wypadku spełnione (nagłość, przyczyna zewnętrzna — upadek z wysokości, uraz, związek z działalnością). Stan nietrzeźwości (1,1‰) w znacznym stopniu przyczynił się do zdarzenia — świadczenia nie przysługują (art. 21 ust. 2). Dowód: wynik badania krwi.' }) },
  { kod: 'zadluzenie_skladek', ile: 2, f: (k, ctx) => ({
    dz: 'mechanik', miejsce: 'warsztat samochodowy w miejscu prowadzenia działalności', uraz: 'złamanie kości śródręcza prawego',
    opis: `Podczas wymiany koła podnośnik się przechylił, a koło przygniotło mi rękę.`,
    wyj: `Podnośnik hydrauliczny sprawny, z przeglądem UDT. Składki płacę, ale w tym roku miał${r(k, 'em', 'am')} zaległości.`,
    maszyna: { nazwa: 'podnośnik hydrauliczny', sprawna: true, zgodnie_z_instrukcja: true, atest: true, w_ewidencji: true },
    przyczyny: 'przechylenie podnośnika i przygniecenie dłoni', dlug: int(150, 3200),
    p: P_OK, kw: 'uznano', wyl: 'art. 6 ust. 2 — zadłużenie z tytułu składek powyżej 2 zł w dniu wypadku',
    uz: 'Przesłanki wypadku spełnione. W dniu wypadku zadłużenie z tytułu składek przekraczało 2 zł — prawo do świadczeń powstanie dopiero po spłacie zadłużenia (art. 6 ust. 2). Dowód: konto płatnika.' }) },
  { kod: 'razace_niedbalstwo', ile: 1, graniczny: true, f: (k) => ({
    dz: 'elektryk', miejsce: 'rozdzielnia w budynku klienta', uraz: 'porażenie prądem, oparzenia dłoni II stopnia',
    opis: `Wymieniał${r(k, 'em', 'am')} zabezpieczenia w rozdzielni bez wyłączenia zasilania, żeby nie odcinać prądu klientowi.`,
    wyj: `Mam uprawnienia SEP. Wiedział${r(k, 'em', 'am')}, że nie wolno pracować pod napięciem, ale klient prosił, żeby nie wyłączać serwerowni.`,
    maszyna: null, przyczyny: 'świadoma praca pod napięciem wbrew przepisom BHP',
    p: P_OK, kw: 'uznano', wyl: 'art. 21 ust. 1 — wyłączna przyczyna: naruszenie przepisów BHP z rażącego niedbalstwa',
    uz: 'Przesłanki wypadku spełnione. Wyłączną przyczyną było świadome naruszenie przepisów o ochronie życia i zdrowia (praca pod napięciem przez osobę z uprawnieniami) — rażące niedbalstwo; świadczenia nie przysługują (art. 21 ust. 1).' }) },
];

// ---------- braki w zgłoszeniu (dla asystenta) ----------
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
  const firma = { nip: nip(), regon: regon(), pkd: DZIAL[x.dz].pkd, przedmiot: DZIAL[x.dz].opis, adres: adrDz, zawieszona: !!x.zawieszona };
  const med = x.bezMedycznej ? null : { placowka: `${pick(SZPITALE)}, ${o._miasto[0]}`, data: d.data, rozpoznanie: x.uraz };
  const sw = (sc.kod === 'zaslabniecie_bez_przyczyny' || rnd() < 0.25) ? [] : Array.from({ length: int(1, 2) }, swiadek);
  const zgl = {
    poszkodowany: { pesel: o.pesel, dokument_tozsamosci: o.dokument_tozsamosci, imie: o.imie, nazwisko: o.nazwisko, data_urodzenia: o.data_urodzenia, miejsce_urodzenia: o.miejsce_urodzenia },
    adres_zamieszkania: adrZam, adres_korespondencyjny: rnd() < 0.15 ? adres() : null,
    adres_dzialalnosci: adrDz,
    pelnomocnik: rnd() < 0.15 ? { ...(({ imie, nazwisko }) => ({ imie, nazwisko }))(osoba()), adres: adresTxt(adres()), pelnomocnictwo: 'PEL' } : null,
    wypadek: { data: d.data, godzina: godz, miejsce: x.miejsce },
    planowane_godziny_pracy: { od: '08:00', do: pick(['16:00', '17:00', '18:00']) },
    rodzaj_urazu: x.uraz,
    opis_okolicznosci: x.opis,
    pierwsza_pomoc: med ? { kto_gdzie: med.placowka, data: med.data } : null,
    policja_prokuratura: x.policja || null,
    maszyna: x.maszyna || null,
    swiadkowie: sw,
    zalaczniki: ['wydruk CEIDG', ...(med ? ['karta informacyjna ze szpitala / dokument pierwszej pomocy'] : []), ...(x.policja && sc.kod === 'kolizja_dostawa' ? ['notatka policji'] : [])],
    sposob_odbioru: pick(['PUE ZUS', 'poczta', 'placówka ZUS']),
    data_zgloszenia: plusDni(d.data, int(1, 10)),
  };
  // celowe braki (ok. 40% przypadków), poza polami tożsamości
  const braki = [];
  if (rnd() < 0.4) {
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
  const karta = {
    platnik_skladek: { nazwa: `${o.imie} ${o.nazwisko} — działalność gospodarcza`, adres: adresTxt(adrDz), nip: firma.nip, regon: firma.regon, pesel: o.pesel, dokument_tozsamosci: o.dokument_tozsamosci },
    poszkodowany: { ...zgl.poszkodowany, adres: adresTxt(adrZam), tytul_ubezpieczenia: 'art. 3 ust. 3 pkt 8 ustawy wypadkowej (pozarolnicza działalność)' },
    dzialalnosc: { nip: firma.nip, regon: firma.regon, pkd: firma.pkd, przedmiot: firma.przedmiot, adres: adresTxt(adrDz) },
    wypadek: { data: d.data, godzina: godz, miejsce: x.miejsce },
    rodzaj_urazu: x.uraz,
    okolicznosci: x.opis + ' ' + x.wyj,
    przyczyny: x.przyczyny,
    pierwsza_pomoc: med ? med.placowka : 'nie udzielono',
    swiadkowie: sw.map((w) => `${w.imie} ${w.nazwisko}, ${w.adres}`),
    czynnosci_ustalajace: ['zapis wyjaśnień poszkodowanego', ...(sw.length ? ['informacje od świadków'] : []), ...(med ? ['dokumentacja medyczna'] : []), 'wydruk CEIDG', ...(x.dlug ? ['konto płatnika składek'] : [])],
    przeslanki: x.p,
    kwalifikacja: x.kw,
    wylaczna_przyczyna_bhp: x.wyl && x.wyl.includes('art. 21 ust. 1') ? x.wyl : null,
    nietrzezwosc_srodki: x.wyl && x.wyl.includes('art. 21 ust. 2') ? x.wyl : null,
    wylaczenie_swiadczen: x.wyl,
    uzasadnienie: x.uz,
    pouczenie: 'Od karty wypadku nie przysługuje odwołanie. Poszkodowany może zgłosić uwagi i zastrzeżenia do ustaleń zawartych w karcie.',
    data_sporzadzenia: dataKarty, sporzadzajacy: 'ZUS, Oddział (dane wymyślone)',
  };
  przypadki.push({
    id: `W${pad(nr, 3)}`, scenariusz: sc.kod, graniczny: !!sc.graniczny,
    wejscie: {
      zgloszenie: zgl,
      wyjasnienia_poszkodowanego: x.wyj,
      dokumentacja_medyczna: med,
      dzialalnosc: firma,
      skladki: { ubezpieczenie_wypadkowe: !x.zawieszona, zadluzenie_zl: x.dlug || 0 },
    },
    oczekiwane: { braki_zgloszenia: braki, karta },
  });
}

// tasowanie i podział: ok. 25% testowy, warstwowo po kwalifikacji
przypadki.sort(() => rnd() - 0.5);
const test = new Set();
for (const kw of ['uznano', 'nie uznano']) {
  const g = przypadki.filter((p) => p.oczekiwane.karta.kwalifikacja === kw);
  g.slice(0, Math.round(g.length * 0.25)).forEach((p) => test.add(p.id));
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
// Prosty generator poprawnego PDF 1.4 bez zależności (tekst ASCII-bezpieczny dla Helvetica;
// wersje ze skanami, szumem, przekrzywieniem i pełnymi polskimi fontami generuje dane/generuj_pdf_skany.py na OMENie).
function asciiPdf(t) {
  const m = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z', Ą: 'A', Ć: 'C', Ę: 'E', Ł: 'L', Ń: 'N', Ó: 'O', Ś: 'S', Ź: 'Z', Ż: 'Z', '—': '-', '–': '-', '„': '"', '”': '"', '‰': ' prom.' };
  return String(t).replace(/[ąćęłńśźżĄĆĘŁŃŚŹŻ—–„”‰]/g, (c) => m[c] || c).replace(/[^\x20-\x7E]/g, ' ');
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
for (const p of przypadki) {
  const dir = path.join(OUT, p.zbior, p.id);
  fs.mkdirSync(dir, { recursive: true });
  const txt = tekstZgl(p);
  fs.writeFileSync(path.join(dir, 'wejscie.json'), JSON.stringify({ id: p.id, ...p.wejscie }, null, 2));
  fs.writeFileSync(path.join(dir, 'zgloszenie.txt'), txt);
  fs.writeFileSync(path.join(dir, 'karta.json'), JSON.stringify({ id: p.id, ...p.oczekiwane }, null, 2));
  if (p.zbior === 'testowy' || uczacyPdf < 14) {
    zapiszPdfProsty(path.join(dir, 'zgloszenie.pdf'), txt);
    pdfCount++;
    if (p.zbior === 'uczacy') uczacyPdf++;
  }
}
const csv = ['id,zbior,scenariusz,graniczny,kwalifikacja,wylaczenie_swiadczen,braki_zgloszenia',
  ...przypadki.map((p) => [p.id, p.zbior, p.scenariusz, p.graniczny, p.oczekiwane.karta.kwalifikacja, p.oczekiwane.karta.wylaczenie_swiadczen ?? '', p.oczekiwane.braki_zgloszenia.join(' ')].map((v) => `"${v}"`).join(','))];
fs.writeFileSync(path.join(OUT, 'etykiety.csv'), csv.join('\n') + '\n');
const ile = (f) => przypadki.filter(f).length;
console.log(`przypadki: ${przypadki.length} (uczący ${ile((p) => p.zbior === 'uczacy')}, testowy ${ile((p) => p.zbior === 'testowy')}); pdf ${pdfCount}; uznano ${ile((p) => p.oczekiwane.karta.kwalifikacja === 'uznano')}, nie uznano ${ile((p) => p.oczekiwane.karta.kwalifikacja === 'nie uznano')}; graniczne ${ile((p) => p.graniczny)}; z brakami ${ile((p) => p.oczekiwane.braki_zgloszenia.length)}`);
