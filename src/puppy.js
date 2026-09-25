/* Щенок Моня: чихуахуа в стиле японских стикеров (толстый контур, плоская заливка, глазки-точки, язычок-«блеп»).
   Возвращает разметку SVG строкой. */
const Puppy = (() => {
  const O = "#2F2425";                 // контур
  const FUR = "#FCEEDC", EAR = "#F0CB9F", EAR_IN = "#FFC6C6", BLUSH = "#FFA3B8", TONGUE = "#FF8DA8", MOUTH = "#A83F55", NOSE = "#5A3434";
  const line = (d, w = 3.6) => `<path d="${d}" fill="none" stroke="${O}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const shape = (d, fill, w = 4.4) => `<path d="${d}" fill="${fill}" stroke="${O}" stroke-width="${w}" stroke-linejoin="round"/>`;
  const star5 = (cx, cy, R, r, fill, w = 2.6) => {
    let d = "";
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, q = i % 2 ? r : R; d += (i ? "L" : "M") + (cx + q * Math.cos(a)).toFixed(1) + " " + (cy + q * Math.sin(a)).toFixed(1); }
    return `<path d="${d}Z" fill="${fill}" stroke="${O}" stroke-width="${w}" stroke-linejoin="round"/>`;
  };
  const EL = 44, ER = 76, EY = 72;
  const dot = (x, y = EY, k = 1) => `<ellipse cx="${x}" cy="${y}" rx="${5.4 * k}" ry="${6.3 * k}" fill="${O}"/><circle cx="${x + 1.7 * k}" cy="${y - 2.2 * k}" r="${1.8 * k}" fill="#fff"/>`;
  const dotEyes = (k) => dot(EL, EY, k) + dot(ER, EY, k);
  const wink = (x) => line(`M${x + 4} ${EY - 5} L${x - 4} ${EY} L${x + 4} ${EY + 5}`, 3.6);           // «<»
  const squeeze = () => line(`M${EL - 4} ${EY - 5} L${EL + 4} ${EY} L${EL - 4} ${EY + 5}`, 3.6) + line(`M${ER + 4} ${EY - 5} L${ER - 4} ${EY} L${ER + 4} ${EY + 5}`, 3.6); // «> <»
  const arcsUp = () => line(`M${EL - 6} ${EY + 2} Q${EL} ${EY - 6} ${EL + 6} ${EY + 2}`) + line(`M${ER - 6} ${EY + 2} Q${ER} ${EY - 6} ${ER + 6} ${EY + 2}`);
  const arcsDown = () => line(`M${EL - 6} ${EY - 1} Q${EL} ${EY + 5} ${EL + 6} ${EY - 1}`) + line(`M${ER - 6} ${EY - 1} Q${ER} ${EY + 5} ${ER + 6} ${EY - 1}`);
  const nose = `<path d="M56 76.4 Q60 74 64 76.4 Q63 80.4 60 80.4 Q57 80.4 56 76.4 Z" fill="${NOSE}" stroke="${O}" stroke-width="2.2" stroke-linejoin="round"/>`;
  const omega = line("M53.6 82.6 Q56.8 86.8 60 82.8 Q63.2 86.8 66.4 82.6", 3.2);
  // язычок-«блеп», как у настоящей Мони
  const blep = `<path d="M58.6 84.6 Q58.2 91.4 61.8 91.6 Q65.4 91.4 65 84.2 Z" fill="${TONGUE}" stroke="${O}" stroke-width="2.4" stroke-linejoin="round"/>`;
  const openMouth = (big) => shape(big ? "M52.6 82 Q60 80 67.4 82 Q66.4 95 60 95 Q53.6 95 52.6 82 Z" : "M54 82.4 Q60 80.8 66 82.4 Q65 92 60 92 Q55 92 54 82.4 Z", MOUTH, 3)
    + `<path d="${big ? "M55.4 89.6 Q60 85.8 64.6 89.6 Q63 93.6 60 93.6 Q57 93.6 55.4 89.6 Z" : "M56.4 88 Q60 85 63.6 88 Q62.4 90.8 60 90.8 Q57.6 90.8 56.4 88 Z"}" fill="${TONGUE}"/>`;
  const blush = [31, 89].map((x) => `<ellipse cx="${x}" cy="82" rx="7.4" ry="4.6" fill="${BLUSH}" opacity=".85"/><circle cx="${x - 2.6}" cy="81" r="1" fill="#fff" opacity=".85"/><circle cx="${x + 1.4}" cy="83.2" r=".9" fill="#fff" opacity=".85"/><circle cx="${x + 3.2}" cy="80.4" r=".8" fill="#fff" opacity=".85"/>`).join("");
  // розовые штрихи радости: сверху между ушами, а для «ура» ещё и по бокам
  const burst = (sides) => `<path d="M49.6 24 L46 14.6 M60 21.6 L60 10.6 M70.4 24 L74 14.6" stroke="#FF7FA8" stroke-width="4" stroke-linecap="round"/>`
    + (sides ? `<path d="M8.6 70 L1.6 66 M9 79 L2 80.6 M111.4 70 L118.4 66 M111 79 L118 80.6" stroke="#FF7FA8" stroke-width="4" stroke-linecap="round"/>` : "");
  const ACC = {
    kubiwa: () => `<path d="M32 91 Q60 104 88 91 L88 98.4 Q60 111.4 32 98.4 Z" fill="#FF7FA8" stroke="${O}" stroke-width="3.4" stroke-linejoin="round"/><path d="M60 100 l4.4 4.4 -4.4 5.4 -4.4 -5.4z" fill="#FFD84D" stroke="${O}" stroke-width="2.4" stroke-linejoin="round"/>`,
    erimaki: () => `<path d="M28 89 Q60 106 92 89 Q94 97 90 101 Q60 114 30 101 Q26 97 28 89 Z" fill="#AED8FF" stroke="${O}" stroke-width="3.4" stroke-linejoin="round"/><path d="M40 96 L44 100 M52 100 L55 104 M66 100 L68 104" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`,
    boushi: () => `<ellipse cx="60" cy="37" rx="24" ry="8.4" fill="#FFB0CD" stroke="${O}" stroke-width="3.6"/><path d="M43 36 Q45 18 60 18 Q75 18 77 36 Z" fill="#FFB0CD" stroke="${O}" stroke-width="3.6" stroke-linejoin="round"/><circle cx="60" cy="15.6" r="4.6" fill="#fff" stroke="${O}" stroke-width="3"/><path d="M45 32 Q60 37 75 32" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
    hana: () => { let s = ""; for (let i = 0; i < 5; i++) s += `<ellipse cx="96" cy="${36 - 5.5}" rx="4.2" ry="6" fill="#FF9EC4" stroke="${O}" stroke-width="2.2" transform="rotate(${i * 72} 96 36)"/>`; return s + `<circle cx="96" cy="36" r="3.4" fill="#FFD84D" stroke="${O}" stroke-width="2.2"/>`; },
    hoshi: () => star5(24, 38, 9.5, 4.2, "#FFE27A"),
    megane: () => `<circle cx="${EL}" cy="${EY}" r="10.4" fill="rgba(255,255,255,.3)" stroke="${O}" stroke-width="3.2"/><circle cx="${ER}" cy="${EY}" r="10.4" fill="rgba(255,255,255,.3)" stroke="${O}" stroke-width="3.2"/><path d="M54.4 71 Q60 67 65.6 71" fill="none" stroke="${O}" stroke-width="3.2" stroke-linecap="round"/>`
  };
  // mood: normal | happy | great | sad | sleepy | eat | hungry
  function svg(mood = "normal", opts = {}) {
    const acc = opts.acc || [];
    const cls = opts.cls || "";
    let s = `<svg viewBox="0 0 120 120" class="mascot ${cls}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">`;
    // уши чихуахуа: большие, стоячие, с закруглёнными кончиками (рисуем до головы)
    s += shape("M19 62 C12 46 10 30 13 18.6 C14.6 12.8 20 11.6 24.6 14.6 C35 21.4 43.4 30.6 49 42 Z", EAR);
    s += `<path d="M24 53 C19.6 42.6 18.6 32.6 20.4 23.4 C28.4 28.4 35 35 39.4 42.4 Z" fill="${EAR_IN}"/>`;
    s += shape("M101 62 C108 46 110 30 107 18.6 C105.4 12.8 100 11.6 95.4 14.6 C85 21.4 76.6 30.6 71 42 Z", EAR);
    s += `<path d="M96 53 C100.4 42.6 101.4 32.6 99.6 23.4 C91.6 28.4 85 35 80.6 42.4 Z" fill="${EAR_IN}"/>`;
    // голова-моти: широкая и приземистая
    s += shape("M60 36 C88 36 106 52 106 72 C106 90 88 101 60 101 C32 101 14 90 14 72 C14 52 32 36 60 36 Z", FUR);
    s += line("M55.6 37.6 C53.6 31 58 27.4 62.6 29.6", 3.2);
    if (acc.includes("kubiwa")) s += ACC.kubiwa();
    if (acc.includes("erimaki")) s += ACC.erimaki();
    s += blush;
    if (mood === "happy") {
      s += dot(EL) + wink(ER) + nose + openMouth(false) + burst(false);
    } else if (mood === "eat") {
      s += arcsUp() + nose + line("M53.6 84 Q56.8 88 60 84 Q63.2 88 66.4 84", 3.2) + `<circle cx="71" cy="90" r="1.8" fill="#E2B282"/><circle cx="49" cy="92" r="1.4" fill="#E2B282"/>`;
    } else if (mood === "great") {
      s += squeeze() + nose + openMouth(true) + burst(true);
    } else if (mood === "sad") {
      s += dotEyes(0.9) + line(`M${EL - 7} ${EY - 10} L${EL + 5} ${EY - 13}`, 3.2) + line(`M${ER + 7} ${EY - 10} L${ER - 5} ${EY - 13}`, 3.2) + nose;
      s += line("M54 87 Q57 84 60 86.6 Q63 89.2 66 86", 3.2);
      s += `<path d="M86 74 Q91 82 86 85 Q81 82 86 74 Z" fill="#AEDCFF" stroke="${O}" stroke-width="2"/>`;
    } else if (mood === "sleepy") {
      s += arcsDown() + nose + omega + blep;
      s += `<text x="66" y="30" font-family="system-ui,sans-serif" font-weight="800" font-size="14" fill="#9A7BFF">z</text><text x="75" y="19" font-family="system-ui,sans-serif" font-weight="800" font-size="11" fill="#9A7BFF">z</text>`;
    } else if (mood === "hungry") {
      s += dotEyes() + nose + `<ellipse cx="60" cy="87" rx="4" ry="4.6" fill="${MOUTH}" stroke="${O}" stroke-width="2.8"/>`;
      s += `<path d="M69 88 Q72 95 69 98 Q66 95 69 88 Z" fill="#BFE6FF" stroke="${O}" stroke-width="1.8"/>`;
    } else {
      s += dotEyes() + nose + omega + blep;
    }
    // лапки спереди, как будто Моня выглядывает из-за края
    s += shape("M26 101 C26 91 46 91 46 101 C46 108 26 108 26 101 Z", FUR, 4) + shape("M74 101 C74 91 94 91 94 101 C94 108 74 108 74 101 Z", FUR, 4);
    s += line("M33 98.6 L33 103 M39 98.6 L39 103", 2.6) + line("M81 98.6 L81 103 M87 98.6 L87 103", 2.6);
    if (acc.includes("megane")) s += ACC.megane();
    if (acc.includes("boushi")) s += ACC.boushi();
    if (acc.includes("hana")) s += ACC.hana();
    if (acc.includes("hoshi")) s += ACC.hoshi();
    return s + "</svg>";
  }
  return { svg };
})();
if (typeof module !== "undefined") module.exports = Puppy;
