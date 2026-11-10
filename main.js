const sections = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".page-dot")];
const pageLabel = document.querySelector(".page-nav-label");
const nextButton = document.querySelector(".next-button");
const announcement = document.querySelector("#navigation-announcement");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let activeSection = 0;
let soundEnabled = false;
let audioContext;

function playTone(frequency = 520) {
  // El audio se crea únicamente después de que la persona lo activa.
  if (!soundEnabled) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioContext ??= new AudioContext();
  if (audioContext.state === "suspended") void audioContext.resume();

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.12);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.13);
}

function goToSection(index) {
  const boundedIndex = Math.max(0, Math.min(sections.length - 1, index));
  sections[boundedIndex].scrollIntoView({
    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    block: "start",
  });
  playTone(440 + boundedIndex * 35);
}

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;

  activeSection = sections.indexOf(visible.target);
  dots.forEach((dot, index) => {
    const isActive = index === activeSection;
    dot.classList.toggle("is-active", isActive);
    if (isActive) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
  pageLabel.textContent = `${String(activeSection + 1).padStart(2, "0")} / ${String(sections.length).padStart(2, "0")}`;
  if (nextButton) {
    nextButton.setAttribute(
      "aria-label",
      activeSection === sections.length - 1 ? "Volver al inicio" : "Ir a la siguiente sección",
    );
    const label = nextButton.querySelector("span:first-child");
    if (label) label.textContent = activeSection === sections.length - 1 ? "Volver al inicio" : "Desliza para explorar";
  }
  announcement.textContent = `Sección ${activeSection + 1} de ${sections.length}: ${visible.target.querySelector("h1, h2")?.textContent.replace(/\s+/g, " ").trim() ?? ""}`;
}, { threshold: [0.35, 0.6] });

sections.forEach((section) => sectionObserver.observe(section));
dots.forEach((dot, index) => dot.addEventListener("click", (event) => {
  event.preventDefault();
  goToSection(index);
}));
nextButton?.addEventListener("click", () => {
  goToSection(activeSection === sections.length - 1 ? 0 : activeSection + 1);
});

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey) return;
  const target = event.target;
  if (target instanceof HTMLElement && (target.isContentEditable || /INPUT|TEXTAREA|SELECT|BUTTON/.test(target.tagName))) return;
  if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    goToSection(activeSection + 1);
  } else if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault();
    goToSection(activeSection - 1);
  } else if (event.key === "Home") {
    event.preventDefault();
    goToSection(0);
  } else if (event.key === "End") {
    event.preventDefault();
    goToSection(sections.length - 1);
  }
});

document.querySelector("#contrast-toggle")?.addEventListener("click", (event) => {
  const button = event.currentTarget;
  const enabled = document.body.classList.toggle("high-contrast");
  button.setAttribute("aria-pressed", String(enabled));
});

