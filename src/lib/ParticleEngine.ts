import { AnimationController } from './AnimationController';
import { InteractionController } from './InteractionController';
import { Particle } from './Particle';
import { ParticleRenderer } from './ParticleRenderer';
import { PerformanceManager } from './PerformanceManager';
import { ShapeSampler } from './ShapeSampler';
import type { EngineBounds, EngineConfig, InteractionMode, MorphOptions, ParticleConfig, Point, ShapeDescriptor } from './types';

export class ParticleEngine {
  private canvas: HTMLCanvasElement | { width: number; height: number; getContext: (type: string) => CanvasRenderingContext2D | null };
  private context: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private config: Required<Pick<EngineConfig, 'count'>> & { particle: Required<ParticleConfig>; interaction: InteractionMode; bounds: EngineBounds; performance: { maxParticles: number; targetFps: number } };
  public renderer: ParticleRenderer;
  public interaction: InteractionController;
  public animation: AnimationController;
  public performance: PerformanceManager;
  private animationFrameId = 0;
  private lastTimestamp = 0;
  private isPaused = false;
  private targetShape: ShapeDescriptor | null = null;

  constructor(canvas: HTMLCanvasElement | { width: number; height: number; getContext: (type: string) => CanvasRenderingContext2D | null }, config: EngineConfig = {}) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context could not be created.');
    }
    this.context = context;

    const width = canvas.width || 960;
    const height = canvas.height || 540;
    const particleConfig: Required<ParticleConfig> = {
      count: config.count ?? 1000,
      radius: config.particle?.radius ?? 2,
      shape: config.particle?.shape ?? 'circle',
      colors: config.particle?.colors ?? ['#7dd3fc', '#a78bfa', '#f9a8d4'],
      opacity: config.particle?.opacity ?? 0.9,
      glow: config.particle?.glow ?? 12,
      blur: config.particle?.blur ?? 0,
      speed: config.particle?.speed ?? 1,
      inertia: config.particle?.inertia ?? 0.12,
      randomness: config.particle?.randomness ?? 0.18,
      minSize: config.particle?.minSize ?? 1,
      maxSize: config.particle?.maxSize ?? 4,
      colorMixing: config.particle?.colorMixing ?? true
    };

    this.config = {
      count: config.count ?? 1000,
      particle: particleConfig,
      interaction: config.interaction ?? 'none',
      bounds: {
        x: 0,
        y: 0,
        width,
        height
      },
      performance: {
        maxParticles: config.performance?.maxParticles ?? 2500,
        targetFps: config.performance?.targetFps ?? 60
      }
    };

    this.renderer = new ParticleRenderer(this.context, this.config.particle);
    this.performance = new PerformanceManager(this.config.performance.maxParticles, this.config.performance.targetFps);
    this.interaction = new InteractionController(this.canvas as { width: number; height: number });
    this.animation = new AnimationController();
    this.interaction.setMode(this.config.interaction);

    this.regenerateParticles(this.config.count);
    this.startLoop();
  }

  public get count(): number {
    return this.particles.length;
  }

  public get bounds(): EngineBounds {
    return this.config.bounds;
  }

  private regenerateParticles(count: number): void {
    const safeCount = this.performance.clampParticleCount(count, this.config.bounds);
    this.particles = Array.from({ length: safeCount }, () => new Particle(this.config.particle));
    this.placeParticlesRandomly();
  }

  private placeParticlesRandomly(): void {
    for (const particle of this.particles) {
      particle.reset(this.config.bounds);
      particle.setTarget({ x: particle.x, y: particle.y });
    }
  }

  public setConfig(config: Partial<ParticleConfig>): void {
    this.config.particle = { ...this.config.particle, ...config };
    this.renderer.updateConfig(config);

    for (const particle of this.particles) {
      particle.size = config.radius ?? particle.size;
      particle.opacity = config.opacity ?? particle.opacity;
      particle.glow = config.glow ?? particle.glow;
    }
  }

  public morphTo(shape: ShapeDescriptor, options: MorphOptions = {}): this {
    this.targetShape = shape;
    const targetPoints = ShapeSampler.generate(shape, this.particles.length, this.config.bounds.width, this.config.bounds.height);
    this.animation.morphTo(this.particles, targetPoints, options);
    return this;
  }

  public scatter(options: MorphOptions = {}): this {
    this.animation.scatter(this.particles, this.config.bounds, options);
    return this;
  }

  public assemble(options: MorphOptions = {}): this {
    this.animation.assemble(this.particles, this.config.bounds, options);
    return this;
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
  }

  public reset(): void {
    this.placeParticlesRandomly();
  }

  public update(dt: number): void {
    const inertia = this.config.particle.inertia;
    for (let index = 0; index < this.particles.length; index += 1) {
      const particle = this.particles[index];
      if (index % 2 === 0 || this.config.particle.count < 600) {
        particle.update(dt, inertia);
      }
    }

    this.interaction.update(this.particles, this.config.bounds, dt);
    this.renderer.render(this.particles, this.config.bounds);
  }

  private requestFrame(callback: FrameRequestCallback): number {
    if (typeof globalThis.requestAnimationFrame === 'function') {
      return globalThis.requestAnimationFrame(callback);
    }

    return globalThis.setTimeout(() => callback(Date.now()), 16) as unknown as number;
  }

  private cancelFrame(handle: number): void {
    if (typeof globalThis.cancelAnimationFrame === 'function') {
      globalThis.cancelAnimationFrame(handle);
      return;
    }

    globalThis.clearTimeout(handle);
  }

  private tick = (timestamp: number): void => {
    if (!this.isPaused) {
      const delta = Math.min((timestamp - this.lastTimestamp) / 1000 || 0.016, 0.032);
      this.lastTimestamp = timestamp;
      this.performance.recordFrame(delta * 1000);

      if (!this.performance.shouldSkipFrame()) {
        this.update(delta);
      }
    }

    this.animationFrameId = this.requestFrame(this.tick);
  };

  private startLoop(): void {
    this.lastTimestamp = 0;
    this.animationFrameId = this.requestFrame(this.tick);

    if ('addEventListener' in this.canvas) {
      this.interaction.bind(this.canvas as HTMLCanvasElement);
    }
  }

  public destroy(): void {
    if (this.animationFrameId) {
      this.cancelFrame(this.animationFrameId);
    }
    this.interaction.destroy();
    this.context.clearRect(0, 0, this.config.bounds.width, this.config.bounds.height);
    this.particles = [];
  }
}
