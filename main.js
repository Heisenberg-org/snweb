/**
 * SMARTNAV // MAIN.JS
 * High-Impact Interactive Controller (Awwwards Grade)
 * Navy Blue & Warm Beige Luxury Color Palette
 * 0. Cinematic Fullscreen Opening Eye Intro (A24 / Content Architecture Grade)
 * 1. Contextual & Unique Transitions per Slide (GSAP Powered)
 * 2. Three.js Procedural 3D Glasses Viewer (Navy Blue & Beige Titanium)
 * 3. Canvas 2D Simulator: Navy Blue Walker + Beige Obstacle
 * 4. Vision 2.0 Tab Transitions & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initEyeIntroAnimation();
  initContextualDeck();
  initThreeJsViewer();
  initSimulator2D();
  initVisionTabs();
});

/* ==========================================================================
   0. INTRO CINEMATOGRÁFICA EN PANTALLA COMPLETA: LADRILLO ISOMÉTRICO & PRENSA
   Inspirado en la Máquina Compactadora de Ladrillos y Diseño Editorial
   ========================================================================== */
function initEyeIntroAnimation() {
  const introCurtain = document.getElementById('intro-eye-curtain');
  if (!introCurtain) return;

  const upperLid = document.getElementById('intro-upper-lid');
  const lowerLid = document.getElementById('intro-lower-lid');
  const grandIris = document.getElementById('intro-iris');
  const grandPupil = document.getElementById('intro-pupil');
  const grandPupilCenter = document.getElementById('intro-pupil-center');
  const irisZoomCircle = document.getElementById('intro-iris-zoom-circle');
  const introStage = document.getElementById('intro-eye-stage');
  const introContainer = document.querySelector('.intro-container');
  const skipBtn = document.getElementById('intro-skip-btn');
  const lateralEyes = document.querySelectorAll('.nav-eye-item, .nav-brick-item');
  const brickGroup = document.getElementById('intro-brick-group');
  const lashFlyers = document.querySelectorAll('.intro-lash-flyer');

  let hasEnded = false;

  function endIntroImmediately() {
    if (hasEnded) return;
    hasEnded = true;
    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(['#intro-eye-curtain', '#intro-upper-lid', '#intro-lower-lid', '#intro-iris', '#intro-pupil', '#intro-iris-zoom-circle', '#intro-eye-stage', '#intro-brick-group', '.intro-container']);
      gsap.to(introCurtain, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.out',
        onComplete: () => {
          introCurtain.style.display = 'none';
          triggerHeroReveal();
        }
      });
      gsap.to(lateralEyes, { opacity: 1, x: 0, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
    } else {
      introCurtain.style.display = 'none';
      triggerHeroReveal();
    }
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      endIntroImmediately();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !hasEnded) {
      endIntroImmediately();
    }
  });

  introCurtain.addEventListener('click', (e) => {
    if (e.target !== skipBtn && !skipBtn?.contains(e.target)) {
      endIntroImmediately();
    }
  });

  if (typeof gsap === 'undefined') {
    setTimeout(endIntroImmediately, 1200);
    return;
  }

  // Posicionar selectores de ladrillos laterales inicialmente para aparición limpia y sin duplicaciones
  gsap.set(lateralEyes, { opacity: 0, x: -20, scale: 0.9 });

  const introTimeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      if (!hasEnded) {
        hasEnded = true;
        introCurtain.style.display = 'none';
        triggerHeroReveal();
      }
    }
  });

  // 1. Entrada de Rayos de Proyección Isométrica y Formación del Ladrillo
  if (brickGroup) {
    gsap.set(brickGroup, { scale: 0.8, opacity: 0, transformOrigin: '270px 180px' });
  }

  introTimeline
    .fromTo(lashFlyers, 
      { strokeDashoffset: 40, opacity: 0 },
      { strokeDashoffset: 0, opacity: 0.8, duration: 0.6, stagger: 0.08, ease: 'power2.out' },
      0.1
    )
    // 2. Golpe de Compresión Mecánica: El Ladrillo Isométrico se Materializa y Compacta
    .to(brickGroup, {
      scale: 1,
      opacity: 1,
      duration: 0.85,
      ease: 'back.out(2.2)'
    }, 0.25)
    // Simulación de prensado y pulso de compactación
    .to(brickGroup, {
      scaleY: 0.94,
      duration: 0.12,
      ease: 'power2.in',
      yoyo: true,
      repeat: 1
    }, 0.85)
    // Destello de compactación central
    .fromTo([grandIris, grandPupilCenter], 
      { opacity: 0, scale: 0.4 }, 
      { opacity: 0.8, scale: 1.4, duration: 0.4, ease: 'power2.out' }, 
      0.88
    )
    // 3. TRANSICIÓN CINEMÁTICA: ZOOM SUAVE CREMA (#FAF7F2) QUE REVELA LA PÁGINA
    .to(irisZoomCircle, {
      scale: 130,
      duration: 1.15,
      ease: 'power4.inOut'
    }, 1.05)
    .to(introStage, {
      scale: 2.8,
      opacity: 0.1,
      transformOrigin: '270px 180px',
      duration: 0.95,
      ease: 'power3.in'
    }, 1.05)
    .to(introContainer, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, 1.15)
    .to(introCurtain, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.out'
    }, 1.85)
    // 4. Entrada elegante del selector de ladrillos lateral
    .to(lateralEyes, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'back.out(1.4)'
    }, 1.75);
}

