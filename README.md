# ParticleForge

ParticleForge is a lightweight, reusable particle animation engine for the web. It is designed for morphing text, logos, geometric forms, waves, galaxy patterns, SVG paths, and custom particle layouts.

![ParticleForge Demo](https://img.shields.io/badge/status-demo%20ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## Overview

The library provides a production-friendly API for developers who want to animate particles on canvas without wiring a custom render loop or a heavy engine. It supports:

- text-to-particle generation
- morphing between shapes
- geometric presets (circle, ring, ellipse, polygon, star, sphere, wave, spiral, galaxy)
- SVG and custom point collections
- cursor interactions (repel, attract, orbit)
- adjustable palette, glow, blur, opacity, and particle sizing
- easy integration with plain HTML, TypeScript, and framework-based apps

## Installation

```bash
npm install particleforge
```

## Quick start

```ts
import { ParticleEngine, PresetManager } from 'particleforge';

const canvas = document.querySelector('canvas') as HTMLCanvasElement;
const engine = new ParticleEngine(canvas, {
  count: 1400,
  particle: {
    colors: ['#7dd3fc', '#a78bfa', '#f9a8d4', '#facc15'],
    radius: 2,
    opacity: 0.9,
    glow: 12,
    blur: 0
  }
});

engine.morphTo(PresetManager.get('text', { text: 'SHIPOV' }), {
  duration: 1800,
  easing: 'easeInOut'
});

engine.interaction.setMode('repel');
```

## Presets

```ts
const wave = PresetManager.get('wave', { amplitude: 90, frequency: 2 });
const sphere = PresetManager.get('sphere', { radius: 180 });

engine.morphTo(wave, { duration: 1600, easing: 'easeOut' });
engine.morphTo(sphere, { duration: 1600, easing: 'easeInOut' });
```

## Available commands

```bash
npm install
npm run dev
npm run test
npm run build
```

## Project structure

- `src/lib/ParticleEngine.ts` — lifecycle and main orchestration
- `src/lib/Particle.ts` — particle state model
- `src/lib/ParticleRenderer.ts` — canvas rendering pipeline
- `src/lib/ShapeSampler.ts` — generation and sampling for forms
- `src/lib/AnimationController.ts` — morphing transitions and easing
- `src/lib/InteractionController.ts` — pointer-driven reactions
- `src/lib/PresetManager.ts` — built-in shape presets
- `src/lib/PerformanceManager.ts` — adaptive frame budget and load control
- `src/demo/` — local showcase page
- `test/` — unit tests

## Roadmap

- improved SVG path parsing and point normalization
- richer preset library and global theme configuration
- optional React/Vue integration helpers
- deterministic benchmarking and profile presets

## License

MIT
