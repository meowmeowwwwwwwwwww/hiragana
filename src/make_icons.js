/* Иконки приложения из рисунка щенка (puppy.js): node src/make_icons.js → src/icons/, потом python3 src/build.py. */
const P = require('./puppy.js');
// Нужен Node и playwright (или playwright-core); путь к Chromium можно задать в CHROMIUM_PATH.
let chromium; try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('playwright-core')); }
const OUT = process.argv[2] || require('path').join(__dirname, 'icons');
const heart = '<path d="M20 34C8 26 4 19 6 13c2-6 10-8 14-2 4-6 12-4 14 2 2 6-2 13-14 21z" fill="none" stroke="#fff" stroke-width="3.4" stroke-linejoin="round"/>';
let st = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 8.4 : 18; st += (i ? 'L' : 'M') + (20 + r * Math.cos(a)).toFixed(2) + ' ' + (21 + r * Math.sin(a)).toFixed(2); }
const star = `<path d="${st}Z" fill="#FFE27A" stroke="#FFE27A" stroke-width="2" stroke-linejoin="round"/>`;
// размеры в долях стороны: pup — ширина щенка; deco — сердечко/звезда
function page(maskable) {
  const pup = maskable ? 0.62 : 0.8, top = maskable ? 0.2 : 0.11;
  const deco = (svg, x, y, s, extra = '') => `<svg viewBox="0 0 40 40" style="position:absolute;left:${x * 100}%;top:${y * 100}%;width:${s * 100}%;height:${s * 100}%;overflow:visible;${extra}">${svg}</svg>`;
  return `<html><body style="margin:0"><div id="ic" style="position:relative;width:100vw;height:100vw;overflow:hidden;
    background: radial-gradient(circle at 21% 21%, rgb(255 255 255 / .75) 0, rgb(255 255 255 / 0) 34%), linear-gradient(135deg, #FFDFEB 0%, #FFC6DA 50%, #FFB1CC 100%);">
    ${deco(heart, maskable ? 0.13 : 0.035, maskable ? 0.6 : 0.62, maskable ? 0.1 : 0.12)}
    ${deco(star, maskable ? 0.76 : 0.83, maskable ? 0.58 : 0.6, maskable ? 0.11 : 0.13, 'filter:drop-shadow(0 0 6px rgb(255 240 170 / .9))')}
    <div style="position:absolute;left:${(1 - pup) / 2 * 100}%;top:${top * 100}%;width:${pup * 100}%;height:${pup * 100}%">${P.svg('normal').replace('class="mascot', 'width="100%" height="100%" class="mascot')}</div>
  </div></body></html>`;
}
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  for (const [file, size, mask] of [['icon-512.png', 512, false], ['icon-192.png', 192, false], ['apple-touch-icon.png', 180, false], ['icon-maskable-512.png', 512, true]]) {
    const p = await b.newPage({ viewport: { width: size, height: size } });
    await p.setContent(page(mask));
    await (await p.$('#ic')).screenshot({ path: OUT + '/' + file });
    await p.close();
  }
  await b.close();
})();
