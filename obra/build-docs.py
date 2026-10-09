#!/usr/bin/env python3
"""Genera el Excel de cómputos + APU + presupuesto y el Word de
especificaciones técnicas, a partir de datos.json y especificaciones.json."""
import json, os, subprocess
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

D = json.load(open("datos.json", encoding="utf-8"))
ESP = json.load(open("especificaciones.json", encoding="utf-8"))
G, RES, ITEMS, CAPS = D["G"], D["resumen"], D["items"], D["caps"]
MAT, MO, EQ, REC = D["MAT"], D["MO"], D["EQ"], D["REC"]
OUT = "entregables"
os.makedirs(OUT, exist_ok=True)

TITULO = "Casa Yerko 250 m²"
SUBT = "Vivienda unifamiliar de dos niveles con local comercial — terreno de 300 m²"

# ----------------------------------------------------------------- EXCEL
INK = "16202B"; AZUL = "1D6B8C"; AMBAR = "9C7524"; WASH = "EEF1F4"
thin = Side(style="thin", color="C9D1D9")
BORDE = Border(bottom=thin)

def head(ws, row, cols, widths=None):
    for i, c in enumerate(cols, 1):
        cell = ws.cell(row=row, column=i, value=c)
        cell.font = Font(bold=True, color="FFFFFF", size=9)
        cell.fill = PatternFill("solid", fgColor=INK)
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    if widths:
        for i, w in enumerate(widths, 1):
            ws.column_dimensions[get_column_letter(i)].width = w
    ws.row_dimensions[row].height = 26

def titulo(ws, texto, sub=None, span=6):
    ws.merge_cells(start_row=1, start_column=1, end_row=1, end_column=span)
    c = ws.cell(row=1, column=1, value=texto)
    c.font = Font(bold=True, size=15, color=INK)
    if sub:
        ws.merge_cells(start_row=2, start_column=1, end_row=2, end_column=span)
        c2 = ws.cell(row=2, column=1, value=sub)
        c2.font = Font(size=9, color="5B6A7A")

wb = Workbook()

# --- Hoja 1: resumen ---------------------------------------------------
ws = wb.active; ws.title = "Resumen"
titulo(ws, TITULO, SUBT)
r = 4
ws.cell(row=r, column=1, value="CUADRO DE SUPERFICIES").font = Font(bold=True, size=11, color=AZUL); r += 1
head(ws, r, ["Concepto", "Unidad", "Cantidad"], [46, 10, 14, 14, 16, 16]); r += 1
for k, u, v in [("Superficie del terreno", "m²", G["terreno"]),
                ("Superficie cubierta planta baja", "m²", RES["supPB"]),
                ("Superficie cubierta planta alta", "m²", RES["supPA"]),
                ("Superficie cubierta total", "m²", RES["supTotal"]),
                ("Balcón descubierto", "m²", G["balcon"]),
                ("Superficie de ocupación en planta", "m²", G["huella"]),
                ("Porcentaje de ocupación", "%", RES["ocupacion"]),
                ("Área libre del terreno", "m²", G["libre"])]:
    ws.cell(row=r, column=1, value=k).border = BORDE
    ws.cell(row=r, column=2, value=u).alignment = Alignment(horizontal="center"); ws.cell(row=r, column=2).border = BORDE
    c = ws.cell(row=r, column=3, value=v); c.number_format = "#,##0.00"; c.border = BORDE
    r += 1
r += 1
ws.cell(row=r, column=1, value="PROGRAMA ARQUITECTÓNICO").font = Font(bold=True, size=11, color=AZUL); r += 1
for k, v in [("Dormitorios", "4 de 15,00 m² (uno en suite)"), ("Baños completos", "4"),
             ("Sala – comedor", "43,40 m²"), ("Cocina", "17,28 m²"),
             ("Garaje", "2 autos · 28,00 m²"), ("Tienda", "14,00 m² con acceso desde la calle"),
             ("Lavandería", "5,10 m²"), ("Churrasquera", "3,50 × 3,00 m bajo pérgola"),
             ("Niveles", "2 · altura libre 2,70 m y 2,60 m")]:
    ws.cell(row=r, column=1, value=k).border = BORDE
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=3)
    ws.cell(row=r, column=2, value=v).border = BORDE
    r += 1
