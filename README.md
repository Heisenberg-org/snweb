# SmartNav

**Versión base: 1.0**

SmartNav es una experiencia web conceptual para presentar unas gafas inteligentes de asistencia a la movilidad. El proyecto explora cómo sensores ultrasónicos y señales hápticas podrían ayudar a percibir obstáculos antes de llegar a ellos, complementando —no reemplazando— las herramientas de movilidad habituales.

La página combina una narrativa editorial por secciones, una paleta crema, navegación lateral en cápsula, enlaces de redes y contacto en el encabezado, un modelo 3D interactivo y una simulación ilustrativa en 2D. SmartNav es un concepto en desarrollo: las cifras, escenas y funciones que aparecen en la web no representan resultados clínicos ni especificaciones validadas de un producto.

## Tecnologías

- HTML semántico y CSS adaptable, sin proceso de compilación.
- JavaScript moderno para navegación, accesibilidad y Canvas 2D.
- [Three.js](https://threejs.org/) para el modelo conceptual interactivo.
- [GSAP](https://gsap.com/) para animación de entrada progresiva.
- [Lucide](https://lucide.dev/) y Font Awesome para iconografía.
- DM Sans y DM Serif Display servidas por Google Fonts, con alternativas del sistema.

Three.js y las fuentes e iconos se cargan desde CDN. Si el navegador no puede cargar Three.js, la página muestra una alternativa visual y el resto de la experiencia continúa disponible.

El visor 3D carga Three.js al acercarse a su sección y pausa el renderizado cuando no está visible. El modelo se dibuja bajo demanda, con resolución limitada para reducir el uso de GPU; la simulación pausa sus cuadros al salir del área visible, detenerse o dejar la pestaña en segundo plano.

## Requisitos

- Un navegador moderno con soporte para módulos JavaScript, Canvas 2D y WebGL para la vista 3D.
- Conexión a Internet para cargar librerías, iconos y fuentes externas.
- Un servidor HTTP local para abrir el proyecto como módulos ES. No hace falta instalar dependencias.

## Clonar y ejecutar

```bash
git clone https://github.com/Heisenberg-org/snweb.git
cd snweb
python3 -m http.server 8000
```

Abre [http://localhost:8000](http://localhost:8000) en el navegador. También puedes utilizar la extensión Live Server de VS Code.

## Controles

- Desplázate o utiliza las flechas, `Page Up` / `Page Down`, `Home` y `End` para navegar por las secciones.
- En el visor de producto, arrastra para girar los lentes y selecciona una vista predeterminada.
- Usa los controles de reproducción y reinicio para explorar la simulación.
- Los botones flotantes permiten activar alto contraste y sonidos opcionales. La animación respeta la preferencia del sistema para reducir movimiento.

## Accesibilidad y alcance

La interfaz incluye estructura semántica, etiquetas para controles, navegación por teclado, estados anunciados a tecnologías de asistencia y una alternativa para el modelo 3D. La simulación es únicamente ilustrativa; no debe interpretarse como una medición de alcance, desempeño o seguridad. El prototipo no sustituye un bastón blanco, perro guía ni asesoría profesional de movilidad.

## Estructura

```text
.
├── index.html   # Contenido semántico y secciones de la experiencia
├── styles.css   # Sistema visual, responsive y preferencias de accesibilidad
├── main.js      # Navegación, visor 3D, simulación y microinteracciones
├── README.md    # Documentación del proyecto
├── .gitignore   # Archivos locales y artefactos generados excluidos de Git
└── test/
    └── test_v1.0.html # Demo autónoma para abrir directamente con file://
```

## Demos autónomas

Abre la carpeta `test` y haz doble clic en `test_v1.0.html`; no requiere servidor, instalación ni comandos. Sus estilos y lógica están incluidos en el HTML y Three.js se carga como un script clásico desde CDN, sin módulos ES ni recursos locales. El visor 3D necesita conexión a Internet para descargar Three.js; si no está disponible, se muestra una alternativa visual y el resto de la demo sigue funcionando. La página no intenta leer archivos locales.

## Registro de cambios

- **1.0** — Se establece la base visual crema, el encabezado con enlaces de GitHub y correo, la navegación lateral en cápsula y el visor 3D con carga diferida y renderizado bajo demanda.
- **test_v1.0** — Se añade una demo autónoma en un único HTML, compatible con apertura directa mediante `file://`.
