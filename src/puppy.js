/* Щенок Моня: чихуахуа в стиле японских стикеров (толстый контур, плоская заливка, глазки-точки, язычок-«блеп»).
   Возвращает разметку SVG строкой. */
const Puppy = (() => {
  const O = "#2F2425";                 // контур
  // окрасы: обычный и три из капсульного автомата
  const FURS = {
    base: { fur: "#FCEEDC", ear: "#F0CB9F", earIn: "#FFC6C6" },
    kinako: { fur: "#F3D2A2", ear: "#DCA266", earIn: "#FFC2B8" },
    sakurairo: { fur: "#FFE3EC", ear: "#FFB5CB", earIn: "#FF8FB2" },
    matcha: { fur: "#E4F2D0", ear: "#B3D796", earIn: "#FFC8D6" }
  };
  let FUR = FURS.base.fur, EAR = FURS.base.ear, EAR_IN = FURS.base.earIn;
  const BLUSH = "#FFA3B8", TONGUE = "#FF8DA8", MOUTH = "#A83F55", NOSE = "#5A3434";
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
  const blush = [31, 89].map((x) => `<ellipse cx="${x}" cy="82" rx="7.4" ry="4.6" fill="${BLUSH}" opacity=".85"/>`).join("");
  // розовые штрихи радости: сверху между ушами, а для «ура» ещё и по бокам
  const burst = (sides) => `<path d="M49.6 24 L46 14.6 M60 21.6 L60 10.6 M70.4 24 L74 14.6" stroke="#FF7FA8" stroke-width="4" stroke-linecap="round"/>`
    + (sides ? `<path d="M8.6 70 L1.6 66 M9 79 L2 80.6 M111.4 70 L118.4 66 M111 79 L118 80.6" stroke="#FF7FA8" stroke-width="4" stroke-linecap="round"/>` : "");
  const ACC = {
    kubiwa: () => `<path d="M32 91 Q60 104 88 91 L88 98.4 Q60 111.4 32 98.4 Z" fill="#FF7FA8" stroke="${O}" stroke-width="3.4" stroke-linejoin="round"/><path d="M60 100 l4.4 4.4 -4.4 5.4 -4.4 -5.4z" fill="#FFD84D" stroke="${O}" stroke-width="2.4" stroke-linejoin="round"/>`,
    erimaki: () => `<path d="M28 89 Q60 106 92 89 Q94 97 90 101 Q60 114 30 101 Q26 97 28 89 Z" fill="#AED8FF" stroke="${O}" stroke-width="3.4" stroke-linejoin="round"/><path d="M40 96 L44 100 M52 100 L55 104 M66 100 L68 104" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`,
    boushi: () => `<ellipse cx="60" cy="37" rx="24" ry="8.4" fill="#FFB0CD" stroke="${O}" stroke-width="3.6"/><path d="M43 36 Q45 18 60 18 Q75 18 77 36 Z" fill="#FFB0CD" stroke="${O}" stroke-width="3.6" stroke-linejoin="round"/><circle cx="60" cy="15.6" r="4.6" fill="#fff" stroke="${O}" stroke-width="3"/><path d="M45 32 Q60 37 75 32" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
    hana: () => { let s = ""; for (let i = 0; i < 5; i++) s += `<ellipse cx="96" cy="${36 - 5.5}" rx="4.2" ry="6" fill="#FF9EC4" stroke="${O}" stroke-width="2.2" transform="rotate(${i * 72} 96 36)"/>`; return s + `<circle cx="96" cy="36" r="3.4" fill="#FFD84D" stroke="${O}" stroke-width="2.2"/>`; },
    hoshi: () => star5(24, 38, 9.5, 4.2, "#FFE27A"),
    megane: () => `<circle cx="${EL}" cy="${EY}" r="10.4" fill="rgba(255,255,255,.3)" stroke="${O}" stroke-width="3.2"/><circle cx="${ER}" cy="${EY}" r="10.4" fill="rgba(255,255,255,.3)" stroke="${O}" stroke-width="3.2"/><path d="M54.4 71 Q60 67 65.6 71" fill="none" stroke="${O}" stroke-width="3.2" stroke-linecap="round"/>`,
    // ---- вещи из капсульного автомата ----
    hachimaki: () => `<path d="M17 58 Q60 38 103 58 L102 66.5 Q60 46.5 18 66.5 Z" fill="#fff" stroke="${O}" stroke-width="3.2" stroke-linejoin="round"/><circle cx="60" cy="51.6" r="4.6" fill="#FF5C7C"/><path d="M101 60 L115 52 L113.4 61.6 Z M101 64 L114 72 L105 73.4 Z" fill="#fff" stroke="${O}" stroke-width="2.8" stroke-linejoin="round"/>`,
    nekomimi: () => `<path d="M33 45 Q60 29 87 45" fill="none" stroke="${O}" stroke-width="4.6" stroke-linecap="round"/><path d="M40 41 L43 21 L55.6 35.6 Z M80 41 L77 21 L64.4 35.6 Z" fill="#433A40" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><path d="M44.6 36.4 L45.6 27 L51.6 34.6 Z M75.4 36.4 L74.4 27 L68.4 34.6 Z" fill="#FFB0CD"/>`,
    oukan: () => `<g transform="rotate(-8 60 30)"><path d="M45 39 L43 19 L52.6 28.4 L60 14 L67.4 28.4 L77 19 L75 39 Z" fill="#FFD84D" stroke="${O}" stroke-width="3.2" stroke-linejoin="round"/><path d="M46 34 L74 34" stroke="#F0B429" stroke-width="2.6"/><circle cx="60" cy="27.6" r="3.2" fill="#FF7FA8" stroke="${O}" stroke-width="1.8"/><circle cx="50" cy="31" r="2" fill="#AED8FF"/><circle cx="70" cy="31" r="2" fill="#AED8FF"/><circle cx="60" cy="14" r="2.4" fill="#fff" stroke="${O}" stroke-width="1.8"/></g>`,
    hanakanmuri: () => {
      let s = `<path d="M22 55 Q60 25 98 55" fill="none" stroke="#7CC67E" stroke-width="3.6" stroke-linecap="round"/>`;
      const cols = ["#FFB0CD", "#fff", "#D8BDFF", "#FFE27A", "#FFB0CD", "#fff", "#D8BDFF"];
      for (let i = 0; i < 7; i++) {
        const t = i / 6, x = (1 - t) * (1 - t) * 22 + 2 * (1 - t) * t * 60 + t * t * 98, y = (1 - t) * (1 - t) * 55 + 2 * (1 - t) * t * 25 + t * t * 55;
        for (let j = 0; j < 5; j++) { const a = (j * 72 - 90) * Math.PI / 180; s += `<circle cx="${(x + 3.4 * Math.cos(a)).toFixed(1)}" cy="${(y + 3.4 * Math.sin(a)).toFixed(1)}" r="3" fill="${cols[i]}" stroke="${O}" stroke-width="1.4"/>`; }
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.8" fill="#FFC94D"/>`;
      }
      return s;
    },
    sakura: () => { let s = ""; for (let i = 0; i < 5; i++) s += `<path d="M96 36 C91.6 30.6 91.8 25.4 94.8 23.4 L96 25.6 L97.2 23.4 C100.2 25.4 100.4 30.6 96 36 Z" fill="#FFCCDD" stroke="${O}" stroke-width="1.8" stroke-linejoin="round" transform="rotate(${i * 72} 96 36)"/>`; return s + `<circle cx="96" cy="36" r="2.6" fill="#FF7FA8"/>`; },
    chouchou: () => `<g stroke="${O}" stroke-width="2" stroke-linejoin="round"><ellipse cx="17.6" cy="32.6" rx="7" ry="5.4" fill="#D8BDFF" transform="rotate(-32 17.6 32.6)"/><ellipse cx="30.4" cy="32.6" rx="7" ry="5.4" fill="#D8BDFF" transform="rotate(32 30.4 32.6)"/><ellipse cx="19.4" cy="42" rx="5" ry="4" fill="#FFB0CD" transform="rotate(24 19.4 42)"/><ellipse cx="28.6" cy="42" rx="5" ry="4" fill="#FFB0CD" transform="rotate(-24 28.6 42)"/><ellipse cx="24" cy="37.6" rx="2" ry="7" fill="${O}"/></g><path d="M23 31 Q20 25 17.6 24.4 M25 31 Q28 25 30.4 24.4" fill="none" stroke="${O}" stroke-width="1.6" stroke-linecap="round"/>`,
    momiji: () => `<path d="M97 44 L100 51" stroke="${O}" stroke-width="2.4" stroke-linecap="round"/>` + star5(96, 36, 10.5, 5, "#FF9E5C", 2.2) + `<path d="M96 36 L96 27 M96 36 L104 33 M96 36 L88 33 M96 36 L101 43 M96 36 L91 43" stroke="#FFD2A6" stroke-width="1.3" stroke-linecap="round"/>`,
    bansoukou: () => `<g transform="rotate(-24 89 80)"><rect x="80" y="76.2" width="18" height="7.6" rx="3.8" fill="#FFE2C0" stroke="${O}" stroke-width="2.2"/><rect x="86" y="77.4" width="6" height="5.2" rx="1.6" fill="#F4C79C"/><circle cx="83" cy="80" r=".7" fill="#D9A877"/><circle cx="95" cy="80" r=".7" fill="#D9A877"/></g>`,
    suzu: () => `<path d="M32 92 Q60 104 88 92 L88 97.4 Q60 109.4 32 97.4 Z" fill="#FF6B81" stroke="${O}" stroke-width="3" stroke-linejoin="round"/><circle cx="60" cy="106.4" r="6.4" fill="#FFD84D" stroke="${O}" stroke-width="2.6"/><path d="M55 106 L65 106" stroke="${O}" stroke-width="1.8"/><circle cx="60" cy="109.4" r="1.2" fill="${O}"/><circle cx="57.6" cy="103.6" r="1.2" fill="#fff"/>`,
    chomusubi: () => `<g stroke="${O}" stroke-width="2.8" stroke-linejoin="round"><path d="M57 102 L50 114 L55.6 112 L58.4 115.6 Z M63 102 L70 114 L64.4 112 L61.6 115.6 Z" fill="#FF7FA8"/><path d="M60 99 C50 87 36 91 38.6 100 C41 108.6 52 106 60 99 Z M60 99 C70 87 84 91 81.4 100 C79 108.6 68 106 60 99 Z" fill="#FF9EC0"/><circle cx="60" cy="99.4" r="4.6" fill="#FF7FA8"/></g><path d="M44 96 Q47 93 51 95 M76 96 Q73 93 69 95" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>`,
    hoshimegane: () => star5(EL, EY, 13, 7, "rgba(255,216,77,.42)", 3) + star5(ER, EY, 13, 7, "rgba(255,216,77,.42)", 3) + `<path d="M53.6 70 Q60 66 66.4 70" fill="none" stroke="${O}" stroke-width="3" stroke-linecap="round"/>`
  };
  // фоны за Моней (только на её «сцене», в остальных местах не рисуются)
  const petal = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.2" fill="#FFC2D6" transform="rotate(${r} ${x} ${y})"/>`;
  const tiny = (x, y, r, c) => `<path d="M${x} ${y - r}L${x + r * .3} ${y - r * .3}L${x + r} ${y}L${x + r * .3} ${y + r * .3}L${x} ${y + r}L${x - r * .3} ${y + r * .3}L${x - r} ${y}L${x - r * .3} ${y - r * .3}Z" fill="${c}"/>`;
  const berry = (x, y) => `<path d="M${x} ${y - 4} C${x + 6} ${y - 4} ${x + 6} ${y + 2} ${x} ${y + 6} C${x - 6} ${y + 2} ${x - 6} ${y - 4} ${x} ${y - 4} Z" fill="#FF7FA3"/><path d="M${x - 3} ${y - 4.6} L${x} ${y - 2.6} L${x + 3} ${y - 4.6} L${x} ${y - 6.4} Z" fill="#7CC67E"/>`;
  const BG = {
    haru: () => `<circle cx="60" cy="62" r="58" fill="#DDF0FF"/>` + petal(16, 38, 30) + petal(30, 18, -20) + petal(98, 22, 60) + petal(108, 50, 10) + petal(12, 76, -40) + petal(104, 88, 35) + petal(84, 10, 80),
    yozora: () => `<circle cx="60" cy="62" r="58" fill="#6F6CBA"/><circle cx="98" cy="28" r="9" fill="#FFE9A0"/><circle cx="102.6" cy="24.6" r="8" fill="#6F6CBA"/>` + tiny(18, 34, 4, "#FFE27A") + tiny(34, 12, 3, "#fff") + tiny(108, 58, 3.4, "#FFE27A") + tiny(10, 70, 2.6, "#fff") + tiny(82, 12, 2.4, "#fff"),
    niji: () => `<circle cx="60" cy="62" r="58" fill="#FFF7FB"/>` + ["#FFB3C9", "#FFE08A", "#B9E6C9", "#AED8FF", "#D8BDFF"].map((c, i) => `<path d="M${8 + i * 5} 72 A${52 - i * 5} ${52 - i * 5} 0 0 1 ${112 - i * 5} 72" fill="none" stroke="${c}" stroke-width="5"/>`).join(""),
    ichigobatake: () => `<circle cx="60" cy="62" r="58" fill="#E6F6D9"/><path d="M4 84 Q60 72 116 84 L114 96 Q60 118 6 96 Z" fill="#C9EBB3"/>` + berry(16, 70) + berry(104, 70) + berry(24, 40) + berry(98, 36) + `<circle cx="60" cy="10" r="3" fill="#fff"/><circle cx="60" cy="10" r="1.4" fill="#FFD84D"/>`
  };
  const NECK = ["kubiwa", "erimaki", "suzu", "chomusubi"], CHEEK = ["bansoukou"];
  const TOPS = ["megane", "hoshimegane", "hachimaki", "boushi", "nekomimi", "oukan", "hanakanmuri", "hana", "hoshi", "sakura", "chouchou", "momiji"];
  // mood: normal | happy | great | sad | sleepy | eat | hungry
  function svg(mood = "normal", opts = {}) {
    const acc = opts.acc || [];
    const cls = opts.cls || "";
    let s = `<svg viewBox="0 0 120 120" class="mascot ${cls}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">`;
    const furId = acc.find((a) => FURS[a]) || "base";
    ({ fur: FUR, ear: EAR, earIn: EAR_IN } = FURS[furId]);
    if (opts.bg) { const b = acc.find((a) => BG[a]); if (b) s += BG[b](); }
    // уши чихуахуа: большие, стоячие, с закруглёнными кончиками (рисуем до головы)
    s += shape("M19 62 C12 46 10 30 13 18.6 C14.6 12.8 20 11.6 24.6 14.6 C35 21.4 43.4 30.6 49 42 Z", EAR);
    s += `<path d="M24 53 C19.6 42.6 18.6 32.6 20.4 23.4 C28.4 28.4 35 35 39.4 42.4 Z" fill="${EAR_IN}"/>`;
    s += shape("M101 62 C108 46 110 30 107 18.6 C105.4 12.8 100 11.6 95.4 14.6 C85 21.4 76.6 30.6 71 42 Z", EAR);
    s += `<path d="M96 53 C100.4 42.6 101.4 32.6 99.6 23.4 C91.6 28.4 85 35 80.6 42.4 Z" fill="${EAR_IN}"/>`;
    // голова-моти: широкая и приземистая
    s += shape("M60 36 C88 36 106 52 106 72 C106 90 88 101 60 101 C32 101 14 90 14 72 C14 52 32 36 60 36 Z", FUR);
    s += line("M55.6 37.6 C53.6 31 58 27.4 62.6 29.6", 3.2);
    for (const a of NECK) if (acc.includes(a)) s += ACC[a]();
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
    for (const a of CHEEK) if (acc.includes(a)) s += ACC[a]();
    // лапки спереди, как будто Моня выглядывает из-за края
    s += shape("M26 101 C26 91 46 91 46 101 C46 108 26 108 26 101 Z", FUR, 4) + shape("M74 101 C74 91 94 91 94 101 C94 108 74 108 74 101 Z", FUR, 4);
    s += line("M33 98.6 L33 103 M39 98.6 L39 103", 2.6) + line("M81 98.6 L81 103 M87 98.6 L87 103", 2.6);
    for (const a of TOPS) if (acc.includes(a)) s += ACC[a]();
    return s + "</svg>";
  }
  return { svg };
})();
if (typeof module !== "undefined") module.exports = Puppy;