r += 1
ws.cell(row=r, column=1, value="RESUMEN DE PRESUPUESTO (Bs)").font = Font(bold=True, size=11, color=AZUL); r += 1
head(ws, r, ["Capítulo", "Descripción", "Parcial Bs"]); r += 1
cap_rows = []
for c in CAPS:
    ws.cell(row=r, column=1, value=c["c"]).alignment = Alignment(horizontal="center")
    ws.cell(row=r, column=2, value=c["d"])
    cap_rows.append(r)
    r += 1
first_cap = cap_rows[0]
tot_row = r
ws.cell(row=r, column=2, value="TOTAL PRESUPUESTO").font = Font(bold=True, size=11)
tc = ws.cell(row=r, column=3, value=f"=SUM(C{first_cap}:C{r-1})")
tc.font = Font(bold=True, size=11); tc.number_format = "#,##0.00"
r += 1
ws.cell(row=r, column=2, value="Costo por m² cubierto")
ws.cell(row=r, column=3, value=f"=C{tot_row}/{RES['supTotal']}").number_format = "#,##0.00"
r += 2
ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=3)
ws.cell(row=r, column=1, value=(
    "Precios referenciales de mercado 2026 en bolivianos. Cambie los valores en la hoja «Insumos» "
    "y todo el presupuesto se recalcula. No incluye estudio de suelos, cálculo estructural, muebles, "
    "climatización, aprobación municipal, conexiones domiciliarias ni imprevistos.")).alignment = Alignment(wrap_text=True)
ws.row_dimensions[r].height = 40

# --- Hoja 2: insumos ---------------------------------------------------
wi = wb.create_sheet("Insumos")
titulo(wi, "Precios de insumos", "Edite la columna D y el presupuesto completo se actualiza", 4)
head(wi, 4, ["Código", "Descripción", "Unidad", "Precio Bs"], [12, 56, 14, 14])
ri = 5
for k, v in MAT.items():
    wi.cell(row=ri, column=1, value="MAT." + k); wi.cell(row=ri, column=2, value=v[0])
    wi.cell(row=ri, column=3, value=v[1]).alignment = Alignment(horizontal="center")
    wi.cell(row=ri, column=4, value=v[2]).number_format = "#,##0.00"
    ri += 1
for k, v in MO.items():
    wi.cell(row=ri, column=1, value="MO." + k); wi.cell(row=ri, column=2, value=v[0] + " (mano de obra)")
    wi.cell(row=ri, column=3, value="hr").alignment = Alignment(horizontal="center")
    wi.cell(row=ri, column=4, value=v[1]).number_format = "#,##0.00"
    ri += 1
for k, v in EQ.items():
    wi.cell(row=ri, column=1, value="EQ." + k); wi.cell(row=ri, column=2, value=v[0] + " (equipo)")
    wi.cell(row=ri, column=3, value=v[1]).alignment = Alignment(horizontal="center")
    wi.cell(row=ri, column=4, value=v[2]).number_format = "#,##0.00"
    ri += 1
wi.cell(row=ri + 1, column=2, value="Los jornales son por hora, sobre jornada de 8 h. Las cargas sociales se aplican en cada análisis.")

def ref(fila):
    """Precio tomado de la hoja Insumos por código único (TIPO.codigo)."""
    return f'=VLOOKUP($A{fila},Insumos!$A${5}:$D${ri-1},4,0)'

