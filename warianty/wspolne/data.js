// UDAWANE DANE (sztuczny zbiór testowy ZANT) — makieta bez backendu
const S={ok:['d-ok','spełniona'],no:['d-no','niespełniona'],wa:['d-wa','brak danych']};
const PRZ=['Nagłość zdarzenia','Przyczyna zewnętrzna','Uraz','Zwykłe czynności związane z działalnością','Okres ubezpieczenia wypadkowego'];
const D={
 przyklad:'Poślizgnąłem się w pracy i boli mnie bark.',
 pytania:['Jaką dokładnie czynność wykonywałeś w momencie zdarzenia i w ramach jakiego zlecenia?','Co było na podłożu lub w otoczeniu i co wywołało poślizgnięcie?','Która część ciała ucierpiała i czy udzielił Ci już pomocy lekarz lub SOR?'],
 braki:['Opis szczegółowy okoliczności (jeśli nie doprecyzowano)','Karta informacyjna ze szpitala / SOR','Umowa lub zlecenie na usługę (opcjonalnie: dane świadka)'],
 zal:['Karta informacyjna ze szpitala / SOR','Umowa lub zlecenie na usługę','Dane świadka (opcjonalnie)'],
 cases:[
 {id:'W052',kto:'Rafał Dąbrowski',zaw:'elektryk (PKD 43.21.Z)',skrot:'ogólnik „Poślizgnąłem się w pracy”, bark',rek:'DO',wyl:null,
  prz:['ok','wa','wa','wa','ok'],przn:['Poślizgnięcie — zdarzenie nagłe','Nie opisano podłoża ani przyczyny','Brak karty medycznej','Brak umowy/zlecenia — nie wiadomo, jaka czynność','CEIDG: działalność aktywna w dniu zdarzenia'],
  braki:['Brak karty informacyjnej ze szpitala / SOR','Opis ogólnikowy (brak czynności i przyczyny)','Brak umowy/zlecenia na usługę'],dopytac:'O czynność przed poślizgnięciem, o podłoże i o pomoc medyczną.',
  pod:'W051 — ogólnik + brak karty medycznej, do uzupełnienia',data:'2026-01-07',godz:'14:20',miejsce:'obiekt przy ul. Przemysłowa 101, 20-547 Lublin',uraz:'podejrzenie urazu barku',
  opis:'Poślizgnąłem się w pracy. Zdarzyło się to podczas pracy, ale nie dostarczyłem jeszcze karty informacyjnej ani umowy — doślę później.',
  skan:'ZGŁOSZENIE WYPADKU\nPoszkodowany: Rafał Dąbrowski, PKD 43.21.Z\nData: 2026-01-07  Godzina: 14:20\nMiejsce: obiekt przy ul. Przemysłowa 101, Lublin\nOpis: [[Poślizgnąłem się w pracy.]] Doślę później kartę ze szpitala i umowę.\nUraz: bark',unc:[]},
 {id:'W006',kto:'Dariusz Nowak',zaw:'stolarz',skrot:'piła tarczowa, rana palca (zwykła nieuwaga)',rek:'UZNAC',wyl:'Brak — zwykła nieuwaga nie wyłącza świadczeń (art. 21 ust. 1 nie zachodzi).',
  prz:['ok','ok','ok','ok','ok'],przn:['Odrzut materiału na pilarce — nagłe','Ostrze piły tarczowej','Rana palca prawej dłoni','Cięcie materiału w warsztacie','Ubezpieczenie wypadkowe aktywne'],
  braki:[],dopytac:'—',pod:'W004 — odrzut na pilarce, uznano',data:'2026-02-12',godz:'09:35',miejsce:'warsztat, ul. Lipowa 5, Kraków',uraz:'rana szarpana palca wskazującego prawej dłoni',
  opis:'Podczas cięcia listwy na pilarce tarczowej listwa odskoczyła, rozcięła mi palec. Pomoc udzielona w przychodni.',
  skan:'ZGŁOSZENIE WYPADKU\nPoszkodowany: Dariusz Nowak, stolarz\nData: 2026-02-12 Godzina: 09:35\n[[Podczas cięcia listwy na pilarce tarczowej listwa odskoczyła]], rozcięła palec.\nPierwsza pomoc: przychodnia, TAK',unc:[]},
 {id:'W023',kto:'Michał Mazur',zaw:'elektryk',skrot:'poślizgnięcie na parkingu u klienta (dojazd)',rek:'UZNAC',wyl:'Brak.',
  prz:['ok','ok','ok','ok','ok'],przn:['Poślizgnięcie — nagłe','Oblodzony parking','Skręcenie kolana lewego','Dojazd do klienta w ramach zlecenia','Ubezpieczenie aktywne'],
  braki:['Brak informacji o pierwszej pomocy','Brak godziny wypadku (do potwierdzenia)','Brak karty medycznej'],dopytac:'O pierwszą pomoc i o godzinę zdarzenia.',pod:'W022 — dojazd do klienta, uznano',data:'2026-01-20',godz:'10:45',miejsce:'parking przy ul. Długiej 8, Gdańsk',uraz:'skręcenie kolana lewego',
  opis:'Jadąc do klienta poślizgnąłem się na oblodzonym parkingu i skręciłem kolano.',
  skan:'ZGŁOSZENIE WYPADKU\nPoszkodowany: Michał Mazur, elektryk\nData: 2026-01-20  Godzina: [[10:45|godz]]\nMiejsce: parking przy ul. Długiej 8, Gdańsk\nOpis: dojazd do klienta, [[poślizgnięcie na oblodzonym parkingu]]\nUraz: [[skręcenie kolana lewego|uraz]]',unc:['godz','uraz']},
 {id:'W020',kto:'Michał Krawczyk',zaw:'hydraulik',skrot:'naprawa rynny przy własnym domu w sobotę',rek:'NIE',wyl:'n/d — brak związku z działalnością.',
  prz:['ok','ok','ok','no','ok'],przn:['Upadek z drabiny — nagłe','Drabina','Złamanie nadgarstka','Prywatny dom, sobota — brak związku z działalnością','Ubezpieczenie aktywne'],
  braki:[],dopytac:'—',pod:'W019 — prace prywatne, nie uznano',data:'2026-03-07',godz:'11:00',miejsce:'dom własny, Poznań',uraz:'złamanie nadgarstka',
  opis:'W sobotę naprawiałem rynnę przy swoim domu, spadłem z drabiny.',skan:'ZGŁOSZENIE WYPADKU\nData: 2026-03-07\n[[W sobotę naprawiałem rynnę przy swoim domu]], spadłem z drabiny.',unc:[]},
 {id:'W027',kto:'Anna Szymańska',zaw:'księgowa',skrot:'zasłabnięcie przy biurku, bez czynnika zewnętrznego',rek:'NIE',wyl:'n/d — brak przyczyny zewnętrznej.',
  prz:['ok','no','ok','ok','ok'],przn:['Zasłabnięcie — nagłe','Wyłącznie przyczyna wewnętrzna','Hospitalizacja','Praca przy biurku','Ubezpieczenie aktywne'],
  braki:[],dopytac:'—',pod:'W026 — zasłabnięcie, nie uznano',data:'2026-02-25',godz:'13:10',miejsce:'biuro, ul. Prosta 2, Łódź',uraz:'zawał serca',
  opis:'Siedziałam przy biurku, zrobiło mi się słabo, trafiłam do szpitala.',skan:'ZGŁOSZENIE WYPADKU\nData: 2026-02-25\n[[Siedziałam przy biurku, zrobiło mi się słabo]], trafiłam do szpitala.',unc:[]},
 {id:'W038',kto:'Piotr Kozłowski',zaw:'monter rusztowań',skrot:'upadek z rusztowania, odmowa badania trzeźwości',rek:'UZNAC',wyl:'UWAGA (art. 21 ust. 2–3): odmowa badania trzeźwości — wpisać w polu III.6 karty. To nie zmienia uznania wypadku.',
  prz:['ok','ok','ok','ok','ok'],przn:['Upadek — nagłe','Zerwany pomost rusztowania','Złamanie żeber','Montaż rusztowania','Ubezpieczenie aktywne'],
  braki:[],dopytac:'—',pod:'W037 — upadek z wysokości, uznano',data:'2026-04-02',godz:'08:20',miejsce:'budowa, ul. Wiślna 14, Wrocław',uraz:'złamanie trzech żeber',
  opis:'Spadłem z rusztowania podczas montażu. Policja chciała mnie zbadać na trzeźwość, odmówiłem.',skan:'ZGŁOSZENIE WYPADKU\nData: 2026-04-02\n[[Spadłem z rusztowania podczas montażu]]. Policja — badanie trzeźwości: [[odmowa]].',unc:[]}
 ]
};
const RK={UZNAC:['UZNAĆ','UZNAC','b-ok'],NIE:['NIE UZNAĆ','NIE','b-no'],DO:['DO UZUPEŁNIENIA','DO','b-wa']};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const cs=id=>D.cases.find(c=>c.id===id);
function pRek(c){const r=RK[c.rek];return `<div class="rek ${r[1]==='UZNAC'?'UZNAC':r[1]}"><div class="sm mut">Rekomendacja dla sprawy ${c.id} — ${c.kto}</div><div class="v">${r[0]}</div><div class="sm">Decyzję zawsze podejmuje pracownik ZUS.</div></div>`}
function pPrz(c){return `<h3>5 przesłanek (art. 3)</h3>`+PRZ.map((p,i)=>`<div class="pr"><span class="dot ${S[c.prz[i]][0]}"></span><div><b>${p}</b> — ${S[c.prz[i]][1]}<br><span class="mut">${c.przn[i]}</span></div></div>`).join('')+`<h3>Podobna sprawa z bazy</h3><div class="sm">${c.pod}</div>`}
function pWyl(c){return `<div class="excl"><b>Wyłączenia świadczeń — osobno od uznania wypadku</b><div class="sm" style="margin-top:4px">${c.wyl||'Brak.'}</div></div>`}
function pBraki(c){return `<h3>Braki i niespójności w dokumentach (${c.braki.length})</h3>`+(c.braki.length?`<ul style="margin:4px 0;padding-left:20px">${c.braki.map(b=>`<li>${b}</li>`).join('')}</ul><div class="sm mut">O co dopytać: ${c.dopytac}</div>`:'<div class="sm mut">Brak braków.</div>')}
function pScan(c){let h=c.skan.replace(/\[\[(.+?)(?:\|(\w+))?\]\]/g,(m,t,k)=>k?`<span class="unc" data-k="${k}" title="Niepewny odczyt — kliknij, aby poprawić">${t}</span>`:`<span class="hl">${t}</span>`);
 return `<div class="scan">${h}</div><div class="sm mut" style="margin-top:6px">${c.unc.length?'Żółte pola: niepewny odczyt skanu — kliknij i popraw. Niebieskie: cytaty wspierające przesłanki.':'Brak niepewnych pól. Niebieskie: cytaty wspierające przesłanki.'}</div>${c.unc.length?'<button class="btn sec inl" style="margin-top:8px" onclick="recalc(this)">Przelicz rekomendację</button><span class="sm mut" id="rc"></span>':''}`}
