# Casa Yerko 250 m² — anteproyecto

Vivienda unifamiliar de dos niveles con local comercial, 249,70 m² cubiertos
sobre un terreno de 300 m² (12,00 × 25,00 m).

Todo el material sale de un único modelo geométrico, así que los planos, el
render, los cómputos métricos y el presupuesto no pueden contradecirse.

## Fuentes

| Archivo | Contenido |
|---|---|
| `proyecto.js` | Geometría (ambientes, vanos, mobiliario), segmentación de muros y generadores SVG: plantas, implantación, fachadas y axonometría. |
| `presupuesto.js` | Precios de insumos y jornales, composición de los 59 ítems, cálculo del APU y del presupuesto. |
| `especificaciones.js` | Especificaciones técnicas por capítulo. |
| `view3d.js` | Render 3D navegable en canvas 2D, sin librerías ni WebGL. |
| `index.html`, `plan.css` | Lámina web que reúne todo. |

## Generar los entregables

```bash
node build-datos.js      # recalcula cómputos y presupuesto -> datos.js / datos.json
node build-planos.mjs    # PDF de planos A3 (requiere Chromium/Playwright)
python3 build-docs.py    # Excel de cómputos+APU y Word/PDF de especificaciones
```

Para cambiar un precio, edítelo en `presupuesto.js` (objeto `MAT`, `MO` o `EQ`)
y vuelva a correr `node build-datos.js`. En el Excel entregado, la hoja
*Insumos* cumple la misma función con fórmulas vivas.

## Alcance

Anteproyecto. Antes de construir hacen falta estudio de suelos, cálculo
estructural firmado y planos aprobados por el municipio. Los retiros (3,00 m
frontal, 0,50 m laterales) y la altura (6,30 m al parapeto) deben confrontarse
con el reglamento municipal del lote. Los precios son referenciales de mercado
2026 y deben cotizarse localmente.
