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
   0. INTRO CINEMATOGRÁFICA EN PANTALLA COMPLETA: GRAN OJO & PESTAÑAS VOLADORAS
   Inspirado en A24 (Ravi Klaassens) y Content Architecture
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
  const lateralEyes = document.querySelectorAll('.nav-eye-item');

  let hasEnded = false;

  function endIntroImmediately() {
    if (hasEnded) return;
    hasEnded = true;
    if (typeof gsap !== 'undefined') {
      gsap.killTweensOf(['#intro-eye-curtain', '#intro-upper-lid', '#intro-lower-lid', '#intro-iris', '#intro-pupil', '#intro-iris-zoom-circle', '#intro-eye-stage', '.intro-container']);
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

  // Posicionar ojos laterales inicialmente para aparición limpia y sin duplicaciones
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

  // 1. Apertura Cinemática de Párpados
  introTimeline
    .to(upperLid, {
      attr: { d: 'M 20 170 Q 270 20 520 170 L 520 0 L 20 0 Z' },
      duration: 1.0,
      ease: 'power3.inOut'
    }, 0.2)
    .to(lowerLid, {
      attr: { d: 'M 20 170 Q 270 320 520 170 L 520 340 L 20 340 Z' },
      duration: 1.0,
      ease: 'power3.inOut'
    }, 0.2)
    // 2. Pupila e Iris: Enfoque Sensorial Dinámico
    .fromTo([grandIris, grandPupil], 
      { scale: 0.88, transformOrigin: '270px 170px' },
      { scale: 1.08, transformOrigin: '270px 170px', duration: 0.7, ease: 'back.out(1.4)' },
      0.35
    )
    .fromTo(grandPupilCenter, 
      { opacity: 0, scale: 0 }, 
      { opacity: 1, scale: 1.3, duration: 0.6, ease: 'power2.out' }, 
      0.5
    )
    // 3. TRANSICIÓN CINEMÁTICA: ZOOM TIPO "IRIS DE OJO" CREMA (#FAF7F2)
    // El iris se expande exponencialmente desde el centro exacto cubriendo la pantalla con #FAF7F2
    .to(irisZoomCircle, {
      scale: 130,
      duration: 1.15,
      ease: 'power4.inOut'
    }, 0.95)
    .to(introStage, {
      scale: 3.2,
      opacity: 0.15,
      transformOrigin: '270px 170px',
      duration: 0.95,
      ease: 'power3.in'
    }, 0.95)
    .to(introContainer, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, 1.1)
    .to(introCurtain, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.out'
    }, 1.8)
    // 4. Entrada suave y elegante de la guía lateral sin duplicados
    .to(lateralEyes, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'back.out(1.4)'
    }, 1.7);
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
let isTransitioning = false;

