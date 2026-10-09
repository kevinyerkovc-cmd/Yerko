/* Genera el PDF de planos (A3 apaisado) a partir de la misma geometría */
import pw from '/opt/node-tools/node_modules/playwright/index.js';
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire(import.meta.url);
const P = require('./proyecto.js');
const D = require('./datos.json');
const { chromium } = pw;

const css = fs.readFileSync('plan.css', 'utf8');
const f2 = P.f2;

function rotulo(num, titulo, escala, nota) {
  return `<div class="rot">
    <div><span>Proyecto</span><b>Casa Yerko 250 m²</b></div>
    <div><span>Ubicación</span><b>Terreno de 12,00 × 25,00 m · 300 m²</b></div>
    <div><span>Contenido</span><b>${titulo}</b></div>
    <div><span>Escala</span><b>${escala}</b></div>
    <div><span>Superficie</span><b>249,70 m² cubiertos</b></div>
    <div><span>Lámina</span><b>${num}</b></div>
  </div>${nota ? `<div class="nota">${nota}</div>` : ''}`;
}
function hoja(num, titulo, escala, svg, nota) {
  return `<section class="hoja">
    <header><h1>${titulo}</h1><div class="lam">${num}</div></header>
    <div class="dib">${svg}</div>
    ${rotulo(num, titulo, escala, nota)}
  </section>`;
}

const sheets = [
  hoja('A-01', 'Implantación y techos', '1:100',
    P.siteSVG(),
    'Retiro frontal 3,00 m · retiros laterales 0,50 m · patio posterior 10,00 m · ocupación 132,00 m² (44 % del terreno).'),
  hoja('A-02', 'Planta baja', '1:100',
    P.planSVG(P.PB, {}),
    'Superficie 132,00 m². Altura libre 2,70 m. Muros de 0,20 m acotados a ejes. Escalera de 18 contrapasos de 0,175 m y pisada de 0,28 m.'),
  hoja('A-03', 'Planta alta', '1:100',
    P.planSVG(P.PA, {}),
    'Superficie 117,70 m² (incluye terraza cubierta de 8,16 m²). Balcón descubierto de 14,30 m². Altura libre 2,60 m.'),
  `<section class="hoja"><header><h1>Fachadas</h1><div class="lam">A-04</div></header>
     <div class="dib cuatro">
       ${['N', 'S', 'E', 'W'].map(k => `<div class="cuad"><div class="cap">${P.SIDES[k].t}</div>${P.elevSVG(k)}</div>`).join('')}
     </div>
     ${rotulo('A-04', 'Fachadas norte, sur, este y oeste', '1:100',
    'Niveles: ± 0,00 piso terminado · + 2,70 losa de entrepiso · + 2,90 piso alto · + 5,50 losa de cubierta · + 6,30 parapeto · + 7,42 tanque de reserva.')}
   </section>`,
  hoja('A-05', 'Axonometría del conjunto', 'sin escala',
    P.axoSVG(),
    'Vista desde la calle. Cubierta plana con parapeto de 0,80 m, tanque de reserva sobre la caja de escalera y previsión de seis paneles fotovoltaicos.'),
  `<section class="hoja"><header><h1>Cuadro de áreas y resumen de presupuesto</h1><div class="lam">A-06</div></header>
     <div class="dib tablas">
       <div><h2>Planta baja</h2>${tablaSup(P.PB)}</div>
       <div><h2>Planta alta</h2>${tablaSup(P.PA)}</div>
       <div><h2>Resumen de presupuesto</h2>${tablaCap()}</div>
     </div>
     ${rotulo('A-06', 'Cuadro de áreas y resumen de presupuesto', 's/esc',
    'Superficies medidas sobre ejes de muro. Presupuesto referencial en bolivianos, estructura de precios unitarios con 55 % de cargas sociales, 10 % de gastos generales, 7 % de utilidad y 3,09 % de IT.')}
   </section>`
];