function triggerHeroReveal() {
  const hero = document.getElementById('scene-hero');
  if (!hero || typeof gsap === 'undefined') return;
  gsap.fromTo(hero.querySelectorAll('.kicker-pill, .heading-display, .lead-editorial, .hero-actions, .stat-item, .hero-telemetry-widget'), 
    { opacity: 0, y: 35 },
    { opacity: 1, y: 0, stagger: 0.08, duration: 1.0, ease: 'power3.out' }
  );
  initTelemetryLiveTicker();
}

/**
 * Micro-animación de telemetría en tiempo real para Diapositiva 1 (Hero)
 */
let telemetryInterval = null;
function initTelemetryLiveTicker() {
  if (telemetryInterval) clearInterval(telemetryInterval);
  const latVal = document.getElementById('telemetry-lat-val');
  const sparkBars = document.querySelectorAll('#telemetry-sparkline .spark-bar');

  if (!latVal) return;

  const latencies = ['3.4 ms', '3.2 ms', '3.6 ms', '3.3 ms', '3.7 ms', '3.1 ms', '3.5 ms'];
  let idx = 0;

  telemetryInterval = setInterval(() => {
    idx = (idx + 1) % latencies.length;
    latVal.textContent = latencies[idx];

    if (sparkBars.length > 0) {
      sparkBars.forEach(bar => {
        const h = Math.floor(Math.random() * 45 + 40);
        bar.style.height = `${h}%`;
        bar.classList.remove('active');
      });
      const activeBar = sparkBars[Math.floor(Math.random() * sparkBars.length)];
      if (activeBar) activeBar.classList.add('active');
    }
  }, 1600);
}

/* ==========================================================================
   1. CONTEXTUAL SLIDE TRANSITION MANAGER
   ========================================================================== */
let currentSlideIndex = 0;

