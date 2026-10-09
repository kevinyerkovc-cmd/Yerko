/* =====================================================================
   Casa Yerko 250 m² — cómputos métricos, análisis de precios unitarios
   y presupuesto, derivados de la geometría de proyecto.js
   Moneda: bolivianos (Bs). Precios referenciales de mercado 2026,
   a verificar con proveedores locales antes de contratar.
   ===================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./proyecto.js"));
  else root.PRES = factory(root.PROY);
})(typeof globalThis !== "undefined" ? globalThis : this, function (P) {
  "use strict";

  var r2 = function (v) { return Math.round(v * 100) / 100; };

  /* ====================== 1. GEOMETRÍA DERIVADA ====================== */
  function geom() {
    var G = {};
    var PB = P.PB, PA = P.PA;

    G.supPB = PB.rooms.reduce(function (s, r) { return s + P.area(r.r); }, 0);
    G.supPA = PA.rooms.reduce(function (s, r) { return s + P.area(r.r); }, 0);
    G.supTotal = G.supPB + G.supPA;
    G.terreno = P.LOT.w * P.LOT.d;
    G.huella = G.supPB;
    G.balcon = 11.2 * 1.3;
    G.libre = G.terreno - G.huella;

    /* --- muros: área neta por espesor --- */
    var muro = { 0.18: 0, 0.12: 0 }, bruto = { 0.18: 0, 0.12: 0 }, vanos = { 0.18: 0, 0.12: 0 };
    var caraInt = 0, caraExt = 0;        /* superficies a revocar */
    [PB, PA].forEach(function (L) {
      P.wallSegments(L).forEach(function (sg) {
        var h = sg.kind === "par" ? 1.10 : L.h;
        var ab = (sg.b - sg.a) * h;
        var av = P.opsOn(L, sg).reduce(function (s, o) {
          var w = Math.min(o.b, sg.b) - Math.max(o.a, sg.a);
          return s + w * Math.min(P.opH(o), h - P.opSill(o));
        }, 0);
        bruto[sg.th] += ab; vanos[sg.th] += av; muro[sg.th] += ab - av;
        if (sg.kind === "int") caraInt += 2 * (ab - av);
        else { caraInt += (ab - av); caraExt += (ab - av); }
      });
    });
    G.muro18 = r2(muro[0.18]); G.tabique12 = r2(muro[0.12]);
    G.muroBruto = r2(bruto[0.18] + bruto[0.12]);
    G.vanosMuro = r2(vanos[0.18] + vanos[0.12]);
    G.revoqueInt = r2(caraInt);
    G.revoqueExt = r2(caraExt);

    /* --- carpintería contada sobre los vanos del modelo --- */
    var pIntA = 0, pExt = 0, pInt = 0, venA = 0, venU = 0, porton = 0;
    [PB, PA].forEach(function (L) {
      L.ops.forEach(function (o) {
        if (o.t === "d") { if (o.ext) pExt++; else pInt++; pIntA += P.opArea(o); }
        else if (o.t === "w" && o.ext) { venU++; venA += P.opArea(o); }
        else if (o.t === "g") porton++;
      });
    });
    G.puertasInt = pInt; G.puertasExt = pExt; G.ventanasU = venU;
    G.ventanasM2 = r2(venA); G.portones = porton;

    /* --- estructura: ejes de columnas --- */
    G.ejesX = [0, 2.8, 5.6, 8.2, 11.0];
    G.ejesY = [0, 5.0, 8.4, 12.0];
    G.columnasPB = G.ejesX.length * G.ejesY.length;              /* 20 */
    G.columnasPA = 18;                                            /* sin las 2 del frente del balcón */
    G.zapatas = G.columnasPB;
    G.cimientoML = r2(46.0 + 26.0);                               /* perímetro + muros portantes interiores */
    G.vigasML = r2(G.ejesX.length * 12 + G.ejesY.length * 11);    /* 104 ml por nivel */
    G.losaEntrepiso = r2(G.supPB + G.balcon);
    G.losaCubierta = r2(11.5 * 11.2);
    G.losaTotal = r2(G.losaEntrepiso + G.losaCubierta);
    G.escalera = 8.10;

    var volZap = G.zapatas * 1.20 * 1.20 * 0.30;
    var volSob = G.cimientoML * 0.20 * 0.30;
    var volCol = G.columnasPB * 0.20 * 0.25 * 3.00 + G.columnasPA * 0.20 * 0.25 * 2.90;
    var volVig = G.vigasML * 2 * 0.20 * 0.30;
    var volEsc = G.escalera * 0.15;
    G.volZapatas = r2(volZap); G.volSobrecimiento = r2(volSob);
    G.volColumnas = r2(volCol); G.volVigas = r2(volVig); G.volEscalera = r2(volEsc);
    G.volHA = r2(volZap + volSob + volCol + volVig + volEsc);
    G.volCiclopeo = r2(G.cimientoML * 0.40 * 0.70);
    G.acero = r2(G.volHA * 90 + G.losaTotal * 4.5);               /* 90 kg/m³ + 4,5 kg/m² de losa */
    G.encofrado = r2(G.columnasPB * 3.0 * 0.90 + G.columnasPA * 2.9 * 0.90 + G.vigasML * 2 * 0.80);

    G.excavZapatas = r2(G.zapatas * 1.40 * 1.40 * 1.20);
    G.excavCimiento = r2(G.cimientoML * 0.50 * 1.00);
    G.excavacion = r2(G.excavZapatas + G.excavCimiento);
    G.relleno = r2(G.excavacion * 0.40);
    G.escombros = r2((G.excavacion - G.relleno) * 1.25);

    /* --- pisos por tipo --- */
    function supDe(L, nombres) {
      return L.rooms.filter(function (r) { return nombres.indexOf(r.n) >= 0; })
        .reduce(function (s, r) { return s + P.area(r.r); }, 0);
    }
    G.pisoPorcelanato = r2(supDe(PB, ["Sala – Comedor", "Cocina", "Hall · Escalera", "Pasillo"]) +
      supDe(PA, ["Estar familiar", "Hall · Escalera", "Pasillo"]));
    G.pisoFlotante = r2(supDe(PA, ["Dormitorio 1", "Dormitorio 2", "Dormitorio 3", "Dorm. 4 · Suite"]));
    G.pisoCeramica = r2(supDe(PB, ["Baño 1", "Baño 2 servicio", "Lavandería", "Garaje 2 autos", "Tienda"]) +
      supDe(PA, ["Baño 3", "Baño 4 suite", "Vestidor", "Clóset", "Terraza"]));
    G.contrapiso = r2(G.supPB);
    G.cieloRaso = r2(G.supTotal);
    G.zocalo = 165.00;

    /* --- revestimientos húmedos --- */
    var banos = [[1.7, 1.9], [1.7, 1.9], [3.2, 1.7], [2.0, 2.0]];
    G.azulejoBanos = r2(banos.reduce(function (s, b) { return s + 2 * (b[0] + b[1]) * 2.10; }, 0) - 6.0);
    G.azulejoCocina = 8.00;
    G.meson = 6.06;

    /* --- cubierta e instalaciones --- */
    G.impermeabilizacion = G.losaCubierta;
    G.parapeto = r2(2 * (11.5 + 11.2) * 0.80);
    G.bajantes = 26.00;
    G.puntosAguaFria = 16; G.puntosAguaCaliente = 9; G.puntosDesague = 16;
    G.colectores = 48.00;
    G.camaras = 3;
    G.puntosLuz = 42; G.puntosToma = 48;

    /* --- pintura y exteriores --- */
    G.pinturaInt = r2(G.revoqueInt + G.cieloRaso);
    G.pinturaExt = r2(G.revoqueExt + G.parapeto);
    G.cercoLateral = r2(62.0 * 2.20);
    G.cercoFrontal = 12.00;
    G.pavimentoExt = r2(4.4 * 3 + 1.2 * 3 + 1.2 * 3 + 11.5 * 2.2 + 3.5 * 3.0);
    G.pergola = 10.50;
    G.jardin = 120.00;
    return G;
  }

  /* ====================== 2. PRECIOS DE INSUMOS ====================== */
  /* Materiales: Bs por unidad. Referencia mercado boliviano 2026. */
  var MAT = {
    cem: ["Cemento Portland IP-30", "bls 50 kg", 60.00],
    are: ["Arena fina lavada", "m³", 160.00],
    gra: ["Gravilla 3/4\"", "m³", 200.00],
    pie: ["Piedra bruta / bolón", "m³", 150.00],
    lad18: ["Ladrillo gambote 6 huecos 18 cm", "pza", 2.00],
    lad12: ["Ladrillo cerámico 12 cm", "pza", 1.80],
    fie: ["Fierro corrugado fy=4200", "kg", 11.50],
    ala: ["Alambre de amarre Nº 16", "kg", 14.00],
    cla: ["Clavos de 2\" a 3\"", "kg", 16.00],
    mad: ["Madera de construcción para encofrado", "p²", 9.00],
    vig: ["Vigueta pretensada h=15 cm", "ml", 48.00],
    pla: ["Complemento de plastoform", "pza", 14.00],
    yes: ["Yeso de construcción", "bls 40 kg", 35.00],
    cal: ["Cal hidratada", "bls 25 kg", 25.00],
    por: ["Porcelanato esmaltado 60×60 cm", "m²", 150.00],
    flo: ["Piso flotante AC4 8 mm con manta", "m²", 110.00],
    cer: ["Cerámica antideslizante 45×45 cm", "m²", 95.00],
    azu: ["Azulejo cerámico 30×60 cm", "m²", 85.00],
    peg: ["Pegamento cerámico", "bls 25 kg", 60.00],
    fra: ["Fragua / sellador de juntas", "kg", 12.00],
    mem: ["Membrana asfáltica 4 mm con foil", "m²", 70.00],
    t110: ["Tubería PVC desagüe Ø110 mm", "ml", 48.00],
    t50: ["Tubería PVC desagüe Ø50 mm", "ml", 22.00],
    ppr: ["Tubería PPR Ø1/2\" PN20", "ml", 18.00],
    acc: ["Accesorios y piezas especiales", "glb", 1.00],
    ino: ["Inodoro con tanque bajo + asiento", "pza", 950.00],
    lav: ["Lavamanos con pedestal y grifería", "pza", 650.00],
    duc: ["Grifería monocomando de ducha", "pza", 450.00],
    fre: ["Fregadero de acero inoxidable 2 pozas", "pza", 750.00],
    bat: ["Batea prefabricada de lavandería", "pza", 380.00],
    tan: ["Tanque de polietileno 1 000 L", "pza", 1250.00],
    bom: ["Bomba periférica 1/2 HP + presostato", "pza", 900.00],
    ter: ["Termotanque eléctrico 80 L", "pza", 2200.00],
    c25: ["Cable THHN 2,5 mm²", "ml", 7.50],
    c40: ["Cable THHN 4 mm²", "ml", 12.00],
    duct: ["Ducto corrugado 3/4\"", "ml", 6.00],
    caja: ["Caja octogonal / rectangular", "pza", 12.00],
    mec: ["Mecanismo: interruptor o tomacorriente", "pza", 35.00],
    lum: ["Luminaria LED de embutir 18 W", "pza", 120.00],
    tab: ["Tablero de distribución 12 polos + protecciones", "pza", 850.00],
    pint: ["Pintura látex acrílica", "lt", 24.00],
    sell: ["Sellador / imprimante", "lt", 22.00],
    ppl: ["Puerta placa 0,90 × 2,10 con marco y quincallería", "pza", 1450.00],
    ppr2: ["Puerta principal de madera tablero + quincallería", "pza", 3200.00],
    ven: ["Ventana de aluminio línea 25 con vidrio 6 mm", "m²", 650.00],
    porton: ["Portón seccional metálico 4,40 × 2,30", "pza", 11500.00],
    portv: ["Portón vehicular metálico 4,80 × 1,60", "pza", 6800.00],
    bar: ["Baranda metálica con pasamanos", "ml", 650.00],
    gran: ["Granito natural e=2 cm pulido", "m²", 850.00],
    ces: ["Césped en rollo / plantines", "m²", 35.00],
    tve: ["Tierra vegetal cernida", "m³", 120.00],
    madp: ["Madera dura cepillada para pérgola", "p²", 14.00],
    par: ["Parrilla de fierro fundido y accesorios", "glb", 1.00],
    niv: ["Nivelación: estuco / masilla", "kg", 9.00]
  };

  /* Mano de obra: Bs por hora (jornal de 8 h sobre la base indicada) */
  var MO = {
    mae: ["Maestro albañil", 27.50], alb: ["Albañil", 23.13], ayu: ["Ayudante", 15.63],
    enc: ["Carpintero encofrador", 23.75], arm: ["Armador de fierro", 23.75],
    plo: ["Plomero", 25.00], ele: ["Electricista", 25.00], pin: ["Pintor", 21.25],
    cer: ["Ceramista / azulejero", 25.00], yes: ["Yesero", 23.75],
    car: ["Carpintero de obra fina", 25.00], her: ["Herrero / cerrajero", 25.00], jar: ["Jardinero", 18.75]
  };
  var EQ = {
    mez: ["Mezcladora de hormigón 1 saco", "hr", 45.00],
    vib: ["Vibradora de inmersión", "hr", 35.00],
    com: ["Compactadora manual tipo canguro", "hr", 40.00],
    and: ["Andamio metálico modular", "m²", 6.00]
  };

  /* Recargos (estructura estándar de APU en Bolivia) */
  var REC = { cargas: 0.55, ivaMO: 0.1494, herram: 0.05, gg: 0.10, util: 0.07, it: 0.0309 };

  /* ====================== 3. ÍTEMS Y COMPOSICIÓN ====================== */
  /* comp: ["MAT"|"MO"|"EQ", clave, cantidad por unidad del ítem] */
  function items(G) {
    return [
      { ch: "1", d: "TRABAJOS PRELIMINARES" },
      {
        c: "1.1", d: "Instalación de faenas (depósito, servicio sanitario, cartel de obra)", un: "glb", q: 1,
        comp: [["MAT", "mad", 320], ["MAT", "cla", 12], ["MAT", "cem", 8], ["MO", "mae", 24], ["MO", "ayu", 48]]
      },
      {
        c: "1.2", d: "Replanteo y trazado con nivel de obra", un: "m²", q: G.huella,
        comp: [["MAT", "mad", 0.35], ["MAT", "cla", 0.05], ["MO", "mae", 0.09], ["MO", "ayu", 0.18]]
      },
      { ch: "2", d: "MOVIMIENTO DE TIERRAS" },
      {
        c: "2.1", d: "Excavación manual de zapatas, suelo semiduro h≤1,20 m", un: "m³", q: G.excavZapatas,
        comp: [["MO", "alb", 0.35], ["MO", "ayu", 2.10]]
      },
      {
        c: "2.2", d: "Excavación manual de zanja para cimiento corrido", un: "m³", q: G.excavCimiento,
        comp: [["MO", "alb", 0.30], ["MO", "ayu", 1.90]]
      },
      {
        c: "2.3", d: "Relleno y compactado con material seleccionado, capas de 0,20 m", un: "m³", q: G.relleno,
        comp: [["MO", "alb", 0.25], ["MO", "ayu", 1.20], ["EQ", "com", 0.45]]
      },
      {
        c: "2.4", d: "Retiro de escombros y tierra sobrante hasta 10 km", un: "m³", q: G.escombros,
        comp: [["MO", "ayu", 0.55], ["EQ", "com", 0.10], ["MAT", "acc", 28]]
      },
      { ch: "3", d: "OBRA GRUESA: HORMIGONES Y ESTRUCTURA" },
      {
        c: "3.1", d: "Hormigón ciclópeo 50 % piedra desplazadora para cimiento corrido", un: "m³", q: G.volCiclopeo,
        comp: [["MAT", "cem", 3.60], ["MAT", "are", 0.32], ["MAT", "gra", 0.40], ["MAT", "pie", 0.55],
          ["MO", "mae", 0.40], ["MO", "alb", 1.60], ["MO", "ayu", 4.00], ["EQ", "mez", 0.70]]
      },
      {
        c: "3.2", d: "Hormigón armado fc=210 kg/cm² en zapatas aisladas", un: "m³", q: G.volZapatas,
        comp: [["MAT", "cem", 7.20], ["MAT", "are", 0.52], ["MAT", "gra", 0.70], ["MAT", "fie", 55], ["MAT", "ala", 1.2],
          ["MO", "mae", 0.80], ["MO", "alb", 2.40], ["MO", "arm", 3.20], ["MO", "ayu", 6.40], ["EQ", "mez", 1.10], ["EQ", "vib", 0.60]]
      },
      {
        c: "3.3", d: "Hormigón armado fc=210 en sobrecimiento y viga de arranque 0,20 × 0,30", un: "m³", q: G.volSobrecimiento,
        comp: [["MAT", "cem", 7.20], ["MAT", "are", 0.52], ["MAT", "gra", 0.70], ["MAT", "fie", 85], ["MAT", "ala", 1.8],
          ["MAT", "mad", 10], ["MO", "mae", 1.00], ["MO", "enc", 4.00], ["MO", "arm", 4.00], ["MO", "ayu", 8.00], ["EQ", "mez", 1.20], ["EQ", "vib", 0.70]]
      },
      {
        c: "3.4", d: "Hormigón armado fc=210 en columnas 0,20 × 0,25", un: "m³", q: G.volColumnas,
        comp: [["MAT", "cem", 7.50], ["MAT", "are", 0.54], ["MAT", "gra", 0.72], ["MAT", "fie", 130], ["MAT", "ala", 2.6],
          ["MAT", "mad", 24], ["MAT", "cla", 2.2], ["MO", "mae", 1.60], ["MO", "enc", 8.00], ["MO", "arm", 6.40], ["MO", "ayu", 12.00],
          ["EQ", "mez", 1.40], ["EQ", "vib", 0.90]]
      },
      {
        c: "3.5", d: "Hormigón armado fc=210 en vigas 0,20 × 0,30", un: "m³", q: G.volVigas,
        comp: [["MAT", "cem", 7.50], ["MAT", "are", 0.54], ["MAT", "gra", 0.72], ["MAT", "fie", 115], ["MAT", "ala", 2.3],
          ["MAT", "mad", 28], ["MAT", "cla", 2.4], ["MO", "mae", 1.60], ["MO", "enc", 9.00], ["MO", "arm", 6.00], ["MO", "ayu", 13.00],
          ["EQ", "mez", 1.40], ["EQ", "vib", 0.90]]
      },
      {
        c: "3.6", d: "Losa aligerada e=0,20 m con viguetas pretensadas y plastoform", un: "m²", q: G.losaTotal,
        comp: [["MAT", "vig", 1.45], ["MAT", "pla", 2.60], ["MAT", "cem", 1.05], ["MAT", "are", 0.055], ["MAT", "gra", 0.070],
          ["MAT", "fie", 4.50], ["MAT", "ala", 0.18], ["MAT", "mad", 2.60], ["MAT", "cla", 0.22],
          ["MO", "mae", 0.22], ["MO", "enc", 0.75], ["MO", "arm", 0.35], ["MO", "ayu", 1.30], ["EQ", "mez", 0.16], ["EQ", "vib", 0.08]]
      },
      {
        c: "3.7", d: "Escalera de hormigón armado con peldaños conformados", un: "m²", q: G.escalera,
        comp: [["MAT", "cem", 1.60], ["MAT", "are", 0.085], ["MAT", "gra", 0.11], ["MAT", "fie", 14], ["MAT", "mad", 5.5],
          ["MAT", "cla", 0.5], ["MO", "mae", 0.60], ["MO", "enc", 2.20], ["MO", "arm", 1.10], ["MO", "ayu", 3.20], ["EQ", "mez", 0.25]]
      },
      { ch: "4", d: "MAMPOSTERÍA Y CERRAMIENTOS" },
      {
        c: "4.1", d: "Muro de ladrillo gambote de 18 cm con mortero 1:5", un: "m²", q: G.muro18,
        comp: [["MAT", "lad18", 36], ["MAT", "cem", 0.55], ["MAT", "are", 0.042], ["MAT", "cal", 0.12],
          ["MO", "mae", 0.12], ["MO", "alb", 0.95], ["MO", "ayu", 1.05], ["EQ", "and", 0.35]]
      },
      {
        c: "4.2", d: "Tabique de ladrillo cerámico de 12 cm con mortero 1:5", un: "m²", q: G.tabique12,
        comp: [["MAT", "lad12", 26], ["MAT", "cem", 0.38], ["MAT", "are", 0.030], ["MAT", "cal", 0.08],
          ["MO", "mae", 0.10], ["MO", "alb", 0.80], ["MO", "ayu", 0.88], ["EQ", "and", 0.30]]
      },
      {
        c: "4.3", d: "Parapeto de cubierta h=0,80 m, ladrillo 12 cm con viga de coronamiento", un: "m²", q: G.parapeto,
        comp: [["MAT", "lad12", 26], ["MAT", "cem", 0.70], ["MAT", "are", 0.040], ["MAT", "fie", 3.2],
          ["MO", "mae", 0.14], ["MO", "alb", 1.05], ["MO", "ayu", 1.15], ["EQ", "and", 0.40]]
      },
      { ch: "5", d: "REVOQUES, CIELOS Y PINTURA" },
      {
        c: "5.1", d: "Revoque interior de yeso sobre muro, e=1,5 cm", un: "m²", q: G.revoqueInt,
        comp: [["MAT", "yes", 0.42], ["MAT", "cem", 0.08], ["MAT", "are", 0.006],
          ["MO", "yes", 0.55], ["MO", "ayu", 0.55], ["EQ", "and", 0.25]]
      },
      {
        c: "5.2", d: "Revoque exterior de mortero 1:4 con acabado frotachado, e=2 cm", un: "m²", q: G.revoqueExt,
        comp: [["MAT", "cem", 0.42], ["MAT", "are", 0.032], ["MAT", "cal", 0.10],
          ["MO", "mae", 0.10], ["MO", "alb", 0.75], ["MO", "ayu", 0.80], ["EQ", "and", 0.55]]
      },
      {
        c: "5.3", d: "Cielo raso de yeso bajo losa con malla y perfilería", un: "m²", q: G.cieloRaso,
        comp: [["MAT", "yes", 0.55], ["MAT", "niv", 0.9], ["MO", "yes", 0.70], ["MO", "ayu", 0.70], ["EQ", "and", 0.30]]
      },
      {
        c: "5.4", d: "Pintura látex interior, sellador y dos manos", un: "m²", q: G.pinturaInt,
        comp: [["MAT", "pint", 0.22], ["MAT", "sell", 0.10], ["MAT", "niv", 0.25], ["MO", "pin", 0.28], ["MO", "ayu", 0.14], ["EQ", "and", 0.18]]
      },
      {
        c: "5.5", d: "Pintura látex acrílica exterior, imprimante y dos manos", un: "m²", q: G.pinturaExt,
        comp: [["MAT", "pint", 0.28], ["MAT", "sell", 0.12], ["MO", "pin", 0.34], ["MO", "ayu", 0.17], ["EQ", "and", 0.40]]
      },
      { ch: "6", d: "PISOS Y REVESTIMIENTOS" },
      {
        c: "6.1", d: "Contrapiso de hormigón simple e=7 cm sobre terreno compactado", un: "m²", q: G.contrapiso,
        comp: [["MAT", "cem", 0.52], ["MAT", "are", 0.040], ["MAT", "gra", 0.055], ["MAT", "pie", 0.08],
          ["MO", "mae", 0.09], ["MO", "alb", 0.42], ["MO", "ayu", 0.85], ["EQ", "mez", 0.09]]
      },
      {
        c: "6.2", d: "Piso de porcelanato 60 × 60 cm con pegamento y fragua", un: "m²", q: G.pisoPorcelanato,
        comp: [["MAT", "por", 1.07], ["MAT", "peg", 0.22], ["MAT", "fra", 0.35], ["MO", "cer", 0.60], ["MO", "ayu", 0.45]]
      },
      {
        c: "6.3", d: "Piso flotante AC4 de 8 mm con manta y zócalo perimetral", un: "m²", q: G.pisoFlotante,
        comp: [["MAT", "flo", 1.06], ["MAT", "niv", 1.2], ["MO", "car", 0.40], ["MO", "ayu", 0.25]]
      },
      {
        c: "6.4", d: "Piso de cerámica antideslizante 45 × 45 cm", un: "m²", q: G.pisoCeramica,
        comp: [["MAT", "cer", 1.07], ["MAT", "peg", 0.22], ["MAT", "fra", 0.32], ["MO", "cer", 0.55], ["MO", "ayu", 0.42]]
      },
      {
        c: "6.5", d: "Zócalo de porcelanato h=7 cm", un: "ml", q: G.zocalo,
        comp: [["MAT", "por", 0.09], ["MAT", "peg", 0.03], ["MAT", "fra", 0.04], ["MO", "cer", 0.14], ["MO", "ayu", 0.10]]
      },
      {
        c: "6.6", d: "Revestimiento de azulejo en baños h=2,10 m", un: "m²", q: G.azulejoBanos,
        comp: [["MAT", "azu", 1.08], ["MAT", "peg", 0.24], ["MAT", "fra", 0.30], ["MO", "cer", 0.75], ["MO", "ayu", 0.50]]
      },
      {
        c: "6.7", d: "Revestimiento de azulejo en mesón de cocina y lavandería", un: "m²", q: G.azulejoCocina,
        comp: [["MAT", "azu", 1.08], ["MAT", "peg", 0.24], ["MAT", "fra", 0.30], ["MO", "cer", 0.80], ["MO", "ayu", 0.52]]
      },
      {
        c: "6.8", d: "Mesón de granito natural e=2 cm con pulido de bordes", un: "m²", q: G.meson,
        comp: [["MAT", "gran", 1.05], ["MAT", "peg", 0.15], ["MO", "car", 1.60], ["MO", "ayu", 1.20]]
      },
      { ch: "7", d: "CUBIERTA" },
      {
        c: "7.1", d: "Impermeabilización de losa con membrana asfáltica 4 mm y carpeta de pendiente", un: "m²", q: G.impermeabilizacion,
        comp: [["MAT", "mem", 1.12], ["MAT", "cem", 0.38], ["MAT", "are", 0.030], ["MAT", "sell", 0.10],
          ["MO", "mae", 0.12], ["MO", "alb", 0.55], ["MO", "ayu", 0.55]]
      },
      {
        c: "7.2", d: "Bajante pluvial de PVC Ø110 mm con abrazaderas y rejilla", un: "ml", q: G.bajantes,
        comp: [["MAT", "t110", 1.05], ["MAT", "acc", 38], ["MO", "plo", 0.45], ["MO", "ayu", 0.35]]
      },
      { ch: "8", d: "CARPINTERÍA" },
      {
        c: "8.1", d: "Puerta placa 0,90 × 2,10 m con marco de madera y quincallería", un: "pza", q: G.puertasInt,
        comp: [["MAT", "ppl", 1], ["MAT", "cem", 0.25], ["MAT", "pint", 0.6], ["MO", "car", 3.20], ["MO", "ayu", 1.60]]
      },
      {
        c: "8.2", d: "Puerta exterior de madera tablero con marco reforzado y cerradura de seguridad", un: "pza", q: G.puertasExt,
        comp: [["MAT", "ppr2", 1], ["MAT", "cem", 0.35], ["MAT", "pint", 1.1], ["MO", "car", 5.00], ["MO", "ayu", 2.50]]
      },
      {
        c: "8.3", d: "Ventana de aluminio línea 25 con vidrio de 6 mm, incluye contramarco", un: "m²", q: G.ventanasM2,
        comp: [["MAT", "ven", 1.02], ["MAT", "cem", 0.08], ["MAT", "sell", 0.10], ["MO", "her", 0.85], ["MO", "ayu", 0.60]]
      },
      {
        c: "8.4", d: "Portón seccional de garaje 4,40 × 2,30 m con guías y resortes", un: "pza", q: G.portones,
        comp: [["MAT", "porton", 1], ["MAT", "acc", 450], ["MO", "her", 10.00], ["MO", "ayu", 8.00]]
      },
      {
        c: "8.5", d: "Baranda metálica de balcón y escalera con pasamanos", un: "ml", q: 21.80,
        comp: [["MAT", "bar", 1.02], ["MAT", "pint", 0.18], ["MO", "her", 1.10], ["MO", "ayu", 0.70]]
      },
      { ch: "9", d: "INSTALACIÓN SANITARIA Y AGUA" },
      {
        c: "9.1", d: "Punto de agua fría PPR Ø1/2\" con llave de paso", un: "pto", q: G.puntosAguaFria,
        comp: [["MAT", "ppr", 4.20], ["MAT", "acc", 95], ["MAT", "cem", 0.18], ["MO", "plo", 2.20], ["MO", "ayu", 1.60]]
      },
      {
        c: "9.2", d: "Punto de agua caliente PPR Ø1/2\" con aislamiento", un: "pto", q: G.puntosAguaCaliente,
        comp: [["MAT", "ppr", 5.00], ["MAT", "acc", 125], ["MAT", "cem", 0.18], ["MO", "plo", 2.50], ["MO", "ayu", 1.80]]
      },
      {
        c: "9.3", d: "Punto de desagüe PVC Ø50 a Ø110 mm con sifón y ventilación", un: "pto", q: G.puntosDesague,
        comp: [["MAT", "t50", 3.00], ["MAT", "t110", 1.40], ["MAT", "acc", 140], ["MAT", "cem", 0.25], ["MO", "plo", 2.80], ["MO", "ayu", 2.20]]
      },
      {
        c: "9.4", d: "Colector y bajante de PVC Ø110 mm con pendiente 2 %", un: "ml", q: G.colectores,
        comp: [["MAT", "t110", 1.05], ["MAT", "acc", 30], ["MO", "plo", 0.50], ["MO", "ayu", 0.60]]
      },
      {
        c: "9.5", d: "Cámara de inspección 0,60 × 0,60 m con tapa de H°A°", un: "pza", q: G.camaras,
        comp: [["MAT", "lad18", 110], ["MAT", "cem", 5.5], ["MAT", "are", 0.35], ["MAT", "gra", 0.20], ["MAT", "fie", 18],
          ["MO", "mae", 2.00], ["MO", "alb", 7.00], ["MO", "ayu", 9.00]]
      },
      {
        c: "9.6", d: "Provisión e instalación de inodoro con tanque bajo", un: "pza", q: 4,
        comp: [["MAT", "ino", 1], ["MAT", "acc", 120], ["MO", "plo", 2.20], ["MO", "ayu", 1.20]]
      },
      {
        c: "9.7", d: "Provisión e instalación de lavamanos con grifería", un: "pza", q: 4,
        comp: [["MAT", "lav", 1], ["MAT", "acc", 90], ["MO", "plo", 2.00], ["MO", "ayu", 1.10]]
      },
      {
        c: "9.8", d: "Provisión e instalación de grifería de ducha monocomando", un: "pza", q: 4,
        comp: [["MAT", "duc", 1], ["MAT", "acc", 70], ["MO", "plo", 1.80], ["MO", "ayu", 1.00]]
      },
      {
        c: "9.9", d: "Fregadero de cocina de 2 pozas y batea de lavandería", un: "pza", q: 2,
        comp: [["MAT", "fre", 0.5], ["MAT", "bat", 0.5], ["MAT", "acc", 110], ["MO", "plo", 2.40], ["MO", "ayu", 1.40]]
      },
      {
        c: "9.10", d: "Tanque de reserva 1 000 L con bomba, presostato y accesorios", un: "glb", q: 1,
        comp: [["MAT", "tan", 1], ["MAT", "bom", 1], ["MAT", "ppr", 22], ["MAT", "acc", 650], ["MO", "plo", 16.00], ["MO", "ayu", 12.00]]
      },
      {
        c: "9.11", d: "Termotanque eléctrico de 80 L instalado", un: "pza", q: 1,
        comp: [["MAT", "ter", 1], ["MAT", "acc", 280], ["MO", "plo", 6.00], ["MO", "ele", 2.00], ["MO", "ayu", 3.00]]
      },
      { ch: "10", d: "INSTALACIÓN ELÉCTRICA" },
      {
        c: "10.1", d: "Punto de iluminación con ducto, cable 2,5 mm², caja e interruptor", un: "pto", q: G.puntosLuz,
        comp: [["MAT", "duct", 6.5], ["MAT", "c25", 16], ["MAT", "caja", 1.6], ["MAT", "mec", 0.8], ["MAT", "lum", 1],
          ["MO", "ele", 2.10], ["MO", "ayu", 1.40]]
      },
      {
        c: "10.2", d: "Punto de tomacorriente doble con puesta a tierra", un: "pto", q: G.puntosToma,
        comp: [["MAT", "duct", 5.5], ["MAT", "c25", 14], ["MAT", "caja", 1.2], ["MAT", "mec", 1], ["MO", "ele", 1.70], ["MO", "ayu", 1.10]]
      },
      {
        c: "10.3", d: "Tablero de distribución 12 polos con diferencial y térmicas", un: "pza", q: 1,
        comp: [["MAT", "tab", 1], ["MAT", "c40", 28], ["MAT", "acc", 320], ["MO", "ele", 9.00], ["MO", "ayu", 4.00]]
      },
      {
        c: "10.4", d: "Acometida, medidor y puesta a tierra con jabalina", un: "glb", q: 1,
        comp: [["MAT", "c40", 35], ["MAT", "duct", 18], ["MAT", "acc", 1450], ["MO", "ele", 14.00], ["MO", "ayu", 8.00]]
      },
      {
        c: "10.5", d: "Previsión para sistema fotovoltaico: ducto, cableado y tablero en cubierta", un: "glb", q: 1,
        comp: [["MAT", "duct", 45], ["MAT", "c40", 60], ["MAT", "acc", 780], ["MO", "ele", 12.00], ["MO", "ayu", 8.00]]
      },
      { ch: "11", d: "OBRAS EXTERIORES" },
      {
        c: "11.1", d: "Cerco perimetral de ladrillo visto h=2,20 m con columnetas y viga", un: "m²", q: G.cercoLateral,
        comp: [["MAT", "lad18", 34], ["MAT", "cem", 0.85], ["MAT", "are", 0.055], ["MAT", "fie", 5.5],
          ["MO", "mae", 0.14], ["MO", "alb", 1.00], ["MO", "ayu", 1.20]]
      },
      {
        c: "11.2", d: "Cerco frontal: zócalo de 1,00 m y reja metálica de 1,20 m", un: "ml", q: G.cercoFrontal,
        comp: [["MAT", "lad18", 36], ["MAT", "cem", 1.2], ["MAT", "bar", 1.2], ["MAT", "pint", 0.3],
          ["MO", "alb", 1.60], ["MO", "her", 1.80], ["MO", "ayu", 2.20]]
      },
      {
        c: "11.3", d: "Portón vehicular metálico 4,80 × 1,60 m y portón peatonal 1,50 m", un: "glb", q: 1,
        comp: [["MAT", "portv", 1], ["MAT", "bar", 2.2], ["MAT", "pint", 1.8], ["MAT", "acc", 320], ["MO", "her", 16.00], ["MO", "ayu", 10.00]]
      },
      {
        c: "11.4", d: "Pavimento exterior de hormigón e=10 cm con malla y juntas", un: "m²", q: G.pavimentoExt,
        comp: [["MAT", "cem", 0.72], ["MAT", "are", 0.050], ["MAT", "gra", 0.075], ["MAT", "fie", 2.6],
          ["MO", "mae", 0.10], ["MO", "alb", 0.55], ["MO", "ayu", 1.10], ["EQ", "mez", 0.12]]
      },
      {
        c: "11.5", d: "Churrasquera con mesón, parrilla y chimenea de ladrillo visto", un: "glb", q: 1,
        comp: [["MAT", "lad18", 420], ["MAT", "cem", 14], ["MAT", "are", 0.9], ["MAT", "gra", 0.4], ["MAT", "gran", 2.2], ["MAT", "par", 1850],
          ["MO", "mae", 20.00], ["MO", "alb", 40.00], ["MO", "ayu", 48.00]]
      },
      {
        c: "11.6", d: "Pérgola de madera dura con vigas 0,10 × 0,20 m y listones", un: "m²", q: G.pergola,
        comp: [["MAT", "madp", 9.5], ["MAT", "cla", 0.5], ["MAT", "pint", 0.35], ["MAT", "cem", 0.6],
          ["MO", "car", 2.40], ["MO", "ayu", 1.80]]
      },
      {
        c: "11.7", d: "Jardinería: tierra vegetal, césped y limpieza final de obra", un: "m²", q: G.jardin,
        comp: [["MAT", "ces", 1.05], ["MAT", "tve", 0.12], ["MO", "jar", 0.30], ["MO", "ayu", 0.22]]
      }
    ];
  }

  /* ====================== 4. CÁLCULO DEL APU ====================== */
  function apuOf(it) {
    var mat = [], mo = [], eq = [], A = 0, B = 0, C = 0;
    (it.comp || []).forEach(function (c) {
      var tipo = c[0], k = c[1], cant = c[2], row;
      if (tipo === "MAT") {
        var m = MAT[k];
        row = { k: k, t: "MAT", desc: m[0], un: m[1], cant: cant, pu: m[2], total: r2(cant * m[2]) };
        A += row.total; mat.push(row);
      } else if (tipo === "MO") {
        var o = MO[k];
        row = { k: k, t: "MO", desc: o[0], un: "hr", cant: cant, pu: o[1], total: r2(cant * o[1]) };
        B += row.total; mo.push(row);
      } else {
        var e = EQ[k];
        row = { k: k, t: "EQ", desc: e[0], un: e[1], cant: cant, pu: e[2], total: r2(cant * e[2]) };
        C += row.total; eq.push(row);
      }
    });
    var cargas = r2(B * REC.cargas);
    var ivaMO = r2((B + cargas) * REC.ivaMO);
    var subMO = r2(B + cargas + ivaMO);
    var herram = r2((B + cargas) * REC.herram);
    var subEQ = r2(C + herram);
    var D = r2(A + subMO + subEQ);
    var gg = r2(D * REC.gg);
    var ut = r2((D + gg) * REC.util);
    var it_ = r2((D + gg + ut) * REC.it);
    var pu = r2(D + gg + ut + it_);
    return {
      mat: mat, mo: mo, eq: eq,
      A: r2(A), B: r2(B), cargas: cargas, ivaMO: ivaMO, subMO: subMO,
      C: r2(C), herram: herram, subEQ: subEQ,
      D: D, gg: gg, ut: ut, it: it_, pu: pu
    };
  }

  function build() {
    var G = geom(), lista = items(G), out = [], tot = 0, cap = null, caps = [];
    lista.forEach(function (it) {
      if (it.ch) { cap = { c: it.ch, d: it.d, total: 0 }; caps.push(cap); out.push({ tipo: "cap", c: it.ch, d: it.d }); return; }
      var a = apuOf(it), q = r2(it.q), parcial = r2(q * a.pu);
      cap.total = r2(cap.total + parcial); tot = r2(tot + parcial);
      out.push({ tipo: "item", c: it.c, d: it.d, un: it.un, q: q, pu: a.pu, parcial: parcial, apu: a });
    });
    var resumen = {
      terreno: r2(G.terreno), supPB: r2(G.supPB), supPA: r2(G.supPA), supTotal: r2(G.supTotal),
      balcon: r2(G.balcon), huella: r2(G.huella), ocupacion: r2(G.huella / G.terreno * 100),
      total: tot, porM2: r2(tot / G.supTotal),
      items: out.filter(function (o) { return o.tipo === "item"; }).length,
      capitulos: caps
    };
    return { G: G, items: out, caps: caps, resumen: resumen, MAT: MAT, MO: MO, EQ: EQ, REC: REC };
  }

  return { build: build, geom: geom, MAT: MAT, MO: MO, EQ: EQ, REC: REC };
});