# --- Hoja 3: cómputos métricos ----------------------------------------
wc = wb.create_sheet("Cómputos")
titulo(wc, "Cómputos métricos", "Cantidades derivadas de la geometría del proyecto", 4)
head(wc, 4, ["Capítulo", "Descripción", "Unidad", "Cantidad"], [26, 62, 10, 14])
COMP = [
 ("Movimiento de tierras", [
   ("Excavación de zapatas (20 u de 1,40 × 1,40 × 1,20 m)", "m³", G["excavZapatas"]),
   ("Excavación de zanja de cimiento (72,00 ml × 0,50 × 1,00 m)", "m³", G["excavCimiento"]),
   ("Relleno y compactado", "m³", G["relleno"]),
   ("Retiro de escombros (esponjamiento 1,25)", "m³", G["escombros"])]),
 ("Estructura de hormigón", [
   ("Hormigón ciclópeo de cimiento corrido", "m³", G["volCiclopeo"]),
   ("H°A° en zapatas aisladas", "m³", G["volZapatas"]),
   ("H°A° en sobrecimiento y viga de arranque", "m³", G["volSobrecimiento"]),
   ("H°A° en columnas", "m³", G["volColumnas"]),
   ("H°A° en vigas", "m³", G["volVigas"]),
   ("Losa aligerada de entrepiso y cubierta", "m²", G["losaTotal"]),
   ("Escalera de hormigón armado", "m²", G["escalera"]),
   ("Acero de refuerzo fy = 4 200 kg/cm²", "kg", G["acero"]),
   ("Encofrado de columnas y vigas", "m²", G["encofrado"])]),
 ("Mampostería y revoques", [
   ("Muro de ladrillo gambote 18 cm (neto de vanos)", "m²", G["muro18"]),
   ("Tabique de ladrillo 12 cm", "m²", G["tabique12"]),
   ("Parapeto de cubierta h = 0,80 m", "m²", G["parapeto"]),
   ("Revoque interior de yeso", "m²", G["revoqueInt"]),
   ("Revoque exterior de mortero", "m²", G["revoqueExt"]),
   ("Cielo raso de yeso", "m²", G["cieloRaso"]),
   ("Pintura interior", "m²", G["pinturaInt"]),
   ("Pintura exterior", "m²", G["pinturaExt"])]),
 ("Pisos y revestimientos", [
   ("Contrapiso de hormigón sobre terreno", "m²", G["contrapiso"]),
   ("Piso de porcelanato 60 × 60 cm", "m²", G["pisoPorcelanato"]),
   ("Piso flotante en dormitorios", "m²", G["pisoFlotante"]),
   ("Piso de cerámica antideslizante", "m²", G["pisoCeramica"]),
   ("Zócalo de porcelanato", "ml", G["zocalo"]),
   ("Azulejo en baños h = 2,10 m", "m²", G["azulejoBanos"]),
   ("Azulejo en cocina y lavandería", "m²", G["azulejoCocina"]),
   ("Mesón de granito", "m²", G["meson"])]),
 ("Cubierta y carpintería", [
   ("Impermeabilización de losa", "m²", G["impermeabilizacion"]),
   ("Bajantes pluviales Ø110 mm", "ml", G["bajantes"]),
   ("Puertas interiores placa", "pza", G["puertasInt"]),
   ("Puertas exteriores", "pza", G["puertasExt"]),
   ("Ventanas de aluminio con vidrio 6 mm", "m²", G["ventanasM2"]),
   ("Portón seccional de garaje", "pza", G["portones"]),
   ("Baranda metálica de balcón y escalera", "ml", 21.80)]),
 ("Instalaciones", [
   ("Puntos de agua fría", "pto", G["puntosAguaFria"]),
   ("Puntos de agua caliente", "pto", G["puntosAguaCaliente"]),
   ("Puntos de desagüe", "pto", G["puntosDesague"]),
   ("Colectores y bajantes Ø110 mm", "ml", G["colectores"]),
   ("Cámaras de inspección", "pza", G["camaras"]),
   ("Puntos de iluminación", "pto", G["puntosLuz"]),
   ("Tomacorrientes", "pto", G["puntosToma"])]),
 ("Obras exteriores", [
   ("Cerco perimetral h = 2,20 m", "m²", G["cercoLateral"]),
   ("Cerco frontal con reja", "ml", G["cercoFrontal"]),
   ("Pavimento exterior de hormigón", "m²", G["pavimentoExt"]),
   ("Pérgola de madera", "m²", G["pergola"]),
   ("Jardinería y césped", "m²", G["jardin"])]),
]
rc = 5
for cap, filas in COMP:
    wc.cell(row=rc, column=1, value=cap).font = Font(bold=True, size=9, color=AMBAR)
    for i in range(1, 5):
        wc.cell(row=rc, column=i).fill = PatternFill("solid", fgColor=WASH)
    rc += 1
    for d, u, v in filas:
        wc.cell(row=rc, column=2, value=d).border = BORDE
        wc.cell(row=rc, column=3, value=u).alignment = Alignment(horizontal="center")
        c = wc.cell(row=rc, column=4, value=v); c.number_format = "#,##0.00"; c.border = BORDE
        rc += 1
