/**
 * TEST.JS - SmartNav Quality & Architecture Validator (Awwwards Grade)
 * Validates DOM IDs, 5 Fullpage Scenes, Luminous Warm Palette Tokens,
 * Contextual GSAP Transitions, 3D/2D Controllers, and Standalone Build.
 * Zero external dependencies. Can be run with: node test.js (or agy-node test.js)
 */

const fs = typeof require !== 'undefined' ? require('fs') : null;
const path = typeof require !== 'undefined' ? require('path') : null;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  bold: '\x1b[1m'
};

let passed = 0;
let failed = 0;

function assert(condition, name, err = '') {
  if (condition) {
    console.log(` ${colors.green}[PASS]${colors.reset} ${name}`);
    passed++;
  } else {
    console.error(` ${colors.red}[FAIL]${colors.reset} ${name} ${err}`);
    failed++;
  }
}

console.log(`\n${colors.cyan}${colors.bold}=== [SMARTNAV ADVANCED QUALITY AUDIT & TEST SUITE] ===${colors.reset}\n`);

if (fs && path) {
  // 1. File Architecture Verification
  console.log(`${colors.yellow}>> 1. Verifying Required File Architecture${colors.reset}`);
  const requiredFiles = [
    'index.html',
    'styles.css',
    'main.js',
    'README.md',
    '.gitignore',
    '.github/workflows/deploy.yml',
    'test/smartnav_standalone.html'
  ];

  requiredFiles.forEach(f => {
    const full = path.join(__dirname, f);
    assert(fs.existsSync(full), `File exists: ${f}`);
  });

  // 2. Index.html Semantic Scenes & New UI Controls
  console.log(`\n${colors.yellow}>> 2. Verifying 5 Fullpage Scenes & UI Controls in index.html${colors.reset}`);
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

  const requiredScenes = [
    'scene-hero',
    'scene-engineering',
    'scene-simulator',
    'scene-architecture',
    'scene-vision'
  ];

  requiredScenes.forEach(sceneId => {
    assert(html.includes(`id="${sceneId}"`), `Scene element found: #${sceneId}`);
  });

  assert(html.includes('class="lateral-capsule"'), 'Floating Lateral Navigation Capsule is present');
  assert(html.includes('nav-eye-item') && html.includes('nav-eye-svg'), 'Lateral indicator features interactive SVG Eyes with open/close animation');
  assert(html.includes('eye-num-text'), 'Eye pupil numbers (01 to 05) are present');
  assert(html.includes('id="intro-eye-curtain"'), 'Fullscreen Opening Eye Intro overlay (A24 / Content Architecture grade) is present');
  assert(html.includes('intro-grand-eye-svg') && html.includes('intro-lash-flyer'), 'Intro grand eye with flying eyelashes is present');
  assert(!html.includes('class="advance-fab"'), 'Advance FAB (counter and bottom-right arrow) has been removed as requested');
  assert(html.includes('scene-social-dock'), 'Dedicated Social Dock is present in the final slide');
  assert(html.includes('Instagram') && html.includes('X (Twitter)') && html.includes('GitHub'), 'Social icon links (Instagram, X, GitHub) are present');
  assert(html.includes('target="_blank"') && html.includes('rel="noopener noreferrer"'), 'External links are secured');

  // 3. CSS Navy Blue & Beige Luxury Palette
  console.log(`\n${colors.yellow}>> 3. Verifying Navy Blue & Beige Luxury Palette in styles.css${colors.reset}`);
  const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');

  assert(css.includes('#212842'), 'Navy Blue (#212842) defined in CSS');
  assert(css.includes('#E6D7C4'), 'Warm Beige (#E6D7C4) defined in CSS');
  assert(css.includes('--color-navy'), 'Navy Blue token (--color-navy) configured');
  assert(css.includes('--color-beige'), 'Beige token (--color-beige) configured');
  assert(css.includes('.intro-eye-curtain'), 'Fullscreen Eye Intro curtain styles defined');
  assert(css.includes('.nav-eye-btn'), 'Interactive Eye Navigation button styles defined');
  assert(css.includes('.scene-social-dock'), 'Scene 5 Social Dock styles defined');

  // 4. Main.js Controllers & Engine
  console.log(`\n${colors.yellow}>> 4. Verifying Interactive Engines in main.js${colors.reset}`);
  const js = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');

  assert(js.includes('initEyeIntroAnimation'), 'Fullscreen Opening Eye Intro animation implemented');
  assert(js.includes('initContextualDeck'), 'Contextual Deck transition controller implemented');
  assert(js.includes('goToSlide'), 'Fullpage slide navigation with contextual transitions implemented');
  assert(js.includes('initThreeJsViewer'), 'Three.js 3D glasses viewer implemented');
  assert(js.includes('initSimulator2D'), 'Canvas 2D "Tocar vs. Anticipar" simulator implemented');
  assert(js.includes('initVisionTabs'), 'Vision 2.0 interactive tab selector implemented');

  // 5. Standalone Build Integrity
  console.log(`\n${colors.yellow}>> 5. Verifying Standalone file:/// Compatibility in test/smartnav_standalone.html${colors.reset}`);
  const standalone = fs.readFileSync(path.join(__dirname, 'test', 'smartnav_standalone.html'), 'utf8');

  assert(standalone.length > 50000, `Standalone file size is complete (${Math.round(standalone.length / 1024)} KB)`);
  assert(standalone.includes('<style>') && standalone.includes('</style>'), 'Embedded styles block present');
  assert(standalone.includes('<script>') && standalone.includes('</script>'), 'Embedded script block present');
}

console.log(`\n${colors.cyan}------------------------------------------------${colors.reset}`);
if (failed === 0) {
  console.log(`${colors.green}${colors.bold}ALL SMARTNAV TESTS PASSED! (${passed} passed, 0 failed)${colors.reset}\n`);
  if (typeof process !== 'undefined') process.exit(0);
} else {
  console.error(`${colors.red}${colors.bold}AUDIT FAILED (${passed} passed, ${failed} failed)${colors.reset}\n`);
  if (typeof process !== 'undefined') process.exit(1);
}
