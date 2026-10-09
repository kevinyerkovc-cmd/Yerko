/* =====================================================================
   Casa Yerko 250 m² — modelo único del proyecto
   Geometría, generadores de planos 2D, fachadas y axonometría.
   Funciona en el navegador (global PROY) y en Node (module.exports).
   Todas las medidas en metros, sobre ejes de muro.
   ===================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.PROY = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  /* ---------------------------------------------------------------- DATOS */
  var ALT = { pb: 2.70, pa: 2.60, losa: 0.20, parapeto: 0.80, baranda: 1.05 };
  var NIV = { pb: 0.00, entrepiso: 2.70, pa: 2.90, cubierta: 5.50, parapeto: 6.30 };

  var PB = {
    id: "pb", name: "Planta baja", bbox: [0, 0, 11, 12], h: ALT.pb, base: NIV.pb,
    mass: [[-0.1, -0.1], [11.1, -0.1], [11.1, 12.1], [-0.1, 12.1]],
    rooms: [
      { n: "Garaje 2 autos", r: [0, 0, 5.6, 5], k: "gar" },
      { n: "Hall · Escalera", r: [5.6, 0, 8.2, 5], k: "circ" },
      { n: "Tienda", r: [8.2, 0, 11, 5], k: "com" },
      { n: "Sala – Comedor", r: [0, 5, 6.2, 12], k: "soc" },
      { n: "Pasillo", r: [6.2, 5, 7.6, 8.4], k: "circ" },
      { n: "Baño 1", r: [7.6, 5, 9.3, 6.9], k: "wet" },
      { n: "Baño 2 servicio", r: [9.3, 5, 11, 6.9], k: "wet" },
      { n: "Lavandería", r: [7.6, 6.9, 11, 8.4], k: "serv" },
      { n: "Cocina", r: [6.2, 8.4, 11, 12], k: "soc" }
    ],
    ops: [
      { t: "g", ax: "h", c: 0, a: 0.7, b: 5.1, ext: 1 },
      { t: "d", ax: "h", c: 0, a: 6.5, b: 7.5, f: 1, ext: 1 },
      { t: "w", ax: "h", c: 0, a: 8.5, b: 9.6, sl: 0.6, hh: 1.9, ext: 1 },
      { t: "d", ax: "h", c: 0, a: 9.9, b: 10.8, f: 1, ext: 1 },
      { t: "w", ax: "h", c: 12, a: 1.2, b: 3.6, sl: 0.05, hh: 2.3, ext: 1 },
      { t: "w", ax: "h", c: 12, a: 4.4, b: 5.8, ext: 1 },
      { t: "w", ax: "h", c: 12, a: 7.2, b: 9.0, ext: 1 },
      { t: "d", ax: "h", c: 12, a: 9.6, b: 10.5, f: -1, ext: 1 },
      { t: "w", ax: "v", c: 0, a: 6.5, b: 8.0, ext: 1 },
      { t: "w", ax: "v", c: 11, a: 2.0, b: 3.4, ext: 1 },
      { t: "w", ax: "v", c: 11, a: 5.6, b: 6.3, sl: 1.6, hh: 0.7, ext: 1 },
      { t: "w", ax: "v", c: 11, a: 7.2, b: 8.1, sl: 1.6, hh: 0.7, ext: 1 },
      { t: "d", ax: "v", c: 5.6, a: 1.0, b: 1.9, f: 1 },
      { t: "d", ax: "v", c: 8.2, a: 0.9, b: 1.8, f: 1 },
      { t: "d", ax: "h", c: 5, a: 6.4, b: 7.4, f: 1 },
      { t: "d", ax: "v", c: 6.2, a: 5.4, b: 6.3, f: -1 },
      { t: "d", ax: "v", c: 7.6, a: 5.3, b: 6.0, f: 1 },
      { t: "d", ax: "v", c: 7.6, a: 7.4, b: 8.2, f: 1 },
      { t: "d", ax: "h", c: 6.9, a: 9.8, b: 10.6, f: -1 },
      { t: "d", ax: "h", c: 8.4, a: 6.4, b: 7.4, f: 1 },
      { t: "o", ax: "v", c: 6.2, a: 9.2, b: 10.6 }
    ],
    furn: [
      { k: "car", r: [0.6, 0.6, 2.0, 4.3] }, { k: "car", r: [3.0, 0.6, 2.0, 4.3] },
      { k: "stairU", r: [5.85, 0.9, 2.1, 3.6] },
      { k: "counter", r: [8.4, 3.8, 2.4, 0.6] }, { k: "counter", r: [10.3, 0.6, 0.5, 2.6] },
      { k: "sofa", r: [0.45, 9.6, 2.6, 0.9] }, { k: "rect", r: [1.3, 8.4, 1.1, 0.6] },
      { k: "table", r: [3.2, 5.5, 1.1, 2.2] },
      { k: "counter", r: [10.2, 8.7, 0.6, 3.0] }, { k: "counter", r: [6.9, 11.2, 3.2, 0.6] },
      { k: "rect", r: [7.0, 9.3, 1.8, 0.9] },
      { k: "wc", r: [8.85, 5.25, 0.42, 0.62] }, { k: "sink", r: [7.8, 5.2, 0.52, 0.42] }, { k: "shower", r: [7.75, 5.95, 0.85, 0.8] },
      { k: "wc", r: [10.45, 5.25, 0.42, 0.62] }, { k: "sink", r: [9.5, 5.2, 0.52, 0.42] }, { k: "shower", r: [9.45, 5.95, 0.85, 0.8] },
      { k: "rect", r: [7.8, 7.15, 0.6, 0.6] }, { k: "rect", r: [8.5, 7.15, 0.6, 0.6] }, { k: "counter", r: [9.3, 7.1, 1.5, 0.6] }
    ]
  };

  var PA = {
    id: "pa", name: "Planta alta", bbox: [0, 1.3, 11, 12], h: ALT.pa, base: NIV.pa,
    mass: [[-0.1, 1.2], [11.1, 1.2], [11.1, 10.4], [6.3, 10.4], [6.3, 12.1], [-0.1, 12.1]],
    parapets: [[10.9, 10.4, 0.2, 1.7], [6.3, 11.9, 4.8, 0.2]],
    balcony: [-0.1, -0.1, 11.2, 1.3],
    rooms: [
      { n: "Dormitorio 1", r: [0, 1.3, 5, 4.3], k: "dor" },
      { n: "Hall · Escalera", r: [5, 1.3, 8.2, 5], k: "circ" },
      { n: "Estar familiar", r: [8.2, 1.3, 11, 5], k: "soc" },
      { n: "Dormitorio 2", r: [0, 4.3, 5, 7.3], k: "dor" },
      { n: "Pasillo", r: [5, 5, 6.2, 12], k: "circ" },
      { n: "Baño 4 suite", r: [6.2, 5, 8.2, 7], k: "wet" },
      { n: "Vestidor", r: [8.2, 5, 11, 7], k: "serv" },
      { n: "Dormitorio 3", r: [0, 7.3, 5, 10.3], k: "dor" },
      { n: "Dorm. 4 · Suite", r: [6.2, 7, 11, 10.3], k: "dor" },
      { n: "Clóset", r: [0, 10.3, 1.8, 12], k: "serv" },
      { n: "Baño 3", r: [1.8, 10.3, 5, 12], k: "wet" },
      { n: "Terraza", r: [6.2, 10.3, 11, 12], k: "open" }
    ],
    ops: [
      { t: "d", ax: "h", c: 1.3, a: 0.6, b: 1.5, f: 1, ext: 1 },
      { t: "w", ax: "h", c: 1.3, a: 2.4, b: 4.2, ext: 1 },
      { t: "w", ax: "h", c: 1.3, a: 6.2, b: 7.2, ext: 1 },
      { t: "d", ax: "h", c: 1.3, a: 9.2, b: 10.2, f: 1, ext: 1 },
      { t: "w", ax: "v", c: 0, a: 5.3, b: 7.0, ext: 1 },
      { t: "w", ax: "v", c: 0, a: 8.3, b: 10.0, ext: 1 },
      { t: "w", ax: "h", c: 12, a: 2.6, b: 3.6, sl: 1.4, hh: 0.9, ext: 1 },
      { t: "w", ax: "v", c: 11, a: 2.4, b: 3.9, ext: 1 },
      { t: "w", ax: "v", c: 11, a: 5.6, b: 6.4, sl: 1.6, hh: 0.7, ext: 1 },
      { t: "w", ax: "v", c: 11, a: 8.0, b: 9.8, ext: 1 },
      { t: "w", ax: "h", c: 10.3, a: 7.0, b: 8.6, sl: 0.05, hh: 2.2, ext: 1 },
      { t: "d", ax: "v", c: 5, a: 2.0, b: 2.9, f: -1 },
      { t: "d", ax: "v", c: 8.2, a: 2.0, b: 2.9, f: 1 },
      { t: "d", ax: "h", c: 5, a: 5.2, b: 6.1, f: 1 },
      { t: "d", ax: "v", c: 5, a: 5.5, b: 6.4, f: -1 },
      { t: "d", ax: "v", c: 5, a: 8.2, b: 9.1, f: -1 },
      { t: "d", ax: "v", c: 5, a: 10.7, b: 11.6, f: -1 },
      { t: "d", ax: "h", c: 10.3, a: 0.4, b: 1.2, f: 1 },
      { t: "d", ax: "v", c: 6.2, a: 5.4, b: 6.3, f: 1 },
      { t: "d", ax: "v", c: 6.2, a: 7.5, b: 8.4, f: 1 },
      { t: "d", ax: "h", c: 7, a: 6.6, b: 7.4, f: -1 },
      { t: "d", ax: "h", c: 7, a: 9.0, b: 9.9, f: -1 }
    ],
    furn: [
      { k: "bed", r: [1.7, 1.5, 1.6, 2.0] }, { k: "counter", r: [0.2, 1.6, 0.6, 2.0] },
      { k: "bed", r: [1.7, 4.55, 1.6, 2.0] }, { k: "counter", r: [0.2, 4.65, 0.6, 2.0] },
      { k: "bed", r: [1.7, 7.55, 1.6, 2.0] }, { k: "counter", r: [0.2, 7.65, 0.6, 2.0] },
      { k: "bed", r: [8.0, 7.25, 1.9, 2.1] }, { k: "counter", r: [6.45, 7.3, 0.6, 2.0] },
      { k: "stairU", r: [5.9, 1.6, 2.0, 3.2] },
      { k: "sofa", r: [8.6, 4.0, 2.0, 0.85] },
      { k: "counter", r: [8.45, 5.2, 2.3, 0.6] }, { k: "counter", r: [8.45, 6.2, 2.3, 0.6] },
      { k: "wc", r: [6.45, 5.25, 0.42, 0.62] }, { k: "sink", r: [7.2, 5.2, 0.52, 0.42] }, { k: "shower", r: [7.25, 5.95, 0.85, 0.85] },
      { k: "wc", r: [2.0, 10.5, 0.42, 0.62] }, { k: "sink", r: [2.8, 10.45, 0.52, 0.42] }, { k: "shower", r: [3.95, 10.5, 0.9, 0.9] },
      { k: "ellipse", r: [7.9, 10.7, 1.4, 1.0] }
    ]
  };

  /* terreno 12 × 25; la casa arranca en x = 0,50  y = 3,00 del lote */
  var LOT = { w: 12, d: 25, hx: 0.5, hy: 3.0, retiroFrente: 3.0, retiroLat: 0.5, patio: 10.0 };
  var CHU = { x0: 7.0, x1: 10.5, y0: 17.0, y1: 20.4 };   /* churrasquera en coords de planta */

  /* ------------------------------------------------------------ GEOMETRÍA */
  function f2(v) { return (Math.round(v * 100) / 100).toFixed(2); }
  function area(r) { return (r[2] - r[0]) * (r[3] - r[1]); }
  function near(a, b) { return Math.abs(a - b) < 0.005; }

  /* Segmentos de muro de un nivel, clasificados.
     Devuelve [{ax, c, a, b, kind:"ext"|"int"|"par", th, rooms:[..]}]            */
  function wallSegments(L) {
    var out = [];
    ["v", "h"].forEach(function (ax) {
      var lines = {};
      L.rooms.forEach(function (rm) {
        var q = rm.r;
        var c1 = ax === "v" ? q[0] : q[1], c2 = ax === "v" ? q[2] : q[3];
        var a = ax === "v" ? q[1] : q[0], b = ax === "v" ? q[3] : q[2];
        [c1, c2].forEach(function (c) {
          var k = f2(c);
          (lines[k] = lines[k] || { c: c, pts: [], seg: [] });
          lines[k].pts.push(a, b);
        });
      });
      Object.keys(lines).forEach(function (k) {
        var ln = lines[k], c = ln.c;
        var pts = ln.pts.slice().sort(function (p, q) { return p - q; });
        var uniqPts = [];
        pts.forEach(function (p) { if (!uniqPts.length || p - uniqPts[uniqPts.length - 1] > 0.005) uniqPts.push(p); });
        for (var i = 0; i < uniqPts.length - 1; i++) {
          var a = uniqPts[i], b = uniqPts[i + 1], m = (a + b) / 2;
          var lo = null, hi = null;    /* lo = lado menor (x<c o y<c), hi = lado mayor */
          L.rooms.forEach(function (rm) {
            var q = rm.r;
            var e1 = ax === "v" ? q[0] : q[1], e2 = ax === "v" ? q[2] : q[3];
            var s1 = ax === "v" ? q[1] : q[0], s2 = ax === "v" ? q[3] : q[2];
            if (m <= s1 + 0.005 || m >= s2 - 0.005) return;
            if (near(e2, c)) lo = rm;
            if (near(e1, c)) hi = rm;
          });
          if (!lo && !hi) continue;
          var both = lo && hi;
          var kind, th, rooms = [];
          if (both && lo.k !== "open" && hi.k !== "open") {
            kind = "int";
            th = (lo.k === "wet" || hi.k === "wet" || lo.k === "serv" || hi.k === "serv") ? 0.12 : 0.18;
            rooms = [lo.n, hi.n];
          } else {
            var solo = both ? (lo.k === "open" ? hi : lo) : (lo || hi);
            if (solo.k === "open") { kind = "par"; th = 0.18; }   /* antepecho de terraza */
            else { kind = "ext"; th = 0.18; }
            rooms = [solo.n];
          }
          var prev = out[out.length - 1];
          if (prev && prev.ax === ax && near(prev.c, c) && near(prev.b, a) && prev.kind === kind && prev.th === th) prev.b = b;
          else out.push({ ax: ax, c: c, a: a, b: b, kind: kind, th: th, rooms: rooms });
        }
      });
    });
    return out;
  }

  /* vanos que caen sobre un segmento dado */
  function opsOn(L, seg) {
    return L.ops.filter(function (o) {
      return o.ax === seg.ax && near(o.c, seg.c) && o.b > seg.a + 0.01 && o.a < seg.b - 0.01;
    }).sort(function (p, q) { return p.a - q.a; });
  }
  function opSill(o) { return o.sl !== undefined ? o.sl : (o.t === "w" ? 1.0 : 0.04); }
  function opH(o) { return o.hh !== undefined ? o.hh : (o.t === "w" ? 1.4 : (o.t === "g" ? 2.30 : 2.15)); }
  function opArea(o) { return (o.b - o.a) * opH(o); }

  /* ------------------------------------------------------------- SVG BASE */
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function R(x, y, w, h, cls, rx) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" class="' + cls + '"' + (rx ? ' rx="' + rx + '"' : "") + "/>"; }
  function LN(x1, y1, x2, y2, cls) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="' + cls + '"/>'; }
  function TX(x, y, t, cls, fs, rot) {
    return '<text x="' + x + '" y="' + y + '" class="' + cls + '"' + (fs ? ' font-size="' + fs + '"' : "") +
      (rot ? ' transform="rotate(' + rot + " " + x + " " + y + ')"' : "") + ">" + esc(t) + "</text>";
  }
  function POLY(pts, cls, attr) {
    return '<polygon points="' + pts.map(function (p) { return p[0] + "," + p[1]; }).join(" ") + '"' +
      (cls ? ' class="' + cls + '"' : "") + (attr || "") + "/>";
  }

  /* --------------------------------------------------------------- VANOS */
  var OPW = 0.30;
  function opSVG(o) {
    var s = "", L = o.b - o.a, i, xx, sw;
    s += (o.ax === "v") ? R(o.c - OPW / 2, o.a, OPW, L, "gap") : R(o.a, o.c - OPW / 2, L, OPW, "gap");
    if (o.t === "w") {
      if (o.ax === "v") {
        s += R(o.c - 0.075, o.a, 0.15, L, "op-f");
        s += LN(o.c - 0.075, o.a, o.c - 0.075, o.b, "op") + LN(o.c + 0.075, o.a, o.c + 0.075, o.b, "op");
        s += LN(o.c, o.a, o.c, o.b, "f-line");
      } else {
        s += R(o.a, o.c - 0.075, L, 0.15, "op-f");
        s += LN(o.a, o.c - 0.075, o.b, o.c - 0.075, "op") + LN(o.a, o.c + 0.075, o.b, o.c + 0.075, "op");
        s += LN(o.a, o.c, o.b, o.c, "f-line");
      }
    } else if (o.t === "g") {
      s += R(o.a, o.c - 0.06, L, 0.12, "op-f");
      s += LN(o.a, o.c - 0.06, o.b, o.c - 0.06, "op") + LN(o.a, o.c + 0.06, o.b, o.c + 0.06, "op");
      for (i = 1; i < 5; i++) { xx = o.a + L * i / 5; s += LN(xx, o.c - 0.06, xx, o.c + 0.06, "f-line"); }
    } else if (o.t === "d") {
      var fl = o.f || 1;
      if (o.ax === "v") {
        var dx = fl * L;
        s += LN(o.c, o.a, o.c + dx, o.a, "leaf");
        sw = ((dx > 0) === true) ? 1 : 0;
        s += '<path class="arc" d="M ' + (o.c + dx) + " " + o.a + " A " + L + " " + L + " 0 0 " + sw + " " + o.c + " " + (o.a + L) + '"/>';
      } else {
        var dy = fl * L;
        s += LN(o.a, o.c, o.a, o.c + dy, "leaf");
        sw = ((dy > 0) === true) ? 0 : 1;
        s += '<path class="arc" d="M ' + o.a + " " + (o.c + dy) + " A " + L + " " + L + " 0 0 " + sw + " " + (o.a + L) + " " + o.c + '"/>';
      }
    }
    return s;
  }

  /* ---------------------------------------------------------- MOBILIARIO */
  function furnSVG(fu) {
    var x = fu.r[0], y = fu.r[1], w = fu.r[2], h = fu.r[3], s = "", i;
    switch (fu.k) {
      case "car":
        s += R(x, y, w, h, "f-car", 0.35) + R(x + 0.22, y + 0.95, w - 0.44, h - 2.5, "f-line", 0.12); break;
      case "bed":
        s += R(x, y, w, h, "f-obj", 0.06) + R(x + 0.08, y + 0.08, w - 0.16, 0.42, "f-soft", 0.05) + LN(x, y + 0.56, x + w, y + 0.56, "f-line"); break;
      case "sofa":
        s += R(x, y, w, h, "f-obj", 0.1) + R(x + 0.08, y + 0.08, w - 0.16, h * 0.42, "f-soft", 0.06); break;
      case "table":
        s += R(x, y, w, h, "f-obj", 0.06);
        for (i = 0; i < 3; i++) {
          var cy = y + h * (i + 0.5) / 3 - 0.19;
          s += R(x - 0.46, cy, 0.38, 0.38, "f-line", 0.05) + R(x + w + 0.08, cy, 0.38, 0.38, "f-line", 0.05);
        } break;
      case "counter": s += R(x, y, w, h, "f-obj", 0.03); break;
      case "rect": s += R(x, y, w, h, "f-obj", 0.04); break;
      case "ellipse": s += '<ellipse cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" rx="' + (w / 2) + '" ry="' + (h / 2) + '" class="f-obj"/>'; break;
      case "wc":
        s += R(x, y, w, 0.17, "f-obj", 0.04) + '<ellipse cx="' + (x + w / 2) + '" cy="' + (y + 0.17 + (h - 0.17) / 2) + '" rx="' + (w / 2 - 0.02) + '" ry="' + ((h - 0.17) / 2) + '" class="f-obj"/>'; break;
      case "sink":
        s += R(x, y, w, h, "f-obj", 0.06) + '<ellipse cx="' + (x + w / 2) + '" cy="' + (y + h / 2 + 0.03) + '" rx="' + (w / 2 - 0.09) + '" ry="' + (h / 2 - 0.09) + '" class="f-line"/>'; break;
      case "shower":
        s += R(x, y, w, h, "f-obj", 0.03) + LN(x, y, x + w, y + h, "f-line") + LN(x + w, y, x, y + h, "f-line"); break;
      case "stairU":
        var n = 9, half = (w - 0.14) / 2, step = (h - 1.1) / (n - 1);
        for (i = 0; i < n; i++) {
          var yy = y + i * step;
          s += LN(x, yy, x + half, yy, "f-line") + LN(x + half + 0.14, yy, x + w, yy, "f-line");
        }
        s += R(x, y, half, h, "f-soft", 0.02) + R(x + half + 0.14, y, half, h, "f-soft", 0.02);
        s += LN(x + half / 2, y + h - 0.35, x + half / 2, y + 0.15, "f-line");
        s += '<path class="f-line" d="M ' + (x + half / 2 - 0.12) + " " + (y + 0.38) + " L " + (x + half / 2) + " " + (y + 0.1) + " L " + (x + half / 2 + 0.12) + " " + (y + 0.38) + '"/>';
        s += TX(x + w / 2, y + h + 0.3, "SUBE 18 × 0,175", "lbl-s", 0.2); break;
    }
    return s;
  }

  /* --------------------------------------------------------------- COTAS */
  function chain(coords, fixed, axis, tick) {
    var s = "", i, a, b;
    coords = coords.slice().sort(function (p, q) { return p - q; });
    if (axis === "h") {
      s += LN(coords[0], fixed, coords[coords.length - 1], fixed, "dim");
      for (i = 0; i < coords.length; i++) s += LN(coords[i], fixed - tick, coords[i], fixed + tick, "dim");
      for (i = 0; i < coords.length - 1; i++) {
        a = coords[i]; b = coords[i + 1];
        if (b - a < 0.55) continue;
        s += TX((a + b) / 2, fixed - 0.22, f2(b - a), "dim-t");
      }
    } else {
      s += LN(fixed, coords[0], fixed, coords[coords.length - 1], "dim");
      for (i = 0; i < coords.length; i++) s += LN(fixed - tick, coords[i], fixed + tick, coords[i], "dim");
      for (i = 0; i < coords.length - 1; i++) {
        a = coords[i]; b = coords[i + 1];
        if (b - a < 0.55) continue;
        s += TX(fixed - 0.22, (a + b) / 2, f2(b - a), "dim-t", null, -90);
      }
    }
    return s;
  }
  function uniq(arr) {
    var out = [], seen = {};
    arr.forEach(function (v) { var k = f2(v); if (!seen[k]) { seen[k] = 1; out.push(Math.round(v * 100) / 100); } });
    return out;
  }

  /* -------------------------------------------------------- CUERPO PLANTA */
  function planBody(L, o) {
    o = o || {};
    var s = "";
    s += POLY(L.mass, "muro");
    if (L.parapets) L.parapets.forEach(function (p) { s += R(p[0], p[1], p[2], p[3], "muro"); });
    L.rooms.forEach(function (rm) {
      var q = rm.r;
      s += R(q[0] + 0.1, q[1] + 0.1, q[2] - q[0] - 0.2, q[3] - q[1] - 0.2, rm.k === "open" ? "piso-h" : "piso");
    });
    if (L.balcony) {
      var bl = L.balcony;
      s += R(bl[0], bl[1], bl[2], bl[3], "piso-h") + R(bl[0], bl[1], bl[2], bl[3], "thin");
      s += R(bl[0] + 0.06, bl[1] + 0.06, bl[2] - 0.12, 0.1, "muro");
    }
    if (o.ops !== false) L.ops.forEach(function (op) { s += opSVG(op); });
    if (o.furn !== false) L.furn.forEach(function (fu) { s += furnSVG(fu); });
    s += POLY(L.mass, "thin");
    L.rooms.forEach(function (rm) {
      var q = rm.r, w = q[2] - q[0], h = q[3] - q[1], cx = (q[0] + q[2]) / 2, cy = (q[1] + q[3]) / 2;
      var narrow = (h > 2 * w && w < 2.2), mn = Math.min(w, h);
      var fs = mn < 1.5 ? 0.21 : (mn < 2.6 ? 0.26 : 0.31);
      /* que el rótulo nunca sobresalga del ambiente */
      fs = Math.min(fs, (narrow ? h : w) * 0.92 / Math.max(6, rm.n.length) / 0.52);
      if (o.labels === "min" && mn < 2.2) return;
      var rot = narrow ? -90 : 0;
      s += TX(cx, cy - (o.labels === "min" ? 0 : fs * 0.62), rm.n, "lbl", fs, rot);
      if (o.labels !== "min") s += TX(cx, cy + fs * 0.75, f2(area(q)) + " m²", "lbl-s", fs * 0.72, rot);
    });
    if (L.balcony && o.labels !== "min") {
      s += TX(5.5, 0.5, "Balcón", "lbl", 0.28) + TX(5.5, 0.88, "14,30 m² descubierto", "lbl-s", 0.21);
    }
    return s;
  }

  function planSVG(L, o) {
    o = o || {};
    var bb = L.bbox, m = 3.1, X0 = bb[0], Y0 = bb[1], X1 = bb[2], Y1 = bb[3];
    var top = L.balcony ? -0.4 : 0;
    var vb = (X0 - m) + " " + (Y0 - m + top) + " " + ((X1 - X0) + 2 * m) + " " + ((Y1 - Y0) + 2 * m - top);
    var s = '<svg class="plan" viewBox="' + vb + '" role="img" aria-label="' + esc(L.name) + ' acotada">';
    s += planBody(L, o);
    if (o.dims !== false) {
      var xs = [X0, X1], ys = [Y0, Y1];
      L.rooms.forEach(function (rm) { xs.push(rm.r[0], rm.r[2]); ys.push(rm.r[1], rm.r[3]); });
      xs = uniq(xs).filter(function (v) { return v >= X0 - 0.001 && v <= X1 + 0.001; });
      ys = uniq(ys).filter(function (v) { return v >= Y0 - 0.001 && v <= Y1 + 0.001; });
      s += chain(xs, Y1 + 1.05, "h", 0.1) + chain([X0, X1], Y1 + 2.0, "h", 0.14);
      s += chain(ys, X0 - 1.05, "v", 0.1) + chain([Y0, Y1], X0 - 2.0, "v", 0.14);
      s += TX(X1 - 0.9, Y1 + 2.55, "ESCALA 1:100 · m", "note-t", 0.3);
    }
    s += '<g transform="translate(' + (X1 + 1.5) + "," + (Y0 + (L.balcony ? 0.2 : 0.6)) + ')">' +
      '<path class="muro" d="M 0 -0.75 L 0.3 0.35 L 0 0.1 L -0.3 0.35 Z"/>' + TX(0, 0.85, "N", "lbl", 0.34) + "</g>";
    return s + "</svg>";
  }

  /* --------------------------------------------------------- IMPLANTACIÓN */
  function siteSVG() {
    var W = LOT.w, D = LOT.d, s, i, k;
    s = '<svg class="plan" viewBox="' + (-3) + " " + (-4.6) + " " + (W + 6) + " " + (D + 7.6) + '" role="img" aria-label="Implantación en el terreno">';
    s += R(-3, -2.6, W + 6, 2.6, "street") + TX(W / 2, -1.9, "CALLE", "note-t", 0.46);
    s += LN(-3, -0.9, W + 3, -0.9, "thin") + TX(W / 2 + 3.2, -0.55, "acera 0,90 m", "note-t", 0.3);
    s += R(0, 0, W, D, "grass") + R(0, 0, W, D, "lot");
    s += R(1.2, 0, 4.4, 3.0, "pave") + R(6.9, 0, 1.2, 3.0, "pave") + R(10.3, 0, 1.2, 3.0, "pave");
    s += R(0.5, 15, 11, 2.2, "pave") + R(LOT.hx + CHU.x0, LOT.hy + CHU.y0, CHU.x1 - CHU.x0, CHU.y1 - CHU.y0, "pave");
    s += '<g transform="translate(' + LOT.hx + "," + LOT.hy + ')">' + planBody(PB, { labels: "min", furn: false, dims: false }) + "</g>";
    s += TX(LOT.hx + 5.5, LOT.hy + 6.2, "VIVIENDA · 2 NIVELES", "lbl", 0.4);
    s += TX(LOT.hx + 5.5, LOT.hy + 6.8, "huella 132,00 m² · 249,70 m² cubiertos", "lbl-s", 0.3);
    s += R(7.4, 20.3, 3.4, 0.7, "f-obj", 0.05) + R(9.8, 19.7, 0.8, 0.8, "f-obj", 0.05) + TX(10.2, 20.1, "CH", "lbl-s", 0.26);
    s += '<ellipse cx="9.0" cy="22.2" rx="0.75" ry="0.55" class="f-obj"/>';
    for (i = 0; i < 5; i++) s += LN(7.2, 20.1 + i * 0.84, 11.1, 20.1 + i * 0.84, "thin");
    s += TX(9.1, 24.0, "Churrasquera + pérgola 3,50 × 3,00", "note-t", 0.3);
    s += TX(3.4, 20.0, "Jardín · patio posterior", "lbl", 0.4) + TX(3.4, 20.6, "120,00 m²", "lbl-s", 0.3);
    s += R(1.0, 16.6, 2.6, 0.12, "f-obj") + TX(2.3, 17.2, "tendedero", "note-t", 0.28);
    [[0.9, 5.0], [0.9, 13.0], [11.1, 18.5], [1.2, 23.5], [4.6, 24.2]].forEach(function (p) {
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="0.85" class="grass"/>';
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="0.85" class="thin"/>';
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="0.14" class="muro"/>';
    });
    s += LN(0, 0, 1.0, 0, "muro") + LN(5.8, 0, 6.8, 0, "muro") + LN(8.3, 0, 10.2, 0, "muro") + LN(11.6, 0, 12, 0, "muro");
    s += LN(1.0, 0, 5.8, 0, "op") + LN(6.8, 0, 8.3, 0, "op") + LN(10.2, 0, 11.6, 0, "op");
    s += TX(3.4, 0.55, "portón vehicular 4,80", "note-t", 0.3) + TX(7.6, 1.5, "ingreso", "note-t", 0.3) + TX(10.9, 1.5, "tienda", "note-t", 0.3);
    s += chain([0, 1.2, 5.6, 6.9, 8.1, 10.3, 11.5, 12], -2.85, "h", 0.1) + chain([0, 12], -3.8, "h", 0.15);
    s += chain([0, 3, 15, 25], -1.3, "v", 0.1) + chain([0, 25], -2.25, "v", 0.15);
    s += TX(-1.85, 1.5, "RETIRO 3,00", "dim-t", 0.28, -90) + TX(-1.85, 20.0, "PATIO 10,00", "dim-t", 0.28, -90);
    s += TX(0.25, 9.0, "0,50", "dim-t", 0.24, -90) + TX(11.75, 9.0, "0,50", "dim-t", 0.24, -90);
    s += LN(0, 3, 12, 3, "axis") + LN(0, 15, 12, 15, "axis");
    s += '<g transform="translate(' + (W + 1.6) + ',1.4)"><path class="muro" d="M 0 -0.95 L 0.38 0.45 L 0 0.12 L -0.38 0.45 Z"/>' + TX(0, 1.05, "N", "lbl", 0.42) + "</g>";
    s += '<g transform="translate(' + (W + 0.9) + "," + (D - 1.2) + ')">';
    for (k = 0; k < 5; k++) s += R(0, -k, 0.55, 1, k % 2 ? "piso" : "muro");
    s += R(0, -5, 0.55, 5, "thin") + TX(1.5, -5, "5 m", "note-t", 0.34) + TX(1.3, 0, "0", "note-t", 0.34) + "</g>";
    return s + "</svg>";
  }

  /* ------------------------------------------------------------ FACHADAS */
  var SIDES = {
    N: { t: "Fachada frontal · calle", u: [0, 11], flip: false, ax: "h", pb: 0, pa: 1.3, paU: [0, 11], balc: [-0.1, 11.1], terr: null },
    S: { t: "Fachada posterior · patio", u: [0, 11], flip: true, ax: "h", pb: 12, pa: 12, paU: [0, 11], balc: null, terr: [0, 4.8] },
    E: { t: "Fachada lateral derecha", u: [0, 12], flip: false, ax: "v", pb: 11, pa: 11, paU: [1.3, 12], balc: [-0.1, 1.3], terr: [10.3, 12] },
    W: { t: "Fachada lateral izquierda", u: [0, 12], flip: true, ax: "v", pb: 0, pa: 0, paU: [0, 10.7], balc: [10.7, 12.1], terr: null }
  };
  function elevSVG(key) {
    var S = SIDES[key], U0 = S.u[0], U1 = S.u[1];
    var mu = function (p) { return S.flip ? (U1 - p) : p; };
    var top = NIV.parapeto + 1.0, s = "";
    var vb = (U0 - 1.6) + " " + (-top - 1.2) + " " + ((U1 - U0) + 4.2) + " " + (top + 3.0);
    s = '<svg class="plan" viewBox="' + vb + '" role="img" aria-label="' + esc(S.t) + '">';
    function band(a, b, z0, z1, cls) {
      var x0 = Math.min(mu(a), mu(b)), x1 = Math.max(mu(a), mu(b));
      return R(x0, -z1, x1 - x0, z1 - z0, cls);
    }
    /* planta alta (plano retranqueado donde corresponde) */
    var pa0 = S.paU[0], pa1 = S.paU[1];
    if (S.terr) {
      var t0 = S.terr[0], t1 = S.terr[1];
      if (key === "S") { s += band(t1, pa1, NIV.pa, NIV.cubierta, "el-wall"); s += band(t0, t1, NIV.pa, NIV.pa + 1.1, "el-wall"); }
      else { s += band(pa0, t0, NIV.pa, NIV.cubierta, "el-wall"); s += band(t0, t1, NIV.pa, NIV.pa + 1.1, "el-wall"); }
    } else {
      s += band(pa0, pa1, NIV.pa, NIV.cubierta, "el-wall");
    }
    /* vanos de planta alta */
    PA.ops.forEach(function (o) {
      if (!o.ext || o.ax !== S.ax || !near(o.c, S.pa)) return;
      var z0 = NIV.pa + opSill(o), z1 = z0 + opH(o);
      s += band(o.a, o.b, z0, z1, o.t === "g" ? "el-dark" : "el-glass");
    });
    /* losa de entrepiso y planta baja */
    s += band(U0 - 0.12, U1 + 0.12, NIV.entrepiso, NIV.pa, "el-slab");
    s += band(U0, U1, 0, NIV.entrepiso, "el-wall");
    PB.ops.forEach(function (o) {
      if (!o.ext || o.ax !== S.ax || !near(o.c, S.pb)) return;
      var z0 = opSill(o), z1 = z0 + opH(o);
      s += band(o.a, o.b, z0, z1, o.t === "g" ? "el-dark" : "el-glass");
    });
    /* cubierta y parapeto */
    s += band(U0 - 0.25, U1 + 0.25, NIV.cubierta, NIV.cubierta + 0.22, "el-slab");
    s += band(U0 - 0.25, U1 + 0.25, NIV.cubierta + 0.22, NIV.parapeto, "el-wall");
    if (key === "N" || key === "S") s += band(5.2, 7.4, NIV.parapeto, NIV.parapeto + 0.9, "el-back");
    /* baranda de balcón delante del plano */
    if (S.balc) {
      var b0 = S.balc[0], b1 = S.balc[1];
      s += band(b0, b1, NIV.entrepiso, NIV.pa, "el-slab");
      var x0 = Math.min(mu(b0), mu(b1)), x1 = Math.max(mu(b0), mu(b1));
      s += LN(x0, -(NIV.pa + ALT.baranda), x1, -(NIV.pa + ALT.baranda), "el-rail");
      for (var bx = x0 + 0.12; bx < x1; bx += 0.26) s += LN(bx, -NIV.pa, bx, -(NIV.pa + ALT.baranda), "el-rail");
    }
    /* suelo */
    s += LN(U0 - 1.3, 0, U1 + 1.3, 0, "el-gnd");
    for (var g = U0 - 1.2; g < U1 + 1.3; g += 0.45) s += LN(g, 0, g - 0.3, 0.3, "el-hatch");
    /* cotas de nivel */
    var niveles = [[0, "± 0,00"], [NIV.entrepiso, "+ 2,70"], [NIV.pa, "+ 2,90"], [NIV.cubierta, "+ 5,50"], [NIV.parapeto, "+ 6,30"]];
    niveles.forEach(function (n) {
      s += LN(U1 + 0.3, -n[0], U1 + 1.2, -n[0], "dim");
      s += '<text x="' + (U1 + 1.3) + '" y="' + (-n[0] - 0.12) + '" class="note-t" font-size="0.3">' + esc(n[1]) + "</text>";
    });
    s += chain([0, NIV.entrepiso, NIV.pa, NIV.cubierta, NIV.parapeto].map(function (v) { return -v; }), U0 - 0.75, "v", 0.1);
    s += TX((U0 + U1) / 2, 0.95, S.t.toUpperCase() + " · ESC 1:100", "note-t", 0.36);
    return s + "</svg>";
  }

  /* -------------------------------------------------------- AXONOMETRÍA */
  var PAL = {
    muro: "#e9e5dd", losa: "#d3cec4", madera: "#8a5a33", vidrio: "#2f5566", marco: "#3a4047",
    piso: "#bdb8ad", pasto: "#869a68", calle: "#6d7176", auto1: "#31506a", auto2: "#8d3a30", verde: "#5f7d4a", cerco: "#cfc9bd"
  };
  function shade(hex, f) {
    var n = parseInt(hex.slice(1), 16);
    var r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f);
    return "rgb(" + Math.min(r, 255) + "," + Math.min(g, 255) + "," + Math.min(b, 255) + ")";
  }
  var YF = 22;  /* la calle queda al frente de la vista */
  function axoBoxes() {
    var B = [], TAG = "site";
    function bx(x0, x1, y0, y1, z0, z1, col, tag) {
      B.push({ x0: x0, x1: x1, yp0: YF - y1, yp1: YF - y0, y0: y0, y1: y1, z0: z0, z1: z1, c: col, g: tag || TAG });
    }
    /* terreno y solados */
    bx(-0.5, 11.5, -3.0, 22.0, -0.18, 0, PAL.pasto);
    bx(-0.5, 11.5, -9.0, -3.2, -0.2, -0.02, PAL.calle);
    bx(0.7, 5.1, -3.0, 0.0, 0, 0.04, PAL.piso);
    bx(6.4, 7.6, -3.0, 0.0, 0, 0.04, PAL.piso);
    bx(9.8, 11.0, -3.0, 0.0, 0, 0.04, PAL.piso);
    bx(-0.5, 11.5, 12.0, 14.4, 0, 0.05, PAL.piso);
    bx(CHU.x0 - 0.5, CHU.x1 + 0.1, CHU.y0 - 0.2, CHU.y1, 0, 0.05, PAL.piso);
    /* cercos */
    bx(-0.6, -0.4, -3.0, 22.0, 0, 2.2, PAL.cerco);
    bx(11.4, 11.6, -3.0, 22.0, 0, 2.2, PAL.cerco);
    bx(-0.6, 11.6, 21.8, 22.0, 0, 2.2, PAL.cerco);
    [[-0.6, 0.5], [5.3, 6.3], [7.8, 9.7], [11.1, 11.6]].forEach(function (p) { bx(p[0], p[1], -3.1, -2.9, 0, 1.9, PAL.cerco); });
    bx(0.5, 5.3, -3.06, -2.94, 0, 1.6, PAL.marco);
    bx(6.3, 7.8, -3.06, -2.94, 0, 1.6, PAL.marco);
    /* muros con vanos, por nivel */
    [PB, PA].forEach(function (L) {
      var base = L.base, hh = L.h;
      TAG = L.id;
      wallSegments(L).forEach(function (sg) {
        var top = sg.kind === "par" ? 1.10 : hh;
        var ops = opsOn(L, sg);
        var pos = sg.a, th = 0.20;
        function wall(a, b, z0, z1) {
          if (b - a < 0.02 || z1 - z0 < 0.02) return;
          if (sg.ax === "v") bx(sg.c - th / 2, sg.c + th / 2, a, b, base + z0, base + z1, PAL.muro);
          else bx(a, b, sg.c - th / 2, sg.c + th / 2, base + z0, base + z1, PAL.muro);
        }
        function glass(a, b, z0, z1, col) {
          if (sg.ax === "v") bx(sg.c - 0.12, sg.c + 0.12, a, b, base + z0, base + z1, col);
          else bx(a, b, sg.c - 0.12, sg.c + 0.12, base + z0, base + z1, col);
        }
        ops.forEach(function (o) {
          var a = Math.max(o.a, sg.a), b = Math.min(o.b, sg.b);
          var sl = opSill(o), h = Math.min(opH(o), top - sl);
          wall(pos, a, 0, top);
          if (sl > 0.02) wall(a, b, 0, sl);
          if (sl + h < top - 0.02) wall(a, b, sl + h, top);
          glass(a, b, sl, sl + h, o.t === "g" ? PAL.marco : PAL.vidrio);
          pos = b;
        });
        wall(pos, sg.b, 0, top);
      });
    });
    /* losas */
    TAG = "site";
    bx(-0.1, 11.1, -0.1, 12.1, 2.70, 2.90, PAL.losa, "pb");
    bx(-0.1, 11.2, -0.1, 1.2, 2.70, 2.90, PAL.losa, "pa");     /* balcón */
    bx(-0.1, 11.2, -0.1, 0.0, 2.90, 3.95, PAL.marco, "pa");    /* baranda */
    bx(-0.1, 0.0, -0.1, 1.2, 2.90, 3.95, PAL.marco, "pa");
    bx(11.1, 11.2, -0.1, 1.2, 2.90, 3.95, PAL.marco, "pa");
    bx(-0.25, 11.25, 1.05, 12.25, 5.50, 5.72, PAL.losa, "roof");
    bx(-0.25, 11.25, 1.05, 1.25, 5.72, 6.52, PAL.muro, "roof");
    bx(-0.25, 11.25, 12.05, 12.25, 5.72, 6.52, PAL.muro, "roof");
    bx(-0.25, -0.05, 1.05, 12.25, 5.72, 6.52, PAL.muro, "roof");
    bx(11.05, 11.25, 1.05, 12.25, 5.72, 6.52, PAL.muro, "roof");
    bx(5.2, 7.4, 2.0, 4.0, 6.52, 7.42, PAL.losa, "roof");      /* tanque */
    for (var sp = 0; sp < 5; sp++) bx(1.2 + sp * 1.8, 2.6 + sp * 1.8, 6.0, 8.4, 5.74, 5.88, PAL.marco, "roof");
    /* paño de madera del ingreso */
    bx(5.6, 6.3, -0.16, -0.02, 0, 2.70, PAL.madera, "pb");
    /* autos */
    bx(0.55, 2.55, 0.6, 4.9, 0.05, 1.35, PAL.auto1, "pb");
    bx(0.75, 2.35, 1.5, 3.7, 1.35, 1.62, PAL.marco, "pb");
    bx(3.0, 5.0, 0.6, 4.9, 0.05, 1.35, PAL.auto2, "pb");
    bx(3.2, 4.8, 1.5, 3.7, 1.35, 1.62, PAL.marco, "pb");
    /* churrasquera + pérgola */
    bx(CHU.x0 - 0.3, CHU.x1 - 0.2, CHU.y0 + 0.2, CHU.y0 + 0.9, 0, 0.95, PAL.cerco);
    bx(CHU.x1 - 1.1, CHU.x1 - 0.2, CHU.y0 + 0.2, CHU.y0 + 1.0, 0.95, 1.55, PAL.marco);
    bx(CHU.x1 - 1.0, CHU.x1 - 0.3, CHU.y0 + 0.3, CHU.y0 + 0.9, 1.55, 3.30, PAL.cerco);
    [[CHU.x0 - 0.4, CHU.y0 + 0.1], [CHU.x1, CHU.y0 + 0.1], [CHU.x0 - 0.4, CHU.y1 - 0.1], [CHU.x1, CHU.y1 - 0.1]].forEach(function (p) {
      bx(p[0] - 0.08, p[0] + 0.08, p[1] - 0.08, p[1] + 0.08, 0, 2.45, PAL.madera);
    });
    for (var sl2 = 0; sl2 < 9; sl2++) bx(CHU.x0 - 0.5, CHU.x1 + 0.1, CHU.y0 + sl2 * 0.42, CHU.y0 + 0.1 + sl2 * 0.42, 2.45, 2.57, PAL.madera);
    bx(CHU.x0 + 0.2, CHU.x0 + 2.2, CHU.y0 + 1.6, CHU.y0 + 2.2, 0.68, 0.78, PAL.madera);
    /* árboles esquemáticos */
    [[0.9, -1.5, 1.0], [10.9, 14.0, 1.2], [0.9, 19.5, 1.5], [0.9, 13.0, 1.1], [4.0, 20.8, 1.3]].forEach(function (t) {
      bx(t[0] - 0.09, t[0] + 0.09, t[1] - 0.09, t[1] + 0.09, 0, 1.6, PAL.madera);
      bx(t[0] - t[2] / 2, t[0] + t[2] / 2, t[1] - t[2] / 2, t[1] + t[2] / 2, 1.6, 1.6 + t[2], PAL.verde);
    });
    return B;
  }
  /* Orden de dibujo para cajas alineadas a los ejes (algoritmo del pintor).
     sx, sy, sz son los signos de la dirección hacia la cámara. Si dos cajas
     están separadas en algún eje, la del lado lejano se dibuja antes; si no,
     se desempata por la suma de coordenadas del centro. Devuelve índices
     de lejos a cerca. El resultado solo depende de los signos, así que
     se memoriza por octante. */
  var ordenCache = {};
  function sortBoxes(B, ax, ay, az, sx, sy, sz, proj) {
    var key = sx + "," + sy + "," + sz + "," + B.length;
    if (!proj && ordenCache[key]) return ordenCache[key];
    var n = B.length, i, j, k, e = 0.001;
    /* caja envolvente en pantalla, para comparar solo lo que se superpone */
    var bb = new Array(n);
    for (i = 0; i < n; i++) {
      var b = B[i], x0 = b[ax + "0"], x1 = b[ax + "1"], y0 = b[ay + "0"], y1 = b[ay + "1"];
      var u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
      for (var c = 0; c < 8; c++) {
        var p = proj(c & 1 ? x1 : x0, c & 2 ? y1 : y0, c & 4 ? b.z1 : b.z0);
        if (p[0] < u0) u0 = p[0]; if (p[0] > u1) u1 = p[0];
        if (p[1] < v0) v0 = p[1]; if (p[1] > v1) v1 = p[1];
      }
      bb[i] = [u0, u1, v0, v1];
    }
    function lejos(a, b) {
      if (sx > 0 ? a[ax + "1"] <= b[ax + "0"] + e : a[ax + "0"] >= b[ax + "1"] - e) return true;
      if (sy > 0 ? a[ay + "1"] <= b[ay + "0"] + e : a[ay + "0"] >= b[ay + "1"] - e) return true;
      if (sz > 0 ? a.z1 <= b.z0 + e : a.z0 >= b.z1 - e) return true;
      return false;
    }
    var adj = new Array(n), grado = new Int32Array(n);
    for (i = 0; i < n; i++) adj[i] = [];
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) {
      if (bb[i][0] > bb[j][1] || bb[j][0] > bb[i][1] || bb[i][2] > bb[j][3] || bb[j][2] > bb[i][3]) continue;
      if (lejos(B[i], B[j])) { adj[i].push(j); grado[j]++; }
      else if (lejos(B[j], B[i])) { adj[j].push(i); grado[i]++; }
    }
    /* orden topológico por capas: entre los disponibles, primero el más lejano */
    function prof(b) {
      return sx * (b[ax + "0"] + b[ax + "1"]) + sy * (b[ay + "0"] + b[ay + "1"]) + sz * (b.z0 + b.z1);
    }
    var libres = [], orden = [], hecho = new Int8Array(n);
    for (i = 0; i < n; i++) if (!grado[i]) libres.push(i);
    libres.sort(function (p, q) { return prof(B[p]) - prof(B[q]); });
    while (orden.length < n) {
      if (!libres.length) {                 /* ciclo: se libera el más lejano pendiente */
        var mejor = -1;
        for (k = 0; k < n; k++) if (!hecho[k] && (mejor < 0 || prof(B[k]) < prof(B[mejor]))) mejor = k;
        if (mejor < 0) break;
        libres.push(mejor);
      }
      var cur = libres.shift();
      if (hecho[cur]) continue;
      hecho[cur] = 1; orden.push(cur);
      var a = adj[cur], nuevos = [];
      for (k = 0; k < a.length; k++) if (!hecho[a[k]] && --grado[a[k]] === 0) nuevos.push(a[k]);
      if (nuevos.length) {
        libres = libres.concat(nuevos);
        libres.sort(function (p, q) { return prof(B[p]) - prof(B[q]); });
      }
    }
    if (!proj) ordenCache[key] = orden;
    return orden;
  }

  function axoSVG() {
    var B = axoBoxes(), K = 0.8660254;
    function r3(v) { return Math.round(v * 1000) / 1000; }
    function pr(x, yp, z) { return [r3((x - yp) * K), r3((x + yp) * 0.5 - z)]; }
    B = sortBoxes(B, "x", "yp", "z", 1, 1, 1, function (x, yp, z) { return pr(x, yp, z); }).map(function (i) { return B[i]; });
    var s = "", minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
    function track(p) { if (p[0] < minx) minx = p[0]; if (p[0] > maxx) maxx = p[0]; if (p[1] < miny) miny = p[1]; if (p[1] > maxy) maxy = p[1]; }
    B.forEach(function (b) {
      var A = pr(b.x0, b.yp0, b.z1), C = pr(b.x1, b.yp0, b.z1), D = pr(b.x1, b.yp1, b.z1), E = pr(b.x0, b.yp1, b.z1);
      var F = pr(b.x1, b.yp0, b.z0), G = pr(b.x1, b.yp1, b.z0), H = pr(b.x0, b.yp1, b.z0);
      [A, C, D, E, F, G, H].forEach(track);
      s += POLY([A, C, D, E], null, ' fill="' + shade(b.c, 1.0) + '"');
      s += POLY([C, D, G, F], null, ' fill="' + shade(b.c, 0.80) + '"');
      s += POLY([E, D, G, H], null, ' fill="' + shade(b.c, 0.63) + '"');
      s += '<path class="ax-ln" d="M ' + A[0] + " " + A[1] + " L " + C[0] + " " + C[1] + " L " + D[0] + " " + D[1] +
        " L " + E[0] + " " + E[1] + ' Z"/>';
    });
    var pad = 1.2;
    var vb = (minx - pad) + " " + (miny - pad) + " " + (maxx - minx + 2 * pad) + " " + (maxy - miny + 2 * pad);
    return '<svg class="plan" viewBox="' + vb + '" role="img" aria-label="Vista axonométrica del conjunto">' + s + "</svg>";
  }

  return {
    PB: PB, PA: PA, LOT: LOT, CHU: CHU, ALT: ALT, NIV: NIV, SIDES: SIDES, PAL: PAL,
    f2: f2, area: area, near: near,
    wallSegments: wallSegments, sortBoxes: sortBoxes, opsOn: opsOn, opSill: opSill, opH: opH, opArea: opArea,
    planBody: planBody, planSVG: planSVG, siteSVG: siteSVG, elevSVG: elevSVG, axoSVG: axoSVG, axoBoxes: axoBoxes
  };
});