document.querySelector("#sound-toggle")?.addEventListener("click", (event) => {
  const button = event.currentTarget;
  soundEnabled = !soundEnabled;
  button.setAttribute("aria-pressed", String(soundEnabled));
  button.setAttribute("aria-label", soundEnabled ? "Desactivar sonidos de interfaz" : "Activar sonidos de interfaz");
  button.title = soundEnabled ? "Desactivar sonido" : "Sonido opcional";
  const icon = button.querySelector("svg");
  if (icon) icon.setAttribute("data-lucide", soundEnabled ? "volume-2" : "volume-x");
  window.lucide?.createIcons();
  playTone(660);
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
window.addEventListener("load", () => {
  window.lucide?.createIcons();
  if (window.gsap && !prefersReducedMotion.matches) {
    window.gsap.from(".hero-copy > *", { y: 18, opacity: 0, duration: 0.8, stagger: 0.11, ease: "power2.out" });
  }
});

function initProductViewer() {
  const canvas = document.querySelector("#product-canvas");
  const wrapper = document.querySelector("#product-canvas-wrap");
  const fallback = document.querySelector("#canvas-fallback");
  if (!canvas || !wrapper) return;

  let initialized = false;
  const loadViewer = async () => {
    if (initialized) return;
    initialized = true;

    try {
    const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: window.devicePixelRatio <= 1.5,
      powerPreference: "low-power",
      stencil: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
    camera.position.set(0, 0.2, 8.6);
    scene.add(new THREE.HemisphereLight(0xfffcf4, 0x77786e, 2.25));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(-3, 5, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xc8d7c6, 2.1);
    rimLight.position.set(4, 1, -3);
    scene.add(rimLight);

    const product = new THREE.Group();
    scene.add(product);

    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x292a26, roughness: 0.25, metalness: 0.62 });
    const lensMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc6d8cb,
      roughness: 0.12,
      metalness: 0.04,
      transmission: 0.16,
      transparent: true,
      opacity: 0.72,
      thickness: 0.28,
      side: THREE.DoubleSide,
    });
    const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0xb7745d, roughness: 0.25, metalness: 0.55 });

    function roundedRectShape(width, height, radius) {
      const shape = new THREE.Shape();
      const x = -width / 2;
      const y = -height / 2;
      shape.moveTo(x + radius, y);
      shape.lineTo(x + width - radius, y);
      shape.quadraticCurveTo(x + width, y, x + width, y + radius);
      shape.lineTo(x + width, y + height - radius);
      shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      shape.lineTo(x + radius, y + height);
      shape.quadraticCurveTo(x, y + height, x, y + height - radius);
      shape.lineTo(x, y + radius);
      shape.quadraticCurveTo(x, y, x + radius, y);
      return shape;
    }

    function addRod(start, end, radius, material, segments = 10) {
      const from = new THREE.Vector3(...start);
      const to = new THREE.Vector3(...end);
      const direction = new THREE.Vector3().subVectors(to, from);
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.78, radius, direction.length(), segments), material);
      rod.position.copy(from).add(to).multiplyScalar(0.5);
      rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
      product.add(rod);
      return rod;
    }

    const lensShape = roundedRectShape(1.4, 0.92, 0.28);
    for (const centerX of [-0.86, 0.86]) {
      const lens = new THREE.Mesh(new THREE.ShapeGeometry(lensShape, 18), lensMaterial);
      lens.position.set(centerX, 0, 0);
      product.add(lens);

      const outlinePoints = lensShape.getPoints(36).map((point) => new THREE.Vector3(point.x + centerX, point.y, 0.045));
      const outline = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(outlinePoints, true), 72, 0.052, 8, true),
        frameMaterial,
      );
      product.add(outline);
    }

    addRod([-0.18, 0.29, 0.02], [0.18, 0.29, 0.02], 0.065, frameMaterial);
    addRod([-1.54, 0.25, 0.03], [-2.55, 0.45, -0.24], 0.065, frameMaterial);
    addRod([1.54, 0.25, 0.03], [2.55, 0.45, -0.24], 0.065, frameMaterial);
    addRod([-2.55, 0.45, -0.24], [-2.42, 0.27, -1.42], 0.07, frameMaterial);
    addRod([2.55, 0.45, -0.24], [2.42, 0.27, -1.42], 0.07, frameMaterial);

    for (const x of [-0.24, 0.24]) {
      const sensor = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 16), sensorMaterial);
      sensor.position.set(x, 0.27, 0.12);
      product.add(sensor);
      const sensorRing = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.018, 8, 24), frameMaterial);
      sensorRing.position.copy(sensor.position);
      product.add(sensorRing);
    }

    const templeSensor = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), sensorMaterial);
    templeSensor.position.set(2.42, 0.32, -0.82);
    product.add(templeSensor);

    let targetRotationY = -0.18;
    let targetRotationX = 0.02;
    let velocityX = 0;
    let velocityY = 0;
    let dragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let viewerVisible = false;
    let renderFrame = 0;

    function requestRender() {
      if (!viewerVisible || document.hidden || renderFrame) return;
      renderFrame = window.requestAnimationFrame(render);
    }

    function resize() {
      const bounds = wrapper.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 500 ? 9.5 : 8.6;
      camera.updateProjectionMatrix();
      requestRender();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);
    resize();

    canvas.addEventListener("pointerdown", (event) => {
      dragging = true;
      previousPointerX = event.clientX;
      previousPointerY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const deltaX = event.clientX - previousPointerX;
      const deltaY = event.clientY - previousPointerY;
      targetRotationY += deltaX * 0.009;
      targetRotationX = THREE.MathUtils.clamp(targetRotationX + deltaY * 0.006, -0.55, 0.55);
      // La velocidad residual se amortigua al soltar para dar inercia al giro.
      velocityY = deltaX * 0.0007;
      velocityX = deltaY * 0.0004;
      previousPointerX = event.clientX;
      previousPointerY = event.clientY;
      requestRender();
    });
    const stopDragging = () => {
      dragging = false;
      requestRender();
    };
    canvas.addEventListener("pointerup", stopDragging);
    canvas.addEventListener("pointercancel", stopDragging);

    document.querySelectorAll(".view-button").forEach((button) => {
      button.addEventListener("click", () => {
        const view = button.dataset.view;
        const rotations = { front: [0.02, -0.18], side: [0.02, -1.08], detail: [0.38, 0.1] };
        [targetRotationX, targetRotationY] = rotations[view] ?? rotations.front;
        velocityX = 0;
        velocityY = 0;
        document.querySelectorAll(".view-button").forEach((item) => {
          const selected = item === button;
          item.classList.toggle("is-selected", selected);
          item.setAttribute("aria-pressed", String(selected));
        });
        requestRender();
        playTone(540);
      });
    });

    const render = () => {
      renderFrame = 0;
      if (!viewerVisible || document.hidden) return;

      if (!dragging && !prefersReducedMotion.matches) {
          targetRotationY += velocityY;
          targetRotationX += velocityX;
          velocityX *= 0.94;
          velocityY *= 0.94;
      }
      if (prefersReducedMotion.matches) {
        product.rotation.y = targetRotationY;
        product.rotation.x = targetRotationX;
      } else {
        product.rotation.y += (targetRotationY - product.rotation.y) * 0.075;
        product.rotation.x += (targetRotationX - product.rotation.x) * 0.075;
      }
      renderer.render(scene, camera);
      const rotationSettled = Math.abs(targetRotationY - product.rotation.y) < 0.001
        && Math.abs(targetRotationX - product.rotation.x) < 0.001;
      const inertiaSettled = Math.abs(velocityX) < 0.0005 && Math.abs(velocityY) < 0.0005;
      if (dragging || !rotationSettled || !inertiaSettled) requestRender();
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      viewerVisible = entry.isIntersecting;
      if (viewerVisible) requestRender();
    });
    visibilityObserver.observe(wrapper);
    document.addEventListener("visibilitychange", requestRender);
    } catch (error) {
      console.warn("No se pudo cargar la visualización 3D de SmartNav.", error);
      canvas.hidden = true;
      fallback.hidden = false;
    }
  };

  if ("IntersectionObserver" in window) {
    const loadObserver = new IntersectionObserver(([entry], observer) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      void loadViewer();
    }, { rootMargin: "160px 0px" });
    loadObserver.observe(wrapper);
  } else {
    void loadViewer();
  }
}

