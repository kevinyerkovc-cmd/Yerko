/* =====================================================================
   Vista 3D navegable sin librerías: proyección axonométrica general
   (azimut + elevación) de la misma lista de volúmenes que usa la
   axonometría en SVG, dibujada en canvas 2D con algoritmo del pintor.
   No usa WebGL ni CDN, así que funciona en cualquier navegador.
   ===================================================================== */
(function (root) {
  "use strict";
  var P = root.PROY;

  /* brillo por cara, con el sol al noroeste alto */
  var SH = { top: 1.00, xp: 0.78, xn: 0.70, yp: 0.86, yn: 0.58 };

  function shade(hex, f) {
    var n = parseInt(hex.slice(1), 16);
    return "rgb(" + Math.min(255, Math.round(((n >> 16) & 255) * f)) + "," +
      Math.min(255, Math.round(((n >> 8) & 255) * f)) + "," +
      Math.min(255, Math.round((n & 255) * f)) + ")";
  }

  root.init3D = function () {
    var host = document.getElementById("view3d");
    var hint = document.getElementById("hint3d");
    if (!host || host.dataset.on) return;
    host.dataset.on = "1";

    var cv = document.createElement("canvas");
    host.insertBefore(cv, hint);
    var ctx = cv.getContext("2d");
    if (!ctx) { hint.textContent = "Este navegador no permite dibujar en canvas; use la axonometría de arriba."; return; }

    /* volúmenes: color pre-sombreado por cara, una sola vez */
    var BOX = P.axoBoxes().map(function (b) {
      return {
        x0: b.x0 - 5.5, x1: b.x1 - 5.5, y0: b.y0 - 9.5, y1: b.y1 - 9.5, z0: b.z0, z1: b.z1,
        g: b.g, glass: b.c === P.PAL.vidrio,
        top: shade(b.c, SH.top), xp: shade(b.c, SH.xp), xn: shade(b.c, SH.xn),
        yp: shade(b.c, SH.yp), yn: shade(b.c, SH.yn)
      };
    });

    var cam = { a: 25 * Math.PI / 180, e: 18 * Math.PI / 180, s: 1, cx: 0, cy: 0 };
    var vis = { site: true, pb: true, pa: true, roof: true };
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function fit() {
      var ca = Math.cos(cam.a), sa = Math.sin(cam.a), se = Math.sin(cam.e), ce = Math.cos(cam.e);
      var minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
      BOX.forEach(function (b) {
        if (!vis[b.g]) return;
        [b.x0, b.x1].forEach(function (x) {
          [b.y0, b.y1].forEach(function (y) {
            [b.z0, b.z1].forEach(function (z) {
              var sx = x * ca - y * sa, h = x * sa + y * ca, sy = -(h * se + z * ce);
              if (sx < minx) minx = sx; if (sx > maxx) maxx = sx;
              if (sy < miny) miny = sy; if (sy > maxy) maxy = sy;
            });
          });
        });
      });
      var s = Math.min(W / (maxx - minx + 2), H / (maxy - miny + 2)) * 0.96;
      cam.s = s;
      cam.cx = W / 2 - (minx + maxx) / 2 * s;
      cam.cy = H / 2 - (miny + maxy) / 2 * s;
    }

    function draw() {
      var ca = Math.cos(cam.a), sa = Math.sin(cam.a), se = Math.sin(cam.e), ce = Math.cos(cam.e);
      var faceX = sa < 0 ? "x1" : "x0", faceY = ca < 0 ? "y1" : "y0";
      var colX = sa < 0 ? "xp" : "xn", colY = ca < 0 ? "yp" : "yn";

      /* cielo */
      var grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#bfd2e0"); grad.addColorStop(1, "#e8ebe9");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

      /* orden del pintor: mismo criterio topológico que la axonometría */
      var act = BOX.filter(function (b) { return vis[b.g]; });
      var sgx = -sa >= 0 ? 1 : -1, sgy = -ca >= 0 ? 1 : -1;
      var list = P.sortBoxes(act, "x", "y", "z", sgx, sgy, 1, function (x, y, z) {
        return [x * ca - y * sa, -((x * sa + y * ca) * se + z * ce)];
      }).map(function (i) { return act[i]; });

      function pr(x, y, z) {
        return [(x * ca - y * sa) * cam.s + cam.cx, -((x * sa + y * ca) * se + z * ce) * cam.s + cam.cy];
      }
      function poly(pts, fill, alpha) {
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.closePath();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = fill; ctx.fill();
        ctx.globalAlpha = alpha * 0.55;
        ctx.strokeStyle = "#2a3238"; ctx.lineWidth = 0.6; ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.lineJoin = "round";
      list.forEach(function (b) {
        var al = b.glass ? 0.72 : 1;
        var xf = b[faceX], yf = b[faceY];
        /* cara superior */
        poly([pr(b.x0, b.y0, b.z1), pr(b.x1, b.y0, b.z1), pr(b.x1, b.y1, b.z1), pr(b.x0, b.y1, b.z1)], b.top, al);
        /* cara vertical en x */
        poly([pr(xf, b.y0, b.z1), pr(xf, b.y1, b.z1), pr(xf, b.y1, b.z0), pr(xf, b.y0, b.z0)], b[colX], al);
        /* cara vertical en y */
        poly([pr(b.x0, yf, b.z1), pr(b.x1, yf, b.z1), pr(b.x1, yf, b.z0), pr(b.x0, yf, b.z0)], b[colY], al);
      });
    }

    function resize() {
      var w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      W = w; H = h;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      cv.style.width = w + "px"; cv.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fit(); draw();
    }

    /* interacción: arrastrar gira, rueda y pinza acercan */
    var drag = false, lx = 0, ly = 0, pinch = 0, base = 1;
    cv.addEventListener("pointerdown", function (e) {
      drag = true; lx = e.clientX; ly = e.clientY;
      try { cv.setPointerCapture(e.pointerId); } catch (x) { }
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) {
      cv.addEventListener(ev, function () { drag = false; });
    });
    cv.addEventListener("pointermove", function (e) {
      if (!drag) return;
      cam.a += (e.clientX - lx) * 0.009;
      cam.e = Math.max(4 * Math.PI / 180, Math.min(86 * Math.PI / 180, cam.e - (e.clientY - ly) * 0.006));
      lx = e.clientX; ly = e.clientY;
      fit(); cam.s *= base; draw();
    });
    cv.addEventListener("wheel", function (e) {
      e.preventDefault();
      base = Math.max(0.6, Math.min(4.5, base * (e.deltaY > 0 ? 1 / 1.12 : 1.12)));
      fit(); cam.s *= base; draw();
    }, { passive: false });
    cv.addEventListener("touchmove", function (e) {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      var dx = e.touches[0].clientX - e.touches[1].clientX, dy = e.touches[0].clientY - e.touches[1].clientY;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (pinch) { base = Math.max(0.6, Math.min(4.5, base * d / pinch)); fit(); cam.s *= base; draw(); }
      pinch = d;
    }, { passive: false });
    cv.addEventListener("touchend", function () { pinch = 0; });

    var PRE = {
      frente: [25, 18], aerea: [35, 55], patio: [200, 20], lateral: [-70, 15]
    };
    document.querySelectorAll("[data-cam]").forEach(function (b) {
      b.addEventListener("click", function () {
        var p = PRE[b.dataset.cam];
        cam.a = p[0] * Math.PI / 180; cam.e = p[1] * Math.PI / 180; base = 1;
        fit(); draw();
      });
    });
    [["c-roof", "roof"], ["c-upper", "pa"], ["c-site", "site"]].forEach(function (p) {
      var node = document.getElementById(p[0]);
      if (node) node.addEventListener("change", function () { vis[p[1]] = this.checked; fit(); cam.s *= base; draw(); });
    });

    window.addEventListener("resize", resize);
    resize();
    hint.textContent = "Arrastre para girar · rueda o pinza para acercar · " + BOX.length + " volúmenes";
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
