import { Particle } from './Particle';
import type { EngineBounds, ParticleConfig } from './types';

export class ParticleRenderer {
  private context: CanvasRenderingContext2D;
  private config: Required<Pick<ParticleConfig, 'radius' | 'shape' | 'opacity' | 'glow' | 'blur' | 'speed' | 'inertia' | 'colors'>>;

  constructor(context: CanvasRenderingContext2D, config: Partial<ParticleConfig> = {}) {
    this.context = context;
    this.config = {
      radius: config.radius ?? 2,
      shape: config.shape ?? 'circle',
      opacity: config.opacity ?? 1,
      glow: config.glow ?? 0,
      blur: config.blur ?? 0,
      speed: config.speed ?? 1,
      inertia: config.inertia ?? 0.12,
      colors: config.colors ?? ['#7dd3fc']
    };
  }

  public updateConfig(config: Partial<ParticleConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      colors: config.colors ?? this.config.colors
    };
  }

  public render(particles: Particle[], bounds: EngineBounds): void {
    this.context.clearRect(bounds.x, bounds.y, bounds.width, bounds.height);
    this.context.save();
    this.context.globalCompositeOperation = 'screen';

    const grouped = new Map<string, { color: string; opacity: number; glow: number; particles: Particle[] }>();
    for (const particle of particles) {
      const opacity = particle.opacity ?? this.config.opacity;
      const glow = particle.glow || this.config.glow;
      const key = `${particle.color}-${opacity}-${glow}`;
      const entry = grouped.get(key) ?? { color: particle.color, opacity, glow, particles: [] };
      entry.particles.push(particle);
      grouped.set(key, entry);
    }

    for (const entry of grouped.values()) {
      this.context.beginPath();
      this.context.fillStyle = entry.color;
      this.context.globalAlpha = entry.opacity;
      this.context.shadowBlur = entry.glow;
      this.context.shadowColor = entry.color;

      for (const particle of entry.particles) {
        if (this.config.shape === 'square') {
          this.context.fillRect(
            particle.x - particle.size / 2,
            particle.y - particle.size / 2,
            particle.size,
            particle.size
          );
          continue;
        }

        this.context.moveTo(particle.x + particle.size, particle.y);
        this.context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      }

      this.context.fill();
    }

    this.context.restore();
  }
}
