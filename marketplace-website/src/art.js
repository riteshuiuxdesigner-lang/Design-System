// Preview images for listings and portfolios: detailed mockups drawn on a canvas, with real copy set in Inter Display.
// They stand in for creator-uploaded shots, so they're images (JPEG data URIs) with their own palettes, like real uploads.
// art(kind, color, seed, { word, name }) → data URL. Kinds: ui, mobile, icons, 3d, type, poster, scene, brand.
import { ASSETS } from './data.js';

export const POP = ['yellow', 'lime', 'pink', 'orange', 'violet'];
export const popToken = c => 'pop-' + c;

const W = 1200, H = 900;
const F = (w, s) => `${w} ${s}px "Inter Display", Inter, system-ui, sans-serif`;
const PAL = {
  yellow: { bg: ['#fff1b8', '#ffd84a'], brand: '#ff6a2c', ink: '#1a1405', soft: '#fff7d6', alt: '#6c4dff' },
  lime:   { bg: ['#ecfcc2', '#c8f560'], brand: '#13795b', ink: '#0d2a1f', soft: '#f4fde0', alt: '#ff5fa2' },
  pink:   { bg: ['#ffe0ef', '#ff8fc8'], brand: '#e8338b', ink: '#3a0d24', soft: '#fff0f7', alt: '#3f75ff' },
  orange: { bg: ['#ffe6cc', '#ffb36b'], brand: '#f0541e', ink: '#2b1408', soft: '#fff3e6', alt: '#1f9d74' },
  violet: { bg: ['#ebe5ff', '#b9a3ff'], brand: '#5b3df5', ink: '#1b1240', soft: '#f4f1ff', alt: '#ff8a3d' },
  ink:    { bg: ['#2a2a30', '#0b0b0d'], brand: '#c8f560', ink: '#ffffff', soft: '#1c1c21', alt: '#ff8fc8' },
  grey:   { bg: ['#f7f7f5', '#e6e6e3'], brand: '#3263e4', ink: '#141414', soft: '#ffffff', alt: '#ff6a2c' },
  blue:   { bg: ['#a9c1ff', '#3f75ff'], brand: '#ffd84a', ink: '#0b1a40', soft: '#eef3ff', alt: '#ff8fc8' },
};

/* ---------- tiny drawing kit ---------- */
function rnd(seed) { let s = 0; for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
function box(c, x, y, w, h, r, fill, stroke) { rr(c, x, y, w, h, r); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2; c.stroke(); } }
function shadow(c, blur = 40, y = 20, color = 'rgba(20,20,40,.18)') { c.shadowColor = color; c.shadowBlur = blur; c.shadowOffsetY = y; c.shadowOffsetX = 0; }
function noShadow(c) { c.shadowColor = 'transparent'; c.shadowBlur = 0; c.shadowOffsetY = 0; }
function txt(c, s, x, y, { size = 16, weight = 500, color = '#111', align = 'left', ls = 0, base = 'alphabetic' } = {}) {
  c.font = F(weight, size); c.fillStyle = color; c.textAlign = align; c.textBaseline = base;
  if ('letterSpacing' in c) c.letterSpacing = ls + 'px';
  c.fillText(s, x, y);
  if ('letterSpacing' in c) c.letterSpacing = '0px';
}
function lin(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; }
function circle(c, x, y, r, fill) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = fill; c.fill(); }
function backdrop(c, p, angle = 1) { c.fillStyle = lin(c, 0, 0, W * angle, H, p.bg); c.fillRect(0, 0, W, H); }
function avatar(c, x, y, r, fill, initials, color = '#fff') { circle(c, x, y, r, fill); txt(c, initials, x, y + r * 0.36, { size: r * 0.9, weight: 700, color, align: 'center' }); }
const GLYPHS = {
  home: 'M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z', search: 'M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM20 20l-4-4',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z', star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0', user: 'M12 12a4 4 0 1 0 0-8a4 4 0 1 0 0 8zM4 21c1-4 4.5-6 8-6s7 2 8 6',
  sliders: 'M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4', chat: 'M4 5h16v11H9l-5 4z', calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  camera: 'M4 8h4l2-3h4l2 3h4v11H4zM12 17a3.5 3.5 0 1 0 0-7a3.5 3.5 0 1 0 0 7z', folder: 'M3 6h6l2 2h10v11H3z',
  cart: 'M3 4h2l2.5 11h11L21 7H6.5M9 20.5a.5.5 0 1 0 0-1M18 20.5a.5.5 0 1 0 0-1', lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6', play: 'M8 5l11 7-11 7z', download: 'M12 4v11M7 10l5 5 5-5M5 20h14', cloud: 'M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1 0 9z',
  chart: 'M4 20V10M10 20V4M16 20v-7M2 20h20', pin: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5a2.5 2.5 0 1 0 0 5z',
  gift: 'M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0', card: 'M3 6h18v12H3zM3 10h18M7 15h4',
  send: 'M21 3L3 10l7 3 3 7z', grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z', bolt: 'M13 3L5 13h6l-1 8 8-10h-6z', globe: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
};
function glyph(c, name, x, y, size, color, lw = 1.7) {
  c.save(); c.translate(x, y); c.scale(size / 24, size / 24); c.strokeStyle = color; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round';
  c.stroke(new Path2D(GLYPHS[name])); c.restore();
}
function line(c, pts, color, w = 3) { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.strokeStyle = color; c.lineWidth = w; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); }
function smooth(c, pts) { c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2; c.bezierCurveTo(mx, y0, mx, y1, x1, y1); } }

