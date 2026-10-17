import type { EngineBounds } from './types';

export class PerformanceManager {
  private maxParticles: number;
  private targetFps: number;
  private frameTimes: number[] = [];
  private adaptiveQuality = true;
  private frameSkipCounter = 0;

  constructor(maxParticles = 2000, targetFps = 60) {
    this.maxParticles = maxParticles;
    this.targetFps = targetFps;
  }

  public setAdaptiveQuality(enabled: boolean): void {
    this.adaptiveQuality = enabled;
    if (!enabled) {
      this.frameTimes = [];
    }
  }

  public clampParticleCount(count: number, bounds: EngineBounds): number {
    const area = bounds.width * bounds.height;
    const ratio = Math.min(area / 450000, 1.2);
    const budget = Math.floor(this.maxParticles * ratio);
    return Math.min(count, Math.max(200, budget));
  }

  public recordFrame(deltaMs: number): void {
    this.frameTimes.push(deltaMs);
    if (this.frameTimes.length > 18) {
      this.frameTimes.shift();
    }
  }

  public shouldSkipFrame(): boolean {
    if (!this.adaptiveQuality || this.frameTimes.length < 3) {
      return false;
    }

    const avgFrameMs =
      this.frameTimes.reduce((total, value) => total + value, 0) / this.frameTimes.length;

    if (avgFrameMs <= 1000 / this.targetFps) {
      this.frameSkipCounter = 0;
      return false;
    }

    this.frameSkipCounter += 1;
    return this.frameSkipCounter % 2 === 0;
  }

  public getTargetFps(): number {
    return this.targetFps;
  }
}
