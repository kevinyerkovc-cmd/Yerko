/* Exporta los cómputos y el presupuesto a datos.js (navegador) y datos.json (Python) */
const fs = require("fs");
const B = require("./presupuesto.js").build();
const ESP = require("./especificaciones.js");
fs.writeFileSync("especificaciones.json", JSON.stringify(ESP, null, 1));
const payload = { G: B.G, items: B.items, caps: B.caps, resumen: B.resumen, MAT: B.MAT, MO: B.MO, EQ: B.EQ, REC: B.REC };
fs.writeFileSync("datos.json", JSON.stringify(payload, null, 1));
fs.writeFileSync("datos.js", "/* Generado por build-datos.js — no editar a mano */\n" +
  "(function(r,d){if(typeof module===\"object\"&&module.exports)module.exports=d;else r.DATOS=d;})" +
  "(typeof globalThis!==\"undefined\"?globalThis:this,\n" + JSON.stringify(payload) + ");\n");
console.log("datos.json", (fs.statSync("datos.json").size/1024).toFixed(0)+" KB |",
            "datos.js", (fs.statSync("datos.js").size/1024).toFixed(0)+" KB");
