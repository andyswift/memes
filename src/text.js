// Pure text layout: wrap a caption into a box and shrink the type until it fits.
// `measure(size, str)` returns the rendered width, so this runs without a canvas.

export function wrapLines(measure, size, text, maxWidth) {
  const lines = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const trial = line ? line + ' ' + word : word;
      if (line && measure(size, trial) > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = trial;
      }
    }
    lines.push(line);
  }
  return lines;
}

export function layoutText(measure, text, box, { max = 28, min = 9, lineHeight = 1.1 } = {}) {
  let size = max;
  let lines = wrapLines(measure, size, text, box.w);
  const fits = (s, l) => l.length * s * lineHeight <= box.h && l.every((x) => measure(s, x) <= box.w);
  while (size > min && !fits(size, lines)) {
    size -= 1;
    lines = wrapLines(measure, size, text, box.w);
  }
  return { size, lines, lineHeight };
}
