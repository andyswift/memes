// The five formats. All art is original, drawn in code from simple shapes.
// Each template: id, name, button colour, canvas size (design units), text slots, draw(api, texts).

const INK = '#1F2A2E';
const PAPER = '#FFF6E3';
const CORAL = '#F26B4E';
const MARIGOLD = '#F5B83D';
const MINT = '#7ED1B0';
const PINK = '#F58BA8';
const SKY = '#5FA8D3';
const TEAL = '#17494D';
const SKIN = '#C98B63';
const SKIN_DARK = '#A86F4C';

const TORSO = 'M25 240 Q25 175 100 168 Q175 175 175 240 Z';

const yesNo = {
  id: 'yes-no',
  name: 'Yes / No',
  color: CORAL,
  size: 480,
  slots: [
    { id: 'no', label: 'Not this', default: 'Writing a meme generator in a framework' },
    { id: 'yes', label: 'This!', default: '300 lines of plain JavaScript' }
  ],
  draw(c, t) {
    c.fillAll(PAPER);
    c.rect(0, 0, 200, 240, MINT);
    c.rect(0, 240, 200, 240, CORAL);
    // panel 1: hand over the face
    c.path(TORSO, INK);
    c.rect(88, 140, 24, 36, SKIN_DARK);
    c.circle(100, 116, 40, SKIN);
    c.stroke('M158 206 C 160 170 150 150 136 130', INK, 26);
    c.ellipse(122, 108, 24, 28, SKIN, -18);
    // panel 2: pointing
    c.at(0, 240, () => {
      c.path(TORSO, INK);
      c.rect(88, 140, 24, 36, SKIN_DARK);
      c.circle(100, 112, 40, SKIN);
      c.stroke('M150 206 L 176 154', INK, 26);
      c.circle(182, 142, 15, SKIN);
      c.stroke('M184 136 L 194 108', SKIN, 10);
    });
    c.rect(0, 237, 480, 6, INK);
    c.rect(197, 0, 6, 480, INK);
    c.text(t[0], { x: 216, y: 24, w: 244, h: 190 }, { max: 34, min: 12 });
    c.text(t[1], { x: 216, y: 264, w: 244, h: 190 }, { max: 34, min: 12 });
  }
};

const distracted = {
  id: 'distracted',
  name: 'Distracted',
  color: MARIGOLD,
  size: 400,
  slots: [
    { id: 'left', label: 'What you have', default: 'My to-do list' },
    { id: 'middle', label: 'You', default: 'Me' },
    { id: 'right', label: 'The temptation', default: 'A shiny side project' }
  ],
  draw(c, t) {
    c.fillAll('#BFE3F0');
    c.circle(330, 70, 30, '#FFC83D');
    c.rect(0, 330, 400, 70, '#E9B872');
    c.rect(0, 330, 400, 4, INK);
    // left: the person who has been noticed less
    c.path('M52 340 L64 208 Q96 194 128 208 L140 340 Z', PINK);
    c.circle(96, 172, 24, SKIN);
    c.path('M72 170 Q72 142 96 142 Q120 142 120 170 Q108 158 96 158 Q84 158 72 170 Z', '#3A2418');
    c.path('M119 174 L130 180 L119 185 Z', SKIN);
    c.stroke('M84 192 L108 190', INK, 3);
    // middle: head turned
    c.path('M152 340 L160 200 Q205 182 250 200 L258 340 Z', '#3D8FB0');
    c.stroke('M162 214 L128 238', '#3D8FB0', 18);
    c.rect(195, 166, 20, 22, SKIN_DARK);
    c.circle(207, 146, 27, SKIN);
    c.path('M231 148 L248 156 L231 162 Z', SKIN);
    c.path('M180 140 Q182 118 207 118 Q232 118 232 136 Q214 126 180 140 Z', INK);
    // right: the passer-by
    c.path('M282 340 L292 208 Q316 198 340 208 L350 340 Z', CORAL);
    c.circle(316, 170, 24, SKIN);
    c.path('M292 168 Q292 140 316 140 Q340 140 340 168 L340 190 Q330 160 316 160 Q302 160 292 190 Z', INK);
    c.path('M293 172 L280 179 L293 184 Z', SKIN);
    c.tag(t[0], 12, 14, 112);
    c.tag(t[1], 146, 14, 104, { align: 'center' });
    c.tag(t[2], 270, 86, 118);
  }
};

