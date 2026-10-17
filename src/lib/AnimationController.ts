import { Particle } from './Particle';
import type { MorphOptions, Point } from './types';

export class AnimationController {
  private currentEasing: MorphOptions['easing'] = 'easeInOut';

  public ease(name: MorphOptions['easing'] = 'easeInOut', t: number): number {
    switch (name) {
      case 'linear':
        return t;
      case 'easeIn':
        return t * t;
      case 'easeOut':
        return 1 - (1 - t) * (1 - t);
      case 'easeInOut':
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      case 'backOut':
        return 1 - Math.pow(1 - t, 3) + Math.sin(t * Math.PI) * 0.04;
      default:
        return t;
    }
  }

  public morphTo(particles: Particle[], targetPoints: Point[], options: MorphOptions = {}): void {
    const count = particles.length;
    const safePoints = targetPoints.length > 0 ? targetPoints : [{ x: 0, y: 0 }];

    for (let index = 0; index < count; index += 1) {
      const target = safePoints[index % safePoints.length] ?? { x: 0, y: 0 };
      particles[index].setTarget(target);
    }

    this.currentEasing = options.easing ?? this.currentEasing;
  }

  public scatter(particles: Particle[], bounds: { width: number; height: number }, options: MorphOptions = {}): void {
    const spread = options.scattering ?? 1.4;

    for (const particle of particles) {
      const dx = (Math.random() - 0.5) * bounds.width * spread;
      const dy = (Math.random() - 0.5) * bounds.height * spread;
      particle.setTarget({ x: bounds.width / 2 + dx, y: bounds.height / 2 + dy });
    }
  }

  public assemble(particles: Particle[], bounds: { width: number; height: number }, options: MorphOptions = {}): void {
    const safe = Math.min(bounds.width, bounds.height) * 0.45;
    const cx = bounds.width / 2;
    const cy = bounds.height / 2;

    for (let index = 0; index < particles.length; index += 1) {
      const angle = (index / Math.max(particles.length, 1)) * Math.PI * 2;
      const radius = safe * (0.03 + (index % 3) * 0.08);
      particles[index].setTarget({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius
      });
    }
  }
}
