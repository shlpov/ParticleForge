import type { ParticleConfig, Point } from './types';

export class Particle {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public size: number;
  public color: string;
  public opacity: number;
  public glow: number;
  public targetX: number;
  public targetY: number;
  public randomSeed: number;

  constructor(config: Partial<ParticleConfig> = {}) {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.size = config.radius ?? 2;
    this.color = config.colors?.[0] ?? '#7dd3fc';
    this.opacity = config.opacity ?? 1;
    this.glow = config.glow ?? 0;
    this.targetX = 0;
    this.targetY = 0;
    this.randomSeed = Math.random();
  }

  public setTarget(point: Point): void {
    this.targetX = point.x;
    this.targetY = point.y;
  }

  public update(dt: number, inertia: number): void {
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;

    this.vx += dx * inertia * dt * 60;
    this.vy += dy * inertia * dt * 60;

    this.vx *= 0.82;
    this.vy *= 0.82;

    this.x += this.vx * dt * 60;
    this.y += this.vy * dt * 60;
  }

  public reset(bounds: { width: number; height: number }): void {
    this.x = Math.random() * bounds.width;
    this.y = Math.random() * bounds.height;
    this.targetX = this.x;
    this.targetY = this.y;
    this.vx = 0;
    this.vy = 0;
  }
}
