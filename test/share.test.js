import test from 'node:test';
import assert from 'node:assert/strict';
import { encodeState, decodeState, MAX_LEN } from '../src/share.js';

const templates = [
  { id: 'a', slots: [{ default: 'A1' }, { default: 'A2' }] },
  { id: 'b', slots: [{ default: 'B1' }] }
];

test('round-trips plain text', () => {
  const s = { template: 'a', texts: ['hello', 'world'] };
  assert.deepEqual(decodeState('#' + encodeState(s), templates), s);
});

test('round-trips unicode, emoji and quotes', () => {
  const s = { template: 'a', texts: ['Blåbærsyltetøy "æøå" 🎉', "it's <b>fine</b> & more"] };
  assert.deepEqual(decodeState(encodeState(s), templates), s);
});

test('encoded form is URL-safe', () => {
  const enc = encodeState({ template: 'a', texts: ['???>>>', '~~~___'] });
  assert.match(enc, /^v1\.[A-Za-z0-9_-]+$/);
});

test('bad, empty or unknown input falls back to null', () => {
  for (const bad of ['', '#', '#v1.', '#v1.!!!', '#v2.abc', '#nope', undefined, null]) {
    assert.equal(decodeState(bad, templates), null, String(bad));
  }
  const unknown = encodeState({ template: 'zzz', texts: ['x'] });
  assert.equal(decodeState(unknown, templates), null);
});

test('missing or wrong-typed texts use the template defaults', () => {
  const enc = 'v1.' + btoa(JSON.stringify({ t: 'a', x: ['only one'] })).replace(/=+$/, '');
  assert.deepEqual(decodeState(enc, templates), { template: 'a', texts: ['only one', 'A2'] });
  const typed = 'v1.' + btoa(JSON.stringify({ t: 'b', x: [42] })).replace(/=+$/, '');
  assert.deepEqual(decodeState(typed, templates), { template: 'b', texts: ['B1'] });
});

test('extra texts are dropped and long texts are clipped', () => {
  const long = 'x'.repeat(MAX_LEN + 50);
  const dec = decodeState(encodeState({ template: 'b', texts: [long, 'extra'] }), templates);
  assert.equal(dec.texts.length, 1);
  assert.equal(dec.texts[0].length, MAX_LEN);
});