/* ---------- recipes ---------- */
function dashboard(c, p, r, name, dark) {
  backdrop(c, p);
  const bg = dark ? '#121217' : '#ffffff', panel = dark ? '#1b1b22' : '#f6f6f8', tx = dark ? '#f2f2f5' : '#121217', mu = dark ? '#8c8c99' : '#8a8a96', line_ = dark ? '#2a2a33' : '#ececf0';
  const X = 90, Y = 80, w = 1180, h = 900;
  shadow(c, 60, 30, 'rgba(10,10,40,.28)'); box(c, X, Y, w, h, 22, bg); noShadow(c);
  // sidebar
  box(c, X + 14, Y + 14, 196, h, 16, panel);
  box(c, X + 34, Y + 38, 30, 30, 9, p.brand); txt(c, name, X + 74, Y + 60, { size: 19, weight: 700, color: tx });
  ['Overview', 'Analytics', 'Customers', 'Billing', 'Messages', 'Settings'].forEach((l, i) => {
    const yy = Y + 112 + i * 46;
    if (i === 0) box(c, X + 26, yy - 26, 172, 40, 12, dark ? '#2a2a35' : '#ffffff');
    glyph(c, ['grid', 'chart', 'user', 'card', 'chat', 'sliders'][i], X + 40, yy - 17, 20, i === 0 ? p.brand : mu);
    txt(c, l, X + 72, yy, { size: 15, weight: i === 0 ? 600 : 500, color: i === 0 ? tx : mu });
  });
  box(c, X + 30, Y + 450, 164, 120, 14, p.brand); txt(c, 'Upgrade to Pro', X + 46, Y + 486, { size: 15, weight: 700, color: '#fff' }); txt(c, 'Unlock team seats', X + 46, Y + 510, { size: 12, weight: 500, color: 'rgba(255,255,255,.75)' });
  box(c, X + 46, Y + 526, 96, 30, 15, '#ffffff'); txt(c, 'Upgrade', X + 94, Y + 546, { size: 12, weight: 700, color: p.brand, align: 'center' });
  // top bar
  const cx = X + 236;
  txt(c, 'Good morning, Ada', cx, Y + 62, { size: 26, weight: 700, color: tx, ls: -0.6 });
  txt(c, 'Here’s what happened with your store this week.', cx, Y + 88, { size: 14, weight: 500, color: mu });
  box(c, cx + 520, Y + 38, 240, 42, 21, panel); glyph(c, 'search', cx + 536, Y + 49, 20, mu); txt(c, 'Search', cx + 566, Y + 65, { size: 14, color: mu });
  avatar(c, cx + 800, Y + 59, 20, p.alt, 'AK');
  // KPI cards
  const kpis = [['Revenue', '$84,210', '+12.4%'], ['Orders', '3,482', '+8.1%'], ['Avg. order', '$24.18', '+2.3%']];
  kpis.forEach(([l, v, d], i) => {
    const kx = cx + i * 222, ky = Y + 118;
    box(c, kx, ky, 206, 118, 16, bg, line_);
    txt(c, l, kx + 18, ky + 32, { size: 13, weight: 600, color: mu }); txt(c, v, kx + 18, ky + 72, { size: 28, weight: 700, color: tx, ls: -0.8 });
    box(c, kx + 18, ky + 86, 62, 22, 11, dark ? '#16352a' : '#e6f7ef'); txt(c, d, kx + 49, ky + 102, { size: 11, weight: 700, color: '#1f9d6b', align: 'center' });
    c.beginPath(); smooth(c, [[kx + 110, ky + 98], [kx + 128, ky + 88], [kx + 146, ky + 94], [kx + 164, ky + 76], [kx + 188, ky + 70]]); c.strokeStyle = i === 0 ? p.brand : (dark ? '#5d5d6b' : '#c9c9d3'); c.lineWidth = 3; c.stroke();
  });
  // chart card
  const chx = cx, chy = Y + 254, chw = 650, chh = 300;
  box(c, chx, chy, chw, chh, 18, bg, line_);
  txt(c, 'Revenue', chx + 22, chy + 38, { size: 17, weight: 700, color: tx }); txt(c, 'Last 12 months', chx + 22, chy + 60, { size: 13, color: mu });
  box(c, chx + chw - 170, chy + 20, 150, 34, 17, panel); txt(c, 'Monthly  ▾', chx + chw - 95, chy + 42, { size: 13, weight: 600, color: tx, align: 'center' });
  const pts = []; for (let i = 0; i < 12; i++) pts.push([chx + 40 + i * ((chw - 70) / 11), chy + 250 - (40 + r() * 70 + i * 9)]);
  for (let g = 0; g < 4; g++) line(c, [[chx + 30, chy + 110 + g * 45], [chx + chw - 22, chy + 110 + g * 45]], line_, 1.5);
  c.beginPath(); smooth(c, pts); c.lineTo(pts[11][0], chy + 255); c.lineTo(pts[0][0], chy + 255); c.closePath(); c.fillStyle = lin(c, 0, chy + 80, 0, chy + 255, [p.brand + '55', p.brand + '00']); c.fill();
  c.beginPath(); smooth(c, pts); c.strokeStyle = p.brand; c.lineWidth = 4; c.stroke();
  const hp = pts[8]; circle(c, hp[0], hp[1], 9, '#fff'); circle(c, hp[0], hp[1], 6, p.brand);
  box(c, hp[0] - 48, hp[1] - 58, 96, 40, 10, tx); txt(c, '$9,420', hp[0], hp[1] - 32, { size: 15, weight: 700, color: bg, align: 'center' });
  ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].forEach((m, i) => txt(c, m, chx + 40 + i * 2 * ((chw - 70) / 11), chy + 285, { size: 12, color: mu, align: 'center' }));
  // donut
  const dx = chx + chw + 18, dw = 200;
  box(c, dx, chy, dw, chh, 18, bg, line_); txt(c, 'Traffic', dx + 20, chy + 38, { size: 17, weight: 700, color: tx });
  const seg = [[0.46, p.brand], [0.28, p.alt], [0.26, dark ? '#3a3a46' : '#dcdce4']]; let a0 = -Math.PI / 2;
  seg.forEach(([v, col]) => { c.beginPath(); c.arc(dx + dw / 2, chy + 140, 58, a0, a0 + v * Math.PI * 2 - 0.05); c.strokeStyle = col; c.lineWidth = 20; c.lineCap = 'round'; c.stroke(); a0 += v * Math.PI * 2; });
  txt(c, '46%', dx + dw / 2, chy + 148, { size: 22, weight: 700, color: tx, align: 'center' });
  [['Organic', p.brand], ['Social', p.alt], ['Direct', dark ? '#3a3a46' : '#dcdce4']].forEach(([l, col], i) => { circle(c, dx + 28, chy + 230 + i * 24, 6, col); txt(c, l, dx + 42, chy + 235 + i * 24, { size: 13, color: mu }); });
  // table
  const ty = chy + chh + 18; box(c, chx, ty, chw + 218, 200, 18, bg, line_);
  txt(c, 'Recent orders', chx + 22, ty + 36, { size: 17, weight: 700, color: tx });
  [['Mila Torres', 'Pro plan · annual', '$480.00', 'Paid'], ['Jonas Berg', 'Starter · monthly', '$24.00', 'Pending'], ['Aiko Sato', 'Team · 5 seats', '$1,200.00', 'Paid']].forEach((row, i) => {
    const ry = ty + 74 + i * 42; avatar(c, chx + 38, ry - 5, 15, [p.alt, p.brand, '#ffb36b'][i], row[0][0] + row[0].split(' ')[1][0]);
    txt(c, row[0], chx + 64, ry, { size: 14, weight: 600, color: tx }); txt(c, row[1], chx + 260, ry, { size: 14, color: mu });
    txt(c, row[2], chx + 560, ry, { size: 14, weight: 700, color: tx, align: 'right' });
    const ok = row[3] === 'Paid'; box(c, chx + 600, ry - 19, 76, 26, 13, ok ? (dark ? '#16352a' : '#e6f7ef') : (dark ? '#3a2e12' : '#fff4dc')); txt(c, row[3], chx + 638, ry - 1, { size: 12, weight: 700, color: ok ? '#1f9d6b' : '#c98a00', align: 'center' });
  });
}