function initContextualDeck() {
  const scenes = document.querySelectorAll('.slide-scene');
  const navItems = document.querySelectorAll('.nav-eye-item, .nav-brick-item');
  const deck = document.getElementById('viewport-deck');

  if (!deck || scenes.length === 0) return;

  const totalScenes = scenes.length;

  // goToSlide: scroll nativo suave a la escena objetivo
  window.goToSlide = function(targetIndex) {
    if (targetIndex < 0 || targetIndex >= totalScenes) return;
    scenes[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Actualizar navegación lateral con IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        const idx = Array.from(scenes).indexOf(entry.target);
        if (idx < 0) return;
        currentSlideIndex = idx;
        navItems.forEach((item, i) => {
          item.classList.remove('anim-entrance', 'anim-exit');
          if (i === idx) {
            item.classList.add('active');
            item.classList.add('anim-entrance');
            setTimeout(() => item.classList.remove('anim-entrance'), 500);
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.5, root: deck });

  scenes.forEach(scene => observer.observe(scene));

  // Clics en la nav lateral
  navItems.forEach((item, index) => {
    item.addEventListener('click', () => window.goToSlide(index));
  });

  // Links internos tipo href="#scene-X"
  document.querySelectorAll('a[href^="#scene-"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Teclado: flechas y espacio
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      if (currentSlideIndex < totalScenes - 1) window.goToSlide(currentSlideIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (currentSlideIndex > 0) window.goToSlide(currentSlideIndex - 1);
    }
  });
}

/* ==========================================================================
   2. THREE.JS 3D: MÁQUINA COMPACTADORA DE LADRILLOS EN VISTA ISOMÉTRICA
   Modelo técnico interactivo con chasis de acero, tolva, pistón y ladrillo ecológico
   ========================================================================== */
function initThreeJsViewer() {
  const container = document.getElementById('canvas-3d-glasses');
  if (!container) return;

  if (typeof THREE === 'undefined') {
    renderCanvas3DFallback(container);
    return;
  }

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 500;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xE6D7C4); // Beige Cálido (#E6D7C4)

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(3.2, 2.6, 3.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Iluminación de Estudio Industrial (Navy & Warm Beige)
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.35);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xF4ECE1, 1.6);
  dirLight1.position.set(5, 7, 5);
  dirLight1.castShadow = true;
  dirLight1.shadow.mapSize.width = 1024;
  dirLight1.shadow.mapSize.height = 1024;
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xD5C4AD, 0.9);
  dirLight2.position.set(-5, -2, -3);
  scene.add(dirLight2);

  const dirLight3 = new THREE.DirectionalLight(0x212842, 0.5);
  dirLight3.position.set(2, -4, 4);
  scene.add(dirLight3);

  // Grupo Principal de la Máquina Compactadora
  const machineGroup = new THREE.Group();
  scene.add(machineGroup);
  // Alias para mantener compatibilidad total con referencias internas
  const glassesGroup = machineGroup;

  // Materiales Industriales PBR (Paleta Navy Blue, Beige Titanio y Terracota)
  const steelDarkMat = new THREE.MeshStandardMaterial({
    color: 0x212842, // Acero Industrial Navy Blue
    roughness: 0.28,
    metalness: 0.85
  });

  const steelBrightMat = new THREE.MeshStandardMaterial({
    color: 0xD5C4AD, // Columnas en Beige Titanio
    roughness: 0.22,
    metalness: 0.92
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xF5F2EA, // Vástago de pistón cromado espejo
    roughness: 0.08,
    metalness: 0.98
  });

  const terracottaMat = new THREE.MeshStandardMaterial({
    color: 0xD4622C, // Arcilla de Ladrillo Terracota (Imagen de referencia)
    roughness: 0.85,
    metalness: 0.04
  });

  const terracottaHoleMat = new THREE.MeshStandardMaterial({
    color: 0x9E3B13, // Sombra interior orificios ladrillo
    roughness: 0.9,
    metalness: 0.02
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xC88A32, // Manómetro y acoples de bronce
    roughness: 0.25,
    metalness: 0.88
  });

  const rubberHoseMat = new THREE.MeshStandardMaterial({
    color: 0x161C2E,
    roughness: 0.65,
    metalness: 0.15
  });

  /* ------------------------------------------------------------------------
     1. BASE Y ESTRUCTURA DE ANCLAJE INDUSTRIAL
     ------------------------------------------------------------------------ */
  // Placa base estructural
  const baseGeo = new THREE.BoxGeometry(2.1, 0.12, 1.5);
  const baseMesh = new THREE.Mesh(baseGeo, steelDarkMat);
  baseMesh.position.set(0, -1.05, 0);
  baseMesh.receiveShadow = true;
  machineGroup.add(baseMesh);

  // Zapatas y pernos de fijación en las 4 esquinas
  const footingOffsets = [
    [-0.92, -0.62], [0.92, -0.62],
    [-0.92, 0.62], [0.92, 0.62]
  ];
  footingOffsets.forEach(([fx, fz]) => {
    const footGeo = new THREE.BoxGeometry(0.24, 0.06, 0.24);
    const footMesh = new THREE.Mesh(footGeo, steelBrightMat);
    footMesh.position.set(fx, -0.96, fz);
    machineGroup.add(footMesh);

    const boltGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.06, 12);
    const boltMesh = new THREE.Mesh(boltGeo, chromeMat);
    boltMesh.position.set(fx, -0.9, fz);
    machineGroup.add(boltMesh);
  });

  /* ------------------------------------------------------------------------
     2. CUATRO COLUMNAS GUÍA REFORZADAS (Acero Templado Isométrico)
     ------------------------------------------------------------------------ */
  const colGeo = new THREE.CylinderGeometry(0.048, 0.048, 2.5, 24);
  const colOffsets = [
    [-0.72, -0.44], [0.72, -0.44],
    [-0.72, 0.44], [0.72, 0.44]
  ];
  colOffsets.forEach(([cx, cz]) => {
    const colMesh = new THREE.Mesh(colGeo, steelBrightMat);
    colMesh.position.set(cx, 0.2, cz);
    colMesh.castShadow = true;
    machineGroup.add(colMesh);
  });

  /* ------------------------------------------------------------------------
     3. CORONA SUPERIOR & CHIP DE COMPRESIÓN
     ------------------------------------------------------------------------ */
  const topCrownGeo = new THREE.BoxGeometry(1.68, 0.2, 1.12);
  const topCrownMesh = new THREE.Mesh(topCrownGeo, steelDarkMat);
  topCrownMesh.position.set(0, 1.45, 0);
  topCrownMesh.castShadow = true;
  machineGroup.add(topCrownMesh);

  // Placa central de refuerzo de cilindro
  const cylMountGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 28);
  const cylMount = new THREE.Mesh(cylMountGeo, steelBrightMat);
  cylMount.position.set(0, 1.58, 0);
  machineGroup.add(cylMount);

  /* ------------------------------------------------------------------------
     4. CILINDRO HIDRÁULICO DE ALTA PRESIÓN Y PISTÓN DESLIZANTE
     ------------------------------------------------------------------------ */
  // Cilindro hidráulico superior
  const cylBodyGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.75, 32);
  const cylBody = new THREE.Mesh(cylBodyGeo, steelDarkMat);
  cylBody.position.set(0, 1.98, 0);
  cylBody.castShadow = true;
  machineGroup.add(cylBody);

  // Tapa superior del cilindro con válvula
  const cylCapGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.08, 32);
  const cylCap = new THREE.Mesh(cylCapGeo, brassMat);
  cylCap.position.set(0, 2.38, 0);
  machineGroup.add(cylCap);

  // Grupo móvil del prensador (se desplaza durante el ciclo de compactación)
  const presserGroup = new THREE.Group();
  machineGroup.add(presserGroup);

  // Vástago de pistón cromado
  const pistonRodGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.95, 28);
  const pistonRod = new THREE.Mesh(pistonRodGeo, chromeMat);
  pistonRod.position.set(0, 1.1, 0);
  presserGroup.add(pistonRod);

  // Plato compactador / estampador superior
  const ramPlateGeo = new THREE.BoxGeometry(1.15, 0.18, 0.76);
  const ramPlate = new THREE.Mesh(ramPlateGeo, steelDarkMat);
  ramPlate.position.set(0, 0.65, 0);
  ramPlate.castShadow = true;
  presserGroup.add(ramPlate);

  // Machos superiores de compresión que entran al molde
  const stampHeadGeo = new THREE.BoxGeometry(1.05, 0.12, 0.68);
  const stampHead = new THREE.Mesh(stampHeadGeo, steelBrightMat);
  stampHead.position.set(0, 0.5, 0);
  presserGroup.add(stampHead);

  // Bujes de guía en las 4 esquinas del plato
  colOffsets.forEach(([cx, cz]) => {
    const bushingGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.22, 18);
    const bushing = new THREE.Mesh(bushingGeo, brassMat);
    bushing.position.set(cx, 0.65, cz);
    presserGroup.add(bushing);
  });

  /* ------------------------------------------------------------------------
     5. CÁMARA DE MOLDEO / MATRIZ DE LADRILLO MODULAR
     ------------------------------------------------------------------------ */
  const moldBoxGeo = new THREE.BoxGeometry(1.28, 0.58, 0.88);
  const moldBox = new THREE.Mesh(moldBoxGeo, steelDarkMat);
  moldBox.position.set(0, -0.15, 0);
  moldBox.castShadow = true;
  machineGroup.add(moldBox);

  // Marco de la matriz
  const moldFrameGeo = new THREE.BoxGeometry(1.36, 0.08, 0.96);
  const moldFrame = new THREE.Mesh(moldFrameGeo, steelBrightMat);
  moldFrame.position.set(0, 0.14, 0);
  machineGroup.add(moldFrame);

  // Machos cilíndricos interiores del molde (para agujeros del ladrillo ecológico)
  const core1Geo = new THREE.CylinderGeometry(0.07, 0.07, 0.52, 20);
  const core1 = new THREE.Mesh(core1Geo, chromeMat);
  core1.position.set(-0.22, -0.15, 0);
  machineGroup.add(core1);

  const core2 = new THREE.Mesh(core1Geo, chromeMat);
  core2.position.set(0.22, -0.15, 0);
  machineGroup.add(core2);

  /* ------------------------------------------------------------------------
     6. TOLVA DE ALIMENTACIÓN SUPERIOR (Hopper de mezcla ecológica)
     ------------------------------------------------------------------------ */
  // Tolva troncocónica invertida montada en la parte superior trasera
  const hopperGeo = new THREE.CylinderGeometry(0.5, 0.26, 0.58, 4);
  hopperGeo.rotateY(Math.PI / 4);
  const hopperMesh = new THREE.Mesh(hopperGeo, steelDarkMat);
  hopperMesh.position.set(0, 0.52, -0.62);
  hopperMesh.castShadow = true;
  machineGroup.add(hopperMesh);

  // Borde superior reforzado de la tolva
  const hopperRimGeo = new THREE.BoxGeometry(0.74, 0.06, 0.74);
  const hopperRim = new THREE.Mesh(hopperRimGeo, steelBrightMat);
  hopperRim.position.set(0, 0.82, -0.62);
  machineGroup.add(hopperRim);

  /* ------------------------------------------------------------------------
     7. EL LADRILLO ECOLÓGICO COMPACTADO (Inspirado en la imagen de referencia)
     ------------------------------------------------------------------------ */
  const brickEntityGroup = new THREE.Group();
  machineGroup.add(brickEntityGroup);

  // Cuerpo rectangular del ladrillo en terracota
  const brickBodyGeo = new THREE.BoxGeometry(0.82, 0.28, 0.46);
  const brickBody = new THREE.Mesh(brickBodyGeo, terracottaMat);
  brickBody.position.set(0, 0.28, 0.06);
  brickBody.castShadow = true;
  brickEntityGroup.add(brickBody);

  // 2 Perforaciones cilíndricas del bloque ecológico
  const brickHoleGeo = new THREE.CylinderGeometry(0.072, 0.072, 0.29, 20);
  const brickHole1 = new THREE.Mesh(brickHoleGeo, terracottaHoleMat);
  brickHole1.position.set(-0.22, 0.28, 0.06);
  brickEntityGroup.add(brickHole1);

  const brickHole2 = new THREE.Mesh(brickHoleGeo, terracottaHoleMat);
  brickHole2.position.set(0.22, 0.28, 0.06);
  brickEntityGroup.add(brickHole2);

  // Bandeja de desmolde / expulsión bajo el ladrillo
  const ejectTrayGeo = new THREE.BoxGeometry(0.96, 0.06, 0.56);
  const ejectTray = new THREE.Mesh(ejectTrayGeo, steelBrightMat);
  ejectTray.position.set(0, 0.12, 0.06);
  brickEntityGroup.add(ejectTray);

  /* ------------------------------------------------------------------------
     8. DETALLES INDUSTRIALES: MANÓMETRO, PALANCA Y LÍNEAS HIDRÁULICAS
     ------------------------------------------------------------------------ */
  // Manómetro de presión hidráulica (0 a 10 Toneladas)
  const gaugeHousingGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24);
  gaugeHousingGeo.rotateX(Math.PI / 2);
  const gaugeHousing = new THREE.Mesh(gaugeHousingGeo, brassMat);
  gaugeHousing.position.set(0.55, 1.1, 0.48);
  machineGroup.add(gaugeHousing);

  const gaugeDialGeo = new THREE.CircleGeometry(0.1, 24);
  const gaugeDialMat = new THREE.MeshBasicMaterial({ color: 0xFAF7F2 });
  const gaugeDial = new THREE.Mesh(gaugeDialGeo, gaugeDialMat);
  gaugeDial.position.set(0.55, 1.1, 0.525);
  machineGroup.add(gaugeDial);

  // Aguja del manómetro (animable con la presión)
  const needleGeo = new THREE.BoxGeometry(0.012, 0.075, 0.01);
  const needleMat = new THREE.MeshBasicMaterial({ color: 0xC85A32 });
  const gaugeNeedle = new THREE.Mesh(needleGeo, needleMat);
  gaugeNeedle.position.set(0.55, 1.12, 0.53);
  machineGroup.add(gaugeNeedle);

  // Palanca mecánica lateral de accionamiento
  const leverArmCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.68, 0.15, 0.2),
    new THREE.Vector3(1.05, 0.45, 0.4),
    new THREE.Vector3(1.35, 0.72, 0.55)
  ]);
  const leverGeo = new THREE.TubeGeometry(leverArmCurve, 18, 0.03, 12, false);
  const leverMesh = new THREE.Mesh(leverGeo, steelBrightMat);
  machineGroup.add(leverMesh);

  // Mango ergonómico de la palanca
  const handleGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.26, 16);
  handleGeo.rotateZ(Math.PI / 4);
  const handleMesh = new THREE.Mesh(handleGeo, rubberHoseMat);
  handleMesh.position.set(1.35, 0.72, 0.55);
  machineGroup.add(handleMesh);

  // Mangueras hidráulicas flexibles
  const hoseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.2, 2.1, 0),
    new THREE.Vector3(0.55, 1.8, 0.3),
    new THREE.Vector3(0.55, 1.25, 0.48)
  ]);
  const hoseGeo = new THREE.TubeGeometry(hoseCurve, 20, 0.024, 10, false);
  const hoseMesh = new THREE.Mesh(hoseGeo, rubberHoseMat);
  machineGroup.add(hoseMesh);

  // Ondas / pulso de compactación (anillos de eco para compatibilidad total)
  const echoWaves = [];
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.RingGeometry(0.2 + i * 0.2, 0.24 + i * 0.2, 32);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xC85A32,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(0, 0.16, 0.06);
    machineGroup.add(ringMesh);
    echoWaves.push(ringMesh);
  }

  /* ------------------------------------------------------------------------
     9. CONTROLES DE RATÓN, ARRASTRE Y PERSPECTIVA ISOMÉTRICA
     ------------------------------------------------------------------------ */
  let isDragging = false;
  let prevMouseX = 0, prevMouseY = 0;
  // Ángulo isométrico clásico predeterminado
  let targetRotX = 0.32, targetRotY = -0.65;
  let autoRotate = true;
  let isPressingCycle = false;
  let pressCycleTime = 0;

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
    autoRotate = false;
  });

  window.addEventListener('mouseup', () => isDragging = false);

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    targetRotY += (e.clientX - prevMouseX) * 0.008;
    targetRotX += (e.clientY - prevMouseY) * 0.008;
    targetRotX = Math.max(-0.6, Math.min(0.65, targetRotX));
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  // Soporte táctil en dispositivos móviles
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
      autoRotate = false;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => isDragging = false);

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    targetRotY += (e.touches[0].clientX - prevMouseX) * 0.008;
    targetRotX += (e.touches[0].clientY - prevMouseY) * 0.008;
    targetRotX = Math.max(-0.6, Math.min(0.65, targetRotX));
    prevMouseX = e.touches[0].clientX;
    prevMouseY = e.touches[0].clientY;
  }, { passive: true });

  /* ------------------------------------------------------------------------
     10. ACCIONES DE BOTONES HUD
     ------------------------------------------------------------------------ */
  const btnReset = document.getElementById('btn-3d-reset');
  const btnPress = document.getElementById('btn-3d-echo');
  const btnIso = document.getElementById('btn-3d-temples');

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      autoRotate = !autoRotate;
      btnReset.textContent = autoRotate ? 'Pausar Giro' : 'Rotar 360°';
    });
  }

  // Animación del Ciclo de Compactación y Prensado
  function triggerCompactionCycle() {
    if (isPressingCycle) return;
    isPressingCycle = true;
    pressCycleTime = 0;
    autoRotate = false;

    if (btnPress) btnPress.textContent = 'Prensando... (10 Tn)';

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({
        onComplete: () => {
          isPressingCycle = false;
          if (btnPress) btnPress.textContent = 'Ciclo de Prensado';
        }
      });

      // 1. Descenso potente del pistón hacia el molde
      tl.to(presserGroup.position, { y: -0.42, duration: 0.65, ease: 'power3.in' })
        // 2. Pico de compresión: vibración del chasis y aguja de manómetro
        .to(machineGroup.position, { y: '+=0.03', duration: 0.05, yoyo: true, repeat: 5 })
        .to(gaugeNeedle.rotation, { z: -Math.PI * 0.7, duration: 0.2 }, '<')
        // Ondas de choque / presión
        .call(() => {
          echoWaves.forEach((w, idx) => {
            gsap.fromTo(w.scale, { x: 0.8, y: 0.8 }, { x: 2.2 + idx * 0.4, y: 2.2 + idx * 0.4, duration: 0.5 });
            gsap.fromTo(w.material, { opacity: 0.7 }, { opacity: 0, duration: 0.5 });
          });
        })
        // 3. Elevación del pistón
        .to(presserGroup.position, { y: 0, duration: 0.75, ease: 'power2.out' }, '+=0.3')
        .to(gaugeNeedle.rotation, { z: 0, duration: 0.5 }, '<')
        // 4. Elevación y entrega del ladrillo recién compactado
        .to(brickEntityGroup.position, { y: 0.18, duration: 0.55, ease: 'back.out(1.8)' }, '-=0.4')
        // 5. Asentamiento en bandeja de desmolde
        .to(brickEntityGroup.position, { y: 0, duration: 0.4, ease: 'power2.inOut' }, '+=0.6');
    } else {
      setTimeout(() => {
        isPressingCycle = false;
        if (btnPress) btnPress.textContent = 'Ciclo de Prensado';
      }, 1800);
    }
  }

  if (btnPress) {
    btnPress.textContent = 'Ciclo de Prensado';
    btnPress.addEventListener('click', triggerCompactionCycle);
  }

  // Vista Isométrica CAD (30°/30°)
  if (btnIso) {
    btnIso.textContent = 'Vista Isométrica';
    btnIso.addEventListener('click', () => {
      autoRotate = false;
      targetRotX = 0.38;
      targetRotY = -Math.PI / 4; // Ángulo isométrico clásico 45°
    });
  }

  /* ------------------------------------------------------------------------
     11. HOTSPOTS FLOTANTES INTERACTIVOS EN LA MÁQUINA
     ------------------------------------------------------------------------ */
  const hotspots = document.querySelectorAll('.model-hotspot');
  hotspots.forEach(hotspot => {
    const trigger = hotspot.querySelector('.hotspot-trigger');
    const comp = hotspot.getAttribute('data-component');

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasActive = hotspot.classList.contains('active');
        hotspots.forEach(h => h.classList.remove('active'));
        if (!wasActive) hotspot.classList.add('active');

        autoRotate = false;
        if (comp === 'tolva' || comp === 'sensors') {
          targetRotX = 0.42;
          targetRotY = Math.PI - 0.4; // Vista superior de la tolva
        } else if (comp === 'cilindro' || comp === 'temple-left') {
          targetRotX = 0.22;
          targetRotY = -0.3; // Vista del pistón hidráulico
        } else if (comp === 'matriz' || comp === 'temple-right') {
          targetRotX = 0.15;
          targetRotY = 0.4; // Vista de la cámara de moldeo
        } else if (comp === 'ladrillo' || comp === 'frame') {
          targetRotX = 0.35;
          targetRotY = -Math.PI / 4; // Vista isométrica del ladrillo expulsado
        }
      });
    }
  });

  // Clic exterior oculta tarjetas de hotspots abiertas
  container.addEventListener('click', () => {
    hotspots.forEach(h => h.classList.remove('active'));
  });

  /* ------------------------------------------------------------------------
     12. BUCLE DE RENDERIZADO THREE.JS
     ------------------------------------------------------------------------ */
  let clock = new THREE.Clock();
  function animate3D() {
    requestAnimationFrame(animate3D);
    const elapsedTime = clock.getElapsedTime();

    if (autoRotate) {
      targetRotY += 0.004;
    }

    machineGroup.rotation.y += (targetRotY - machineGroup.rotation.y) * 0.08;
    machineGroup.rotation.x += (targetRotX - machineGroup.rotation.x) * 0.08;

    // Leve flotación armónica
    machineGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.025;

    renderer.render(scene, camera);
  }
  animate3D();

  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