wc.cell(row=rc + 1, column=2, value=(
    "Superficies medidas sobre ejes de muro. La mampostería se computa descontando los vanos reales "
    "(445,84 m² brutos − 56,37 m² de vanos). El acero se estima en 90 kg/m³ de hormigón estructural "
    "más 4,5 kg/m² de losa; debe reemplazarse por la planilla del cálculo estructural."))

# --- Hoja 4: APU -------------------------------------------------------
wa = wb.create_sheet("APU")
titulo(wa, "Análisis de precios unitarios", "Cada precio se calcula con fórmulas enlazadas a la hoja «Insumos»", 5)
wa.column_dimensions["A"].width = 10
wa.column_dimensions["B"].width = 56
wa.column_dimensions["C"].width = 9
wa.column_dimensions["D"].width = 11
wa.column_dimensions["E"].width = 13
wa.column_dimensions["F"].width = 14
ra = 4
pu_cell = {}
items = [i for i in ITEMS if i["tipo"] == "item"]
for it in items:
    a = it["apu"]
    wa.merge_cells(start_row=ra, start_column=1, end_row=ra, end_column=6)
    c = wa.cell(row=ra, column=1, value=f"ÍTEM {it['c']} — {it['d']}")
    c.font = Font(bold=True, size=10, color="FFFFFF"); c.fill = PatternFill("solid", fgColor=INK)
    ra += 1
    wa.cell(row=ra, column=1, value="Unidad"); wa.cell(row=ra, column=2, value=it["un"])
    wa.cell(row=ra, column=3, value="Cantidad de obra")
    wa.cell(row=ra, column=4, value=it["q"]).number_format = "#,##0.00"
    ra += 1
    head(wa, ra, ["Código", "Descripción", "Unidad", "Cantidad", "Precio Bs", "Parcial Bs"])
    ra += 1
    sub = {}
    for tipo, etiqueta in (("mat", "1. MATERIALES"), ("mo", "2. MANO DE OBRA"), ("eq", "3. EQUIPO Y MAQUINARIA")):
        rows = a[tipo]
        wa.cell(row=ra, column=2, value=etiqueta).font = Font(bold=True, size=9, color=AZUL)
        for i in range(1, 7):
            wa.cell(row=ra, column=i).fill = PatternFill("solid", fgColor=WASH)
        ra += 1
        ini = ra
        for row in rows:
            wa.cell(row=ra, column=1, value=row["t"] + "." + row["k"])
            wa.cell(row=ra, column=2, value=row["desc"])
            wa.cell(row=ra, column=3, value=row["un"]).alignment = Alignment(horizontal="center")
            wa.cell(row=ra, column=4, value=row["cant"]).number_format = "#,##0.000"
            pc = wa.cell(row=ra, column=5, value=ref(ra))
            pc.number_format = "#,##0.00"
            tc2 = wa.cell(row=ra, column=6, value=f"=ROUND(D{ra}*E{ra},2)"); tc2.number_format = "#,##0.00"
            ra += 1
        fin = ra - 1
        wa.cell(row=ra, column=2, value=f"Subtotal {etiqueta[3:].lower()}").font = Font(bold=True, size=9)
        sc = wa.cell(row=ra, column=6, value=(f"=SUM(F{ini}:F{fin})" if fin >= ini else 0))
        sc.number_format = "#,##0.00"; sc.font = Font(bold=True, size=9)
        sub[tipo] = ra
        ra += 1
        if tipo == "mo":
            wa.cell(row=ra, column=2, value=f"Cargas sociales {REC['cargas']*100:.0f} %")
            wa.cell(row=ra, column=6, value=f"=ROUND(F{sub['mo']}*{REC['cargas']},2)").number_format = "#,##0.00"
            cs = ra; ra += 1
            wa.cell(row=ra, column=2, value=f"IVA sobre mano de obra {REC['ivaMO']*100:.2f} %")
            wa.cell(row=ra, column=6, value=f"=ROUND((F{sub['mo']}+F{cs})*{REC['ivaMO']},2)").number_format = "#,##0.00"
            iva = ra; ra += 1
            wa.cell(row=ra, column=2, value="Subtotal mano de obra con recargos").font = Font(bold=True, size=9)
            wa.cell(row=ra, column=6, value=f"=F{sub['mo']}+F{cs}+F{iva}").number_format = "#,##0.00"
            sub["mo_tot"] = ra; sub["cs"] = cs; ra += 1
        if tipo == "eq":
            wa.cell(row=ra, column=2, value=f"Herramientas menores {REC['herram']*100:.0f} % de la mano de obra")
            wa.cell(row=ra, column=6, value=f"=ROUND((F{sub['mo']}+F{sub['cs']})*{REC['herram']},2)").number_format = "#,##0.00"
            hm = ra; ra += 1
            wa.cell(row=ra, column=2, value="Subtotal equipo y herramientas").font = Font(bold=True, size=9)
            wa.cell(row=ra, column=6, value=f"=F{sub['eq']}+F{hm}").number_format = "#,##0.00"
            sub["eq_tot"] = ra; ra += 1
    wa.cell(row=ra, column=2, value="COSTO DIRECTO (1 + 2 + 3)").font = Font(bold=True, size=9)
    wa.cell(row=ra, column=6, value=f"=F{sub['mat']}+F{sub['mo_tot']}+F{sub['eq_tot']}").number_format = "#,##0.00"
    cd = ra; ra += 1
    wa.cell(row=ra, column=2, value=f"Gastos generales y administrativos {REC['gg']*100:.0f} %")
    wa.cell(row=ra, column=6, value=f"=ROUND(F{cd}*{REC['gg']},2)").number_format = "#,##0.00"
    gg = ra; ra += 1
    wa.cell(row=ra, column=2, value=f"Utilidad {REC['util']*100:.0f} %")
    wa.cell(row=ra, column=6, value=f"=ROUND((F{cd}+F{gg})*{REC['util']},2)").number_format = "#,##0.00"
    ut = ra; ra += 1
    wa.cell(row=ra, column=2, value=f"Impuesto a las transacciones {REC['it']*100:.2f} %")
    wa.cell(row=ra, column=6, value=f"=ROUND((F{cd}+F{gg}+F{ut})*{REC['it']},2)").number_format = "#,##0.00"
    itx = ra; ra += 1
    c = wa.cell(row=ra, column=2, value=f"PRECIO UNITARIO ({it['un']})")
    c.font = Font(bold=True, size=10)
    pc = wa.cell(row=ra, column=6, value=f"=F{cd}+F{gg}+F{ut}+F{itx}")
    pc.font = Font(bold=True, size=10); pc.number_format = "#,##0.00"
    pc.fill = PatternFill("solid", fgColor="FFF3D6")
    pu_cell[it["c"]] = ra
    ra += 2

