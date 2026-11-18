// Test dymny makiety: logika z makieta/index.html na atrapie DOM (bez przeglądarki).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function zaladuj() {
  const html = fs.readFileSync('makieta/index.html', 'utf8');
  const js = html.match(/<script>([\s\S]*)<\/script>/)[1];
  const el = () => ({ innerHTML: '', value: 'x', classList: { add() {}, remove() {}, toggle() {} }, focus() {} });
  const ctx = { window: {}, document: { querySelector: () => el(), querySelectorAll: () => [], addEventListener() {} }, location: { hash: '' }, scrollTo() {}, prompt() {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('makieta/dane.js', 'utf8'), ctx);
  vm.runInContext(js.replace(/^let step/m, 'var step').replace(/^const D=/m, 'var D='), ctx);
  return ctx;
}
test('dane: 6 spraw, każda ze wzorcem', () => {
  const c = zaladuj();
  assert.equal(vm.runInContext('D.cases.length', c), 6);
  assert.equal(vm.runInContext('D.cases.every(x=>x.wzorzec)', c), true);
});
test('ogólnik elektryka → 3 pytania; długi opis → 0 pytań', () => {
  const c = zaladuj();
  assert.equal(vm.runInContext("text='Poślizgnąłem się w pracy.';questions().length", c), 3);
  assert.equal(vm.runInContext("text='x'.repeat(80);questions().length", c), 0);
});
test('licznik (P27): „0 z 0 — wgraj pliki”, własny plik „Brak wzorca…”, po wgraniu „X z 6”', () => {
  const c = zaladuj();
  assert.match(vm.runInContext('ctr()', c), /0 z 0 — wgraj pliki/);
  assert.match(vm.runInContext('own=true;ctr()', c), /Brak wzorca dla wgranych spraw/);
  assert.match(vm.runInContext('loaded=true;ctr()', c), /Trafne rekomendacje: \d+ z 6/);
});
test('wysyłka mimo braków daje numer sprawy S001', () => {
  const c = zaladuj();
  vm.runInContext("text='Poślizgnąłem się w pracy.';ans=[];send()", c);
  assert.equal(vm.runInContext('sent', c), 'ZG-0001');
});

test('P24: numer sprawy ZG-0001 także bez wysyłki (nigdy „null”)', () => {
  const c = zaladuj();
  vm.runInContext("sent=null;step=4;text='';", c);
  const html = vm.runInContext("(function(){var a={innerHTML:''};var q=document.querySelector;document.querySelector=function(s){return s==='#app'?a:q(s)};draw();return a.innerHTML})()", c);
  assert.match(html, /Numer sprawy: <b>ZG-0001<\/b>/);
  assert.doesNotMatch(html, /null/);
});
test('P28–P31: neutralne plakietki, uzasadnienie z cytatem, żółte pole W052, stopka bez „backendu”', () => {
  const html = fs.readFileSync('makieta/index.html', 'utf8');
  assert.doesNotMatch(html, /bez backendu/);
  assert.match(html, /dane udawane \(zbiór sztuczny\)/);
  assert.match(html, /Zapisano — zostanie po odświeżeniu/);
  const c = zaladuj();
  assert.match(vm.runInContext("loaded=false;cur='W052';dec={};(loaded?D.cases:[cs('W052')]).map(x=>dec[x.id]?'c':'b-bl').join()", c), /b-bl/);
  assert.match(vm.runInContext("cs('W052').skan", c), /\[\[.+\|okolicznosci\]\]/);
  assert.match(vm.runInContext("cs('W052').uzas", c), /Cytat z dokumentu sprawy/);
  assert.ok(vm.runInContext("cs('W038').uzas", c).length > 50);
});