function initContextualDeck() {
  const scenes = document.querySelectorAll('.slide-scene');
  const navEyes = document.querySelectorAll('.nav-eye-item, .nav-dot-item');
  const advanceBtn = document.getElementById('advance-btn');
  const progressFill = document.getElementById('progress-ring-fill');
  const advanceCounter = document.getElementById('advance-counter');
  const advanceIcon = document.getElementById('advance-icon');

  if (scenes.length === 0) return;

  const totalScenes = scenes.length;
  const circumference = 2 * Math.PI * 26; // r = 26 in SVG

  if (progressFill) {
    progressFill.style.strokeDasharray = `${circumference}`;
    progressFill.style.strokeDashoffset = `${circumference}`;
  }

  // Set initial slide active
  scenes[0].classList.add('active');
  if (typeof gsap !== 'undefined') {
    gsap.set(scenes[0], { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', visibility: 'visible' });
  }

  // Router to specific contextual transition
  window.goToSlide = function(targetIndex) {
    if (isTransitioning || targetIndex === currentSlideIndex || targetIndex < 0 || targetIndex >= totalScenes) {
      return;
    }

    isTransitioning = true;
    const fromIndex = currentSlideIndex;
    const outgoing = scenes[fromIndex];
    const incoming = scenes[targetIndex];
    currentSlideIndex = targetIndex;

    // Update UI Eye Indicators
    navEyes.forEach((item, idx) => {
      if (idx === targetIndex) item.classList.add('active');
      else item.classList.remove('active');
    });

    if (progressFill) {
      const progress = targetIndex / (totalScenes - 1);
      progressFill.style.strokeDashoffset = circumference - progress * circumference;
    }

    if (advanceCounter) {
      advanceCounter.textContent = `0${targetIndex + 1} / 0${totalScenes}`;
    }

    if (advanceIcon) {
      advanceIcon.style.transform = targetIndex === totalScenes - 1 ? 'rotate(180deg)' : 'rotate(0deg)';
    }

    // DISPATCH UNIQUE CONTEXTUAL TRANSITION
    if (fromIndex === 0 && targetIndex === 1) {
      transitionHeroTo3D(outgoing, incoming);
    } else if (fromIndex === 1 && targetIndex === 2) {
      transition3DToSimulator(outgoing, incoming);
    } else if (fromIndex === 2 && targetIndex === 3) {
      transitionSimulatorToBento(outgoing, incoming);
    } else if (fromIndex === 3 && targetIndex === 4) {
      transitionBentoToVision(outgoing, incoming);
    } else {
      // General or Reverse Contextual Fallback Transition
      transitionGeneral(outgoing, incoming, targetIndex > fromIndex ? 1 : -1);
    }
  };

  /* ------------------------------------------------------------------------
     TRANSICIÓN 1: De Diapositiva 1 (Hero) a Diapositiva 2 (Render 3D)
     Onda de radar expansiva que cubre la pantalla y revela el 3D
     ------------------------------------------------------------------------ */
  function transitionHeroTo3D(outgoing, incoming) {
    const layer = document.getElementById('trans-radar-scan');
    const disc = document.querySelector('.trans-radar-disc');
    const wave = document.querySelector('.trans-radar-wave-ring');

    if (!layer || typeof gsap === 'undefined') {
      transitionGeneral(outgoing, incoming, 1);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        outgoing.classList.remove('active');
        incoming.classList.add('active');
        isTransitioning = false;
      }
    });

    tl.set(layer, { visibility: 'visible', opacity: 1 })
      .set(disc, { scale: 0, opacity: 0.95 })
      .set(wave, { scale: 0, opacity: 1 })
      // Onda radar expansiva desde el Hero
      .to(disc, { scale: 1.6, duration: 0.65, ease: 'power2.inOut' }, 0)
      .to(wave, { scale: 1.9, opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.05)
      .to(outgoing, { opacity: 0, scale: 0.94, filter: 'blur(12px)', duration: 0.45, ease: 'power2.in' }, 0)
      // Cambio en el ápice de la onda
      .add(() => {
        outgoing.style.visibility = 'hidden';
        incoming.style.visibility = 'visible';
      }, 0.5)
      // Revelado del modelo 3D y especificaciones
      .fromTo(incoming, {
        opacity: 0,
        scale: 1.06,
        filter: 'blur(14px)'
      }, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.65,
        ease: 'power3.out'
      }, 0.5)
      // Disolución suave del radar
      .to(layer, {
        opacity: 0,
        duration: 0.35,
        ease: 'power1.out',
        onComplete: () => { layer.style.visibility = 'hidden'; }
      }, 0.65)
      .from(incoming.querySelectorAll('.spec-card, .viewer-3d-stage, .kicker-pill, .heading-section, .lead-editorial'), {
        y: 20,
        opacity: 0,
        stagger: 0.06,
        duration: 0.6,
        ease: 'power2.out'
      }, 0.6);
  }

  /* ------------------------------------------------------------------------
     TRANSICIÓN 2: De Diapositiva 2 (Render 3D) a Diapositiva 3 (Simulador)
     Compresión horizontal en haz de luz y apertura de cortina deslizante
     ------------------------------------------------------------------------ */
  function transition3DToSimulator(outgoing, incoming) {
    const layer = document.getElementById('trans-beam-shutter');
    const beam = document.querySelector('.trans-light-beam');
    const curtainL = document.querySelector('.trans-slit-curtain-left');
    const curtainR = document.querySelector('.trans-slit-curtain-right');

    if (!layer || typeof gsap === 'undefined') {
      transitionGeneral(outgoing, incoming, 1);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        outgoing.classList.remove('active');
        incoming.classList.add('active');
        isTransitioning = false;
      }
    });

    tl.set(layer, { visibility: 'visible', opacity: 1 })
      .set(beam, { opacity: 0, scaleY: 0, scaleX: 1 })
      .set(curtainL, { x: 0 })
      .set(curtainR, { x: 0 })
      // 1. El 3D se comprime horizontalmente hacia el centro
      .to(outgoing, {
        scaleX: 0.02,
        opacity: 0.5,
        filter: 'blur(8px)',
        duration: 0.45,
        ease: 'power3.in'
      }, 0)
      // 2. Aparece el haz de luz vertical brillante en el centro
      .to(beam, {
        opacity: 1,
        scaleY: 1.2,
        duration: 0.35,
        ease: 'expo.out'
      }, 0.35)
      // 3. Switch de diapositivas detrás del haz
      .add(() => {
        outgoing.style.visibility = 'hidden';
        incoming.style.visibility = 'visible';
      }, 0.48)
      // 4. El haz se ensancha y el telón/persiana se abre hacia los costados
      .to(beam, {
        scaleX: 60,
        opacity: 0,
        duration: 0.45,
        ease: 'power2.inOut'
      }, 0.5)
      .to(curtainL, { x: '-100%', duration: 0.55, ease: 'power3.inOut' }, 0.5)
      .to(curtainR, { x: '100%', duration: 0.55, ease: 'power3.inOut' }, 0.5)
      .fromTo(incoming, {
        opacity: 0,
        scale: 0.96
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out'
      }, 0.52)
      .to(layer, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => { layer.style.visibility = 'hidden'; }
      }, 0.9);
  }

  /* ------------------------------------------------------------------------
     TRANSICIÓN 3: De Diapositiva 3 (Simulador) a Diapositiva 4 (Bento Grid)
     El obstáculo amarillo vibra, estalla en partículas y ensambla el Bento Grid
     ------------------------------------------------------------------------ */
  function transitionSimulatorToBento(outgoing, incoming) {
    const burstContainer = document.getElementById('trans-particle-burst');
    const simCanvas = document.getElementById('canvas-sim-2d');

    if (!burstContainer || typeof gsap === 'undefined') {
      transitionGeneral(outgoing, incoming, 1);
      return;
    }

    // Calcular la posición del obstáculo amarillo en pantalla
    let originX = window.innerWidth * 0.72;
    let originY = window.innerHeight * 0.5;

    if (simCanvas) {
      const rect = simCanvas.getBoundingClientRect();
      originX = rect.left + 330;
      originY = rect.top + rect.height / 2;
    }

    // Crear partículas dinámicas luminosas (Caviar & Cream)
    burstContainer.innerHTML = '';
    const particleCount = 32;
    const particles = [];
    const luxuryColors = ['#181818', '#DCCFC2', '#A4A09A', '#333333'];

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'burst-particle';
      const size = Math.random() * 12 + 6;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${originX}px`;
      p.style.top = `${originY}px`;
      const color = luxuryColors[i % luxuryColors.length];
      p.style.background = color;
      p.style.boxShadow = `0 0 16px ${color === '#181818' ? 'rgba(24, 24, 24, 0.4)' : 'rgba(220, 207, 194, 0.85)'}`;
      burstContainer.appendChild(p);
      particles.push(p);
    }

    const bentoCards = incoming.querySelectorAll('.bento-card');

    const tl = gsap.timeline({
      onComplete: () => {
        outgoing.classList.remove('active');
        incoming.classList.add('active');
        burstContainer.innerHTML = '';
        burstContainer.style.visibility = 'hidden';
        isTransitioning = false;
      }
    });

    tl.set(burstContainer, { visibility: 'visible', opacity: 1 })
      // 1. El simulador hace flash hacia atrás
      .to(outgoing, {
        scale: 0.94,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.4,
        ease: 'power2.in'
      }, 0)
      // 2. Las partículas amarillas y terracota explotan hacia las 4 esquinas de la pantalla
      .to(particles, {
        x: () => (Math.random() - 0.5) * window.innerWidth * 0.85,
        y: () => (Math.random() - 0.5) * window.innerHeight * 0.75,
        scale: () => Math.random() * 2 + 1,
        duration: 0.55,
        stagger: 0.01,
        ease: 'power3.out'
      }, 0.1)
      .add(() => {
        outgoing.style.visibility = 'hidden';
        incoming.style.visibility = 'visible';
      }, 0.4)
      // 3. Las 4 tarjetas del Bento Grid se ordenan y aparecen volando desde las partículas
      .fromTo(incoming, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.5
      }, 0.45)
      .fromTo(bentoCards, {
        scale: 0.82,
        y: 40,
        opacity: 0,
        filter: 'blur(8px)'
      }, {
        scale: 1,
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.08,
        duration: 0.65,
        ease: 'power3.out'
      }, 0.48)
      // 4. Las partículas se disuelven suavemente
      .to(particles, {
        opacity: 0,
        scale: 0.2,
        duration: 0.35,
        ease: 'power1.out'
      }, 0.6);
  }

  /* ------------------------------------------------------------------------
     TRANSICIÓN 4: De Diapositiva 4 (Bento Grid) a Diapositiva 5 (Visión 2.0)
     Desenfoque progresivo de profundidad y cortina ascendente verde salvia
     ------------------------------------------------------------------------ */
  function transitionBentoToVision(outgoing, incoming) {
    const layer = document.getElementById('trans-sage-curtain');
    const sheet = document.querySelector('.sage-curtain-sheet');
    const bentoCards = outgoing.querySelectorAll('.bento-card');

    if (!layer || typeof gsap === 'undefined') {
      transitionGeneral(outgoing, incoming, 1);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        outgoing.classList.remove('active');
        incoming.classList.add('active');
        isTransitioning = false;
      }
    });

    tl.set(layer, { visibility: 'visible', opacity: 1 })
      .set(sheet, { y: '100%' })
      // 1. Las tarjetas del Bento Grid se deslizan hacia el fondo con desenfoque de profundidad
      .to(bentoCards, {
        scale: 0.85,
        y: -30,
        opacity: 0,
        filter: 'blur(14px)',
        stagger: 0.04,
        duration: 0.45,
        ease: 'power2.in'
      }, 0)
      .to(outgoing, { opacity: 0, duration: 0.4 }, 0.1)
      // 2. La cortina verde salvia asciende como un velo luminoso desde abajo
      .to(sheet, {
        y: '0%',
        duration: 0.55,
        ease: 'power3.inOut'
      }, 0.15)
      .add(() => {
        outgoing.style.visibility = 'hidden';
        incoming.style.visibility = 'visible';
      }, 0.5)
      // 3. La cortina sigue subiendo hacia arriba, revelando Visión 2.0
      .to(sheet, {
        y: '-100%',
        duration: 0.55,
        ease: 'power3.inOut'
      }, 0.5)
      .fromTo(incoming, {
        opacity: 0,
        y: 35,
        filter: 'blur(8px)'
      }, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.6,
        ease: 'power3.out'
      }, 0.55)
      .from(incoming.querySelectorAll('.tab-btn, .vision-display-area'), {
        y: 20,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: 'power2.out'
      }, 0.6)
      .to(layer, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => { layer.style.visibility = 'hidden'; }
      }, 0.9);
  }

  /* ------------------------------------------------------------------------
     TRANSICIÓN GENERAL / INVERSA CONTEXTUAL
     ------------------------------------------------------------------------ */
  function transitionGeneral(outgoing, incoming, direction) {
    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline({
        onComplete: () => {
          outgoing.classList.remove('active');
          incoming.classList.add('active');
          isTransitioning = false;
        }
      });

      tl.to(outgoing, {
        y: direction > 0 ? -40 : 40,
        scale: 0.94,
        opacity: 0,
        filter: 'blur(12px)',
        duration: 0.4,
        ease: 'power2.in'
      }, 0)
      .add(() => {
        outgoing.style.visibility = 'hidden';
        incoming.style.visibility = 'visible';
      }, 0.38)
      .fromTo(incoming, {
        y: direction > 0 ? 40 : -40,
        scale: 1.05,
        opacity: 0,
        filter: 'blur(12px)'
      }, {
        y: 0,
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.55,
        ease: 'power3.out'
      }, 0.38);
    } else {
      outgoing.classList.remove('active');
      outgoing.style.visibility = 'hidden';
      incoming.classList.add('active');
      incoming.style.visibility = 'visible';
      incoming.style.opacity = '1';
      isTransitioning = false;
    }
  }

  // Handle Lateral Eye Navigation Clicks
  navEyes.forEach((eyeItem, index) => {
    eyeItem.addEventListener('click', () => {
      window.goToSlide(index);
    });
  });

  // Handle Advance Floating Button Click
  if (advanceBtn) {
    advanceBtn.addEventListener('click', () => {
      const nextIndex = (currentSlideIndex + 1) % totalScenes;
      window.goToSlide(nextIndex);
    });
  }

  // Links in Hero
  document.querySelectorAll('a[href^="#scene-"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      let targetIdx = 0;
      if (href === '#scene-hero') targetIdx = 0;
      else if (href === '#scene-engineering') targetIdx = 1;
      else if (href === '#scene-simulator') targetIdx = 2;
      else if (href === '#scene-architecture') targetIdx = 3;
      else if (href === '#scene-vision') targetIdx = 4;
      window.goToSlide(targetIdx);
    });
  });

  // Mouse Wheel Navigation
  let wheelCooldown = false;
  window.addEventListener('wheel', (e) => {
    if (window.innerWidth <= 860) return;
    e.preventDefault();
    if (wheelCooldown || isTransitioning) return;
    if (Math.abs(e.deltaY) < 25) return;

    wheelCooldown = true;
    setTimeout(() => { wheelCooldown = false; }, 950);

    if (e.deltaY > 0 && currentSlideIndex < totalScenes - 1) {
      window.goToSlide(currentSlideIndex + 1);
    } else if (e.deltaY < 0 && currentSlideIndex > 0) {
      window.goToSlide(currentSlideIndex - 1);
    }
  }, { passive: false });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (isTransitioning) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      if (currentSlideIndex < totalScenes - 1) window.goToSlide(currentSlideIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (currentSlideIndex > 0) window.goToSlide(currentSlideIndex - 1);
    }
  });

  // Touch Swipe
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (window.innerWidth <= 860 || isTransitioning) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlideIndex < totalScenes - 1) {
        window.goToSlide(currentSlideIndex + 1);
      } else if (diff < 0 && currentSlideIndex > 0) {
        window.goToSlide(currentSlideIndex - 1);
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   2. THREE.JS 3D GLASSES VIEWER (Caviar Black & Soft Beige Titanium)
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
  scene.background = new THREE.Color(0xE6D7C4); // Beige (#E6D7C4)

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0.35, 4.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Warm Luxury Studio Lighting (Navy Blue & Beige)
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.4);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xF4ECE1, 1.6);
  dirLight1.position.set(4, 5, 4);
  dirLight1.castShadow = true;
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xD5C4AD, 0.85); // Bounce Warm Beige
  dirLight2.position.set(-4, -2, -2);
  scene.add(dirLight2);

  const dirLight3 = new THREE.DirectionalLight(0x212842, 0.45); // Subtle Navy Blue Rim
  dirLight3.position.set(2, -3, 3);
  scene.add(dirLight3);

  // Glasses Main Group
  const glassesGroup = new THREE.Group();
  scene.add(glassesGroup);

  // Navy Blue & Beige Luxury Materials
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x212842, // Navy Blue Titanium
    roughness: 0.22,
    metalness: 0.85
  });

  const beigeAccentMat = new THREE.MeshStandardMaterial({
    color: 0xD5C4AD, // Warm Beige Titanium
    roughness: 0.25,
    metalness: 0.92
  });

  const lensMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x161C2E, // Deep Navy tinted luxury lenses
    transparent: true,
    opacity: 0.46,
    roughness: 0.08,
    metalness: 0.2,
    transmission: 0.68,
    ior: 1.52
  });

  const sensorMaterial = new THREE.MeshStandardMaterial({
    color: 0x212842,
    emissive: 0xE6D7C4,
    emissiveIntensity: 0.45,
    roughness: 0.2,
    metalness: 0.9
  });

  // Lenses & Rims
  const lensRadiusX = 0.54;
  const lensRadiusY = 0.45;
  const lensGeo = new THREE.CylinderGeometry(lensRadiusX, lensRadiusX, 0.04, 32);
  lensGeo.scale(1, 0.1, lensRadiusY / lensRadiusX);

  const leftLens = new THREE.Mesh(lensGeo, lensMaterial);
  leftLens.rotation.x = Math.PI / 2;
  leftLens.position.set(-0.7, 0, 0);
  glassesGroup.add(leftLens);

  const leftRimGeo = new THREE.TorusGeometry(lensRadiusX, 0.04, 16, 42);
  leftRimGeo.scale(1, lensRadiusY / lensRadiusX, 1);
  const leftRim = new THREE.Mesh(leftRimGeo, frameMaterial);
  leftRim.position.set(-0.7, 0, 0);
  glassesGroup.add(leftRim);

  const rightLens = new THREE.Mesh(lensGeo, lensMaterial);
  rightLens.rotation.x = Math.PI / 2;
  rightLens.position.set(0.7, 0, 0);
  glassesGroup.add(rightLens);

  const rightRim = new THREE.Mesh(leftRimGeo, frameMaterial);
  rightRim.position.set(0.7, 0, 0);
  glassesGroup.add(rightRim);

  // Titanium Arch Bridge
  const bridgeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.25, 0.08, 0),
    new THREE.Vector3(0, 0.17, 0.02),
    new THREE.Vector3(0.25, 0.08, 0)
  ]);
  const bridgeGeo = new THREE.TubeGeometry(bridgeCurve, 20, 0.034, 12, false);
  const bridgeMesh = new THREE.Mesh(bridgeGeo, beigeAccentMat);
  glassesGroup.add(bridgeMesh);

  // Ultrasonic Sensors in Bridge
  const sensorGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.065, 18);
  sensorGeo.rotateX(Math.PI / 2);

  const sensorL = new THREE.Mesh(sensorGeo, sensorMaterial);
  sensorL.position.set(-0.16, 0.12, 0.04);
  glassesGroup.add(sensorL);

  const sensorR = new THREE.Mesh(sensorGeo, sensorMaterial);
  sensorR.position.set(0.16, 0.12, 0.04);
  glassesGroup.add(sensorR);

  // Temples & Haptic Actuators
  const templeCurveL = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.25, 0.08, 0),
    new THREE.Vector3(-1.28, 0.06, -0.6),
    new THREE.Vector3(-1.26, -0.04, -1.5)
  ]);
  const templeGeoL = new THREE.TubeGeometry(templeCurveL, 24, 0.036, 12, false);
  const templeL = new THREE.Mesh(templeGeoL, frameMaterial);
  glassesGroup.add(templeL);

  const hapticGeo = new THREE.BoxGeometry(0.065, 0.085, 0.24);
  const leftHaptic = new THREE.Mesh(hapticGeo, beigeAccentMat);
  leftHaptic.position.set(-1.27, 0.02, -0.9);
  glassesGroup.add(leftHaptic);

  const templeCurveR = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.25, 0.08, 0),
    new THREE.Vector3(1.28, 0.06, -0.6),
    new THREE.Vector3(1.26, -0.04, -1.5)
  ]);
  const templeGeoR = new THREE.TubeGeometry(templeCurveR, 24, 0.036, 12, false);
  const templeR = new THREE.Mesh(templeGeoR, frameMaterial);
  glassesGroup.add(templeR);

  const rightHaptic = new THREE.Mesh(hapticGeo, beigeAccentMat);
  rightHaptic.position.set(1.27, 0.02, -0.9);
  glassesGroup.add(rightHaptic);

  // Radiant Echo Radar Waves (Soft Beige & Stone)
  const echoWaves = [];
  for (let i = 0; i < 4; i++) {
    const waveGeo = new THREE.RingGeometry(0.12 + i * 0.26, 0.15 + i * 0.26, 36);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0xDCCFC2, // Soft Beige
      transparent: true,
      opacity: 0.8 - i * 0.16,
      side: THREE.DoubleSide
    });
    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.position.set(0, 0.12, 0.22 + i * 0.36);
    glassesGroup.add(waveMesh);
    echoWaves.push(waveMesh);
  }

  // Mouse Controls
  let isDragging = false;
  let prevMouseX = 0, prevMouseY = 0;
  let targetRotX = 0.08, targetRotY = -0.3;
  let autoRotate = true, echoActive = true;

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
    targetRotX = Math.max(-0.6, Math.min(0.6, targetRotX));
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  const btnReset = document.getElementById('btn-3d-reset');
  const btnEcho = document.getElementById('btn-3d-echo');
  const btnTemples = document.getElementById('btn-3d-temples');

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      autoRotate = true; targetRotX = 0.08; targetRotY = -0.3;
    });
  }

  if (btnEcho) {
    btnEcho.addEventListener('click', () => {
      echoActive = !echoActive;
      btnEcho.textContent = echoActive ? 'Ecolocalización ON' : 'Ecolocalización OFF';
      echoWaves.forEach(w => w.visible = echoActive);
    });
  }

  if (btnTemples) {
    btnTemples.addEventListener('click', () => {
      autoRotate = false; targetRotX = 0.2; targetRotY = Math.PI / 2 - 0.25;
    });
  }

  // Dynamic Hotspots Interactivity (Aprovechamiento Espacial 3D)
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
        if (comp === 'sensors') {
          targetRotX = 0.04;
          targetRotY = 0;
        } else if (comp === 'temple-left') {
          targetRotX = 0.14;
          targetRotY = -Math.PI / 2 + 0.3;
        } else if (comp === 'temple-right') {
          targetRotX = 0.14;
          targetRotY = Math.PI / 2 - 0.3;
        } else if (comp === 'frame') {
          targetRotX = 0.26;
          targetRotY = 0.45;
        }
      });
    }
  });

  // Clicking outside dismisses open hotspot card
  container.addEventListener('click', () => {
    hotspots.forEach(h => h.classList.remove('active'));
  });

  // Animation Loop
  let clock = new THREE.Clock();
  function animate3D() {
    requestAnimationFrame(animate3D);
    const elapsedTime = clock.getElapsedTime();

    if (autoRotate) targetRotY += 0.005;
    glassesGroup.rotation.y += (targetRotY - glassesGroup.rotation.y) * 0.08;
    glassesGroup.rotation.x += (targetRotX - glassesGroup.rotation.x) * 0.08;
    glassesGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.04;

    if (echoActive) {
      echoWaves.forEach((wave, idx) => {
        const phase = (elapsedTime * 2.2 + idx * 0.6) % 2.5;
        wave.scale.set(1 + phase * 0.85, 1 + phase * 0.85, 1);
        wave.position.z = 0.22 + phase * 0.75;
        wave.material.opacity = Math.max(0, 0.7 - (phase / 2.5) * 0.7);
      });
    }

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
