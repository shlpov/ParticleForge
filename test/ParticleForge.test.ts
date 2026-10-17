import { describe, expect, it } from 'vitest';
import { ParticleEngine } from '../src/lib/ParticleEngine';
import { PresetManager } from '../src/lib/PresetManager';
import { ShapeSampler } from '../src/lib/ShapeSampler';

describe('ShapeSampler', () => {
  it('samples a circle into a stable point set', () => {
    const points = ShapeSampler.generate({ type: 'circle', radius: 60 }, 8, 200, 200);

    expect(points).toHaveLength(8);
    expect(points[0].x).toBeCloseTo(160, 0);
    expect(points[0].y).toBeCloseTo(100, 0);
  });

  it('samples a wave with predictable vertical motion', () => {
    const points = ShapeSampler.generate({ type: 'wave', amplitude: 30, frequency: 2 }, 6, 200, 200);

    expect(points).toHaveLength(6);
    expect(points[0].y).toBeLessThan(200);
    expect(points[points.length - 1].x).toBeCloseTo(166.67, 1);
  });
});

describe('PresetManager', () => {
  it('provides named presets for common forms', () => {
    expect(PresetManager.list()).toContain('text');
    expect(PresetManager.get('sphere', { radius: 120 }).type).toBe('sphere');
  });
});

describe('ParticleEngine', () => {
  it('creates particles and destroys cleanly', () => {
    const mockContext = {
      clearRect() {},
      save() {},
      restore() {},
      beginPath() {},
      arc() {},
      fill() {},
      fillRect() {},
      set globalAlpha(_value: number) {},
      set shadowBlur(_value: number) {},
      set shadowColor(_value: string) {},
      set globalCompositeOperation(_value: string) {}
    } as unknown as CanvasRenderingContext2D;

    const canvas = {
      width: 400,
      height: 300,
      getContext: () => mockContext
    } as unknown as HTMLCanvasElement;
    const engine = new ParticleEngine(canvas, { count: 500 });

    expect(engine.count).toBeGreaterThan(0);
    engine.destroy();
    expect(engine.count).toBe(0);
  });
});
