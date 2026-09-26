/* Комната Мони: сцена в стиле тетради (плоские цвета, толстый контур). Room.svg({ on, pet, hour, focus }) → SVG строкой.
   on — включённые вещи комнаты, pet — SVG щенка строкой, hour — час (для неба за окном), focus — id вещи для иконки. */
const Room = (() => {
  const O = "#5A3848";
  let uid = 0;
  const st = (w = 3) => `stroke="${O}" stroke-width="${w}" stroke-linejoin="round"`;
  const flower = (x, y, r, c) => { let s = ""; for (let i = 0; i < 5; i++) { const a = (i * 72 - 90) * Math.PI / 180; s += `<circle cx="${(x + r * Math.cos(a)).toFixed(1)}" cy="${(y + r * Math.sin(a)).toFixed(1)}" r="${r * 0.9}" fill="${c}"/>`; } return s + `<circle cx="${x}" cy="${y}" r="${r * 0.6}" fill="#FFD84D"/>`; };
  const berry = (x, y, k = 1) => `<path d="M${x} ${y - 5 * k} C${x + 7 * k} ${y - 5 * k} ${x + 7 * k} ${y + 2 * k} ${x} ${y + 7 * k} C${x - 7 * k} ${y + 2 * k} ${x - 7 * k} ${y - 5 * k} ${x} ${y - 5 * k} Z" fill="#FF8FB0"/><path d="M${x - 3.6 * k} ${y - 5.4 * k} L${x} ${y - 3 * k} L${x + 3.6 * k} ${y - 5.4 * k} L${x} ${y - 7.6 * k} Z" fill="#7CC67E"/>`;
  const WALLS = {
    base: (id) => ({ defs: `<pattern id="${id}" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="#FFF3E8"/><path d="M15 0 V30" stroke="#FFE7D6" stroke-width="6"/></pattern>` }),
    mizutama: (id) => ({ defs: `<pattern id="${id}" width="26" height="26" patternUnits="userSpaceOnUse"><rect width="26" height="26" fill="#FFF0F6"/><circle cx="6.5" cy="6.5" r="3.4" fill="#FFC4D8"/><circle cx="19.5" cy="19.5" r="3.4" fill="#FFC4D8"/></pattern>` }),
    kabe_ichigo: (id) => ({ defs: `<pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#FFF7EE"/>${berry(10, 11, 0.8)}${berry(30, 31, 0.8)}</pattern>` }),
    kabe_sakura: (id) => ({ defs: `<pattern id="${id}" width="44" height="44" patternUnits="userSpaceOnUse"><rect width="44" height="44" fill="#FFE4EE"/>${flower(12, 12, 3.4, "#fff")}${flower(33, 32, 2.8, "#FFF5F8")}</pattern>` })
  };
  function sky(hour) {
    if (hour >= 6 && hour < 17) return `<rect x="38" y="34" width="80" height="68" rx="6" fill="#CFEAFF"/><ellipse cx="62" cy="58" rx="13" ry="7" fill="#fff"/><ellipse cx="72" cy="54" rx="9" ry="7" fill="#fff"/><circle cx="104" cy="46" r="7" fill="#FFE27A"/>`;
    if (hour >= 17 && hour < 21) return `<rect x="38" y="34" width="80" height="68" rx="6" fill="#FFD3B6"/><rect x="38" y="70" width="80" height="32" rx="6" fill="#FFB9A4"/><circle cx="92" cy="76" r="11" fill="#FF8E7A"/>`;
    return `<rect x="38" y="34" width="80" height="68" rx="6" fill="#5F5CA8"/><circle cx="96" cy="52" r="9" fill="#FFE9A0"/><circle cx="100.4" cy="48.6" r="8" fill="#5F5CA8"/><circle cx="52" cy="46" r="1.6" fill="#fff"/><circle cx="66" cy="62" r="1.2" fill="#fff"/><circle cx="58" cy="86" r="1.4" fill="#FFE27A"/><circle cx="108" cy="84" r="1.2" fill="#fff"/>`;
  }
  const night = (hour) => hour >= 21 || hour < 6;
  // части комнаты
  const P = {
    window: (hour) => `<rect x="30" y="26" width="96" height="84" rx="10" fill="#fff" ${st()}/>` + sky(hour) + `<path d="M78 34 V102 M38 68 H118" stroke="#fff" stroke-width="4"/><rect x="24" y="106" width="108" height="9" rx="4.5" fill="#fff" ${st()}/>`,
    teruteru: () => `<path d="M46 26 V40" stroke="${O}" stroke-width="1.6"/><path d="M36 70 Q46 64 56 70 L53 54 Q46 50 39 54 Z" fill="#fff" ${st(2.4)}/><circle cx="46" cy="47" r="8" fill="#fff" ${st(2.4)}/><circle cx="43" cy="47" r="1.2" fill="${O}"/><circle cx="49" cy="47" r="1.2" fill="${O}"/><path d="M44 50 Q46 52 48 50" fill="none" stroke="${O}" stroke-width="1.2" stroke-linecap="round"/><path d="M40 53.4 Q46 56 52 53.4" fill="none" stroke="#FF7FA8" stroke-width="2"/>`,
    fuurin: () => `<path d="M110 26 V36" stroke="${O}" stroke-width="1.6"/><path d="M99 50 Q99 36 110 36 Q121 36 121 50 Z" fill="#DDF2FF" fill-opacity=".9" ${st(2.4)}/><circle cx="105" cy="44" r="1.6" fill="#FF7FA8"/><circle cx="114" cy="43" r="1.6" fill="#FF7FA8"/><path d="M110 50 V56" stroke="${O}" stroke-width="1.4"/><rect x="106.5" y="56" width="7" height="17" rx="1.5" fill="#FFB0CD" ${st(1.8)}/>`,
    kakejiku: () => `<path d="M262 22 L280 12 L298 22" fill="none" stroke="${O}" stroke-width="1.8"/><rect x="264" y="26" width="32" height="80" fill="#FFFDF4" ${st(2.4)}/><rect x="258" y="21" width="44" height="7" rx="3.5" fill="#C98E5A" ${st(2.4)}/><rect x="258" y="103" width="44" height="7" rx="3.5" fill="#C98E5A" ${st(2.4)}/><text x="280" y="58" text-anchor="middle" font-family="Klee One, serif" font-weight="600" font-size="22" fill="${O}">わ</text><text x="280" y="88" text-anchor="middle" font-family="Klee One, serif" font-weight="600" font-size="22" fill="${O}">ん</text><circle cx="289" cy="96" r="3" fill="#FF5C7C"/>`,
    floor: () => `<rect x="0" y="168" width="360" height="10" fill="#FFD1E1"/><rect x="0" y="176" width="360" height="84" fill="#F4DAB8"/><path d="M0 200 H360 M0 226 H360 M60 176 V200 M180 176 V200 M300 176 V200 M120 200 V226 M240 200 V226 M60 226 V260 M180 226 V260 M300 226 V260" stroke="#E6C39A" stroke-width="2"/><path d="M0 176 H360" stroke="${O}" stroke-width="2.4"/>`,
    shikimono: () => `<ellipse cx="180" cy="218" rx="84" ry="19" fill="#FFD1E1" ${st()}/><ellipse cx="180" cy="218" rx="70" ry="13" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="6 6"/>`,
    kumo: () => { const c = [[118, 216, 16], [146, 206, 21], [180, 202, 24], [214, 206, 21], [242, 216, 16]]; return c.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#EAF4FF" ${st(6)}/>`).join("") + `<ellipse cx="180" cy="222" rx="70" ry="13" fill="#EAF4FF" ${st(6)}/>` + c.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#EAF4FF"/>`).join("") + `<ellipse cx="180" cy="222" rx="70" ry="13" fill="#EAF4FF"/><circle cx="160" cy="214" r="2.6" fill="#FFB0CD"/><circle cx="200" cy="214" r="2.6" fill="#FFB0CD"/>`; },
    akari: (hour) => (night(hour) ? `<circle cx="326" cy="164" r="36" fill="#FFF3B0" opacity=".5"/>` : "") + `<path d="M326 180 V200" stroke="${O}" stroke-width="3"/><ellipse cx="326" cy="203" rx="15" ry="5" fill="#F0C9A0" ${st(2.6)}/><circle cx="326" cy="164" r="16" fill="#FFF3B8" ${st()}/><path d="M332 152 A14 14 0 0 1 332 176 A10 12 0 0 0 332 152 Z" fill="#FFE27A"/><circle cx="320" cy="160" r="2" fill="#F5D66A"/>`,
    ueki: () => `<path d="M27 196 C20 184 14 180 10 170 C18 172 25 180 27 190 C29 178 34 170 44 166 C40 178 34 186 27 196 Z" fill="#8FD18C" ${st(2.4)}/><path d="M27 196 V178" stroke="#6BB36A" stroke-width="2.4"/>` + flower(27, 172, 3.6, "#FFB0CD") + `<path d="M13 196 L41 196 L37 226 L17 226 Z" fill="#FF9EC0" ${st()}/><path d="M15 204 H39" stroke="#fff" stroke-width="2.4"/>`,
    omocha: () => `<circle cx="86" cy="226" r="10" fill="#AED8FF" ${st(2.6)}/><path d="M77 222 Q86 228 95 222" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M104 236 a4.4 4.4 0 1 1 5.2 -4.6 L121 231 a4.4 4.4 0 1 1 4.6 5.2 a4.4 4.4 0 1 1 -5.2 4.6 L109 240 a4.4 4.4 0 1 1 -5 -4 Z" fill="#FFF6E6" ${st(2.2)}/>`,
    bowl: () => `<path d="M282 222 L320 222 Q316 240 301 240 Q286 240 282 222 Z" fill="#FFB0CD" ${st()}/><circle cx="293" cy="219" r="4" fill="#C98E5A" ${st(1.6)}/><circle cx="302" cy="217" r="4" fill="#C98E5A" ${st(1.6)}/><circle cx="310" cy="219.6" r="4" fill="#C98E5A" ${st(1.6)}/><path d="M292 230 q9 5 18 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`,
    zabuton: () => `<rect x="130" y="192" width="100" height="28" rx="12" fill="#FF9EC0" ${st()}/><circle cx="148" cy="206" r="2" fill="#fff"/><circle cx="212" cy="206" r="2" fill="#fff"/><circle cx="180" cy="206" r="2" fill="#fff"/>`,
    ouchi: () => `<rect x="116" y="94" width="128" height="118" rx="12" fill="#FFE0EC" ${st()}/><path d="M104 102 L180 48 L256 102 Z" fill="#FF7FA8" ${st()}/><path d="M180 66 c-4-6-12-3-10 3 1 4 10 9 10 9s9-5 10-9c2-6-6-9-10-3z" fill="#fff"/><path d="M140 212 L140 150 Q180 110 220 150 L220 212 Z" fill="#C0708C" ${st(2.6)}/>`,
    kagoBack: () => `<ellipse cx="180" cy="196" rx="60" ry="11" fill="#C98E5A" ${st()}/><ellipse cx="180" cy="197" rx="50" ry="7" fill="#FFC4D8"/>`,
    kagoFront: () => `<path d="M120 196 Q180 208 240 196 L232 228 Q180 240 128 228 Z" fill="#E8B98A" ${st()}/><path d="M130 206 Q180 216 230 206 M132 216 Q180 226 228 216" fill="none" stroke="#C98E5A" stroke-width="2.4"/><path d="M146 208 V230 M164 211 V234 M180 212 V235 M196 211 V234 M214 208 V230" stroke="#D8A576" stroke-width="2"/>`,
    kotatsu: () => `<path d="M104 196 Q180 186 256 196 L262 236 Q180 246 98 236 Z" fill="#FFB0CD" ${st()}/><path d="M112 212 Q180 204 248 212 M108 226 Q180 218 252 226" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/><rect x="110" y="184" width="140" height="12" rx="4" fill="#C98E5A" ${st()}/><circle cx="222" cy="176" r="9" fill="#FFA24C" ${st(2.4)}/><path d="M220 168 l3 -3" stroke="#6BB36A" stroke-width="2.4" stroke-linecap="round"/><circle cx="238" cy="179" r="6.5" fill="#FFA24C" ${st(2.2)}/>`
  };
  // рамки для иконок вещей
  const FOCUS = { kago: "100 90 160 160", ouchi: "96 40 170 210", mizutama: "150 10 120 120", kabe_ichigo: "150 10 120 120", kabe_sakura: "150 10 120 120", shikimono: "90 150 180 100", kumo: "90 150 180 100", omocha: "70 205 64 44", ueki: "0 158 52 76", teruteru: "26 22 44 54", fuurin: "92 22 36 56", akari: "300 136 52 76", kakejiku: "250 8 60 108", kotatsu: "96 100 170 150" };
  function svg(opts = {}) {
    const on = opts.on || [], hour = opts.hour == null ? new Date().getHours() : opts.hour;
    const has = (x) => on.includes(x);
    const pid = "rw" + (++uid);
    const wall = (WALLS[on.find((x) => WALLS[x] && x !== "base")] || WALLS.base)(pid);
    const vb = opts.focus && FOCUS[opts.focus] ? FOCUS[opts.focus] : "0 0 360 250";
    let s = `<svg viewBox="${vb}" class="${opts.cls || "room-svg"}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs>${wall.defs}</defs>`;
    s += `<rect x="0" y="0" width="360" height="176" fill="url(#${pid})"/>`;
    s += P.window(hour);
    if (has("teruteru")) s += P.teruteru();
    if (has("fuurin")) s += P.fuurin();
    if (has("kakejiku")) s += P.kakejiku();
    s += P.floor();
    if (has("kumo")) s += P.kumo(); else if (has("shikimono")) s += P.shikimono();
    if (has("akari")) s += P.akari(hour);
    if (has("ueki")) s += P.ueki();
    if (has("ouchi")) s += P.ouchi() + P.zabuton();
    else if (has("kago")) s += P.kagoBack();
    else s += P.zabuton();
    if (opts.pet) s += opts.pet.replace("<svg ", `<svg x="120" y="${has("kotatsu") ? 80 : has("kago") ? 92 : 98}" width="120" height="120" `);
    if (has("kago") && !has("ouchi")) s += P.kagoFront();
    if (has("kotatsu")) s += P.kotatsu();
    if (has("omocha")) s += P.omocha();
    s += P.bowl();
    return s + "</svg>";
  }
  return { svg };
})();
if (typeof module !== "undefined") module.exports = Room;