function phoneFrame(c, x, y, w, h, tilt, draw) {
  c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(tilt); c.translate(-w / 2, -h / 2);
  shadow(c, 50, 30, 'rgba(10,10,30,.3)'); box(c, 0, 0, w, h, 46, '#111114'); noShadow(c);
  c.save(); rr(c, 10, 10, w - 20, h - 20, 37); c.clip(); draw(10, 10, w - 20, h - 20); c.restore();
  box(c, w / 2 - 44, 20, 88, 24, 12, '#111114');
  c.restore();
}
function statusBar(c, x, y, w, color) { txt(c, '9:41', x + 28, y + 34, { size: 14, weight: 700, color }); box(c, x + w - 56, y + 22, 26, 12, 4, color); }
function mobile(c, p, r, name) {
  backdrop(c, p, 0.6);
  const s1 = (x, y, w, h) => { // balance
    c.fillStyle = '#ffffff'; c.fillRect(x, y, w, h); statusBar(c, x, y, w, '#111');
    txt(c, 'Hi, Kemi', x + 22, y + 82, { size: 14, weight: 500, color: '#8a8a96' }); txt(c, 'Your money', x + 22, y + 108, { size: 22, weight: 700, color: '#111', ls: -0.4 });
    c.fillStyle = lin(c, x, y + 130, x + w, y + 290, [p.brand, p.alt]); rr(c, x + 18, y + 128, w - 36, 160, 22); c.fill();
    txt(c, 'Total balance', x + 38, y + 166, { size: 13, weight: 500, color: 'rgba(255,255,255,.8)' }); txt(c, '$12,480.50', x + 38, y + 206, { size: 30, weight: 700, color: '#fff', ls: -0.8 });
    txt(c, '•••• 4021', x + 38, y + 266, { size: 14, weight: 600, color: 'rgba(255,255,255,.85)', ls: 1 }); txt(c, 'VISA', x + w - 40, y + 266, { size: 16, weight: 800, color: '#fff', align: 'right' });
    ['Send', 'Request', 'Top up', 'More'].forEach((l, i) => { const bx = x + 26 + i * ((w - 52) / 4) + 22; circle(c, bx, y + 330, 24, '#f2f2f5'); glyph(c, ['send', 'download', 'bolt', 'grid'][i], bx - 10, y + 320, 20, '#111'); txt(c, l, bx, y + 372, { size: 11, weight: 600, color: '#555', align: 'center' }); });
    txt(c, 'Recent', x + 22, y + 416, { size: 16, weight: 700, color: '#111' });
    [['Spotify', '-$9.99', '#1db954'], ['Lisbon Café', '-$4.20', '#ff8a3d'], ['Salary', '+$3,200.00', '#3f75ff']].forEach(([m, v, col], i) => {
      const ry = y + 448 + i * 54; box(c, x + 22, ry - 18, 40, 40, 12, col + '22'); circle(c, x + 42, ry + 2, 7, col);
      txt(c, m, x + 74, ry + 2, { size: 14, weight: 600, color: '#111' }); txt(c, 'Today', x + 74, ry + 20, { size: 11, color: '#999' });
      txt(c, v, x + w - 22, ry + 8, { size: 14, weight: 700, color: v[0] === '+' ? '#1f9d6b' : '#111', align: 'right' });
    });
  };
  const s2 = (x, y, w, h) => { // savings pots
    c.fillStyle = p.soft; c.fillRect(x, y, w, h); statusBar(c, x, y, w, '#111');
    txt(c, 'Savings pots', x + 22, y + 100, { size: 22, weight: 700, color: '#111', ls: -0.4 });
    [['Trip to Lisbon', 0.68, '$1,360 of $2,000', p.brand], ['New laptop', 0.42, '$840 of $2,000', p.alt], ['Rainy day', 0.9, '$4,500 of $5,000', '#1f9d6b']].forEach(([l, v, sub, col], i) => {
      const ry = y + 130 + i * 136; shadow(c, 20, 8, 'rgba(0,0,0,.06)'); box(c, x + 18, ry, w - 36, 120, 20, '#fff'); noShadow(c);
      c.beginPath(); c.arc(x + 74, ry + 60, 32, 0, Math.PI * 2); c.strokeStyle = '#eee'; c.lineWidth = 9; c.stroke();
      c.beginPath(); c.arc(x + 74, ry + 60, 32, -Math.PI / 2, -Math.PI / 2 + v * Math.PI * 2); c.strokeStyle = col; c.lineCap = 'round'; c.stroke();
      txt(c, Math.round(v * 100) + '%', x + 74, ry + 66, { size: 14, weight: 700, color: '#111', align: 'center' });
      txt(c, l, x + 124, ry + 54, { size: 16, weight: 700, color: '#111' }); txt(c, sub, x + 124, ry + 78, { size: 12, color: '#888' });
    });
    box(c, x + 18, y + h - 96, w - 36, 54, 27, '#111'); txt(c, 'New pot', x + w / 2, y + h - 63, { size: 16, weight: 700, color: '#fff', align: 'center' });
  };
  const s3 = (x, y, w, h) => { // insights
    c.fillStyle = '#121217'; c.fillRect(x, y, w, h); statusBar(c, x, y, w, '#fff');
    txt(c, 'Spending', x + 22, y + 100, { size: 22, weight: 700, color: '#fff', ls: -0.4 }); txt(c, 'October', x + 22, y + 124, { size: 13, color: '#8c8c99' });
    txt(c, '$1,284', x + 22, y + 178, { size: 34, weight: 700, color: '#fff', ls: -1 }); txt(c, '−12% vs Sep', x + 22, y + 204, { size: 13, weight: 600, color: p.bg[1] });
    for (let i = 0; i < 7; i++) { const bh = 40 + r() * 140; box(c, x + 26 + i * ((w - 52) / 7), y + 420 - bh, (w - 52) / 7 - 12, bh, 8, i === 4 ? p.bg[1] : '#2a2a33'); txt(c, 'MTWTFSS'[i], x + 26 + i * ((w - 52) / 7) + ((w - 52) / 7 - 12) / 2, y + 446, { size: 11, weight: 600, color: '#8c8c99', align: 'center' }); }
    [['Food & drink', '$412'], ['Transport', '$186'], ['Shopping', '$302']].forEach(([l, v], i) => { const ry = y + 494 + i * 46; circle(c, x + 34, ry - 5, 8, [p.bg[1], p.alt, '#3f75ff'][i]); txt(c, l, x + 54, ry, { size: 14, weight: 500, color: '#ddd' }); txt(c, v, x + w - 22, ry, { size: 14, weight: 700, color: '#fff', align: 'right' }); });
  };
  phoneFrame(c, 90, 150, 330, 680, -0.08, s2);
  phoneFrame(c, 790, 150, 330, 680, 0.08, s3);
  phoneFrame(c, 435, 90, 330, 700, 0, s1);
}

