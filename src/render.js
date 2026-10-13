import { layoutText } from './text.js';

export const FONT = '"Bricolage Grotesque", "DM Sans", system-ui, sans-serif';
export const OUTPUT = 1000; // exported pictures are 1000 x 1000

// A small drawing API in "design units". Every template is drawn on a square
// canvas of `size` units, scaled up to OUTPUT pixels, so the art is resolution independent.
function makeApi(ctx) {
  const font = (size, weight = 800) => `${weight} ${size}px ${FONT}`;
  const measure = (size, str) => {
    ctx.font = font(size);
    return ctx.measureText(str).width;
  };

  const api = {
    fillAll(color) {
      ctx.fillStyle = color;
      ctx.fillRect(-1, -1, 4000, 4000);
    },
    rect(x, y, w, h, fill, r = 0) {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
    },
    // paper-coloured box with an ink outline
    outlined(x, y, w, h, fill, line, lw, r) {
      ctx.fillStyle = fill;
      ctx.strokeStyle = line;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
      ctx.stroke();
    },
    circle(cx, cy, r, fill, alpha = 1) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    },
    ellipse(cx, cy, rx, ry, fill, deg = 0) {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, (deg * Math.PI) / 180, 0, Math.PI * 2);
      ctx.fill();
    },
    path(d, fill) {
      ctx.fillStyle = fill;
      ctx.fill(new Path2D(d));
    },
    stroke(d, color, width) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.stroke(new Path2D(d));
    },
    at(tx, ty, fn) {
      ctx.save();
      ctx.translate(tx, ty);
      fn();
      ctx.restore();
    },
    // Caption inside a box: wraps, shrinks to fit, never overflows.
    text(str, box, { color = '#1F2A2E', max = 30, min = 10, align = 'left', valign = 'middle', weight = 800, lineHeight = 1.1 } = {}) {
      const t = layoutText(measure, str, box, { max, min, lineHeight });
      const total = t.lines.length * t.size * lineHeight;
      let y = box.y + (valign === 'middle' ? (box.h - total) / 2 : 0);
      ctx.fillStyle = color;
      ctx.font = font(t.size, weight);
      ctx.textBaseline = 'middle';
      ctx.textAlign = align;
      const x = align === 'center' ? box.x + box.w / 2 : box.x;
      for (const line of t.lines) {
        ctx.fillText(line, x, y + (t.size * lineHeight) / 2);
        y += t.size * lineHeight;
      }
      return { height: total };
    },
    // Short label with a paper background, sized to its text (Distracted format).
    tag(str, x, y, w, { align = 'left' } = {}) {
      const size = 16;
      const pad = 10;
      const inner = { x: x + pad, y: 0, w: w - pad * 2, h: 1000 };
      const t = layoutText(measure, str, inner, { max: size, min: size, lineHeight: 1.1 });
      const h = t.lines.length * size * 1.1 + pad * 2 - 2;
      api.outlined(x, y, w, h, '#FFF6E3', '#1F2A2E', 3, 12);
      api.text(str, { x: x + pad, y: y + pad - 1, w: w - pad * 2, h: h - pad * 2 + 2 }, { max: size, min: size, align, valign: 'top' });
    },
    label(str, cx, cy, size, color, spacing) {
      ctx.font = font(size);
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if ('letterSpacing' in ctx) ctx.letterSpacing = spacing + 'px';
      ctx.fillText(str, cx + spacing / 2, cy);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    }
  };
  return api;
}

export function render(canvas, template, texts) {
  canvas.width = OUTPUT;
  canvas.height = OUTPUT;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(OUTPUT / template.size, 0, 0, OUTPUT / template.size, 0, 0);
  ctx.lineJoin = 'round';
  template.draw(makeApi(ctx), texts);
}

// Canvas text needs the fonts to be loaded before the first draw.
export async function loadFonts() {
  if (!document.fonts) return;
  await Promise.all(
    ['800 32px "Bricolage Grotesque"', '600 32px "Bricolage Grotesque"'].map((f) => document.fonts.load(f).catch(() => {}))
  );
}
