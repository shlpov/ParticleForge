import '../styles.css';
import { ParticleEngine, PresetManager } from '../index';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('App root not found');
}

app.innerHTML = `
  <div class="demo-shell">
    <header class="demo-header">
      <h1>ParticleForge</h1>
      <button id="morph-btn" type="button">Morph</button>
    </header>
    <div class="demo-controls">
      <button id="text-btn" type="button">Text</button>
      <button id="wave-btn" type="button">Wave</button>
      <button id="sphere-btn" type="button">Sphere</button>
      <button id="scatter-btn" type="button">Scatter</button>
    </div>
    <canvas id="forge-canvas" width="960" height="540"></canvas>
  </div>
`;

const canvas = document.querySelector('#forge-canvas') as HTMLCanvasElement;
const engine = new ParticleEngine(canvas, {
  count: 1600,
  particle: {
    colors: ['#7dd3fc', '#a78bfa', '#f9a8d4', '#facc15'],
    radius: 2,
    opacity: 0.85,
    glow: 14,
    blur: 0
  }
});

engine.morphTo(PresetManager.get('text', { text: 'SHIPOV' }), { duration: 1800 });
engine.interaction.setMode('repel');

const morphBtn = document.querySelector('#morph-btn');
const textBtn = document.querySelector('#text-btn');
const waveBtn = document.querySelector('#wave-btn');
const sphereBtn = document.querySelector('#sphere-btn');
const scatterBtn = document.querySelector('#scatter-btn');

morphBtn?.addEventListener('click', () => {
  const target = Math.random() > 0.5 ? PresetManager.get('sphere', { radius: 160 }) : PresetManager.get('wave', { amplitude: 80, frequency: 2.1 });
  engine.morphTo(target, { duration: 2000, easing: 'easeInOut' });
});

textBtn?.addEventListener('click', () => {
  engine.morphTo(PresetManager.get('text', { text: 'SHIPOV' }), { duration: 1600, easing: 'easeOut' });
});

waveBtn?.addEventListener('click', () => {
  engine.morphTo(PresetManager.get('wave', { amplitude: 90, frequency: 2 }), { duration: 1800, easing: 'easeInOut' });
});

sphereBtn?.addEventListener('click', () => {
  engine.morphTo(PresetManager.get('sphere', { radius: 170 }), { duration: 1800, easing: 'easeInOut' });
});

scatterBtn?.addEventListener('click', () => {
  engine.scatter({ scattering: 1.3, duration: 1000 });
});

window.addEventListener('beforeunload', () => engine.destroy());