function wireframes(c, p, r) {
  c.fillStyle = '#f4f4f2'; c.fillRect(0, 0, W, H);
  for (let x = 0; x < W; x += 30) for (let y = 0; y < H; y += 30) circle(c, x, y, 1.2, '#d9d9d5');
  const g = '#d7d7d3', g2 = '#bdbdb8', t = '#1a1a1a';
  [[80, 120, 300, 620, 'Onboarding'], [450, 90, 300, 640, 'Home feed'], [820, 140, 300, 620, 'Checkout']].forEach(([x, y, w, h, l], i) => {
    shadow(c, 30, 12, 'rgba(0,0,0,.08)'); box(c, x, y, w, h, 32, '#fff', '#1a1a1a'); noShadow(c);
    txt(c, l.toUpperCase(), x, y - 18, { size: 13, weight: 700, color: '#6b6b66', ls: 1.2 });
    box(c, x + 20, y + 40, w - 40, 160, 14, g); line(c, [[x + 20, y + 40], [x + w - 20, y + 200]], g2, 2); line(c, [[x + w - 20, y + 40], [x + 20, y + 200]], g2, 2);
    box(c, x + 20, y + 226, w * 0.62, 18, 9, g2); box(c, x + 20, y + 256, w * 0.8, 12, 6, g); box(c, x + 20, y + 276, w * 0.5, 12, 6, g);
    for (let k = 0; k < 3; k++) { circle(c, x + 42, y + 330 + k * 64, 20, g); box(c, x + 74, y + 318 + k * 64, w * 0.5, 12, 6, g2); box(c, x + 74, y + 338 + k * 64, w * 0.34, 10, 5, g); }
    box(c, x + 20, y + h - 82, w - 40, 50, 25, '#1a1a1a'); box(c, x + w / 2 - 50, y + h - 62, 100, 10, 5, '#666');
  });
  // sticky note
  c.save(); c.translate(640, 690); c.rotate(-0.06); shadow(c, 20, 8, 'rgba(0,0,0,.15)'); box(c, 0, 0, 230, 150, 6, '#ffe27a'); noShadow(c);
  txt(c, 'Merge steps 2 + 3?', 18, 40, { size: 17, weight: 700, color: t }); txt(c, 'Drop-off is 38% here.', 18, 70, { size: 15, weight: 500, color: '#5a4d10' }); txt(c, '— Leo', 18, 120, { size: 14, weight: 600, color: '#5a4d10' }); c.restore();
  line(c, [[380, 420], [420, 400], [450, 420]], '#ff5a36', 3);
}