# --- Hoja 5: presupuesto ----------------------------------------------
wp = wb.create_sheet("Presupuesto")
titulo(wp, "Presupuesto general", "Los precios unitarios vienen de la hoja «APU»; las cantidades, de «Cómputos»", 6)
head(wp, 4, ["Ítem", "Descripción", "Unidad", "Cantidad", "P. unitario Bs", "Parcial Bs"],
     [9, 60, 9, 13, 15, 16])
rp = 5
cap_sum, cur = [], None
for it in ITEMS:
    if it["tipo"] == "cap":
        if cur: cap_sum.append((cur[0], cur[1], rp - 1))
        wp.cell(row=rp, column=1, value=it["c"]).font = Font(bold=True, size=9, color=AMBAR)
        wp.cell(row=rp, column=2, value=it["d"]).font = Font(bold=True, size=9, color=AMBAR)
        for i in range(1, 7):
            wp.cell(row=rp, column=i).fill = PatternFill("solid", fgColor=WASH)
        cur = (rp, rp + 1)
        rp += 1
        continue
    wp.cell(row=rp, column=1, value=it["c"]).alignment = Alignment(horizontal="center")
    wp.cell(row=rp, column=2, value=it["d"]).border = BORDE
    wp.cell(row=rp, column=3, value=it["un"]).alignment = Alignment(horizontal="center")
    wp.cell(row=rp, column=4, value=it["q"]).number_format = "#,##0.00"
    wp.cell(row=rp, column=5, value=f"=APU!F{pu_cell[it['c']]}").number_format = "#,##0.00"
    wp.cell(row=rp, column=6, value=f"=ROUND(D{rp}*E{rp},2)").number_format = "#,##0.00"
    rp += 1
