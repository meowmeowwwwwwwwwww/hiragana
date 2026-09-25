/* StreamLine: сглаживание линии. Кисть «на поводке» тянется за пальцем и сглаживает дрожание. */
const Stabilizer = (() => {
  // R — длина поводка (в единицах клетки 109×109), a — плавность догона, passes — доп. сглаживание после отрыва
  const LEVELS = [
    { R: 0, a: 1, passes: 0 },
    { R: 1.6, a: 0.6, passes: 1 },
    { R: 3.0, a: 0.42, passes: 2 },
    { R: 4.8, a: 0.3, passes: 3 }
  ];
  function create(level) {
    const P = LEVELS[Math.max(0, Math.min(3, level | 0))];
    let brush = null, last = null;
    return {
      start(p) { brush = [p[0], p[1]]; last = [p[0], p[1]]; return [brush[0], brush[1]]; },
      add(p) {
        last = [p[0], p[1]];
        if (!P.R) { brush = [p[0], p[1]]; return [p[0], p[1]]; }
        const dx = p[0] - brush[0], dy = p[1] - brush[1], d = Math.hypot(dx, dy);
        if (d <= P.R) return null;
        const k = ((d - P.R) / d) * P.a;
        brush = [brush[0] + dx * k, brush[1] + dy * k];
        return [brush[0], brush[1]];
      },
      // Догон: линия дотягивается до места, где палец оторвался.
      end() {
        if (!brush || !last || !P.R) return [];
        const d = Math.hypot(last[0] - brush[0], last[1] - brush[1]);
        const n = Math.ceil(d / 0.8), out = [];
        for (let i = 1; i <= n; i++) {
          const t = i / n, e = 1 - (1 - t) * (1 - t);
          out.push([brush[0] + (last[0] - brush[0]) * e, brush[1] + (last[1] - brush[1]) * e]);
        }
        return out;
      },
      finish(pts) {
        let q = pts;
        for (let s = 0; s < P.passes && q.length > 2; s++) {
          const r = [q[0]];
          for (let i = 1; i < q.length - 1; i++) r.push([(q[i - 1][0] + 2 * q[i][0] + q[i + 1][0]) / 4, (q[i - 1][1] + 2 * q[i][1] + q[i + 1][1]) / 4]);
          r.push(q[q.length - 1]);
          q = r;
        }
        return q;
      }
    };
  }
  // Прогнать готовую черту через стабилизатор (для проверок).
  function apply(raw, level) {
    const st = create(level);
    const out = [st.start(raw[0])];
    for (let i = 1; i < raw.length; i++) {
      const b = st.add(raw[i]);
      if (b) { const l = out[out.length - 1]; if (Math.hypot(b[0] - l[0], b[1] - l[1]) > 0.35) out.push(b); }
    }
    out.push(...st.end());
    return st.finish(out);
  }
  return { create, apply, LEVELS };
})();
if (typeof module !== "undefined") module.exports = Stabilizer;