function iconsShot(c, p, r, name, seed) {
  backdrop(c, p);
  const dark = p === PAL.ink, tx = p.ink;
  txt(c, 'ICON SET', 80, 130, { size: 15, weight: 700, color: tx, ls: 2 });
  txt(c, name, 76, 230, { size: 92, weight: 700, color: tx, ls: -4 });
  txt(c, 'Icons', 76, 320, { size: 92, weight: 700, color: tx, ls: -4 });
  txt(c, '24px grid · 1.5px stroke · Figma, SVG & React', 80, 380, { size: 20, weight: 500, color: dark ? '#b0b0bb' : 'rgba(0,0,0,.6)' });
  ['Outline', 'Duotone', 'Solid'].forEach((l, i) => { box(c, 80 + i * 132, 420, 120, 44, 22, i === 0 ? tx : 'transparent', tx); txt(c, l, 140 + i * 132, 448, { size: 16, weight: 600, color: i === 0 ? (dark ? '#000' : '#fff') : tx, align: 'center' }); });
  const names = Object.keys(GLYPHS); const order = names.slice().sort(() => r() - 0.5);
  const gx = 560, gy = 90, cell = 112;
  shadow(c, 50, 24, 'rgba(0,0,0,.14)'); box(c, gx - 30, gy - 30, cell * 5 + 40, cell * 6 + 40, 36, dark ? '#16161b' : '#ffffff'); noShadow(c);
  for (let i = 0; i < 30; i++) {
    const x = gx + (i % 5) * cell, y = gy + Math.floor(i / 5) * cell, hot = i === 12;
    box(c, x, y, cell - 12, cell - 12, 22, hot ? p.brand : (dark ? '#22222a' : '#f5f5f3'));
    glyph(c, order[i % order.length], x + (cell - 12) / 2 - 20, y + (cell - 12) / 2 - 20, 40, hot ? '#fff' : (dark ? '#fff' : '#141414'), 1.6);
  }
  txt(c, '2,400+', 80, 800, { size: 54, weight: 700, color: tx, ls: -2 }); txt(c, 'icons and growing', 80, 836, { size: 18, weight: 500, color: dark ? '#b0b0bb' : 'rgba(0,0,0,.6)' });
}

function render3d(c, p, r) {
  backdrop(c, p, 0.4);
  const glow = c.createRadialGradient(600, 380, 50, 600, 420, 620); glow.addColorStop(0, 'rgba(255,255,255,.55)'); glow.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = glow; c.fillRect(0, 0, W, H);
  const floor = c.createRadialGradient(600, 760, 20, 600, 760, 460); floor.addColorStop(0, 'rgba(0,0,0,.12)'); floor.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = floor; c.beginPath(); c.ellipse(600, 760, 470, 70, 0, 0, Math.PI * 2); c.fill();
  const sphere = (x, y, rad, base, dark) => {
    const g = c.createRadialGradient(x - rad * 0.35, y - rad * 0.4, rad * 0.05, x, y, rad * 1.05); g.addColorStop(0, '#ffffff'); g.addColorStop(0.18, base); g.addColorStop(0.75, base); g.addColorStop(1, dark);
    shadow(c, 40, 30, 'rgba(0,0,0,.2)'); circle(c, x, y, rad, g); noShadow(c);
    const hl = c.createRadialGradient(x - rad * 0.4, y - rad * 0.45, 0, x - rad * 0.4, y - rad * 0.45, rad * 0.35); hl.addColorStop(0, 'rgba(255,255,255,.9)'); hl.addColorStop(1, 'rgba(255,255,255,0)'); circle(c, x - rad * 0.4, y - rad * 0.45, rad * 0.35, hl);
  };
  const capsule = (x, y, len, rad, ang, base, dark) => {
    c.save(); c.translate(x, y); c.rotate(ang);
    const g = lin(c, 0, -rad, 0, rad, ['#ffffff', base, base, dark]); shadow(c, 40, 30, 'rgba(0,0,0,.2)'); rr(c, -len / 2, -rad, len, rad * 2, rad); c.fillStyle = g; c.fill(); noShadow(c);
    rr(c, -len / 2 + rad * 0.5, -rad * 0.72, len - rad, rad * 0.35, rad * 0.2); c.fillStyle = 'rgba(255,255,255,.55)'; c.fill(); c.restore();
  };
  const torus = (x, y, R, w, base, dark) => {
    c.save(); c.translate(x, y); c.scale(1, 0.55);
    c.beginPath(); c.arc(0, 0, R, 0, Math.PI * 2); c.lineWidth = w; c.strokeStyle = lin(c, -R, -R, R, R, ['#ffffff', base, dark]); shadow(c, 30, 24, 'rgba(0,0,0,.2)'); c.stroke(); noShadow(c);
    c.beginPath(); c.arc(0, 0, R, Math.PI * 1.1, Math.PI * 1.6); c.lineWidth = w * 0.25; c.strokeStyle = 'rgba(255,255,255,.6)'; c.stroke(); c.restore();
  };
  const cube = (x, y, s, base, dark) => {
    c.save(); c.translate(x, y); shadow(c, 40, 30, 'rgba(0,0,0,.18)');
    c.beginPath(); c.moveTo(0, -s); c.lineTo(s * 0.9, -s * 0.5); c.lineTo(0, 0); c.lineTo(-s * 0.9, -s * 0.5); c.closePath(); c.fillStyle = lin(c, 0, -s, 0, 0, ['#ffffff', base]); c.fill(); noShadow(c);
    c.beginPath(); c.moveTo(-s * 0.9, -s * 0.5); c.lineTo(0, 0); c.lineTo(0, s); c.lineTo(-s * 0.9, s * 0.5); c.closePath(); c.fillStyle = base; c.fill();
    c.beginPath(); c.moveTo(s * 0.9, -s * 0.5); c.lineTo(0, 0); c.lineTo(0, s); c.lineTo(s * 0.9, s * 0.5); c.closePath(); c.fillStyle = dark; c.fill(); c.restore();
  };
  const v = Math.floor(r() * 3);
  if (v === 0) { torus(380, 560, 150, 70, '#ff8fc8', '#b0306f'); sphere(700, 430, 170, '#ffd84a', '#c58a00'); capsule(930, 600, 240, 52, -0.6, '#3f75ff', '#1a3d99'); sphere(930, 260, 60, '#c8f560', '#5f8f12'); }
  else if (v === 1) { cube(420, 520, 160, '#b9a3ff', '#5b3df5'); sphere(780, 520, 150, '#ff8fc8', '#b0306f'); capsule(640, 260, 220, 46, 0.4, '#ffd84a', '#c58a00'); sphere(980, 300, 50, '#3f75ff', '#1a3d99'); }
  else { sphere(500, 470, 190, '#3f75ff', '#1a3d99'); torus(820, 580, 120, 56, '#ffd84a', '#c58a00'); cube(860, 330, 90, '#ff8fc8', '#b0306f'); capsule(250, 640, 180, 40, 0.8, '#c8f560', '#5f8f12'); }
  txt(c, 'PASTEL 3D', 70, 100, { size: 16, weight: 800, color: 'rgba(0,0,0,.65)', ls: 2.4 });
  txt(c, '64 icons · Blender + PNG', 70, 126, { size: 15, weight: 500, color: 'rgba(0,0,0,.55)' });
}