document.addEventListener('click',e=>{const u=e.target.closest('.unc[data-k]');if(u){const v=prompt('Popraw odczytaną wartość:',u.textContent);if(v!==null){u.textContent=v;u.classList.add('fixed')}}});
function recalc(b){const n=$$('.unc.fixed').length;b.nextElementSibling.textContent=n?' ✓ Przeliczono — rekomendacja bez zmian (UZNAĆ).':' Najpierw potwierdź lub popraw pola.'}
function pKarta(c){const f=(l,v,s)=>`<div><label>${l}<span class="src">${s}</span></label><input value="${v}"></div>`;
 const ta=(l,v,s)=>`<div style="grid-column:1/-1"><label>${l}<span class="src">${s}</span></label><textarea style="min-height:72px">${v}</textarea></div>`;
 const kw=c.rek==='UZNAC'?'jest wypadkiem przy pracy':c.rek==='NIE'?'nie jest wypadkiem przy pracy':'do ustalenia po uzupełnieniu dokumentów';
 return `<div class="sm mut">Projekt karty wypadku wg Dz.U. 2022 poz. 223 (bez pieczątek). Wszystkie pola edytowalne.</div><h3>I. Płatnik składek i poszkodowany</h3><div class="kf">${f('Poszkodowany',c.kto,'z EWYP')}${f('Rodzaj działalności',c.zaw,'z CEIDG')}</div><h3>II. Czas i miejsce</h3><div class="kf">${f('Data',c.data,'z EWYP')}${f('Godzina',c.godz,c.unc.length?'ze skanu — do potwierdzenia':'z EWYP')}${ta('Miejsce',c.miejsce,'z EWYP')}</div><h3>III. Okoliczności</h3><div class="kf">${ta('1. Okoliczności i przyczyny',c.opis,'z wyjaśnień poszkodowanego')}${f('2. Rodzaj urazu',c.uraz,c.unc.length?'ze skanu — do potwierdzenia':'z dokumentacji')}${f('4. Kwalifikacja zdarzenia',kw,'rekomendacja — do decyzji człowieka')}${ta('5–6. Wyłączenie świadczeń',c.wyl||'brak','osobno od uznania')}</div><h3>IV. Zapoznanie z kartą</h3><div class="sm mut">Pouczenie o prawie zgłoszenia uwag. Data sporządzenia: 2026-04-20.</div><button class="btn ok" style="margin-top:12px" onclick="this.textContent='✓ Zatwierdzono przez pracownika ZUS (makieta)';this.disabled=true">Zatwierdź projekt karty</button>`}
function top(el,left,right,active,cb){ }