function renderCanvas3DFallback(container) {
  const canvas = document.createElement('canvas');
  canvas.width = container.clientWidth || 600;
  canvas.height = container.clientHeight || 500;
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let angle = 0;

  function drawFallback() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.save();
    ctx.translate(cx, cy);

    // Dibujo isométrico en Canvas 2D de la Máquina Compactadora de Ladrillos
    ctx.strokeStyle = '#212842';
    ctx.lineWidth = 3;

    // Chasis
    ctx.strokeRect(-120, -140, 240, 280);

    // Cilindro Superior
    ctx.fillStyle = '#212842';
    ctx.fillRect(-45, -190, 90, 60);

    // Tolva
    ctx.beginPath();
    ctx.moveTo(-70, -110);
    ctx.lineTo(70, -110);
    ctx.lineTo(40, -40);
    ctx.lineTo(-40, -40);
    ctx.closePath();
    ctx.fillStyle = '#D5C4AD';
    ctx.fill();
    ctx.stroke();

    // Ladrillo Isométrico en Centro
    ctx.fillStyle = '#E27237';
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(80, 50);
    ctx.lineTo(0, 80);
    ctx.lineTo(-80, 50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#C45120';
    ctx.beginPath();
    ctx.moveTo(-80, 50);
    ctx.lineTo(0, 80);
    ctx.lineTo(0, 130);
    ctx.lineTo(-80, 100);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#9E3B13';
    ctx.beginPath();
    ctx.moveTo(0, 80);
    ctx.lineTo(80, 50);
    ctx.lineTo(80, 100);
    ctx.lineTo(0, 130);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 12px "JetBrains Mono"';
    ctx.fillStyle = '#212842';
    ctx.textAlign = 'center';
    ctx.fillText('MÁQUINA COMPACTADORA DE LADRILLOS (ISOMÉTRICO)', 0, 160);

    ctx.restore();
    angle += 0.01;
    requestAnimationFrame(drawFallback);
  }
  drawFallback();
}
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 + Math.sin(angle) * 8;
    ctx.strokeStyle = '#181818'; ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(cx - 160, cy - 40, 120, 80, 18);
    ctx.roundRect(cx + 40, cy - 40, 120, 80, 18);
    ctx.stroke();
    ctx.strokeStyle = '#DCCFC2'; ctx.beginPath();
    ctx.moveTo(cx - 40, cy - 10); ctx.quadraticCurveTo(cx, cy - 30, cx + 40, cy - 10);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(220, 207, 194, 0.65)'; ctx.beginPath();
    ctx.arc(cx, cy, 140 + Math.sin(angle * 2) * 20, -Math.PI / 4, Math.PI / 4);
    ctx.stroke();
    angle += 0.02;
    requestAnimationFrame(drawFallback);
  }
  drawFallback();
}

