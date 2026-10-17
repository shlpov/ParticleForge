import type { Point, ShapeDescriptor } from './types';

export class ShapeSampler {
  public static generate(
    descriptor: ShapeDescriptor,
    total: number,
    width = 800,
    height = 500
  ): Point[] {
    const sampler = ShapeSampler;
    const points = sampler.samplePoints(descriptor, total, width, height);
    return sampler.selectSample(points, total);
  }

  private static samplePoints(
    descriptor: ShapeDescriptor,
    total: number,
    width: number,
    height: number
  ): Point[] {
    const sampler = ShapeSampler;
    switch (descriptor.type) {
      case 'circle':
        return sampler.generateCircle(descriptor.radius ?? Math.min(width, height) * 0.3, total, width, height);
      case 'ring':
        return sampler.generateRing(descriptor.radius ?? Math.min(width, height) * 0.3, total, width, height);
      case 'ellipse':
        return sampler.generateEllipse(
          descriptor.width ?? width * 0.4,
          descriptor.height ?? height * 0.26,
          total,
          width,
          height
        );
      case 'star':
        return sampler.generateStar(descriptor.radius ?? Math.min(width, height) * 0.34, total, width, height, descriptor.sides ?? 5);
      case 'polygon':
        return sampler.generatePolygon(descriptor.radius ?? Math.min(width, height) * 0.3, total, width, height, descriptor.sides ?? 6);
      case 'sphere':
        return sampler.generateSphere(descriptor.radius ?? Math.min(width, height) * 0.25, total, width, height);
      case 'wave':
        return sampler.generateWave(descriptor.amplitude ?? 80, descriptor.frequency ?? 2, total, width, height);
      case 'spiral':
        return sampler.generateSpiral(descriptor.radius ?? Math.min(width, height) * 0.32, total, width, height);
      case 'galaxy':
        return sampler.generateGalaxy(descriptor.radius ?? Math.min(width, height) * 0.28, total, width, height);
      case 'text':
        return sampler.generateText(descriptor.text ?? 'ParticleForge', total, width, height, descriptor.font ?? '700 160px sans-serif');
      case 'svg':
        return sampler.parseSvgPath(descriptor.svgPath ?? '', total, width, height);
      case 'custom':
        if (descriptor.fn) {
          return Array.from({ length: total }, (_, index) => descriptor.fn!(index, total));
        }
        if (descriptor.points && descriptor.points.length > 0) {
          return descriptor.points;
        }
        return sampler.generateCircle(Math.min(width, height) * 0.2, total, width, height);
      default:
        return sampler.generateCircle(Math.min(width, height) * 0.25, total, width, height);
    }
  }

  public static sampleFromPoints(points: Point[], total: number): Point[] {
    return ShapeSampler.selectSample(points, total);
  }

  private static selectSample(points: Point[], total: number): Point[] {
    if (points.length === 0) {
      return [];
    }

    if (points.length <= total) {
      const sampled = [...points];
      while (sampled.length < total) {
        sampled.push(points[sampled.length % points.length]);
      }
      return sampled.slice(0, total);
    }

    const step = points.length / total;
    const result: Point[] = [];
    for (let index = 0; index < total; index += 1) {
      const position = Math.floor(index * step);
      result.push(points[position]);
    }
    return result;
  }

  private static generateCircle(radius: number, total: number, width: number, height: number): Point[] {
    const cx = width / 2;
    const cy = height / 2;
    return Array.from({ length: total }, (_, index) => {
      const angle = (index / total) * Math.PI * 2;
      return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
    });
  }

  private static generateRing(radius: number, total: number, width: number, height: number): Point[] {
    const cx = width / 2;
    const cy = height / 2;
    const ringRadius = radius * 0.7;
    return Array.from({ length: total }, (_, index) => {
      const angle = (index / total) * Math.PI * 2;
      return { x: cx + Math.cos(angle) * ringRadius, y: cy + Math.sin(angle) * ringRadius };
    });
  }

  private static generateEllipse(
    rx: number,
    ry: number,
    total: number,
    width: number,
    height: number
  ): Point[] {
    const cx = width / 2;
    const cy = height / 2;
    return Array.from({ length: total }, (_, index) => {
      const angle = (index / total) * Math.PI * 2;
      return { x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry };
    });
  }

