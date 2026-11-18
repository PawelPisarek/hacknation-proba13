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
test('licznik: przed wgraniem „Brak wzorca…”, po wgraniu „X z 6”', () => {
  const c = zaladuj();
  assert.match(vm.runInContext('ctr()', c), /Brak wzorca dla wgranych spraw/);
  assert.match(vm.runInContext('loaded=true;ctr()', c), /Trafne rekomendacje: \d+ z 6/);
});
test('wysyłka mimo braków daje numer sprawy S001', () => {
  const c = zaladuj();
  vm.runInContext("text='Poślizgnąłem się w pracy.';ans=[];send()", c);
  assert.equal(vm.runInContext('sent', c), 'S001');
});
