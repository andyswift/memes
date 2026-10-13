import '@fontsource/bricolage-grotesque/latin-600.css';
import '@fontsource/bricolage-grotesque/latin-800.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-700.css';
import './styles.css';
import { TEMPLATES } from './templates.js';
import { render, loadFonts } from './render.js';
import { encodeState, decodeState, MAX_LEN } from './share.js';

const $ = (id) => document.getElementById(id);
const canvas = $('meme');
const defaults = (tpl) => tpl.slots.map((s) => s.default);

let state = decodeState(location.hash, TEMPLATES) || { template: TEMPLATES[0].id, texts: defaults(TEMPLATES[0]) };
const current = () => TEMPLATES.find((t) => t.id === state.template);

// ---------- drawing ----------
let queued = false;
function draw() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    render(canvas, current(), state.texts);
    canvas.setAttribute('aria-label', 'Your meme: ' + state.texts.filter(Boolean).join(' / '));
  });
}

let syncTimer = 0;
function syncUrl() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    try { history.replaceState(null, '', '#' + encodeState(state)); } catch { /* sandboxed frames */ }
  }, 150);
}

// ---------- the controls ----------
const grille = $('grille');
for (let i = 0; i < 32; i++) grille.appendChild(document.createElement('i'));

const formatsEl = $('formats');
TEMPLATES.forEach((tpl, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'fmt';
  b.style.setProperty('--c', tpl.color);
  b.innerHTML = `<b>${i + 1}</b><span>${tpl.name}</span>`;
  b.addEventListener('click', () => {
    state = { template: tpl.id, texts: defaults(tpl) };
    refresh();
  });
  formatsEl.appendChild(b);
});

function buildFields() {
  const box = $('fields');
  box.innerHTML = '';
  current().slots.forEach((slot, i) => {
    const wrap = document.createElement('div');
    const id = 'f-' + slot.id;
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = slot.label;
    const input = document.createElement('input');
    input.id = id;
    input.type = 'text';
    input.maxLength = MAX_LEN;
    input.autocomplete = 'off';
    input.enterKeyHint = 'done';
    input.value = state.texts[i];
    input.addEventListener('input', () => {
      state.texts[i] = input.value;
      draw();
      syncUrl();
    });
    wrap.append(label, input);
    box.appendChild(wrap);
  });
}

// Full refresh after the template or the whole state changes.
function refresh() {
  const idx = TEMPLATES.findIndex((t) => t.id === state.template);
  [...formatsEl.children].forEach((b, i) => b.setAttribute('aria-pressed', String(i === idx)));
  $('knob').style.transform = `rotate(${32 + idx * 47}deg)`;
  buildFields();
  draw();
  syncUrl();
}

window.addEventListener('hashchange', () => {
  const next = decodeState(location.hash, TEMPLATES);
  if (next && encodeState(next) !== encodeState(state)) {
    state = next;
    refresh();
  }
});

// ---------- sharing ----------
const toast = $('toast');
let toastTimer = 0;
function say(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

async function copyLink() {
  history.replaceState(null, '', '#' + encodeState(state));
  const url = location.href;
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch { /* nothing more to try */ }
    ta.remove();
  }
  say('Link copied!');
}

function toBlob() {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

async function savePicture() {
  render(canvas, current(), state.texts);
  const blob = await toBlob();
  if (!blob) return say('Could not make the picture');
  const file = new File([blob], `meme-${state.template}.png`, { type: 'image/png' });
  const touch = window.matchMedia('(pointer: coarse)').matches;
  if (touch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'memes!' });
      return;
    } catch (err) {
      if (err?.name === 'AbortError') return;
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  say('Saved!');
}

$('copy').addEventListener('click', copyLink);
$('save').addEventListener('click', savePicture);

// ---------- go ----------
refresh();
loadFonts().then(draw);
