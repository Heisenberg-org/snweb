#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["nicegui"]
# ///
# =====================================================================
#  PANEL DE LAS GAFAS - Nodo Escuela Reynaldo Merín
#  Anteojos detectores de obstáculos · Proyecto 2
#  Conectados por Mendoza Futura - Episodio 3, Estación 3
#
#  Panel de calibración para las gafas en MODO DIAGNÓSTICO.
#  Muestra la distancia con un medidor de aguja, deja mover el umbral
#  con un deslizador y registra todo en un CSV.
#
#  ANTES DE EJECUTARLO
#  ---------------------------------------------------------------
#  1. Poner las gafas en modo diagnóstico: mantener el táctil apretado
#     mientras se enciende la placa, 3 segundos, hasta sentir 3 pulsos.
#  2. Conectar la notebook a la red   Gafas-Merin   (clave vibra2026)
#
#  CÓMO EJECUTARLO
#  ---------------------------------------------------------------
#     uv run panel_gafas_merin.py
#
#  Si tu uv es viejo y no lee el bloque de arriba:
#     uv run --with nicegui panel_gafas_merin.py
#
#  Se abre solo en el navegador. Desde el celular, entrar a la dirección
#  que imprime la consola al arrancar (el celular tiene que estar en la
#  misma red Gafas-Merin).
#
#  El CSV se guarda en la carpeta desde donde ejecutás el comando.
# =====================================================================

import csv
import json
import socket
import sys
import urllib.error
import urllib.request
from collections import deque
from datetime import datetime
from pathlib import Path

from nicegui import run, ui

# ---------------------------------------------------------------------
#  CONFIGURACIÓN
# ---------------------------------------------------------------------
IP_POR_DEFECTO = "192.168.4.1"
INTERVALO_S    = 1.0          # las gafas miden cada 500 ms: pedimos cada 1 s
TIMEOUT_S      = 3.0
MAX_PUNTOS     = 600          # 10 minutos de historia
PUERTO_WEB     = 8080
DISTANCIA_MAX  = 1200         # alcance útil del VL53L0X en mm

# Paleta institucional
VIOLETA  = "#1b1233"
VIOLETA2 = "#2a1d4d"
BORDE    = "#4a3a7a"
TEXTO    = "#f2f0ff"
SUAVE    = "#b3a8d8"
TEAL     = "#4ecdc4"
AMBAR    = "#efa927"
NARANJA  = "#d85a30"
ROJO     = "#e24b4a"
VERDE    = "#1d9e75"

COLORES_ESTADO = {
    "LIBRE":          VERDE,
    "OBSTACULO":      ROJO,
    "FUERA DE RANGO": AMBAR,
    "APAGADO":        BORDE,
    "SIN SENSOR":     NARANJA,
}

TEXTOS_ESTADO = {
    "LIBRE":          "CAMINO LIBRE",
    "OBSTACULO":      "OBSTÁCULO — VIBRANDO",
    "FUERA DE RANGO": "FUERA DE RANGO",
    "APAGADO":        "SISTEMA APAGADO",
    "SIN SENSOR":     "SENSOR NO DETECTADO",
}


# =====================================================================
#  ACCESO A LAS GAFAS
# =====================================================================
def pedir_datos(url_base):
    with urllib.request.urlopen(url_base + "/datos", timeout=TIMEOUT_S) as r:
        return json.loads(r.read().decode("utf-8"))


def mandar_comando(url_base, comando, valor=None):
    url = "{}/cmd?a={}".format(url_base, comando)
    if valor is not None:
        url += "&v={}".format(int(valor))
    with urllib.request.urlopen(url, timeout=TIMEOUT_S) as r:
        r.read()
    return True