function specimen(c, p, r, name, word) {
  backdrop(c, p, 0.2);
  const tx = p.ink, mu = p === PAL.ink ? '#9a9aa6' : 'rgba(0,0,0,.55)';
  txt(c, name + ' Display', 70, 100, { size: 18, weight: 700, color: tx }); txt(c, 'Variable · 9 weights · Latin Extended', 70, 126, { size: 15, weight: 500, color: mu });
  box(c, W - 250, 70, 180, 46, 23, tx); txt(c, 'Try it free', W - 160, 100, { size: 16, weight: 700, color: p === PAL.ink ? '#000' : '#fff', align: 'center' });
  for (let i = 0; i < 4; i++) line(c, [[70, 300 + i * 70], [W - 70, 300 + i * 70]], p === PAL.ink ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)', 2);
  const big = name; c.font = F(700, 300); const fit = Math.min(300, 300 * (W - 140) / (c.measureText(big).width - big.length * 16 + 1));
  txt(c, big, 60, 470, { size: Math.floor(fit), weight: 700, color: tx, ls: -fit * 0.053 });
  txt(c, 'Aa Bb Cc Dd Ee Ff Gg Hh 0123', 70, 590, { size: 40, weight: 500, color: tx, ls: -0.5 });
  [400, 500, 600, 700].forEach((wt, i) => txt(c, ['Regular', 'Medium', 'Semibold', 'Bold'][i], 70 + i * 190, 670, { size: 30, weight: wt, color: tx }));
  // axis slider
  box(c, 70, 740, 520, 110, 22, p === PAL.ink ? '#1d1d23' : 'rgba(255,255,255,.7)');
  txt(c, 'Wobble axis', 96, 780, { size: 15, weight: 700, color: tx }); txt(c, '64', 560, 780, { size: 15, weight: 700, color: tx, align: 'right' });
  box(c, 96, 808, 470, 8, 4, p === PAL.ink ? '#333' : 'rgba(0,0,0,.12)'); box(c, 96, 808, 300, 8, 4, p.brand); circle(c, 396, 812, 14, '#fff'); c.lineWidth = 4; c.strokeStyle = p.brand; c.stroke();
  txt(c, '“Design is how it works.”', W - 70, 820, { size: 34, weight: 600, color: tx, align: 'right', ls: -0.6 });
}

function posters(c, p, r, name) {
  c.fillStyle = lin(c, 0, 0, 0, H, ['#efede8', '#dedbd3']); c.fillRect(0, 0, W, H);
  const poster = (x, y, w, h, tilt, bg, fg, acc, n, title, sub) => {
    c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(tilt); c.translate(-w / 2, -h / 2);
    shadow(c, 40, 26, 'rgba(0,0,0,.25)'); box(c, 0, 0, w, h, 4, bg); noShadow(c);
    c.save(); rr(c, 0, 0, w, h, 4); c.clip();
    circle(c, w * 0.62, h * 0.36, w * 0.42, acc);
    c.beginPath(); c.moveTo(-20, h * 0.62); c.lineTo(w + 20, h * 0.18); c.lineWidth = 26; c.strokeStyle = fg; c.stroke();
    txt(c, n, 26, h * 0.6, { size: w * 0.5, weight: 700, color: fg, ls: -w * 0.03 });
    c.restore();
    for (let i = 0; i < 5; i++) line(c, [[26, h - 170 + i * 0], [w - 26, h - 170]], fg, 3);
    txt(c, title, 26, h - 120, { size: w * 0.075, weight: 700, color: fg, ls: -0.6 });
    txt(c, sub, 26, h - 86, { size: w * 0.042, weight: 600, color: fg });
    txt(c, '14—16 NOV', 26, h - 34, { size: w * 0.045, weight: 700, color: fg, ls: 1 }); txt(c, 'LISBON', w - 26, h - 34, { size: w * 0.045, weight: 700, color: fg, align: 'right', ls: 1 });
    c.restore();
  };
  const q = Math.floor(r() * 2);
  poster(150, 90, 420, 594, -0.04, q ? '#1f3dff' : '#f5f0e6', q ? '#f5f0e6' : '#111', q ? '#ff6a2c' : '#ffd84a', '26', 'Blue Hour Jazz', 'Five nights. One river.');
  poster(640, 130, 420, 594, 0.035, '#111', '#f5f0e6', q ? '#c8f560' : '#ff8fc8', '04', name + ' Sessions', 'Live at the Old Docks');
}

