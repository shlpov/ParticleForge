export type Point = {
  x: number;
  y: number;
};

export type ParticleColor = string;
export type EasingName = 'linear' | 'easeInOut' | 'easeOut' | 'easeIn' | 'backOut';
export type InteractionMode = 'repel' | 'attract' | 'orbit' | 'none';
export type ParticleMode = 'circle' | 'square' | 'custom';

export type ShapeType =
  | 'text'
  | 'image'
  | 'circle'
  | 'ring'
  | 'ellipse'
  | 'star'
  | 'polygon'
  | 'sphere'
  | 'wave'
  | 'spiral'
  | 'galaxy'
  | 'custom'
  | 'svg';

export type ParticleBehavior = 'freeze' | 'scatter' | 'pulse';

export interface ParticleConfig {
  count?: number;
  radius?: number;
  shape?: ParticleMode;
  colors?: ParticleColor[];
  opacity?: number;
  glow?: number;
  blur?: number;
  speed?: number;
  inertia?: number;
  randomness?: number;
  minSize?: number;
  maxSize?: number;
  colorMixing?: boolean;
}

export interface EngineBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ShapeDescriptor {
  type: ShapeType;
  points?: Point[];
  fn?: (index: number, total: number) => Point;
  text?: string;
  font?: string;
  density?: number;
  width?: number;
  height?: number;
  radius?: number;
  sides?: number;
  amplitude?: number;
  frequency?: number;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
  rotation?: number;
  align?: 'center' | 'left' | 'right' | 'top' | 'bottom';
  svgPath?: string;
  imageData?: ImageData | null;
  value?: string;
}

export interface MorphOptions {
  duration?: number;
  delay?: number;
  easing?: EasingName;
  scattering?: number;
  spread?: number;
  inertia?: number;
  speed?: number;
  chaos?: number;
  behavior?: ParticleBehavior;
}

export interface EngineConfig {
  count?: number;
  particle?: Partial<ParticleConfig>;
  interaction?: InteractionMode;
  bounds?: Partial<EngineBounds>;
  performance?: {
    maxParticles?: number;
    targetFps?: number;
  };
}
