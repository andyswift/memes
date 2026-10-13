// A meme is just { template, texts }. It travels in the URL hash as
// "#v1." + base64url(JSON), so a link is the whole meme: no server, no sign-up.

export const MAX_LEN = 140;
const VERSION = 'v1';

function toBase64Url(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function encodeState(state) {
  const payload = { t: state.template, x: state.texts.map((s) => String(s).slice(0, MAX_LEN)) };
  return VERSION + '.' + toBase64Url(JSON.stringify(payload));
}

// Returns a clean state, or null if the hash is missing, old, or garbled.
// `templates` is an array of { id, slots: [...] } used to validate the result.
export function decodeState(hash, templates) {
  try {
    const raw = String(hash || '').replace(/^#/, '');
    const dot = raw.indexOf('.');
    if (dot < 0 || raw.slice(0, dot) !== VERSION) return null;
    const data = JSON.parse(fromBase64Url(raw.slice(dot + 1)));
    const tpl = templates.find((t) => t.id === data.t);
    if (!tpl || !Array.isArray(data.x)) return null;
    const texts = tpl.slots.map((slot, i) =>
      typeof data.x[i] === 'string' ? data.x[i].slice(0, MAX_LEN) : slot.default
    );
    return { template: tpl.id, texts };
  } catch {
    return null;
  }
}