if cur: cap_sum.append((cur[0], cur[1], rp - 1))
for head_row, ini, fin in cap_sum:
    c = wp.cell(row=head_row, column=6, value=f"=SUM(F{ini}:F{fin})")
    c.number_format = "#,##0.00"; c.font = Font(bold=True, size=9, color=AMBAR)
    c.fill = PatternFill("solid", fgColor=WASH)
rp += 1
wp.cell(row=rp, column=2, value="TOTAL PRESUPUESTO (Bs)").font = Font(bold=True, size=12)
formula = "+".join(f"F{h}" for h, _, _ in cap_sum)
tc = wp.cell(row=rp, column=6, value=f"={formula}")
tc.font = Font(bold=True, size=12); tc.number_format = "#,##0.00"
rp += 1
wp.cell(row=rp, column=2, value="Costo por m² cubierto (249,70 m²)")
wp.cell(row=rp, column=6, value=f"=F{rp-1}/{RES['supTotal']}").number_format = "#,##0.00"
# enlaza el resumen con los capítulos reales
for i, r0 in enumerate(cap_rows):
    ws.cell(row=r0, column=3, value=f"=Presupuesto!F{cap_sum[i][0]}").number_format = "#,##0.00"

for sheet in wb.worksheets:
    sheet.freeze_panes = "A5"
xlsx = os.path.join(OUT, "Casa-Yerko-250_Computos-APU-Presupuesto.xlsx")
wb.save(xlsx)
print("Excel:", xlsx, f"{os.path.getsize(xlsx)/1024:.0f} KB")

# ----------------------------------------------------------------- WORD
doc = Document()
st = doc.styles["Normal"]
st.font.name = "Calibri"; st.font.size = Pt(10.5)
for s in doc.sections:
    s.top_margin = Cm(2.2); s.bottom_margin = Cm(2.0); s.left_margin = Cm(2.4); s.right_margin = Cm(2.2)

def H(texto, nivel=1, color=INK):
    p = doc.add_heading(texto, level=nivel)
    for run in p.runs:
        run.font.color.rgb = RGBColor.from_string(color)
    return p

def P(texto, size=10.5, bold=False, italic=False, space=4):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    r = p.add_run(texto); r.font.size = Pt(size); r.bold = bold; r.italic = italic
    return p