  private static generateStar(
    radius: number,
    total: number,
    width: number,
    height: number,
    sides: number
  ): Point[] {
    const cx = width / 2;
    const cy = height / 2;
    return Array.from({ length: total }, (_, index) => {
      const angle = (index / total) * Math.PI * 2;
      const starRatio = (Math.sin(angle * sides) + 1) * 0.5;
      const currentRadius = radius * (0.45 + starRatio * 0.55);
      return { x: cx + Math.cos(angle) * currentRadius, y: cy + Math.sin(angle) * currentRadius };
    });
  }

  private static generatePolygon(
    radius: number,
    total: number,
    width: number,
    height: number,
    sides: number
  ): Point[] {
    const cx = width / 2;
    const cy = height / 2;
    return Array.from({ length: total }, (_, index) => {
      const angle = (index / total) * Math.PI * 2;
      const rotation = -Math.PI / 2;
      return {
        x: cx + Math.cos(angle + rotation) * radius * (sides > 4 ? 1 : 0.94),
        y: cy + Math.sin(angle + rotation) * radius
      };
    });
  }

  private static generateSphere(radius: number, total: number, width: number, height: number): Point[] {
    const cx = width / 2;
    const cy = height / 2;
    const points: Point[] = [];

    for (let index = 0; index < total; index += 1) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(Math.random() * 2 - 1);
      const x = Math.sin(v) * Math.cos(u) * radius;
      const y = Math.sin(v) * Math.sin(u) * radius;
      points.push({ x: cx + x, y: cy + y * 0.9 });
    }

    return points;
  }

  private static generateWave(
    amplitude: number,
    frequency: number,
    total: number,
    width: number,
    height: number
  ): Point[] {
    const centerY = height / 2;
    return Array.from({ length: total }, (_, index) => {
      const x = (index / total) * width;
      const y = centerY + Math.sin((x / width) * Math.PI * 2 * frequency) * amplitude;
      return { x, y };
    });
  }

  private static generateSpiral(radius: number, total: number, width: number, height: number): Point[] {
    const cx = width / 2;
    const cy = height / 2;
    return Array.from({ length: total }, (_, index) => {
      const t = (index / total) * 2 * Math.PI * 4;
      const r = radius * (index / total);
      return { x: cx + Math.cos(t) * r, y: cy + Math.sin(t) * r };
    });
  }

  private static generateGalaxy(radius: number, total: number, width: number, height: number): Point[] {
    const cx = width / 2;
    const cy = height / 2;
    const points: Point[] = [];

    for (let index = 0; index < total; index += 1) {
      const arm = index % 4;
      const angle = (index / total) * Math.PI * 2 + arm * (Math.PI / 2);
      const spread = radius * (index / total) * 0.8;
      points.push({
        x: cx + Math.cos(angle) * spread,
        y: cy + Math.sin(angle) * spread * 0.8
      });
    }

    return points;
  }

  private static generateText(
    text: string,
    total: number,
    width: number,
    height: number,
    font: string
  ): Point[] {
    if (typeof document === 'undefined' && typeof OffscreenCanvas === 'undefined') {
      return ShapeSampler.generateCircle(Math.min(width, height) * 0.25, total, width, height);
    }

    const canvas =
      typeof OffscreenCanvas !== 'undefined'
        ? new OffscreenCanvas(width, height)
        : document.createElement('canvas');
    const context = (canvas as any).getContext('2d') as CanvasRenderingContext2D | null;

    if (!context) {
      return ShapeSampler.generateCircle(Math.min(width, height) * 0.25, total, width, height);
    }

    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, width, height);
    context.font = font;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#000';
    context.fillText(text, width / 2, height / 2);

    const image = context.getImageData(0, 0, width, height);
    const pixels = image.data;
    const points: Point[] = [];

    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const alphaIndex = (y * width + x) * 4 + 3;
        if (pixels[alphaIndex] > 32) {
          points.push({ x, y });
        }
      }
    }

    return ShapeSampler.selectSample(points, total);
  }

  private static parseSvgPath(path: string, total: number, width: number, height: number): Point[] {
    const numbers = path
      .replace(/[A-Za-z]/g, ' ')
      .trim()
      .split(/\s+/)
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));

    if (numbers.length === 0) {
      return ShapeSampler.generateCircle(Math.min(width, height) * 0.25, total, width, height);
    }

    const points: Point[] = [];
    for (let index = 0; index < numbers.length; index += 2) {
      const x = numbers[index] ?? 0;
      const y = numbers[index + 1] ?? 0;
      points.push({ x, y });
    }

    return ShapeSampler.selectSample(points, total);
  }
}
