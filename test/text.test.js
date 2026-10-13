import test from 'node:test';
import assert from 'node:assert/strict';
import { wrapLines, layoutText } from '../src/text.js';

const measure = (size, s) => s.length * size * 0.5; // fake font: every glyph is half the size wide

test('wraps on word boundaries', () => {
  const lines = wrapLines(measure, 10, 'one two three four', 60);
  assert.deepEqual(lines, ['one two', 'three four']);
});

test('keeps a single over-long word on its own line', () => {
  const lines = wrapLines(measure, 10, 'a incomprehensibilities b', 40);
  assert.deepEqual(lines, ['a', 'incomprehensibilities', 'b']);
});

test('honours explicit newlines', () => {
  assert.deepEqual(wrapLines(measure, 10, 'a\nb', 500), ['a', 'b']);
});

test('short text keeps the maximum size', () => {
  const r = layoutText(measure, 'hi', { w: 200, h: 100 }, { max: 28, min: 9 });
  assert.equal(r.size, 28);
});

test('long text shrinks until it fits, but never below the minimum', () => {
  const box = { w: 120, h: 60 };
  const r = layoutText(measure, 'this caption is far too long to fit at the big size', box, { max: 28, min: 9 });
  assert.ok(r.size < 28 && r.size >= 9);
  assert.ok(r.lines.length * r.size * r.lineHeight <= box.h || r.size === 9);
  const huge = layoutText(measure, 'x '.repeat(500), box, { max: 28, min: 9 });
  assert.equal(huge.size, 9);
});