function tablaSup(L) {
  let tot = 0;
  const rows = L.rooms.map(r => {
    const a = (r.r[2] - r.r[0]) * (r.r[3] - r.r[1]); tot += a;
    return `<tr><td>${r.n}</td><td class="n">${f2(r.r[2] - r.r[0])} × ${f2(r.r[3] - r.r[1])}</td><td class="n">${f2(a)}</td></tr>`;
  }).join('');
  return `<table><thead><tr><th>Ambiente</th><th class="n">Medidas (m)</th><th class="n">m²</th></tr></thead>
    <tbody>${rows}<tr class="sum"><td>Total</td><td></td><td class="n">${f2(tot)}</td></tr></tbody></table>`;
}
function nf(v, d = 2) { return Number(v).toLocaleString('es-BO', { minimumFractionDigits: d, maximumFractionDigits: d }); }
function tablaCap() {
  const rows = D.resumen.capitulos.map(c =>
    `<tr><td class="n">${c.c}</td><td>${c.d}</td><td class="n">${nf(c.total)}</td></tr>`).join('');
  return `<table><thead><tr><th class="n">Cap.</th><th>Descripción</th><th class="n">Bs</th></tr></thead><tbody>${rows}
    <tr class="sum"><td></td><td>TOTAL PRESUPUESTO</td><td class="n">${nf(D.resumen.total)}</td></tr>
    <tr><td></td><td>Costo por m² cubierto</td><td class="n">${nf(D.resumen.porM2)}</td></tr></tbody></table>`;
}

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
:root{--paper:#fff;--surface:#fff;--ink:#16202b;--ink-2:#5b6a7a;--rule:#d4dae1;--azul:#1d6b8c;--ambar:#9c7524;--verde:#6f8a5a;--wash:#eef1f4}
*{box-sizing:border-box}
body{margin:0;font-family:"DejaVu Sans",Verdana,sans-serif;color:var(--ink);background:#fff;font-size:11px}
.hoja{width:420mm;height:297mm;padding:9mm 10mm 8mm;page-break-after:always;display:flex;flex-direction:column;border:0}
.hoja:last-child{page-break-after:auto}
header{display:flex;align-items:baseline;justify-content:space-between;border-bottom:1.6px solid var(--ink);padding-bottom:4mm}
h1{font-size:20px;margin:0;font-weight:700;letter-spacing:-.3px}
.lam{font-size:15px;font-weight:700;letter-spacing:2px;color:var(--ambar)}
.dib{flex:1;display:flex;align-items:center;justify-content:center;padding:4mm 0;min-height:0}
.dib > svg{width:100%;height:100%}
.cuatro{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:4mm 10mm;width:100%}
.cuad{display:flex;flex-direction:column;min-height:0;border:1px solid var(--rule);padding:3mm}
.cuad .cap{font-size:10px;letter-spacing:1.2px;text-transform:uppercase;color:var(--ink-2);margin-bottom:2mm}
.cuad svg{flex:1;min-height:0;max-height:100%}
.tablas{display:grid;grid-template-columns:1fr 1fr 1.15fr;gap:8mm;align-items:start;width:100%}
.tablas h2{font-size:12px;margin:0 0 2mm;letter-spacing:.4px}
table{width:100%;border-collapse:collapse;font-size:9.6px}
th,td{text-align:left;padding:1.4mm 2mm;border-bottom:.4px solid var(--rule)}
th{font-size:8.4px;letter-spacing:.7px;text-transform:uppercase;color:var(--ink-2)}
.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
tr.sum td{font-weight:700;border-top:1.2px solid var(--ink);border-bottom:none}
.rot{display:grid;grid-template-columns:repeat(6,1fr);border:1px solid var(--ink);margin-top:2mm}
.rot div{padding:2mm 3mm;border-right:.5px solid var(--rule)}
.rot div:last-child{border-right:0}
.rot span{display:block;font-size:7.4px;letter-spacing:1px;text-transform:uppercase;color:var(--ink-2)}
.rot b{font-size:10px}
.nota{margin-top:1.6mm;font-size:8.6px;color:var(--ink-2)}
${css}
</style></head><body>${sheets.join('')}</body></html>`;

fs.writeFileSync('_planos.html', html);
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('file://' + process.cwd() + '/_planos.html');
await p.waitForTimeout(600);
fs.mkdirSync('entregables', { recursive: true });
await p.pdf({ path: 'entregables/Casa-Yerko-250_Planos.pdf', width: '420mm', height: '297mm', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
await b.close();
console.log('PDF de planos:', (fs.statSync('entregables/Casa-Yerko-250_Planos.pdf').size / 1024 / 1024).toFixed(2), 'MB');
