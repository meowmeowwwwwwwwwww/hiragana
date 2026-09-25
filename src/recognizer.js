/* Проверка рисунка: сравнение нарисованных черт с эталоном KanjiVG (поле 109×109). */
const Recog = (() => {
  const N = 32;
  let T_GOOD = 9, T_NEAR = 14;       // средняя удалённость точек черты от эталона
  let M_GOOD = 16, M_NEAR = 22;      // наибольшая удалённость одной точки
  function setLenient(on) {
    const k = on ? 1.3 : 1;
    T_GOOD = 9 * k; T_NEAR = 14 * k; M_GOOD = 16 * k; M_NEAR = 22 * k;
  }
  const SHORT = 16;                  // короткие черты (тэнтэн, кружок) — без проверки направления

  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

  function pathLen(pts) {
    let s = 0;
    for (let i = 1; i < pts.length; i++) s += dist(pts[i - 1], pts[i]);
    return s;
  }

  function resample(pts, n = N) {
    if (!pts.length) return [];
    const L = [0];
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + dist(pts[i - 1], pts[i]));
    const total = L[L.length - 1];
    if (pts.length === 1 || total === 0) return Array.from({ length: n }, () => [pts[0][0], pts[0][1]]);
    const out = [];
    let j = 0;
    for (let k = 0; k < n; k++) {
      const target = (total * k) / (n - 1);
      while (j < L.length - 2 && L[j + 1] < target) j++;
      const seg = L[j + 1] - L[j] || 1;
      const f = Math.min(1, Math.max(0, (target - L[j]) / seg));
      const a = pts[j], b = pts[j + 1];
      out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
    }
    return out;
  }

  function bbox(strokes) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const s of strokes) for (const [x, y] of s) {
      if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y;
    }
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
  }

  const centroid = (pts) => {
    let x = 0, y = 0;
    for (const p of pts) { x += p[0]; y += p[1]; }
    return [x / pts.length, y / pts.length];
  };

  function meanDist(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += dist(a[i], b[i]);
    return s / a.length;
  }
  function maxDist(a, b) {
    let m = 0;
    for (let i = 0; i < a.length; i++) m = Math.max(m, dist(a[i], b[i]));
    return m;
  }

  const mapStrokes = (strokes, f) => strokes.map((s) => s.map(f));

  // Грубое совмещение: одинаковый масштаб по обеим осям, совпадение центров рамок.
  function bboxAlign(U, R) {
    const bu = bbox(U), br = bbox(R);
    const su = Math.max(bu.w, bu.h, 1), sr = Math.max(br.w, br.h, 1);
    const k = sr / su;
    return mapStrokes(U, ([x, y]) => [(x - bu.cx) * k + br.cx, (y - bu.cy) * k + br.cy]);
  }

  // Точное совмещение по соответствующим точкам (сдвиг + масштаб, масштаб ограничен).
  function lsAlign(U, R, perm) {
    const A = [], B = [];
    perm.forEach((j, i) => { A.push(...U[i]); B.push(...R[j]); });
    const ca = centroid(A), cb = centroid(B);
    let num = 0, den = 0;
    for (let i = 0; i < A.length; i++) {
      const ax = A[i][0] - ca[0], ay = A[i][1] - ca[1];
      num += ax * (B[i][0] - cb[0]) + ay * (B[i][1] - cb[1]);
      den += ax * ax + ay * ay;
    }
    let s = den > 0 ? num / den : 1;
    s = Math.min(1.25, Math.max(0.8, s));
    return mapStrokes(U, ([x, y]) => [(x - ca[0]) * s + cb[0], (y - ca[1]) * s + cb[1]]);
  }

  function permutations(n) {
    const res = [];
    const a = [...Array(n).keys()];
    const rec = (k) => {
      if (k === n) { res.push(a.slice()); return; }
      for (let i = k; i < n; i++) {
        [a[k], a[i]] = [a[i], a[k]]; rec(k + 1); [a[k], a[i]] = [a[i], a[k]];
      }
    };
    rec(0);
    return res;
  }

  // Удалённость черты от эталона без учёта положения: совмещаем центры и длины.
  function shapeDist(u, r) {
    const cu = centroid(u), cr = centroid(r);
    const lu = pathLen(u) || 1, lr = pathLen(r) || 1;
    const k = Math.min(2, Math.max(0.5, lr / lu));
    const moved = u.map(([x, y]) => [(x - cu[0]) * k + cr[0], (y - cu[1]) * k + cr[1]]);
    return meanDist(moved, r);
  }

  function plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }
  const cherta = (n) => n + " " + plural(n, "черта", "черты", "черт");

  function describeOffset(u, r) {
    const cu = centroid(u), cr = centroid(r);
    const dx = cu[0] - cr[0], dy = cu[1] - cr[1];
    const lu = pathLen(u), lr = pathLen(r);
    const parts = [];
    if (Math.abs(dy) > 7) parts.push(dy > 0 ? "ниже" : "выше");
    if (Math.abs(dx) > 7) parts.push(dx > 0 ? "правее" : "левее");
    let where = parts.length ? "стоит " + parts.join(" и ") + ", чем нужно" : "";
    let size = "";
    if (lu > lr * 1.35) size = "длиннее, чем нужно";
    else if (lu < lr * 0.7) size = "короче, чем нужно";
    return [where, size].filter(Boolean).join(", и ");
  }

  // Средняя разница направлений движения (в градусах) между чертой и эталоном.
  function angleDiff(u, r) {
    let s = 0, w = 0;
    for (let i = 1; i < u.length; i++) {
      const a1 = Math.atan2(u[i][1] - u[i - 1][1], u[i][0] - u[i - 1][0]);
      const a2 = Math.atan2(r[i][1] - r[i - 1][1], r[i][0] - r[i - 1][0]);
      let d = Math.abs(a1 - a2);
      if (d > Math.PI) d = 2 * Math.PI - d;
      s += d; w++;
    }
    return (s / w) * 180 / Math.PI;
  }

  function features(u, r) {
    return { d: meanDist(u, r), m: maxDist(u, r), a: angleDiff(u, r), k: pathLen(u) / (pathLen(r) || 1) };
  }

  function judgeStroke(u, r, idx) {
    const f = features(u, r);
    const d = f.d, m = f.m;
    const lr = pathLen(r);
    const rev = u.slice().reverse();
    const dRev = meanDist(rev, r), mRev = maxDist(rev, r);
    const n = idx + 1;
    if (lr < SHORT) {
      const dd = Math.min(d, dRev), mm = Math.min(m, mRev);
      if (dd <= T_GOOD && mm <= M_GOOD) return { status: "good", d: dd };
      if (dd <= T_NEAR && mm <= M_NEAR) return { status: "near", d: dd, msg: `Черта ${n}: почти, ${describeOffset(u, r) || "чуть точнее по месту"}.` };
      return { status: "bad", d: dd, reason: "place", msg: `Черта ${n}: ${describeOffset(u, r) || "не на своём месте"}.` };
    }
    if (d <= T_GOOD && m <= M_GOOD) return { status: "good", d };
    if (d <= T_NEAR && m <= M_NEAR) {
      const off = describeOffset(u, r);
      return { status: "near", d, msg: `Черта ${n}: хорошо${off ? ", но " + off : ", форму можно чуть точнее"}.` };
    }
    if (dRev <= T_NEAR && mRev <= M_NEAR) {
      return { status: "bad", d, reason: "reversed", msg: `Черта ${n} идёт в обратную сторону. Начни её с другого конца (с точки, где стоит цифра).` };
    }
    if (shapeDist(u, r) <= T_NEAR) {
      return { status: "bad", d, reason: "place", msg: `Черта ${n}: форма верная, но она ${describeOffset(u, r) || "не на своём месте"}.` };
    }
    return { status: "bad", d, reason: "shape", msg: `Черта ${n} не похожа на образец. Сравни с розовым образцом.` };
  }

  function costMatrix(U, R) {
    return U.map((u) => R.map((r) => {
      const d = meanDist(u, r);
      return pathLen(r) < SHORT ? Math.min(d, meanDist(u.slice().reverse(), r)) : d;
    }));
  }

  function tryMerges(U, R) {
    // У пользователя на одну черту меньше: не соединил ли он две соседние черты?
    if (U.length === R.length - 1) {
      for (let i = 0; i < R.length - 1; i++) {
        const R2 = R.slice(0, i).concat([resample(R[i].concat(R[i + 1]))], R.slice(i + 2));
        const A = lsAlign(bboxAlign(U, R2), R2, R2.map((_, k) => k));
        if (A.every((u, k) => meanDist(u, R2[k]) <= T_NEAR * 1.15)) {
          return `Черты ${i + 1} и ${i + 2} пишутся отдельно, с отрывом, а у тебя они слились в одну.`;
        }
      }
    }
    // У пользователя на одну черту больше: не разбил ли он одну черту на две?
    if (U.length === R.length + 1) {
      for (let i = 0; i < U.length - 1; i++) {
        const U2 = U.slice(0, i).concat([resample(U[i].concat(U[i + 1]))], U.slice(i + 2));
        const A = lsAlign(bboxAlign(U2, R), R, R.map((_, k) => k));
        if (A.every((u, k) => meanDist(u, R[k]) <= T_NEAR * 1.15)) {
          return `Черта ${i + 1} пишется одним движением, без отрыва, а у тебя она из двух частей.`;
        }
      }
    }
    return null;
  }

  // Общая удалённость рисунка от знака при прямом порядке черт (для поиска «похоже на другой знак»).
  function charScore(U0, R) {
    const A = lsAlign(bboxAlign(U0, R), R, R.map((_, k) => k));
    let sd = 0, mm = 0, allOk = true;
    A.forEach((u, k) => {
      const r = R[k];
      let d = meanDist(u, r), m = maxDist(u, r);
      if (pathLen(r) < SHORT) {
        const rv = u.slice().reverse();
        d = Math.min(d, meanDist(rv, r)); m = Math.min(m, maxDist(rv, r));
      }
      sd += d; mm = Math.max(mm, m);
      if (d > T_NEAR || m > M_NEAR) allOk = false;
    });
    return { score: sd / R.length + 0.3 * mm, allOk };
  }

  /**
   * user: массив черт, каждая — массив точек [x, y] в поле 109×109.
   * ref: массив черт эталона [{p: [[x,y],...]}].
   */
  function evaluate(user, ref, others) {
    const R = ref.map((s) => s.p);
    const raw = user.filter((s) => s.length > 0);
    const res = { pass: false, grade: "fail", expected: R.length, got: raw.length, strokes: [], messages: [], aligned: [] };
    if (!raw.length) { res.messages.push("Сначала нарисуй знак."); return res; }
    const U0 = raw.map((s) => resample(s));
    const bu = bbox(U0);
    if (Math.max(bu.w, bu.h) < 3) { res.messages.push("Знак получился слишком маленьким. Рисуй крупно, на всю клетку."); return res; }

    if (U0.length !== R.length) {
      res.aligned = bboxAlign(U0, R);
      const merge = tryMerges(U0, R);
      res.messages.push(`В этом знаке ${cherta(R.length)}, а у тебя ${U0.length}.`);
      if (merge) res.messages.push(merge);
      else res.messages.push("Посмотри порядок черт ещё раз и попробуй снова.");
      res.strokes = res.aligned.map(() => ({ status: "bad" }));
      return res;
    }

    const U1 = bboxAlign(U0, R);
    const n = R.length;
    const C = costMatrix(U1, R);
    const ident = [...Array(n).keys()];
    const costOf = (perm) => perm.reduce((s, j, i) => s + C[i][j], 0);
    let best = ident, bestCost = costOf(ident);
    const identCost = bestCost;
    if (n > 1 && n <= 7) {
      for (const p of permutations(n)) {
        const c = costOf(p);
        if (c < bestCost) { best = p; bestCost = c; }
      }
    }
    const orderWrong = best !== ident && identCost - bestCost > Math.max(4 * n, 0.25 * identCost);
    const perm = orderWrong ? best : ident;
    const U = lsAlign(U1, R, perm);
    res.aligned = U;

    res.strokes = U.map((u, i) => Object.assign({ ref: perm[i], f: features(u, R[perm[i]]), refLen: pathLen(R[perm[i]]) }, judgeStroke(u, R[perm[i]], perm[i])));

    if (orderWrong) {
      const drawnOrder = [];
      perm.forEach((j, i) => { drawnOrder[i] = j + 1; });
      res.messages.push(`Порядок черт другой. Ты рисовала черты в порядке ${drawnOrder.join(" → ")}, а правильно ${ident.map((i) => i + 1).join(" → ")}.`);
    }
    for (const s of res.strokes) if (s.msg && s.status === "bad") res.messages.push(s.msg);
    const allOk = res.strokes.every((s) => s.status !== "bad");
    if (allOk && !orderWrong && others) {
      const own = charScore(U0, R).score;
      let bestCh = null, bestSc = Infinity;
      for (const ch in others) {
        const O = others[ch].map((s) => s.p);
        if (O.length !== n || O === R || others[ch] === ref) continue;
        const cs = charScore(U0, O);
        if (cs.allOk && cs.score < bestSc) { bestSc = cs.score; bestCh = ch; }
      }
      if (bestCh && bestSc < own * 0.85) {
        res.confusedWith = bestCh;
        res.messages.push(`Рисунок больше похож на «${bestCh}». Сравни свой знак с розовым образцом.`);
        return res;
      }
    }
    if (allOk && !orderWrong) {
      res.pass = true;
      res.grade = res.strokes.every((s) => s.status === "good") ? "excellent" : "good";
      for (const s of res.strokes) if (s.msg) res.messages.push(s.msg);
    }
    return res;
  }

  return { evaluate, resample, pathLen, cherta, features, setLenient };
})();
if (typeof module !== "undefined") module.exports = Recog;
