// types/ui/canvas
export interface CanvasDrawOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  isUnlocked: boolean;
  isHovered: boolean;
  accentColor: string;
}

export interface PlanetDrawFunction {
  (options: CanvasDrawOptions): void;
}