function illustration(c, p, r) {
  c.fillStyle = lin(c, 0, 0, 0, H, [p.soft, p.bg[0]]); c.fillRect(0, 0, W, H);
  const sun = c.createRadialGradient(880, 230, 10, 880, 230, 150); sun.addColorStop(0, '#fff6cf'); sun.addColorStop(0.6, '#ffd84a'); sun.addColorStop(1, '#ffd84a00'); circle(c, 880, 230, 150, sun); circle(c, 880, 230, 80, '#ffd84a');
  const hill = (y, col, amp) => { c.beginPath(); c.moveTo(0, H); c.lineTo(0, y); for (let x = 0; x <= W; x += 60) c.lineTo(x, y + Math.sin(x / 180 + amp) * 40); c.lineTo(W, H); c.closePath(); c.fillStyle = col; c.fill(); };
  hill(600, p.bg[1], 1); hill(680, p.alt, 2.4); hill(760, '#1f1f2b', 0.6);
  // character
  c.save(); c.translate(470, 470);
  c.beginPath(); c.moveTo(-90, 210); c.bezierCurveTo(-110, 40, -60, -110, 0, -110); c.bezierCurveTo(60, -110, 110, 40, 90, 210); c.closePath(); c.fillStyle = p.brand; c.fill();
  c.beginPath(); c.moveTo(-70, 10); c.bezierCurveTo(-130, -10, -150, -70, -140, -110); c.lineWidth = 22; c.strokeStyle = p.brand; c.lineCap = 'round'; c.stroke();
  circle(c, -142, -118, 18, p.brand);
  circle(c, -28, -40, 13, '#fff'); circle(c, 28, -40, 13, '#fff'); circle(c, -24, -38, 6, '#111'); circle(c, 32, -38, 6, '#111');
  c.beginPath(); c.arc(2, -6, 24, 0.15 * Math.PI, 0.85 * Math.PI); c.lineWidth = 6; c.strokeStyle = '#111'; c.stroke();
  circle(c, -50, -12, 10, 'rgba(255,255,255,.35)'); circle(c, 54, -12, 10, 'rgba(255,255,255,.35)');
  c.restore();
  // plants + sparkles
  const leaf = (x, y, s, rot, col) => { c.save(); c.translate(x, y); c.rotate(rot); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(s * 0.5, -s * 0.6, 0, -s); c.quadraticCurveTo(-s * 0.5, -s * 0.6, 0, 0); c.fillStyle = col; c.fill(); c.restore(); };
  [[200, 700, 120, -0.3], [240, 700, 150, 0.1], [280, 700, 100, 0.5], [960, 720, 130, -0.2], [1000, 720, 100, 0.4]].forEach(([x, y, s, rot]) => leaf(x, y, s, rot, '#1f9d74'));
  for (let i = 0; i < 9; i++) { const x = 80 + r() * 1040, y = 60 + r() * 300; c.save(); c.translate(x, y); c.rotate(r()); c.fillStyle = '#fff'; c.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, rad = k % 2 ? 4 : 12; c.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); } c.fill(); c.restore(); }
  box(c, 70, 70, 300, 56, 28, 'rgba(255,255,255,.85)'); txt(c, '40 scenes · SVG + Figma', 220, 106, { size: 18, weight: 700, color: '#111', align: 'center' });
}

function brandBoard(c, p, r, name) {
  c.fillStyle = '#f1f0ec'; c.fillRect(0, 0, W, H);
  const n = name.toLowerCase(), G = 24;
  // logo tile
  box(c, G * 2, G * 2, 560, 420, 28, p.brand === '#c8f560' ? '#0b0b0d' : p.brand);
  const lc = p.brand === '#ffd84a' || p.brand === '#c8f560' ? (p.brand === '#c8f560' ? '#c8f560' : '#111') : '#fff';
  circle(c, 200, 258, 54, lc); circle(c, 222, 236, 18, p.brand === '#c8f560' ? '#0b0b0d' : p.brand);
  txt(c, n, 276, 290, { size: 96, weight: 700, color: lc, ls: -5 });
  // palette
  const sw = [p.brand === '#c8f560' ? '#0b0b0d' : p.brand, p.bg[1], p.alt, '#f6f3ea'];
  sw.forEach((col, i) => { box(c, 632 + i * 128, G * 2, 116, 280, 22, col); txt(c, col.toUpperCase(), 646 + i * 128, 300, { size: 14, weight: 700, color: i === 0 || (i === 2 && col !== '#ffd84a') ? '#fff' : '#111' }); });
  // type tile
  box(c, 632, 352, 500, 116, 22, '#fff'); txt(c, 'Aa', 660, 440, { size: 72, weight: 700, color: '#111', ls: -3 }); txt(c, 'Inter Display', 790, 405, { size: 22, weight: 700, color: '#111' }); txt(c, 'Headlines · Bold / Body · Regular', 790, 435, { size: 15, color: '#777' });
  // business card
  c.save(); c.translate(320, 690); c.rotate(-0.07); shadow(c, 40, 22, 'rgba(0,0,0,.22)'); box(c, -230, -130, 460, 260, 18, '#fffdf7'); noShadow(c);
  circle(c, -170, -70, 26, p.brand === '#ffd84a' ? '#111' : (p.brand === '#c8f560' ? '#0b0b0d' : p.brand)); txt(c, n, -130, -58, { size: 34, weight: 700, color: '#111', ls: -1.5 });
  txt(c, 'Rosa Diaz', -200, 60, { size: 20, weight: 700, color: '#111' }); txt(c, 'Founder · hello@' + n + '.co', -200, 88, { size: 14, color: '#666' }); c.restore();
  // app icon + pattern
  shadow(c, 30, 16, 'rgba(0,0,0,.16)'); box(c, 680, 520, 190, 190, 46, p.brand === '#c8f560' ? '#0b0b0d' : p.brand); noShadow(c); circle(c, 775, 615, 44, lc);
  box(c, 900, 500, 232, 352, 22, p.alt); for (let y = 0; y < 6; y++) for (let x = 0; x < 4; x++) circle(c, 935 + x * 54, 540 + y * 54, 14, (x + y) % 2 ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.18)');
  txt(c, 'BRAND GUIDELINES · 30 PAGES', 690, 780, { size: 14, weight: 800, color: '#111', ls: 1.6 });
}

