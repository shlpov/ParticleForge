import type { ShapeDescriptor } from './types';

export class PresetManager {
  public static get(name: string, options: Record<string, unknown> = {}): ShapeDescriptor {
    const presets: Record<string, ShapeDescriptor> = {
      text: {
        type: 'text',
        text: String(options.text ?? 'PARTICLE'),
        font: String(options.font ?? '700 170px sans-serif'),
        density: Number(options.density ?? 1)
      },
      circle: {
        type: 'circle',
        radius: Number(options.radius ?? 160)
      },
      ring: {
        type: 'ring',
        radius: Number(options.radius ?? 170)
      },
      ellipse: {
        type: 'ellipse',
        width: Number(options.width ?? 250),
        height: Number(options.height ?? 120)
      },
      star: {
        type: 'star',
        radius: Number(options.radius ?? 180),
        sides: Number(options.sides ?? 5)
      },
      polygon: {
        type: 'polygon',
        radius: Number(options.radius ?? 180),
        sides: Number(options.sides ?? 6)
      },
      sphere: {
        type: 'sphere',
        radius: Number(options.radius ?? 160)
      },
      wave: {
        type: 'wave',
        amplitude: Number(options.amplitude ?? 80),
        frequency: Number(options.frequency ?? 2)
      },
      spiral: {
        type: 'spiral',
        radius: Number(options.radius ?? 180)
      },
      galaxy: {
        type: 'galaxy',
        radius: Number(options.radius ?? 160)
      },
      custom: {
        type: 'custom',
        points: Array.isArray(options.points) ? (options.points as ShapeDescriptor['points']) : []
      }
    };

    return presets[name] ?? presets.text;
  }

  public static list(): string[] {
    return ['text', 'circle', 'ring', 'ellipse', 'star', 'polygon', 'sphere', 'wave', 'spiral', 'galaxy', 'custom'];
  }
}
