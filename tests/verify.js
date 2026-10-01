// Regression check of the solver embedded in index.html against Appendix A.4.1 (UPM-Sat 1).
// Usage: node tests/verify.js
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const src = html.split('// ==== CORE BEGIN')[1].split('// ==== CORE END')[0];
const Core = new Function(src + '; return Core;')();

const g = 1.4, n = 1.4, V = 0.13, a = 335, tp = 75, pinit = 100e3, xi = 1;
// Book values: Table A.3 (tc), Figs. A.5-A.7 (peak dp, read from plots), Table A.4 (sonic start)
const cases = [
  { S: 24e-5, tc: 1.35,   dpBook: 0.03e3, sonicBook: null },
  { S: 24e-6, tc: 13.53,  dpBook: 3.05e3, sonicBook: 145 },
  { S: 24e-7, tc: 135.28, dpBook: 54e3,   sonicBook: 70 }
];
let fail = 0;
const rc = Core.rcrit(g);
console.log(`r_cr = ${rc.toFixed(4)} (book: 0.528)`);
if (Math.abs(rc - 0.528) > 1e-3) fail++;
cases.forEach((c, k) => {
  const tc = Core.ventTime(V, c.S, a, g, xi);
  const out = { case: k + 1, S: c.S, tc: +tc.toFixed(2), K: +(tc / tp).toFixed(4) };
  for (const model of ['comp', 'incomp']) {
    const run = Core.simulate({ model, n, g, tc, peFun: Core.gauss(tp), tEnd: 3 * tp, N: 4000 });
    let dm = -Infinity, tm = 0, son = null;
    for (let i = 0; i < run.t.length; i++) {
      const p0 = Math.pow(run.rho[i], n), d = p0 - run.pe[i];
      if (d > dm) { dm = d; tm = run.t[i]; }
      if (son === null && d > 0 && run.pe[i] / p0 <= rc) son = run.t[i];
    }
    out[`dpmax_${model}[kPa]`] = +(dm * pinit / 1e3).toFixed(4);
    out[`t_${model}[s]`] = +tm.toFixed(1);
    out[`sonic_${model}[s]`] = son === null ? '-' : +son.toFixed(1);
    if (model === 'comp') {
      if (Math.abs(tc - c.tc) > 0.01) fail++;
      if (Math.abs(dm * pinit - c.dpBook) / c.dpBook > 0.15) fail++;
      if ((c.sonicBook === null) !== (son === null) || (son !== null && Math.abs(son - c.sonicBook) > 5)) fail++;
    }
  }
  out['book dp[kPa]'] = c.dpBook / 1e3;
  out['book sonic[s]'] = c.sonicBook ?? '-';
  console.log(out);
});
console.log(fail ? `FAILED (${fail} checks)` : 'All checks passed');
process.exit(fail ? 1 : 0);