function landing(c, p, r, name) {
  backdrop(c, p, 0.3);
  const X = 90, Y = 70, w = 1100, h = 900;
  shadow(c, 60, 30, 'rgba(10,10,40,.25)'); box(c, X, Y, w, h, 20, '#ffffff'); noShadow(c);
  box(c, X, Y, w, 46, 20, '#f2f2f4'); [['#ff5f57'], ['#febc2e'], ['#28c840']].forEach(([col], i) => circle(c, X + 26 + i * 22, Y + 23, 7, col));
  box(c, X + 380, Y + 11, 340, 24, 12, '#ffffff'); txt(c, name.toLowerCase() + '.app', X + 550, Y + 28, { size: 13, color: '#888', align: 'center' });
  const nx = X + 50, ny = Y + 100;
  circle(c, nx + 14, ny, 14, p.brand); txt(c, name, nx + 38, ny + 7, { size: 20, weight: 700, color: '#111' });
  ['Product', 'Customers', 'Pricing', 'Docs'].forEach((l, i) => txt(c, l, nx + 330 + i * 110, ny + 6, { size: 15, weight: 500, color: '#555' }));
  box(c, X + w - 180, ny - 20, 130, 40, 20, '#111'); txt(c, 'Get started', X + w - 115, ny + 6, { size: 14, weight: 700, color: '#fff', align: 'center' });
  box(c, X + w / 2 - 150, ny + 70, 300, 34, 17, p.soft); txt(c, '✦  New: pipelines that fill themselves', X + w / 2, ny + 93, { size: 13, weight: 600, color: p.brand, align: 'center' });
  txt(c, 'Close deals without', X + w / 2, ny + 190, { size: 62, weight: 700, color: '#111', align: 'center', ls: -2.4 });
  txt(c, 'the busywork.', X + w / 2, ny + 262, { size: 62, weight: 700, color: p.brand, align: 'center', ls: -2.4 });
  txt(c, 'The CRM that updates itself from your inbox, calls and calendar.', X + w / 2, ny + 312, { size: 19, color: '#666', align: 'center' });
  box(c, X + w / 2 - 190, ny + 346, 180, 52, 26, p.brand); txt(c, 'Start free trial', X + w / 2 - 100, ny + 378, { size: 16, weight: 700, color: '#fff', align: 'center' });
  box(c, X + w / 2 + 10, ny + 346, 180, 52, 26, '#ffffff', '#e2e2e6'); txt(c, '▶  Watch demo', X + w / 2 + 100, ny + 378, { size: 16, weight: 700, color: '#111', align: 'center' });
  // product screenshot
  const sx = X + 110, sy = ny + 440; shadow(c, 40, 20, 'rgba(0,0,0,.12)'); box(c, sx, sy, w - 220, 400, 18, '#fbfbfc', '#ececf0'); noShadow(c);
  ['Lead', 'Qualified', 'Proposal', 'Won'].forEach((col, i) => {
    const cx = sx + 20 + i * ((w - 260) / 4); txt(c, col, cx, sy + 40, { size: 14, weight: 700, color: '#333' }); txt(c, String(3 + i), cx + 120, sy + 40, { size: 13, weight: 600, color: '#999' });
    for (let k = 0; k < 3 - (i === 3 ? 1 : 0); k++) { box(c, cx, sy + 58 + k * 92, (w - 260) / 4 - 16, 80, 12, '#fff', '#ececf0'); box(c, cx + 14, sy + 74 + k * 92, 110, 12, 6, '#d9d9e0'); txt(c, ['$4,200', '$12,000', '$880', '$2,400', '$6,100', '$950'][(i + k) % 6], cx + 14, sy + 116 + k * 92, { size: 15, weight: 700, color: '#111' }); circle(c, cx + (w - 260) / 4 - 40, sy + 110 + k * 92, 12, [p.brand, p.alt, '#ffb36b'][(i + k) % 3]); }
  });
}

/* ---------- entry ---------- */
const cache = new Map();
function nameFor(seed) { const s = String(seed); const a = ASSETS.find(x => s === x.id || s.startsWith(x.id + '-')); if (a) return a.title.split(' ')[0].replace(/,$/, ''); const pool = ['Orbit', 'Helm', 'Pocket', 'Kiosk', 'Mint', 'Nova', 'Fable', 'Tidy', 'Lumen', 'Parcel']; return pool[Math.floor(rnd(s)() * pool.length)]; }
export function art(kind, color = 'violet', seed = kind, opts = {}) {
  const key = kind + '|' + color + '|' + seed + '|' + (opts.word || '');
  if (cache.has(key)) return cache.get(key);
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const c = cv.getContext('2d'), p = PAL[color] || PAL.violet, r = rnd(key), name = opts.name || nameFor(seed);
  if (!c.roundRect) c.roundRect = function (x, y, w, h) { this.rect(x, y, w, h); };
  if (kind === 'ui') { if (/helm|crm|landing/i.test(seed + name) || (/-\d$/.test(String(seed)) && r() > 0.5)) landing(c, p, r, name); else dashboard(c, p, r, name, color === 'ink' || /-\d$/.test(String(seed)) && r() > 0.5); }
  else if (kind === 'mobile') { if (color === 'grey' || /wire/.test(seed)) wireframes(c, p, r); else mobile(c, p, r, name); }
  else if (kind === 'icons') iconsShot(c, p, r, name, seed);
  else if (kind === '3d') render3d(c, p, r);
  else if (kind === 'type') specimen(c, p, r, name, opts.word);
  else if (kind === 'poster') posters(c, p, r, name);
  else if (kind === 'scene') illustration(c, p, r);
  else if (kind === 'brand') brandBoard(c, p, r, name);
  else dashboard(c, p, r, name, false);
  const url = cv.toDataURL('image/jpeg', 0.88);
  cache.set(key, url);
  return url;
}
