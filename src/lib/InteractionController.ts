import { Particle } from './Particle';
import type { EngineBounds, InteractionMode } from './types';

export class InteractionController {
  private canvas: { width: number; height: number };
  private pointer = { x: 0, y: 0, active: false };
  private mode: InteractionMode = 'none';

  constructor(canvas: { width: number; height: number }) {
    this.canvas = canvas;
  }

  public setMode(mode: InteractionMode): void {
    this.mode = mode;
  }

  public bind(canvas: HTMLCanvasElement): void {
    const pointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      this.pointer.x = ((event.clientX - bounds.left) / bounds.width) * canvas.width;
      this.pointer.y = ((event.clientY - bounds.top) / bounds.height) * canvas.height;
      this.pointer.active = true;
    };

    const pointerLeave = () => {
      this.pointer.active = false;
    };

    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerleave', pointerLeave);
  }

  public update(particles: Particle[], bounds: EngineBounds, dt: number): void {
    if (!this.pointer.active || this.mode === 'none') {
      return;
    }

    for (const particle of particles) {
      const dx = this.pointer.x - particle.x;
      const dy = this.pointer.y - particle.y;
      const distance = Math.hypot(dx, dy) || 1;

      if (distance < 180) {
        const strength = (180 - distance) / 180;

        if (this.mode === 'repel') {
          particle.x -= (dx / distance) * strength * 5 * dt * 60;
          particle.y -= (dy / distance) * strength * 5 * dt * 60;
        }

        if (this.mode === 'attract') {
          particle.x += (dx / distance) * strength * 4 * dt * 60;
          particle.y += (dy / distance) * strength * 4 * dt * 60;
        }

        if (this.mode === 'orbit') {
          const orbitX = -dy / distance;
          const orbitY = dx / distance;
          particle.x += orbitX * strength * 3 * dt * 60;
          particle.y += orbitY * strength * 3 * dt * 60;
        }
      }
    }

    for (const particle of particles) {
      particle.x = Math.min(bounds.width, Math.max(0, particle.x));
      particle.y = Math.min(bounds.height, Math.max(0, particle.y));
    }
  }

  public destroy(): void {
    this.pointer.active = false;
    this.mode = 'none';
  }
}