def ip_local():
    """IP de esta notebook en la red actual, para abrir el panel desde
    el celular. No manda nada: solo le pregunta al sistema por qué
    placa saldría el tráfico."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect((IP_POR_DEFECTO, 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return "127.0.0.1"


# =====================================================================
#  REGISTRO EN CSV
# =====================================================================
class Registro:
    """Guarda cada muestra en un CSV para analizarlo después con Pandas."""

    def __init__(self):
        self.archivo = None
        self.escritor = None
        self.claves = None
        self.filas = 0

    def abrir(self, datos):
        sello = datetime.now().strftime("%Y%m%d_%H%M%S")
        ruta = Path("gafas_merin_{}.csv".format(sello))
        self.claves = sorted(datos.keys())
        self.archivo = open(ruta, "w", newline="", encoding="utf-8")
        self.escritor = csv.writer(self.archivo)
        self.escritor.writerow(["fecha_hora"] + self.claves)
        self.archivo.flush()
        return ruta

    def escribir(self, datos):
        if self.escritor is None:
            return
        fila = [datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
        fila += [datos.get(k, "") for k in self.claves]
        self.escritor.writerow(fila)
        self.archivo.flush()      # si se corta la luz no se pierde nada
        self.filas += 1


# =====================================================================
#  PANEL
# =====================================================================
class PanelGafas:

    def __init__(self, ip):
        self.url_base = "http://" + ip
        self.registro = Registro()
        self.registro_abierto = False
        self.distancias = deque(maxlen=MAX_PUNTOS)
        self.umbrales = deque(maxlen=MAX_PUNTOS)
        self.momentos = deque(maxlen=MAX_PUNTOS)
        self.fallos = 0
        self.umbral_actual = 200
        self.ajustando = False    # true mientras se arrastra el deslizador
        self.armar()

    # ---------------- estructura de la página ----------------
    def armar(self):
        ui.dark_mode().enable()
        ui.query("body").style("background-color: {}".format(VIOLETA))

        # --- encabezado ---
        with ui.row().classes("w-full items-center justify-between"):
            with ui.column().classes("gap-0"):
                ui.label("Gafas detectoras de obstáculos").style(
                    "font-size:22px;font-weight:600;color:{}".format(TEXTO))
                ui.label("Panel de calibración · Nodo Reynaldo Merín").style(
                    "font-size:13px;color:{}".format(SUAVE))
            with ui.column().classes("gap-0 items-end"):
                with ui.row().classes("items-center gap-2"):
                    self.entrada_ip = ui.input(value=IP_POR_DEFECTO).props(
                        "dense outlined").style("width:150px")
                    ui.button("Conectar", on_click=self.cambiar_ip).props(
                        "dense no-caps")
                self.lbl_conexion = ui.label("● buscando las gafas").style(
                    "font-size:13px;font-weight:600;color:{}".format(AMBAR))
                self.lbl_registro = ui.label("").style(
                    "font-size:11px;color:{}".format(SUAVE))

        # --- banner de estado ---
        self.banner = ui.label("Esperando datos...").classes(
            "w-full text-center q-pa-md rounded-borders q-mt-sm").style(
            "font-size:22px;font-weight:700;background-color:{};color:{}"
            .format(VIOLETA2, TEXTO))

        # --- medidor + tarjetas ---
        with ui.row().classes("w-full q-mt-md gap-4 no-wrap"):
            with ui.column().classes("flex-grow"):
                self.medidor = ui.echart(self.opciones_medidor()).style(
                    "height:320px")
            with ui.column().classes("gap-3").style("min-width:250px"):
                self.tarjetas = {}
                for clave, etiqueta, unidad in [
                        ("umbral_mm",   "Umbral de aviso",   "mm"),
                        ("vibra",       "Vibrando",          ""),
                        ("lecturas_ok", "Lecturas válidas",  ""),
                        ("fuera_rango", "Fuera de rango",    ""),
                        ("tasa_fallo",  "Fallo de medición", "%"),
                        ("uptime_s",    "Encendida hace",    "s")]:
                    with ui.card().classes("w-full").style(
                            "background-color:{};border:1px solid {};"
                            "box-shadow:none;padding:10px".format(VIOLETA2, BORDE)):
                        ui.label(etiqueta.upper()).style(
                            "font-size:10px;letter-spacing:.5px;color:{}"
                            .format(SUAVE))
                        with ui.row().classes("items-baseline gap-1"):
                            self.tarjetas[clave] = ui.label("--").style(
                                "font-size:22px;font-weight:600;color:{}"
                                .format(TEXTO))
                            if unidad:
                                ui.label(unidad).style(
                                    "font-size:12px;color:{}".format(SUAVE))

        # --- control del umbral ---
        with ui.card().classes("w-full q-mt-md").style(
                "background-color:{};border:1px solid {};box-shadow:none"
                .format(VIOLETA2, BORDE)):
            ui.label("UMBRAL DE VIBRACIÓN").style(
                "font-size:11px;letter-spacing:.5px;color:{}".format(SUAVE))
            ui.label("Mové el deslizador mientras alguien camina con las "
                     "gafas puestas. Se aplica al soltarlo.").style(
                "font-size:12px;color:{}".format(SUAVE))
            # El evento 'change' de Quasar salta al SOLTAR el deslizador,
            # no mientras se arrastra: así no inundamos a las gafas de
            # pedidos en cada píxel de movimiento.
            self.deslizador = ui.slider(min=50, max=DISTANCIA_MAX, step=25,
                                        value=200).props("label-always")
            self.deslizador.on("change", self.aplicar_umbral)

            with ui.row().classes("w-full q-mt-sm gap-2"):
                ui.button("Probar motor",
                          on_click=lambda: self.enviar("prueba")
                          ).props("no-caps").style(
                    "background-color:{}".format(TEAL))
                ui.button("Encender",
                          on_click=lambda: self.enviar("encender")
                          ).props("no-caps")
                ui.button("Apagar",
                          on_click=lambda: self.enviar("apagar")
                          ).props("no-caps").style(
                    "background-color:{}".format(ROJO))

        # --- gráfico de historia ---
        self.grafico = ui.echart(self.opciones_grafico()).classes(
            "w-full q-mt-md").style("height:280px")

        ui.timer(INTERVALO_S, self.actualizar)

    # ---------------- configuración de los gráficos ----------------
    def opciones_medidor(self):
        """Medidor de aguja. Las bandas de color siguen al umbral: lo que
        está por debajo del umbral se pinta rojo, porque es lo que hace
        vibrar. Así el chico ve el umbral, no solo lo lee."""
        u = self.umbral_actual
        corte_rojo = min(1.0, u / DISTANCIA_MAX)
        corte_ambar = min(1.0, (u * 2.0) / DISTANCIA_MAX)
        bandas = [[corte_rojo, ROJO]]
        if corte_ambar > corte_rojo:
            bandas.append([corte_ambar, AMBAR])
        if corte_ambar < 1.0:
            bandas.append([1.0, VERDE])

        return {
            "backgroundColor": "transparent",
            "series": [{
                "type": "gauge",
                "min": 0, "max": DISTANCIA_MAX,
                "radius": "92%",
                "startAngle": 200, "endAngle": -20,
                "splitNumber": 6,
                "axisLine": {"lineStyle": {"width": 20, "color": bandas}},
                "pointer": {"itemStyle": {"color": TEXTO}},
                "axisTick": {"lineStyle": {"color": SUAVE}},
                "splitLine": {"lineStyle": {"color": SUAVE}},
                "axisLabel": {"color": SUAVE, "fontSize": 10, "distance": 25},
                "title": {"show": False},
                "detail": {"valueAnimation": True,
                           "formatter": "{value} mm",
                           "color": TEXTO, "fontSize": 30, "offsetCenter": [0, "70%"]},
                "data": [{"value": 0}],
            }],
        }

    def opciones_grafico(self):
        return {
            "backgroundColor": "transparent",
            "title": {"text": "Distancia medida y umbral",
                      "textStyle": {"color": TEXTO, "fontSize": 14}},
            "tooltip": {"trigger": "axis"},
            "legend": {"data": ["Distancia (mm)", "Umbral (mm)"],
                       "textStyle": {"color": SUAVE}, "top": 26},
            "grid": {"left": 55, "right": 20, "top": 66, "bottom": 40},
            "xAxis": {"type": "category", "data": [],
                      "axisLabel": {"color": SUAVE, "fontSize": 10},
                      "axisLine": {"lineStyle": {"color": BORDE}}},
            "yAxis": {"type": "value", "min": 0,
                      "axisLabel": {"color": SUAVE, "fontSize": 10},
                      "axisLine": {"lineStyle": {"color": BORDE}},
                      "splitLine": {"lineStyle": {"color": BORDE,
                                                  "opacity": 0.4}}},
            "series": [
                {"name": "Distancia (mm)", "type": "line", "smooth": True,
                 "showSymbol": False, "connectNulls": False, "data": [],
                 "lineStyle": {"color": TEAL, "width": 2},
                 "itemStyle": {"color": TEAL}},
                {"name": "Umbral (mm)", "type": "line", "step": "end",
                 "showSymbol": False, "data": [],
                 "lineStyle": {"color": AMBAR, "width": 1.5, "type": "dashed"},
                 "itemStyle": {"color": AMBAR}},
            ],
        }

    # ---------------- ciclo de actualización ----------------
    async def actualizar(self):
        try:
            datos = await run.io_bound(pedir_datos, self.url_base)
        except (urllib.error.URLError, OSError, ValueError):
            self.sin_conexion()
            return

        # Verificamos que sea la placa correcta antes de mostrar nada.
        if "distancia_mm" not in datos:
            self.lbl_conexion.set_text("● responde, pero no son las gafas")
            self.lbl_conexion.style("color:{}".format(AMBAR))
            return

        self.fallos = 0
        self.lbl_conexion.set_text("● conectado")
        self.lbl_conexion.style("color:{}".format(VERDE))

        if not self.registro_abierto:
            ruta = self.registro.abrir(datos)
            self.lbl_registro.set_text("registrando en {}".format(ruta.name))
            self.registro_abierto = True
        self.registro.escribir(datos)

        distancia = int(datos.get("distancia_mm", -1))
        umbral    = int(datos.get("umbral_mm", 200))

        # Si el umbral cambió en la placa, se redibujan las bandas del
        # medidor y se acomoda el deslizador (salvo que lo estén moviendo).
        if umbral != self.umbral_actual:
            self.umbral_actual = umbral
            self.medidor.options = self.opciones_medidor()
            if not self.ajustando:
                self.deslizador.set_value(umbral)

        self.actualizar_banner(datos, distancia)
        self.actualizar_tarjetas(datos)

        # Fuera de rango se muestra como aguja al máximo: no hay nada
        # detectado dentro del alcance. En el gráfico, en cambio, se
        # guarda como hueco, para que los fallos se vean como fallos.
        self.medidor.options["series"][0]["data"][0]["value"] = (
            DISTANCIA_MAX if distancia < 0 else distancia)
        self.medidor.update()

        self.momentos.append(datetime.now().strftime("%H:%M:%S"))
        self.distancias.append(None if distancia < 0 else distancia)
        self.umbrales.append(umbral)
        self.grafico.options["xAxis"]["data"] = list(self.momentos)
        self.grafico.options["series"][0]["data"] = list(self.distancias)
        self.grafico.options["series"][1]["data"] = list(self.umbrales)
        self.grafico.update()

    def actualizar_banner(self, datos, distancia):
        estado = str(datos.get("estado", "--"))
        color = COLORES_ESTADO.get(estado, VIOLETA2)
        texto = TEXTOS_ESTADO.get(estado, estado)
        if estado == "OBSTACULO" and distancia >= 0:
            texto += "  ·  {} mm".format(distancia)
        letra = "#412402" if color == AMBAR else TEXTO
        self.banner.set_text(texto)
        self.banner.style("font-size:22px;font-weight:700;"
                          "background-color:{};color:{}".format(color, letra))

    def actualizar_tarjetas(self, datos):
        ok = int(datos.get("lecturas_ok", 0))
        fuera = int(datos.get("fuera_rango", 0))
        total = ok + fuera
        # Este porcentaje es el dato más útil de todo el panel cuando
        # prueban contra vidrio, espejo o ropa negra: cuantifica la
        # limitación del sensor en lugar de dejarla en una impresión.
        tasa = (fuera * 100.0 / total) if total else 0.0

        valores = {
            "umbral_mm":   str(datos.get("umbral_mm", "--")),
            "vibra":       str(datos.get("vibra", "--")),
            "lecturas_ok": str(ok),
            "fuera_rango": str(fuera),
            "tasa_fallo":  "{:.1f}".format(tasa),
            "uptime_s":    str(datos.get("uptime_s", "--")),
        }
        for clave, texto in valores.items():
            self.tarjetas[clave].set_text(texto)

        color_vibra = ROJO if datos.get("vibrando") else TEXTO
        self.tarjetas["vibra"].style(
            "font-size:22px;font-weight:600;color:{}".format(color_vibra))

    def sin_conexion(self):
        self.fallos += 1
        # Un fallo aislado es normal: la placa estaba midiendo y no
        # atendió. Se avisa al segundo seguido para no titilar.
        if self.fallos >= 2:
            self.lbl_conexion.set_text("● sin conexión")
            self.lbl_conexion.style("color:{}".format(ROJO))

    # ---------------- acciones ----------------
    async def aplicar_umbral(self, e=None):
        self.ajustando = True
        valor = int(self.deslizador.value)
        try:
            await run.io_bound(mandar_comando, self.url_base, "umbral", valor)
            self.umbral_actual = valor
            self.medidor.options = self.opciones_medidor()
            self.medidor.update()
            ui.notify("Umbral: {} mm".format(valor), position="bottom-right")
        except (urllib.error.URLError, OSError):
            ui.notify("No se pudo cambiar el umbral", type="negative",
                      position="bottom-right")
        self.ajustando = False

    async def enviar(self, comando):
        try:
            await run.io_bound(mandar_comando, self.url_base, comando)
            ui.notify("Enviado: {}".format(comando), position="bottom-right")
        except (urllib.error.URLError, OSError):
            ui.notify("No se pudo enviar: {}".format(comando),
                      type="negative", position="bottom-right")

    def cambiar_ip(self):
        nueva = self.entrada_ip.value.strip()
        if not nueva:
            return
        self.url_base = "http://" + nueva
        self.distancias.clear()
        self.umbrales.clear()
        self.momentos.clear()
        ui.notify("Conectando a {}".format(nueva), position="bottom-right")


# =====================================================================
@ui.page("/")
def pagina():
    """Una instancia por pestaña abierta: si la notebook y el celular
    miran al mismo tiempo, cada uno tiene su propio estado."""
    ip = sys.argv[1] if len(sys.argv) > 1 else IP_POR_DEFECTO
    PanelGafas(ip)


if __name__ == "__main__":
    ip = sys.argv[1] if len(sys.argv) > 1 else IP_POR_DEFECTO
    print("=" * 64)
    print(" PANEL DE LAS GAFAS - Nodo Reynaldo Merín")
    print(" Leyendo las gafas en   http://{}".format(ip))
    print(" Panel en esta máquina  http://localhost:{}".format(PUERTO_WEB))
    print(" Panel desde el celu    http://{}:{}".format(ip_local(), PUERTO_WEB))
    print("   (el celular tiene que estar en la red Gafas-Merin)")
    print()
    print(" Recordatorio: el Wi-Fi consume batería. Modo diagnóstico solo")
    print(" para calibrar; para usar las gafas de verdad, encenderlas normal.")
    print("=" * 64)
    ui.run(host="0.0.0.0", port=PUERTO_WEB, title="Gafas Merín",
           dark=True, favicon="🕶", reload=False, show=True)