def tabla(cabeceras, filas, anchos=None):
    t = doc.add_table(rows=1, cols=len(cabeceras))
    t.style = "Light Grid Accent 1"
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(cabeceras):
        cel = t.rows[0].cells[i]
        cel.text = ""
        r = cel.paragraphs[0].add_run(h); r.bold = True; r.font.size = Pt(9)
    for fila in filas:
        cells = t.add_row().cells
        for i, v in enumerate(fila):
            cells[i].text = ""
            r = cells[i].paragraphs[0].add_run(str(v)); r.font.size = Pt(9)
            if i and isinstance(v, str) and v and (v[0].isdigit() or v[0] in "±"):
                cells[i].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
    if anchos:
        for i, w in enumerate(anchos):
            for row in t.rows:
                row.cells[i].width = Cm(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t

def num(v, d=2):
    return f"{v:,.{d}f}".replace(",", "@").replace(".", ",").replace("@", ".")

p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("ESPECIFICACIONES TÉCNICAS Y MEMORIA DESCRIPTIVA"); r.bold = True; r.font.size = Pt(9)
r.font.color.rgb = RGBColor.from_string(AMBAR)
H(TITULO, 0)
P(SUBT, 11.5, italic=True, space=14)

H("1. Memoria descriptiva", 1)
P("El proyecto resuelve una vivienda unifamiliar de dos niveles con un local comercial independiente, "
  "sobre un terreno de 12,00 × 25,00 m con una superficie de 300,00 m². La superficie cubierta total es "
  "de 249,70 m², repartidos en 132,00 m² de planta baja y 117,70 m² de planta alta, más un balcón "
  "descubierto de 14,30 m². La ocupación en planta es del 44 % del terreno, lo que deja 168,00 m² libres "
  "entre el retiro frontal y el patio posterior.")
P("La planta baja separa tres accesos sobre la calle: el portón del garaje para dos autos, el ingreso "
  "peatonal al hall y la puerta propia de la tienda, de modo que la actividad comercial nunca atraviesa la "
  "vivienda. Hacia el patio se ubica la zona social: una sala–comedor de 43,40 m² con ventanal corredizo "
  "de 2,40 m y una cocina de 17,28 m² vinculada por un vano libre de 1,40 m. El núcleo húmedo agrupa el "
  "baño social, el baño de servicio y la lavandería sobre un mismo montante sanitario, lo que reduce "
  "recorridos de tubería y puntos de falla.")
P("La planta alta organiza cuatro dormitorios alrededor de un pasillo de 1,20 m. Tres de ellos miden "
  "exactamente 5,00 × 3,00 m, es decir 15,00 m² cada uno, y el cuarto es la suite principal de 15,84 m² "
  "con baño propio, vestidor de 5,60 m² y salida a una terraza cubierta de 8,16 m². Completan el nivel un "
  "estar familiar de 10,36 m², un baño compartido y el balcón frontal, cuyo vuelo de 1,30 m protege del "
  "sol la fachada de la calle.")
P("La construcción se resuelve con estructura aporticada de hormigón armado sobre zapatas aisladas, "
  "cerramientos de ladrillo gambote de 18 cm y losas aligeradas de 0,20 m. La cubierta es plana, "
  "impermeabilizada y con parapeto de 0,80 m, y aloja el tanque de reserva de 1 000 litros sobre la caja "
  "de escalera y la previsión para seis paneles fotovoltaicos. En el patio posterior, de 10,00 m de fondo, "
  "se ubican la churrasquera de 3,50 × 3,00 m bajo pérgola de madera, el tendedero y 120 m² de jardín.")

H("2. Cuadro de superficies", 1)
tabla(["Ambiente", "Medidas (m)", "m²"],
      [[r0["n"], f"{r0['r'][2]-r0['r'][0]:.2f} × {r0['r'][3]-r0['r'][1]:.2f}".replace(".", ","),
        num((r0["r"][2]-r0["r"][0])*(r0["r"][3]-r0["r"][1]))]
       for r0 in json.load(open("datos.json", encoding="utf-8"))["G"] and []] or
      [["PLANTA BAJA", "", ""]] +
      [[n, m, a] for n, m, a in [
          ("Garaje 2 autos", "5,60 × 5,00", "28,00"), ("Hall · Escalera", "2,60 × 5,00", "13,00"),
          ("Tienda", "2,80 × 5,00", "14,00"), ("Sala – Comedor", "6,20 × 7,00", "43,40"),
          ("Pasillo", "1,40 × 3,40", "4,76"), ("Baño 1 social", "1,70 × 1,90", "3,23"),
          ("Baño 2 de servicio", "1,70 × 1,90", "3,23"), ("Lavandería", "3,40 × 1,50", "5,10"),
          ("Cocina", "4,80 × 3,60", "17,28"), ("Subtotal planta baja", "", "132,00"),
          ("PLANTA ALTA", "", ""),
          ("Dormitorio 1", "5,00 × 3,00", "15,00"), ("Dormitorio 2", "5,00 × 3,00", "15,00"),
          ("Dormitorio 3", "5,00 × 3,00", "15,00"), ("Dormitorio 4 · Suite", "4,80 × 3,30", "15,84"),
          ("Baño 3 compartido", "3,20 × 1,70", "5,44"), ("Baño 4 de la suite", "2,00 × 2,00", "4,00"),
          ("Vestidor", "2,80 × 2,00", "5,60"), ("Clóset de blancos", "1,80 × 1,70", "3,06"),
          ("Estar familiar", "2,80 × 3,70", "10,36"), ("Hall · Escalera", "3,20 × 3,70", "11,84"),
          ("Pasillo", "1,20 × 7,00", "8,40"), ("Terraza cubierta", "4,80 × 1,70", "8,16"),
          ("Subtotal planta alta", "", "117,70"),
          ("TOTAL CUBIERTO", "", "249,70"), ("Balcón descubierto", "11,00 × 1,30", "14,30")]],
      [8.5, 4.5, 3.0])

doc.add_page_break()
H("3. Especificaciones técnicas por capítulo", 1)
for cap in ESP:
    H(f"{cap['c']}. {cap['t']}", 2, AZUL)
    for sub, texto in cap["b"]:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(5)
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        r = p.add_run(sub + ". "); r.bold = True; r.font.size = Pt(10.5)
        r2 = p.add_run(texto); r2.font.size = Pt(10.5)

doc.add_page_break()
H("4. Resumen de presupuesto", 1)
P(f"Presupuesto referencial de {num(RES['total'])} bolivianos, equivalente a {num(RES['porM2'])} Bs por metro "
  f"cuadrado cubierto, desarrollado en {RES['items']} ítems con análisis de precios unitarios individual. "
  "La estructura de cada precio es: materiales, más mano de obra con 55 % de cargas sociales y 14,94 % de "
  "IVA, más equipo y herramientas (5 % de la mano de obra), más 10 % de gastos generales, 7 % de utilidad "
  "y 3,09 % de impuesto a las transacciones.")
tabla(["Cap.", "Descripción", "Parcial Bs", "%"],
      [[c["c"], c["d"], num(c["total"]), num(c["total"] / RES["total"] * 100, 1) + " %"] for c in CAPS] +
      [["", "TOTAL PRESUPUESTO", num(RES["total"]), "100,0 %"],
       ["", "Costo por m² cubierto", num(RES["porM2"]), ""]],
      [1.6, 8.0, 3.2, 2.0])
P("Los precios de insumos son referenciales de mercado 2026 y provienen de rangos publicados en fuentes "
  "comerciales, no de una tabla oficial. Varían por ciudad, volumen de compra y fecha, por lo que deben "
  "cotizarse localmente antes de contratar. El archivo Excel adjunto permite cambiar cada precio en una "
  "sola hoja y recalcula el presupuesto completo.", 9.5, italic=True)
P("No está incluido en este presupuesto: estudio de suelos, cálculo estructural firmado, muebles de cocina "
  "y placares, climatización, paneles fotovoltaicos (solo su previsión), cortinas, aprobación de planos y "
  "tasas municipales, conexiones domiciliarias ante las empresas prestadoras, ni imprevistos, que se "
  "recomienda presupuestar entre el 5 % y el 8 % adicional.", 9.5, italic=True)

docx = os.path.join(OUT, "Casa-Yerko-250_Especificaciones-Tecnicas.docx")
doc.save(docx)
print("Word:", docx, f"{os.path.getsize(docx)/1024:.0f} KB")

subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", OUT, docx],
               check=True, capture_output=True, timeout=240)
pdf = docx.replace(".docx", ".pdf")
print("PDF:", pdf, f"{os.path.getsize(pdf)/1024:.0f} KB")