/* ==========================================================================
   3. SIMULATOR 2D: "TOCAR VS. ANTICIPAR"
   Usuario en Caviar Black (#181818) + Obstáculo en Soft Beige (#DCCFC2) + Ondas 60fps
   ========================================================================== */
function initSimulator2D() {
  const canvas = document.getElementById('canvas-sim-2d');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const modeCaneBtn = document.getElementById('mode-cane-btn');
  const modeSmartNavBtn = document.getElementById('mode-smartnav-btn');
  const metricDistance = document.getElementById('sim-dist-val');
  const metricHaptic = document.getElementById('sim-haptic-val');
  const metricReaction = document.getElementById('sim-reaction-val');

  let mode = 'smartnav';
  let canvasW = canvas.clientWidth, canvasH = canvas.clientHeight;

  function resizeCanvas() {
    canvasW = canvas.clientWidth; canvasH = canvas.clientHeight;
    canvas.width = canvasW * window.devicePixelRatio;
    canvas.height = canvasH * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Entities
  const walker = { x: 80, y: canvasH / 2, radius: 18 };
  // Obstáculo en Soft Beige (#DCCFC2) con Borde Caviar (#181818)
  const obstacle = { x: 330, y: canvasH / 2, radius: 24, isDragging: false };

  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
  }

  canvas.addEventListener('mousedown', (e) => {
    const c = getCoords(e);
    if (Math.hypot(c.x - obstacle.x, c.y - obstacle.y) < obstacle.radius + 15) obstacle.isDragging = true;
  });
  window.addEventListener('mousemove', (e) => {
    if (!obstacle.isDragging) return;
    const c = getCoords(e);
    obstacle.x = Math.max(160, Math.min(canvasW - 40, c.x));
    obstacle.y = Math.max(40, Math.min(canvasH - 40, c.y));
  });
  window.addEventListener('mouseup', () => obstacle.isDragging = false);

  canvas.addEventListener('touchstart', (e) => {
    const c = getCoords(e);
    if (Math.hypot(c.x - obstacle.x, c.y - obstacle.y) < obstacle.radius + 20) obstacle.isDragging = true;
  });
  window.addEventListener('touchmove', (e) => {
    if (!obstacle.isDragging) return;
    const c = getCoords(e);
    obstacle.x = Math.max(160, Math.min(canvasW - 40, c.x));
    obstacle.y = Math.max(40, Math.min(canvasH - 40, c.y));
  });
  window.addEventListener('touchend', () => obstacle.isDragging = false);

  if (modeCaneBtn && modeSmartNavBtn) {
    modeCaneBtn.addEventListener('click', () => {
      mode = 'cane';
      modeCaneBtn.classList.add('active');
      modeSmartNavBtn.classList.remove('active');
      metricReaction.textContent = 'Reactivo (Tardío)';
    });
    modeSmartNavBtn.addEventListener('click', () => {
      mode = 'smartnav';
      modeSmartNavBtn.classList.add('active');
      modeCaneBtn.classList.remove('active');
      metricReaction.textContent = '<5ms Anticipado';
    });
  }

  let simTime = 0;
  function renderSim() {
    simTime += 0.03;
    ctx.clearRect(0, 0, canvasW, canvasH);

    const dx = obstacle.x - walker.x;
    const dy = obstacle.y - walker.y;
    const pixelDistance = Math.hypot(dx, dy);
    const metersDistance = (pixelDistance / 100).toFixed(1);

    if (metricDistance) metricDistance.textContent = `${metersDistance} m`;

    // Grilla arquitectónica en Beige Cálido (#D5C4AD)
    ctx.strokeStyle = '#D5C4AD';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    for (let x = 40; x < canvasW; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasH); ctx.stroke();
    }
    ctx.setLineDash([]);

    if (mode === 'cane') {
      const caneRange = 85;
      const isDetected = pixelDistance <= caneRange + obstacle.radius;
      const sweepAngle = Math.sin(simTime * 4) * 0.45;
      ctx.strokeStyle = '#212842';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(walker.x + 10, walker.y);
      ctx.lineTo(walker.x + Math.cos(sweepAngle) * caneRange, walker.y + Math.sin(sweepAngle) * caneRange);
      ctx.stroke();

      if (isDetected) {
        ctx.fillStyle = 'rgba(213, 196, 173, 0.55)';
        ctx.beginPath();
        ctx.arc(obstacle.x, obstacle.y, obstacle.radius + 14, 0, Math.PI * 2);
        ctx.fill();
        if (metricHaptic) metricHaptic.textContent = 'Colisión Física (0m)';
      } else {
        if (metricHaptic) metricHaptic.textContent = 'Sin Detección Aérea';
      }
    } else {
      const maxRange = 320;
      const coneAngle = (120 * Math.PI) / 180;
      const angleToObs = Math.atan2(dy, dx);
      const inCone = Math.abs(angleToObs) <= coneAngle / 2 && pixelDistance <= maxRange;

      // Cono Ultrasónico en Warm Beige & Slate
      const coneGrad = ctx.createRadialGradient(walker.x, walker.y, 20, walker.x, walker.y, maxRange);
      coneGrad.addColorStop(0, 'rgba(230, 215, 196, 0.6)');
      coneGrad.addColorStop(0.7, 'rgba(122, 129, 148, 0.22)');
      coneGrad.addColorStop(1, 'rgba(230, 215, 196, 0)');
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(walker.x, walker.y);
      ctx.arc(walker.x, walker.y, maxRange, -coneAngle / 2, coneAngle / 2);
      ctx.closePath();
      ctx.fill();

      // Ondas acústicas concéntricas limpias en Navy Blue & Slate a 60fps
      for (let r = 40; r < maxRange; r += 50) {
        const waveOffset = (r + (simTime * 65) % 50);
        if (waveOffset < maxRange) {
          ctx.strokeStyle = (r % 100 === 0) ? 'rgba(33, 40, 66, 0.65)' : 'rgba(122, 129, 148, 0.5)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(walker.x, walker.y, waveOffset, -coneAngle / 2, coneAngle / 2);
          ctx.stroke();
        }
      }

      if (inCone) {
        // Haz de ecolocalización hacia el obstáculo en Navy Blue
        ctx.strokeStyle = '#212842';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(walker.x, walker.y);
        ctx.lineTo(obstacle.x, obstacle.y);
        ctx.stroke();
        ctx.setLineDash([]);

        const direction = dy > 10 ? 'Derecha' : dy < -10 ? 'Izquierda' : 'Centro';
        const intensity = metersDistance < 1.5 ? 'Alta' : 'Moderada';
        if (metricHaptic) metricHaptic.textContent = `Patilla ${direction} (${intensity})`;

        // Resplandor del obstáculo
        ctx.fillStyle = 'rgba(213, 196, 173, 0.6)';
        ctx.beginPath();
        ctx.arc(obstacle.x, obstacle.y, obstacle.radius + 14, 0, Math.PI * 2);
        ctx.fill();
      } else {
        if (metricHaptic) metricHaptic.textContent = 'En Espera (Vía Libre)';
      }
    }

    // 1. DIBUJAR OBSTÁCULO: WARM BEIGE (#E6D7C4) CON BORDE NAVY (#212842)
    // Aura de resplandor exterior
    ctx.fillStyle = 'rgba(213, 196, 173, 0.5)';
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacle.radius + 8, 0, Math.PI * 2);
    ctx.fill();

    // Núcleo Warm Beige
    ctx.fillStyle = '#E6D7C4';
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
    ctx.fill();

    // Borde elegante Navy Blue
    ctx.strokeStyle = '#212842';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Punto central Navy
    ctx.fillStyle = '#212842';
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '700 11px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#212842';
    ctx.fillText('OBSTÁCULO', obstacle.x - 34, obstacle.y + obstacle.radius + 18);

    // 2. DIBUJAR USUARIO: NAVY BLUE (#212842)
    ctx.fillStyle = '#212842';
    ctx.beginPath();
    ctx.arc(walker.x, walker.y, walker.radius, 0, Math.PI * 2);
    ctx.fill();

    // Detalle de lentes en Beige
    ctx.fillStyle = '#E6D7C4';
    ctx.fillRect(walker.x + walker.radius - 2, walker.y - 8, 6, 16);

    ctx.font = '700 11px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#212842';
    ctx.fillText('USUARIO', walker.x - 24, walker.y + walker.radius + 18);

    requestAnimationFrame(renderSim);
  }
  renderSim();
}

/* ==========================================================================
   4. VISION 2.0 TAB SELECTOR
   ========================================================================== */
function initVisionTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  if (tabBtns.length === 0 || tabPanes.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      tabPanes.forEach(pane => {
        if (pane.id === targetTab) pane.classList.add('active');
        else pane.classList.remove('active');
      });
    });
  });
}