const twoButtons = {
  id: 'two-buttons',
  name: 'Two Buttons',
  color: MINT,
  size: 400,
  slots: [
    { id: 'left', label: 'Left button', default: 'Ship it today' },
    { id: 'right', label: 'Right button', default: 'Polish it forever' }
  ],
  draw(c, t) {
    c.fillAll(PAPER);
    c.rect(30, 24, 340, 170, TEAL, 16);
    c.rect(48, 42, 150, 134, CORAL, 12);
    c.rect(202, 42, 150, 134, CORAL, 12);
    c.rect(48, 42, 150, 8, '#FF9C84', 4);
    c.rect(202, 42, 150, 8, '#FF9C84', 4);
    c.path('M120 400 Q120 318 200 306 Q280 318 280 400 Z', MARIGOLD);
    c.rect(188, 276, 24, 34, SKIN_DARK);
    c.circle(200, 248, 38, SKIN);
    c.path('M162 244 Q162 206 200 206 Q238 206 238 244 Q222 224 200 224 Q178 224 162 244 Z', INK);
    c.stroke('M148 350 L 176 270', MARIGOLD, 22);
    c.ellipse(178, 240, 16, 22, SKIN, 14);
    c.path('M252 214 Q262 232 252 240 Q242 232 252 214 Z', SKY);
    c.path('M262 258 Q270 272 262 278 Q254 272 262 258 Z', SKY);
    c.path('M148 206 Q156 220 148 226 Q140 220 148 206 Z', SKY);
    c.text(t[0], { x: 58, y: 56, w: 130, h: 104 }, { max: 24, min: 10, align: 'center', color: PAPER });
    c.text(t[1], { x: 212, y: 56, w: 130, h: 104 }, { max: 24, min: 10, align: 'center', color: PAPER });
  }
};

const bigBrain = {
  id: 'big-brain',
  name: 'Big Brain',
  color: PINK,
  size: 400,
  slots: [
    { id: 'l1', label: 'Level 1', default: 'Make a meme' },
    { id: 'l2', label: 'Level 2', default: 'Make a meme with a link' },
    { id: 'l3', label: 'Level 3', default: 'Make a meme with no server' },
    { id: 'l4', label: 'Level 4: galaxy brain', default: 'The link IS the meme' }
  ],
  draw(c, t) {
    c.fillAll(PAPER);
    c.rect(0, 100, 400, 100, '#FFE2A3');
    c.rect(0, 200, 400, 100, TEAL);
    c.rect(0, 300, 400, 100, '#0E2B2E');
    for (const y of [98, 198, 298]) c.rect(0, y, 400, 4, INK);
    c.rect(236, 0, 4, 400, INK);
    for (const y of [0, 100, 200, 300]) {
      c.path(`M270 ${y + 90} Q262 ${y + 40} 306 ${y + 28} Q354 ${y + 24} 366 ${y + 62} Q372 ${y + 84} 356 ${y + 92} L356 ${y + 100} L270 ${y + 100} Z`, SKIN);
    }
    // brains, growing
    c.circle(314, 52, 9, PINK); c.circle(328, 58, 7, PINK);
    c.circle(308, 148, 13, PINK); c.circle(328, 150, 12, PINK); c.circle(318, 136, 10, PINK);
    c.circle(318, 248, 36, '#FFC83D', 0.3);
    c.circle(304, 250, 14, '#FFC83D'); c.circle(326, 252, 14, '#FFC83D'); c.circle(315, 236, 12, '#FFC83D');
    for (const d of ['M318 330 L318 306', 'M342 336 L358 318', 'M294 336 L278 318', 'M364 358 L388 354', 'M272 358 L248 354']) c.stroke(d, '#FFC83D', 4);
    c.circle(318, 352, 48, '#FFC83D', 0.2);
    c.circle(318, 352, 32, '#FFC83D', 0.4);
    c.circle(304, 352, 15, PAPER); c.circle(330, 354, 15, PAPER); c.circle(317, 338, 13, PAPER);
    const colors = [INK, INK, PAPER, '#FFC83D'];
    [0, 100, 200, 300].forEach((y, i) => c.text(t[i], { x: 16, y: y + 4, w: 212, h: 92 }, { max: 24, min: 10, color: colors[i] }));
  }
};

const changeMyMind = {
  id: 'change-my-mind',
  name: 'Change My Mind',
  color: SKY,
  size: 400,
  slots: [{ id: 'claim', label: 'Your hot take', default: 'Plain JavaScript is enough' }],
  draw(c, t) {
    c.fillAll('#BFE3F0');
    c.circle(326, 72, 34, '#FFC83D');
    c.rect(0, 300, 400, 100, MINT);
    c.rect(0, 300, 400, 4, INK);
    c.path('M138 270 L146 168 Q200 148 254 168 L262 270 Z', CORAL);
    c.rect(190, 132, 20, 26, SKIN_DARK);
    c.circle(200, 112, 30, SKIN);
    c.path('M170 106 Q170 76 200 76 Q230 76 230 106 Q214 92 200 92 Q186 92 170 106 Z', '#3A2418');
    c.stroke('M150 190 L 136 262', CORAL, 20);
    c.stroke('M250 190 L 264 262', CORAL, 20);
    c.rect(60, 262, 280, 16, '#8A5A36');
    c.rect(76, 278, 14, 82, '#5E3B22');
    c.rect(310, 278, 14, 82, '#5E3B22');
    c.outlined(279, 237, 22, 25, PAPER, INK, 3, 0);
    c.stroke('M302 242 Q314 244 302 256', INK, 3);
    c.outlined(94, 284, 212, 86, PAPER, INK, 4, 6);
    c.text(t[0], { x: 104, y: 290, w: 192, h: 52 }, { max: 24, min: 10, align: 'center' });
    c.label('CHANGE MY MIND', 200, 354, 11, CORAL, 2);
  }
};

export const TEMPLATES = [yesNo, distracted, twoButtons, bigBrain, changeMyMind];
