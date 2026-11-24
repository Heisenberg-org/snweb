# SmartNav — Lentes Hápticos de Anticipación Sensorial

Web oficial de presentación de producto de alto impacto (nivel Awwwards / Apple Product Page) para **SmartNav**: lentes inteligentes con sensores ultrasónicos y retroalimentación háptica para personas con discapacidad visual.

---

## 🎨 Identidad Visual & Estética "Caviar & Cream" Luxury

- **Paleta de Lujo Intemporal (Caviar & Cream):**
  - **Cream (`#F5F2EA`):** Fondo principal sedoso, cálido y luminoso.
  - **Caviar Black (`#181818`):** Máximo contraste, botones de acción primarios, tipografía de titular y acentos de lujo.
  - **Charcoal (`#333333`):** Grafito profundo para lectura editorial secundaria y hover states.
  - **Soft Beige (`#DCCFC2`):** Superficies arquitectónicas, bordes de tarjetas, auras y detalles de titanio.
  - **Stone (`#A4A09A`):** Neutralidad arquitectónica para micro-etiquetas, especificaciones y rejillas.
  - **Tarjetas y Superficies:** Blanco puro (`#FFFFFF`) con bordes en Soft Beige (`#DCCFC2`).
- **Tipografía:** `Plus Jakarta Sans` (pesos 600, 700, 800) para titulares de alto impacto combinada con `Inter` (pesos 300, 400, 500) para lectura fluida.
- **Header Flotante:** Isla separada con logotipo minimalista ("S" geométrica en recuadro Caviar Black `#181818`), indicador de estado activo y botones circulares para Instagram, X y GitHub.

---

## 🧭 Experiencia Fullpage y Transiciones Contextuales Únicas

Cada cambio de diapositiva cuenta una historia visual conectada con su temática en estética Caviar & Cream:

1. **De Escena 1 (Hero) a Escena 2 (Ingeniería 3D):**
   - *Onda de Radar Expansiva*: La onda acústica se expande a pantalla completa en un suave barrido radial de Caviar & Cream disolviéndose suavemente para revelar el modelo 3D y especificaciones.
2. **De Escena 2 (Ingeniería 3D) a Escena 3 (Simulador "Tocar vs. Anticipar"):**
   - *Compresión en Haz de Luz y Persiana*: La interfaz 3D se comprime horizontalmente en un haz de luz vertical central Soft Beige que se abre como una persiana deslizante revelando el simulador interactivo.
3. **De Escena 3 (Simulador 2D) a Escena 4 (Arquitectura Bento Grid):**
   - *Estallido de Partículas*: El obstáculo Soft Beige estalla en 32 partículas de lujo (Caviar, Beige, Stone) que vuelan hacia los cuatro cuadrantes para ensamblar las 4 tarjetas del Bento Grid.
4. **De Escena 4 (Bento Grid) a Escena 5 (Visión 2.0 Prototipo):**
   - *Desenfoque de Profundidad y Cortina de Luz Lujosa*: Las tarjetas retroceden con motion blur mientras un velo ascendente en Soft Beige y Stone descubre el laboratorio de Visión 2.0.

### Controles de Navegación Especiales:
- **Cápsula Lateral Flotante:** Indicador con rectángulos de bordes redondeados (`border-radius: 12px`), números de diapositiva (`01` a `05`) y núcleo brillante activo.
- **Botón de Avance Creativo:** Botón flotante inferior derecho con anillo SVG que se rellena progresivamente según el avance de las escenas.

---

## 📂 Arquitectura del Proyecto

```text
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD: Despliegue en GitHub Pages al publicar una Release
├── test/
│   └── smartnav_standalone.html    # Versión 100% autocontenida (abre con doble clic sin CORS)
├── index.html                      # Estructura semántica principal
├── styles.css                      # Estilos editorial boutique, variables CSS y snap-scroll
├── main.js                         # Three.js 3D, Canvas 2D Simulator, Snap Navigation y Tabs
├── test.js                         # Suite de auditoría y tests unitarios
├── .gitignore                      # Exclusiones de archivos del sistema y temporales
└── README.md                       # Documentación técnica
```

---

## 🚀 Cómo Probar Localmente

### Opción Rápida (Sin Servidor Local / Sin CORS)
Haz doble clic directamente en el archivo:
👉 `test/smartnav_standalone.html`
*(Funciona directamente en tu navegador mediante `file:///`, sin necesidad de servidores locales ni problemas de políticas de seguridad).*

### Opción Servidor Web (index.html)
Si prefieres servir la versión modular:
```bash
# Con Node / npx
npx serve .

# O con Python
python -m http.server 8080
```
Abre `http://localhost:8080` en tu navegador.

---

## 🧪 Pruebas Unitarias y Auditoría Técnica

Para validar que todas las escenas, tokens de diseño y scripts estén en perfecto estado:

```bash
node test.js
```

---

## 🚢 Despliegue en GitHub Pages

El proyecto incluye `.github/workflows/deploy.yml` configurado para desplegar automáticamente el sitio en **GitHub Pages** cada vez que publiques una **Release** en tu repositorio:

1. Sube los archivos a tu repositorio de GitHub:
   ```bash
   cd c:\Users\andre\Documents\SNWEB
   git init
   git add .
   git commit -m "feat: smartnav official sensory anticipation release"
   git branch -M main
   git remote add origin https://github.com/Heisenberg-org/snweb.git
   git push -u origin main
   ```
2. En GitHub, ve a **Settings** > **Pages** y selecciona **GitHub Actions** en *Source*.
3. Ve a **Releases** > **Create a new release** (etiqueta `v1.0.0`) y publica. ¡Tu web estará online al instante!