initProductViewer();

function initSimulator() {
  const canvas = document.querySelector("#comparison-canvas");
  const context = canvas?.getContext("2d");
  if (!canvas || !context) return;

  const playButton = document.querySelector("#sim-play");
  const resetButton = document.querySelector("#sim-reset");
  const status = document.querySelector("#sim-status");
  let progress = 0;
  let playing = !prefersReducedMotion.matches;
  let lastFrame = 0;
  let frameId = 0;
  let previousDetection = false;
  let simulatorVisible = false;

  function requestDraw() {
    if (frameId || document.hidden || !simulatorVisible) return;
    frameId = window.requestAnimationFrame(draw);
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
    canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    requestDraw();
  }

  function drawPerson(x, y, color, label) {
    context.save();
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = 2;
    context.lineCap = "round";
    context.beginPath();
    context.arc(x, y - 15, 5, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(x, y - 9);
    context.lineTo(x, y + 7);
    context.moveTo(x, y - 3);
    context.lineTo(x + 8, y + 1);
    context.moveTo(x, y + 7);
    context.lineTo(x - 6, y + 16);
    context.moveTo(x, y + 7);
    context.lineTo(x + 7, y + 15);
    context.stroke();
    context.fillStyle = "#77766f";
    context.font = "9px 'DM Sans', sans-serif";
    context.fillText(label, x - 17, y + 31);
    context.restore();
  }

  // Los umbrales son proporciones visuales de una escena conceptual, no mediciones reales.
  function drawPanel({ left, top, width, height, kind, currentProgress }) {
    const isNav = kind === "nav";
    const foreground = isNav ? "#64715e" : "#b7745d";
    const heading = isNav ? "SMARTNAV · ANTICIPACIÓN" : "BASTÓN BLANCO · CONTACTO";
    const groundY = top + height * 0.76;
    const startX = left + width * 0.12;
    const obstacleX = left + width * 0.86;
    const personX = startX + (obstacleX - startX) * currentProgress * 0.96;
    const obstacleTop = groundY - height * 0.34;
    const obstacleBottom = groundY;
    const distance = obstacleX - personX;
    const detected = isNav ? distance < width * 0.48 : distance < width * 0.105;

    context.save();
    context.fillStyle = "#f4f1e9";
    context.fillRect(left, top, width, height);
    context.fillStyle = "#5f5e58";
    context.font = "600 9px 'DM Sans', sans-serif";
    context.fillText(heading, left + 13, top + 18);

    context.strokeStyle = "#d8d5cc";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(left + 12, groundY + 1);
    context.lineTo(left + width - 12, groundY + 1);
    context.stroke();

    if (isNav) {
      const radius = width * 0.57;
      context.fillStyle = "rgba(141, 156, 133, 0.17)";
      context.beginPath();
      context.moveTo(personX, groundY - 5);
      context.arc(personX, groundY - 5, radius, -Math.PI / 3, Math.PI / 3);
      context.closePath();
      context.fill();
      context.strokeStyle = "rgba(100, 113, 94, 0.43)";
      context.setLineDash([4, 5]);
      context.beginPath();
      context.arc(personX, groundY - 5, radius, -Math.PI / 3, Math.PI / 3);
      context.stroke();
      context.setLineDash([]);
    } else {
      context.strokeStyle = "rgba(183, 116, 93, 0.27)";
      context.setLineDash([3, 5]);
      context.beginPath();
      context.arc(personX, groundY - 4, width * 0.1, -Math.PI / 3, Math.PI / 3);
      context.stroke();
      context.setLineDash([]);
    }

    context.fillStyle = detected ? foreground : "#d9d4c8";
    context.fillRect(obstacleX - 7, obstacleTop, 14, obstacleBottom - obstacleTop);
    context.beginPath();
    context.arc(obstacleX, obstacleTop, 7, Math.PI, 0);
    context.fill();

    if (!isNav) {
      context.strokeStyle = "#776c5d";
      context.lineWidth = 1.5;
      context.beginPath();
      context.moveTo(personX + 6, groundY + 9);
      context.lineTo(Math.min(personX + width * 0.22, obstacleX - 3), groundY + 4);
      context.stroke();
    }
    drawPerson(personX, groundY - 2, foreground, isNav ? "persona" : "persona");

    const markerX = isNav ? personX + Math.min(width * 0.28, distance * 0.7) : obstacleX - 13;
    if (detected) {
      context.fillStyle = foreground;
      context.beginPath();
      context.arc(markerX, obstacleTop - 15, 3, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = foreground;
      context.font = "600 8px 'DM Sans', sans-serif";
      context.fillText(isNav ? "AVISO A DISTANCIA" : "CONTACTO", Math.max(left + 11, markerX - 38), obstacleTop - 24);
    } else {
      context.fillStyle = "#8a8880";
      context.font = "8px 'DM Sans', sans-serif";
      context.fillText(isNav ? "campo amplio · 120°" : "detección al alcance", left + 13, groundY + 21);
    }
    context.restore();
    return detected;
  }

  function draw(timestamp = 0) {
    frameId = 0;
    if (document.hidden) return;
    if (playing && lastFrame) {
      progress = (progress + (timestamp - lastFrame) / 12500) % 1;
    }
    lastFrame = playing ? timestamp : 0;

    const bounds = canvas.getBoundingClientRect();
    const width = bounds.width;
    const height = bounds.height;
    context.clearRect(0, 0, width, height);

    const gap = 12;
    const panelWidth = (width - gap) / 2;
    const paddingTop = 3;
    const panelHeight = height - paddingTop - 4;
    const navDetected = drawPanel({ left: 0, top: paddingTop, width: panelWidth, height: panelHeight, kind: "nav", currentProgress: progress });
    const caneDetected = drawPanel({ left: panelWidth + gap, top: paddingTop, width: panelWidth, height: panelHeight, kind: "cane", currentProgress: progress });

    if (navDetected !== previousDetection) {
      status.textContent = navDetected
        ? "SmartNav detecta el obstáculo con anticipación; el bastón aún no ha llegado al punto de contacto."
        : "SmartNav y el bastón muestran momentos de detección distintos en este escenario conceptual.";
      previousDetection = navDetected;
    } else if (caneDetected && navDetected) {
      status.textContent = "En este momento, ambos métodos han identificado el obstáculo; SmartNav lo señaló antes en la simulación.";
    }
    if (playing) requestDraw();
  }

  function updatePlayButton() {
    const icon = playButton.querySelector("svg");
    if (icon) icon.setAttribute("data-lucide", playing ? "pause" : "play");
    playButton.querySelector("span").textContent = playing ? "Pausar" : "Reanudar";
    window.lucide?.createIcons();
  }

  playButton.addEventListener("click", () => {
    playing = !playing;
    lastFrame = 0;
    updatePlayButton();
    requestDraw();
    playTone(playing ? 580 : 390);
  });
  resetButton.addEventListener("click", () => {
    progress = 0;
    previousDetection = false;
    status.textContent = "SmartNav detecta el obstáculo con anticipación; el bastón lo confirma al contacto.";
    if (!playing) {
      playing = true;
      updatePlayButton();
    }
    lastFrame = 0;
    requestDraw();
    playTone(500);
  });
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();
  updatePlayButton();
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    simulatorVisible = entry.isIntersecting;
    if (!simulatorVisible && frameId) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
      lastFrame = 0;
    } else requestDraw();
  });
  visibilityObserver.observe(canvas);
  requestDraw();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
      lastFrame = 0;
    } else requestDraw();
  });
}

initSimulator();
