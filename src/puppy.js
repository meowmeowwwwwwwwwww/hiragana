/* Щенок Кинако: свой персонаж в каваи-стиле. Возвращает разметку SVG строкой. */
const Puppy = (() => {
  const O = "#3F2C2C";                 // контур
  const FUR = "#F7DFC0", EAR = "#DDA878", MUZ = "#FFF3E3", BLUSH = "#FFA3BA", TONGUE = "#FF8AA6", MOUTH = "#B8465E";
  const line = (d, w = 3.6) => `<path d="${d}" fill="none" stroke="${O}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const shape = (d, fill, w = 4.2) => `<path d="${d}" fill="${fill}" stroke="${O}" stroke-width="${w}" stroke-linejoin="round"/>`;
  const dotEyes = () => [44, 76].map((x) => `<ellipse cx="${x}" cy="62" rx="4.6" ry="5.6" fill="${O}"/><circle cx="${x + 1.6}" cy="60" r="1.7" fill="#fff"/>`).join("");
  const starEye = (cx, cy) => {
    let d = "";
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 3 : 7.2; d += (i ? "L" : "M") + (cx + r * Math.cos(a)).toFixed(1) + " " + (cy + r * Math.sin(a)).toFixed(1); }
    return `<path d="${d}Z" fill="#FFD84D" stroke="${O}" stroke-width="2.4" stroke-linejoin="round"/>`;
  };
  const ACC = {
    kubiwa: () => `<path d="M34 92 Q60 104 86 92 L86 99 Q60 111 34 99 Z" fill="#FF7FA8" stroke="${O}" stroke-width="3.4" stroke-linejoin="round"/><path d="M60 101 l4 4 -4 5 -4 -5z" fill="#FFD84D" stroke="${O}" stroke-width="2.4" stroke-linejoin="round"/>`,
    erimaki: () => `<path d="M30 90 Q60 106 90 90 Q92 98 88 102 Q60 114 32 102 Q28 98 30 90 Z" fill="#AED8FF" stroke="${O}" stroke-width="3.4" stroke-linejoin="round"/><path d="M76 100 L84 116 L92 110 L84 98 Z" fill="#AED8FF" stroke="${O}" stroke-width="3.2" stroke-linejoin="round"/><path d="M40 97 L44 101 M52 101 L55 105 M66 101 L68 105" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`,
    boushi: () => `<ellipse cx="60" cy="27" rx="25" ry="9" fill="#FFB0CD" stroke="${O}" stroke-width="3.6"/><path d="M42 26 Q44 8 60 8 Q76 8 78 26 Z" fill="#FFB0CD" stroke="${O}" stroke-width="3.6" stroke-linejoin="round"/><circle cx="60" cy="6" r="4.5" fill="#fff" stroke="${O}" stroke-width="3"/><path d="M44 22 Q60 27 76 22" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
    hana: () => { let s = ""; for (let i = 0; i < 5; i++) s += `<ellipse cx="94" cy="${31 - 5.5}" rx="4.2" ry="6" fill="#FF9EC4" stroke="${O}" stroke-width="2.2" transform="rotate(${i * 72} 94 31)"/>`; return s + `<circle cx="94" cy="31" r="3.4" fill="#FFD84D" stroke="${O}" stroke-width="2.2"/>`; },
    hoshi: () => { let d = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? 4.2 : 9.5; d += (i ? "L" : "M") + (27 + r * Math.cos(a)).toFixed(1) + " " + (33 + r * Math.sin(a)).toFixed(1); } return `<path d="${d}Z" fill="#FFE27A" stroke="${O}" stroke-width="2.6" stroke-linejoin="round"/>`; },
    megane: () => `<circle cx="44" cy="62" r="11" fill="rgba(255,255,255,.35)" stroke="${O}" stroke-width="3"/><circle cx="76" cy="62" r="11" fill="rgba(255,255,255,.35)" stroke="${O}" stroke-width="3"/><path d="M55 61 Q60 57 65 61" fill="none" stroke="${O}" stroke-width="3" stroke-linecap="round"/>`
  };
  // mood: normal | happy | great | sad | sleepy | eat | hungry
  function svg(mood = "normal", opts = {}) {
    const acc = opts.acc || [];
    const cls = opts.cls || "";
    let s = `<svg viewBox="0 0 120 120" class="mascot ${cls}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">`;
    // лапки
    s += shape("M31 104 C31 94 49 94 49 104 C49 110 31 110 31 104 Z", FUR, 4) + shape("M71 104 C71 94 89 94 89 104 C89 110 71 110 71 104 Z", FUR, 4);
    s += line("M37 102 L37 106 M43 102 L43 106", 2.4) + line("M77 102 L77 106 M83 102 L83 106", 2.4);
    // голова
    s += shape("M60 28 C88 28 103 44 103 65 C103 87 85 99 60 99 C35 99 17 87 17 65 C17 44 32 28 60 28 Z", FUR);
    if (acc.includes("kubiwa")) s += ACC.kubiwa();
    if (acc.includes("erimaki")) s += ACC.erimaki();
    s += `<ellipse cx="60" cy="78" rx="16" ry="11" fill="${MUZ}"/>`;
    // уши
    s += shape("M33 34 C16 31 6 48 9 66 C11 76 21 79 27 72 C32 62 35 49 39 38 C38 36 36 34 33 34 Z", EAR);
    s += shape("M87 34 C104 31 114 48 111 66 C109 76 99 79 93 72 C88 62 85 49 81 38 C82 36 84 34 87 34 Z", EAR);
    s += line("M55 29 C53 22 58 18 63 21", 3.2);
    // щёчки
    s += `<ellipse cx="33" cy="76" rx="7.5" ry="4.6" fill="${BLUSH}" opacity=".85"/><ellipse cx="87" cy="76" rx="7.5" ry="4.6" fill="${BLUSH}" opacity=".85"/>`;
    const nose = `<path d="M55 70 Q60 67 65 70 Q63.5 75 60 75 Q56.5 75 55 70 Z" fill="${O}"/>`;
    if (mood === "happy" || mood === "eat") {
      s += line("M38 64 Q44 56 50 64") + line("M70 64 Q76 56 82 64") + nose;
      s += mood === "eat" ? line("M53 80 Q56.5 84 60 80 Q63.5 84 67 80", 3) + `<ellipse cx="30" cy="80" rx="3" ry="3" fill="#fff" opacity=".7"/>`
        : shape("M52 78 Q60 92 68 78 Z", MOUTH, 3) + `<path d="M55.5 83 Q60 91 64.5 83 Q60 86 55.5 83 Z" fill="${TONGUE}"/>`;
    } else if (mood === "great") {
      s += starEye(44, 62) + starEye(76, 62) + nose + shape("M51 78 Q60 94 69 78 Z", MOUTH, 3) + `<path d="M55 84 Q60 92 65 84 Q60 87 55 84 Z" fill="${TONGUE}"/>`;
      s += `<path d="M20 22 L14 14 M30 16 L28 6 M100 22 L106 14 M90 16 L92 6" stroke="#FF7FA8" stroke-width="3.6" stroke-linecap="round"/>`;
    } else if (mood === "sad") {
      s += `<ellipse cx="44" cy="64" rx="4.2" ry="5" fill="${O}"/><ellipse cx="76" cy="64" rx="4.2" ry="5" fill="${O}"/><circle cx="45.5" cy="62.5" r="1.5" fill="#fff"/><circle cx="77.5" cy="62.5" r="1.5" fill="#fff"/>`;
      s += line("M37 55 L49 52", 3) + line("M83 55 L71 52", 3) + nose + line("M54 82 Q60 78 66 82", 3.2);
      s += `<path d="M84 68 Q89 76 84 79 Q79 76 84 68 Z" fill="#9FD3FF" stroke="${O}" stroke-width="1.6"/>`;
    } else if (mood === "sleepy") {
      s += line("M38 63 Q44 68 50 63") + line("M70 63 Q76 68 82 63") + nose + line("M55 80 Q60 83 65 80", 3);
      s += `<text x="92" y="30" font-family="system-ui,sans-serif" font-weight="800" font-size="14" fill="#9A7BFF">z</text><text x="101" y="18" font-family="system-ui,sans-serif" font-weight="800" font-size="11" fill="#9A7BFF">z</text>`;
    } else if (mood === "hungry") {
      s += dotEyes() + nose + `<ellipse cx="60" cy="82" rx="4" ry="4.6" fill="${MOUTH}" stroke="${O}" stroke-width="2.6"/>`;
      s += `<path d="M69 84 Q72 91 69 94 Q66 91 69 84 Z" fill="#BFE6FF" stroke="${O}" stroke-width="1.6"/>`;
    } else {
      s += dotEyes() + nose + line("M52 78 Q56 83 60 78 Q64 83 68 78", 3.2) + `<path d="M57 81.5 Q60 88 63 81.5 Q60 83 57 81.5 Z" fill="${TONGUE}" stroke="${O}" stroke-width="1.8"/>`;
    }
    if (acc.includes("megane")) s += ACC.megane();
    if (acc.includes("boushi")) s += ACC.boushi();
    if (acc.includes("hana")) s += ACC.hana();
    if (acc.includes("hoshi")) s += ACC.hoshi();
    return s + "</svg>";
  }
  return { svg };
})();
if (typeof module !== "undefined") module.exports = Puppy;
