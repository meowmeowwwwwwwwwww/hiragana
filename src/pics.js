/* Картинки-ассоциации: знак встроен в рисунок. Координаты в поле 1024×1024 (как у эталонов). */
const Pics = (() => {
  const O = "#5A3848", SW = 18;
  const F = {
    skin: "#FFE6CC", pink: "#FFC4DA", hot: "#FF9EC0", yellow: "#FFE58F", sun: "#FFD84D", blue: "#BFE3FF", water: "#A8D5FF",
    green: "#A8DDA0", dgreen: "#7CC67E", brown: "#D9A877", lbrown: "#EBC79E", white: "#FFFFFF", lilac: "#DCC8FF", gray: "#DCD4D8",
    cream: "#FFF3C4", red: "#FF7F8E", sand: "#F7D9A0", fur: "#F7DFC0", ear: "#DDA878"
  };
  const col = (c) => F[c] || c;
  const C = (cx, cy, r, fill, w = SW) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col(fill)}" stroke="${O}" stroke-width="${w}"/>`;
  const E = (cx, cy, rx, ry, fill, rot = 0, w = SW) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${col(fill)}" stroke="${O}" stroke-width="${w}" transform="rotate(${rot} ${cx} ${cy})"/>`;
  const P = (d, fill, w = SW) => `<path d="${d}" fill="${col(fill)}" stroke="${O}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const L = (d, color = O, w = 14, dash = "") => `<path d="${d}" fill="none" stroke="${col(color)}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
  const DOT = (cx, cy, r, fill = O) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col(fill)}"/>`;
  const BAR = (x1, y1, x2, y2, w, fill) => L(`M${x1} ${y1}L${x2} ${y2}`, O, w + SW * 2) + L(`M${x1} ${y1}L${x2} ${y2}`, fill, w);
  const T = (x, y, s, size, fill = O) => `<text x="${x}" y="${y}" font-family="M PLUS Rounded 1c, system-ui, sans-serif" font-weight="800" font-size="${size}" fill="${col(fill)}" text-anchor="middle" dominant-baseline="central" stroke="#fff" stroke-width="14" paint-order="stroke">${s}</text>`;
  const FACE = (cx, cy, s, happy = false) => {
    const ex = s * 0.36, ey = cy - s * 0.06;
    const eyes = happy
      ? L(`M${cx - ex - s * 0.12} ${ey + s * 0.04}Q${cx - ex} ${ey - s * 0.14} ${cx - ex + s * 0.12} ${ey + s * 0.04}`, O, s * 0.07) + L(`M${cx + ex - s * 0.12} ${ey + s * 0.04}Q${cx + ex} ${ey - s * 0.14} ${cx + ex + s * 0.12} ${ey + s * 0.04}`, O, s * 0.07)
      : DOT(cx - ex, ey, s * 0.1) + DOT(cx + ex, ey, s * 0.1) + DOT(cx - ex + s * 0.04, ey - s * 0.04, s * 0.035, "#fff") + DOT(cx + ex + s * 0.04, ey - s * 0.04, s * 0.035, "#fff");
    return eyes + `<ellipse cx="${cx - s * 0.58}" cy="${cy + s * 0.2}" rx="${s * 0.16}" ry="${s * 0.1}" fill="#FF9EBB" opacity=".75"/><ellipse cx="${cx + s * 0.58}" cy="${cy + s * 0.2}" rx="${s * 0.16}" ry="${s * 0.1}" fill="#FF9EBB" opacity=".75"/>` +
      L(`M${cx - s * 0.13} ${cy + s * 0.2}Q${cx} ${cy + s * 0.34} ${cx + s * 0.13} ${cy + s * 0.2}`, O, s * 0.07);
  };
  const STAR = (cx, cy, r, fill = "sun") => { let d = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.48 : r; d += (i ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(0) + " " + (cy + rr * Math.sin(a)).toFixed(0); } return P(d + "Z", fill, 12); };
  const FLOWER = (cx, cy, r, fill) => { let s = ""; for (let i = 0; i < 5; i++) { const a = (i * 2 * Math.PI) / 5 - Math.PI / 2; s += C((cx + r * 0.62 * Math.cos(a)).toFixed(0), (cy + r * 0.62 * Math.sin(a)).toFixed(0), r * 0.5, fill, 12); } return s + C(cx, cy, r * 0.36, "sun", 12); };
  const DROP = (cx, cy, s, fill = "water") => P(`M${cx} ${cy - s}Q${cx + s * 0.8} ${cy + s * 0.1} ${cx} ${cy + s * 0.7}Q${cx - s * 0.8} ${cy + s * 0.1} ${cx} ${cy - s}Z`, fill, 12);
  const CLOUD = (cx, cy, s, fill = "white") => C(cx - s * 0.5, cy + s * 0.1, s * 0.42, fill, 12) + C(cx + s * 0.5, cy + s * 0.12, s * 0.4, fill, 12) + C(cx, cy - s * 0.12, s * 0.55, fill, 12) + `<rect x="${cx - s * 0.6}" y="${cy}" width="${s * 1.2}" height="${s * 0.45}" fill="${col(fill)}"/>`;
  const FISH = (cx, cy, s, fill, left = false) => {
    const k = left ? -1 : 1;
    return P(`M${cx - k * s * 0.9} ${cy}L${cx - k * s * 1.45} ${cy - s * 0.5}L${cx - k * s * 1.45} ${cy + s * 0.5}Z`, fill, 12) + E(cx, cy, s, s * 0.62, fill, 0, 12) + DOT(cx + k * s * 0.45, cy - s * 0.12, s * 0.12);
  };
  const HAY = (cx, cy) => [[-40, 10, -30], [0, -10, 0], [40, 8, 30], [-18, 30, -12], [22, 30, 14]].map(([dx, dy, r]) => E(cx + dx, cy + dy, 22, 58, "yellow", r, 10)).join("");
  const GRAINS = (cx, cy) => [[0, 0, 0], [-34, 36, -30], [34, 36, 30], [-40, 90, -30], [40, 90, 30], [0, 60, 0]].map(([dx, dy, r]) => E(cx + dx, cy + dy, 20, 32, "cream", r, 10)).join("");
  const PUP = (cx, cy, s) => {
    const k = s / 100;
    return P(`M${cx} ${cy - 80 * k}C${cx + 80 * k} ${cy - 80 * k} ${cx + 100 * k} ${cy - 20 * k} ${cx + 100 * k} ${cy + 10 * k}C${cx + 100 * k} ${cy + 70 * k} ${cx + 50 * k} ${cy + 90 * k} ${cx} ${cy + 90 * k}C${cx - 50 * k} ${cy + 90 * k} ${cx - 100 * k} ${cy + 70 * k} ${cx - 100 * k} ${cy + 10 * k}C${cx - 100 * k} ${cy - 20 * k} ${cx - 80 * k} ${cy - 80 * k} ${cx} ${cy - 80 * k}Z`, "fur") +
      E(cx - 88 * k, cy - 10 * k, 30 * k, 55 * k, "ear", 20) + E(cx + 88 * k, cy - 10 * k, 30 * k, 55 * k, "ear", -20) + FACE(cx, cy + 10 * k, 80 * k, true);
  };
  const BERRY = (cx, cy, s) => P(`M${cx} ${cy - s * 0.5}C${cx + s} ${cy - s * 0.6} ${cx + s * 0.9} ${cy + s * 0.5} ${cx} ${cy + s}C${cx - s * 0.9} ${cy + s * 0.5} ${cx - s} ${cy - s * 0.6} ${cx} ${cy - s * 0.5}Z`, "hot", 12) +
    P(`M${cx - s * 0.5} ${cy - s * 0.55}L${cx} ${cy - s * 0.3}L${cx + s * 0.5} ${cy - s * 0.55}L${cx} ${cy - s * 0.85}Z`, "dgreen", 10);

  // [под знаком, над знаком]
  const S = {
    "あ": [C(335, 78, 80, "skin") + FACE(335, 82, 80) + C(150, 262, 46, "skin") + C(722, 236, 46, "skin"),
      L("M96 600Q52 700 96 800") + L("M930 560Q984 690 930 820") + STAR(890, 420, 40, "sun")],
    "い": [L("M40 930Q300 890 540 930Q780 960 990 915", "dgreen", 22) + E(170, 520, 26, 70, "green", -30) + E(930, 470, 26, 66, "green", 30),
      FLOWER(98, 200, 76, "lilac") + FLOWER(672, 222, 76, "pink")],
    "う": [L("M40 880Q110 850 180 880Q250 910 320 880", "water", 18) + BAR(640, 200, 960, 40, 26, "brown"),
      FISH(360, 935, 100, "blue") + C(560, 990, 16, "white", 8) + C(600, 950, 10, "white", 8)],
    "え": [P("M400 113L654 205L585 30Z", "hot") + C(520, 290, 78, "skin") + FACE(520, 294, 78),
      C(672, 200, 36, "white") + L("M60 600L150 600") + L("M40 680L130 680") + L("M880 960L990 960")],
    "お": [L("M880 250Q770 420 700 300", "hot", 10, "22 26"),
      E(880, 100, 50, 34, "white", -30, 12) + E(945, 108, 44, 30, "white", 25, 12) + E(900, 180, 92, 62, "yellow", -15) + L("M860 140L846 230", O, 16) + L("M915 136L900 226", O, 16) + DOT(972, 160, 13) + L("M812 205L780 225", O, 12)],
    "か": [L("M740 90Q760 60 780 90Q800 130 760 150Q720 130 740 90", "water", 12),
      E(628, 258, 50, 88, "blue", -37) + E(924, 652, 50, 88, "blue", -37) + DROP(790, 110, 56) + L("M620 380L700 360") + L("M640 440L720 440")],
    "き": [E(465, 845, 215, 90, "blue") + P("M650 880C700 850 740 820 780 780C770 850 770 900 800 950C750 930 700 910 650 900Z", "blue"),
      DOT(360, 830, 13) + L("M390 872Q420 890 450 872", O, 10) + DROP(730, 236, 52) + DROP(830, 408, 52) + DROP(360, 80, 46)],
    "く": [E(850, 500, 380, 420, "yellow") + P("M561 111L337 479L625 884Z", "hot", 0),
      C(770, 330, 48, "white", 12) + DOT(782, 336, 24) + DOT(792, 322, 8, "#fff") + E(820, 560, 50, 28, "#FF9EBB", 0, 0) + T(200, 170, "ку-ку!", 90, "hot")],
    "け": [C(170, 150, 62, "green") + C(262, 110, 70, "green") + C(250, 200, 56, "green") + C(590, 110, 80, "green") + C(700, 80, 86, "green") + C(710, 170, 70, "green") + L("M60 960Q500 930 980 960", "brown", 22), ""],
    "こ": [BAR(300, 240, 680, 250, 96, "#F4B3A6") + BAR(320, 822, 770, 850, 96, "#F4B3A6"),
      L("M400 215L430 270", "#fff", 10) + L("M520 212L550 268", "#fff", 10) + L("M440 810L470 870", "#fff", 10) + L("M580 816L610 872", "#fff", 10) + L("M420 120Q400 80 430 40", O, 10) + L("M520 120Q500 80 530 40", O, 10) + L("M620 120Q600 80 630 40", O, 10)],
    "さ": [P("M380 690L720 690L720 790L380 790Z", "pink") + L("M460 790L460 890") + L("M640 790L640 905"),
      STAR(160, 250, 44, "white") + STAR(880, 190, 40, "white") + STAR(890, 470, 34, "white") + STAR(140, 580, 30, "blue") + STAR(560, 60, 32, "blue")],
    "し": [P("M170 420L870 420L800 990L240 990Z", "#FFF5F9") + P("M205 640L840 640L800 990L240 990Z", "hot", 0) + L("M170 420L870 420L800 990L240 990Z"),
      BERRY(860, 400, 70) + C(330, 720, 12, "white", 0) + C(700, 860, 14, "white", 0)],
    "す": [C(485, 560, 160, "lbrown") + C(485, 560, 40, "#FFF8EE"),
      DOT(400, 450, 10) + DOT(600, 450, 10) + DOT(620, 640, 10) + DOT(360, 650, 10) + DOT(500, 700, 10) + DOT(350, 540, 10) + L("M200 260Q230 230 260 260", O, 8)],
    "せ": [L("M40 960Q500 920 990 960", "brown", 22), HAY(632, 90) + HAY(306, 168) + L("M720 260L740 300", "yellow", 12) + L("M250 330L230 370", "yellow", 12)],
    "そ": [PUP(830, 830, 165),
      L("M150 150Q110 230 150 310") + L("M950 250Q1000 330 950 410") + L("M110 460Q70 520 110 580")],
    "た": [C(110, 150, 72, "pink") + C(935, 690, 72, "yellow"), T(110, 150, "t", 110) + T(935, 690, "a", 110)],
    "ち": [C(630, 725, 150, "cream"),
      L("M630 600L630 625") + L("M630 825L630 850") + L("M755 725L730 725") + L("M505 725L530 725") + L("M630 725L630 650", O, 14) + L("M630 725L690 760", O, 14) + DOT(630, 725, 14)],
    "つ": [P("M40 1010L40 520C200 440 420 330 600 310C800 300 900 380 890 520C880 640 760 740 600 800C700 860 900 900 1000 880L1000 1010Z", "blue"),
      C(920, 430, 26, "white", 10) + C(960, 500, 18, "white", 10) + C(200, 470, 22, "white", 10) + C(300, 420, 16, "white", 10) + L("M200 900Q260 870 320 900", "#fff", 12) + L("M700 950Q760 920 820 950", "#fff", 12)],
    "て": [BAR(185, 325, 720, 180, 70, "pink") + C(190, 330, 62, "pink") + C(720, 182, 62, "pink") + P("M690 860L960 860L990 1010L660 1010Z", "pink"),
      C(825, 935, 42, "white", 12) + DOT(825, 935, 10)],
    "と": [P("M690 250C600 340 500 430 420 520C330 620 250 700 262 782C270 830 330 862 410 862L775 866C835 866 850 800 790 790L520 790C530 620 610 420 700 270Z", "skin"),
      C(820, 830, 26, "skin", 10) + C(862, 850, 22, "skin", 10) + STAR(450, 540, 46, "sun") + L("M480 440L520 410", O, 10) + L("M500 480L550 470", O, 10)],
    "な": [C(470, 830, 160, "pink") + E(610, 680, 52, 34, "pink", -20),
      DOT(400, 760, 20, "#fff") + DOT(540, 860, 20, "#fff") + DOT(420, 930, 18, "#fff") + DOT(560, 740, 18, "#fff") + DOT(340, 860, 16, "#fff") + L("M60 960L220 960")],
    "に": [P("M90 160L320 160L320 215L90 215Z", "brown") + P("M120 215L290 215L290 830L120 830Z", "hot") + P("M90 830L320 830L320 890L90 890Z", "brown"),
      BAR(850, 262, 990, 245, 20, "gray") + E(960, 248, 16, 9, "white", -5, 6)],
    "ぬ": [P("M110 830L930 830Q910 1010 520 1015Q130 1010 110 830Z", "blue"),
      L("M820 150Q790 110 820 70", O, 10) + L("M900 150Q870 110 900 70", O, 10) + E(280, 930, 40, 20, "hot", 0, 0) + E(700, 940, 40, 20, "hot", 0, 0)],
    "ね": [P("M215 60L230 -30L300 30Z", "skin", 14) + P("M330 30L400 -30L380 70Z", "skin", 14) + C(300, 95, 92, "skin") + FACE(300, 100, 92), ""],
    "の": [BAR(515, 880, 515, 1010, 40, "gray") + C(505, 545, 420, "white") + `<circle cx="505" cy="545" r="400" fill="none" stroke="#FF6F7F" stroke-width="40"/>`, ""],
    "は": [P("M500 300L820 300L920 910L420 910Z", "#FFD1E3") + L("M178 150Q176 60 236 66Q290 74 272 128"),
      L("M560 300L520 420", O, 10) + L("M760 300L800 420", O, 10)],
    "ひ": [P("M225 544Q203 758 312 875Q553 805 653 536Z", "#FF9EB0", 0),
      L("M270 110Q330 40 390 110") + L("M630 100Q690 30 750 100") + E(150, 420, 50, 30, "#FF9EBB", 0, 0) + E(920, 420, 50, 30, "#FF9EBB", 0, 0)],
    "ふ": [P("M170 900L510 330L850 900Z", "blue") + P("M430 470L510 330L590 470L550 445L510 480L470 445Z", "white", 12) + CLOUD(150, 720, 120) + CLOUD(850, 700, 120),
      L("M580 190Q620 150 660 190Q700 150 740 190")],
    "へ": [C(830, 190, 80, "sun") + P("M50 910L378 312L970 910Z", "sand"),
      L("M250 700L700 700", O, 10) + L("M200 800L800 800", O, 10) + L("M400 600L520 600", O, 10)],
    "ほ": [P("M440 120L920 120L920 910L440 910Z", "#EEF6FF") + L("M520 120L520 910", "#BFD6EE", 8) + L("M600 120L600 910", "#BFD6EE", 8) + L("M680 120L680 910", "#BFD6EE", 8) + L("M760 120L760 910", "#BFD6EE", 8) + L("M840 120L840 910", "#BFD6EE", 8) + L("M440 300L920 300", "#BFD6EE", 8) + L("M440 600L920 600", "#BFD6EE", 8) + L("M440 120L920 120L920 910L440 910Z"),
      P("M168 860L310 900L310 955L150 935Z", "brown")],
    "ま": [P("M200 910L860 910L760 1010L300 1010Z", "brown") + L("M40 970Q120 940 200 970", "water", 16) + L("M860 970Q940 940 1010 970", "water", 16),
      P("M255 273L110 215L255 160Z", "sun") + P("M258 513L120 455L258 400Z", "hot")],
    "み": [P("M95 610L100 480L175 580Z", "skin", 14) + P("M225 575L290 470L310 610Z", "skin", 14) + C(195, 695, 135, "skin"),
      FACE(195, 712, 96)],
    "む": [E(480, 170, 110, 62, "#C9A89A", 20) + E(170, 560, 90, 58, "#C9A89A", -20) + E(560, 640, 80, 50, "#C9A89A", 10),
      P("M730 150L800 40L850 170Z", "cream") + T(880, 560, "му-у", 90, "hot")],
    "め": [E(560, 560, 230, 200, "white") + C(595, 565, 108, "blue") + DOT(605, 565, 58) + DOT(635, 525, 20, "#fff"),
      L("M430 310L400 250") + L("M540 280L540 215") + L("M660 290L690 230")],
    "も": [L("M60 400Q130 370 200 400Q270 430 340 400", "water", 16), FISH(850, 640, 105, "hot", true)],
    "や": [P("M81 517L491 379L740 305L860 311L921 409L817 524L647 552Z", "white") + P("M300 880L820 880L720 990L380 990Z", "brown") + L("M40 960Q110 930 180 960", "water", 16) + L("M840 960Q910 930 990 960", "water", 16),
      P("M503 105L620 130L540 175Z", "hot", 12)],
    "ゆ": [E(600, 460, 250, 210, "pink") + P("M360 420Q600 380 850 420L850 500Q600 460 360 500Z", "sun", 0),
      L("M70 400Q30 470 70 540") + L("M960 380Q1000 460 960 540")],
    "よ": [L("M250 70L850 70", "dgreen", 30) + L("M320 70L290 130M420 70L400 130M560 70L580 130M700 70L720 130", "dgreen", 16) + C(370, 772, 118, "hot"),
      L("M320 740Q370 700 420 740", "#fff", 12) + STAR(860, 420, 44, "sun") + STAR(140, 330, 34, "lilac")],
    "ら": [C(570, 740, 170, "sun") + L("M570 740m-20 0a20 20 0 1 1 40 0a60 60 0 1 1 -120 0a110 110 0 1 1 220 0", O, 12) + BAR(250, 950, 820, 950, 60, "skin"),
      FACE(250, 930, 60)],
    "り": [L("M40 970L990 970", "water", 20), GRAINS(344, 30) + GRAINS(590, 130)],
    "る": [C(560, 700, 215, "skin") + L("M560 700m-30 0a30 30 0 1 1 60 0a90 90 0 1 1 -180 0a150 150 0 1 1 300 0", "hot", 26),
      BERRY(780, 440, 80)],
    "れ": [L("M880 590L940 520", "hot", 18) + L("M960 690L1010 660", "hot", 18) + L("M820 560L850 490", "hot", 18), STAR(975, 590, 44, "sun")],
    "ろ": [P("M440 530C720 480 900 640 830 840C780 940 580 960 400 920C600 860 690 780 680 680C670 610 590 580 440 530Z", "lbrown"),
      L("M650 600L610 680", O, 10) + L("M760 700L700 760", O, 10)],
    "わ": [C(560, 500, 130, "pink") + C(700, 440, 140, "pink") + C(830, 560, 130, "pink") + C(770, 730, 130, "pink") + C(600, 720, 130, "pink") + C(490, 630, 110, "pink") + C(680, 600, 150, "pink", 0), ""],
    "を": [C(415, 72, 70, "skin") + FACE(415, 76, 70) + P("M560 570L820 570L820 800L560 800Z", "hot") + L("M690 570L690 800", "sun", 24) + L("M560 685L820 685", "sun", 24) + E(650, 540, 50, 30, "sun", -20, 12) + E(730, 540, 50, 30, "sun", 20, 12), ""],
    "ん": [C(840, 200, 90, "sun"), T(840, 200, "n", 140)]
  };
  function svg(k, glyphParts) {
    const sc = S[k];
    if (!sc) return "";
    const glyph = glyphParts.map((o) => `<path d="${o}"/>`).join("");
    return `<svg viewBox="0 0 1024 1024" class="pic" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">` +
      `<g>${sc[0]}</g><g fill="#E24A84" stroke="#fff" stroke-width="26" stroke-linejoin="round" paint-order="stroke">${glyph}</g><g>${sc[1]}</g></svg>`;
  }
  return { svg, has: (k) => !!S[k] };
})();
if (typeof module !== "undefined") module.exports = Pics;
