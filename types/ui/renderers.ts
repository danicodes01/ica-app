import { PlanetType } from '../base';
import { GameColors } from '../base/game';
import { IPlanet } from '../models/planet';

// Planet Renderer Types
export interface DrawOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  isUnlocked: boolean;
  isHovered: boolean;
  accentColor: string;
}

// Game Renderer Types
export interface StarOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  size: number;
  alpha: number;
  colors: GameColors;
}

export interface LabelOptions {
  ctx: CanvasRenderingContext2D;
  planet: IPlanet;
  isHovered: boolean;
  colors: GameColors;
}

export interface UFOOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  colors: GameColors;
  isMoving: boolean;
}

export interface IGameRenderer {
  drawStar(options: StarOptions): void;
  drawPlanetLabel(options: LabelOptions): void;
  drawUFO(options: UFOOptions): void;
  drawStarfield(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    colors: GameColors
  ): void;
  drawPlanet(
    ctx: CanvasRenderingContext2D,
    planet: IPlanet,
    isHovered: boolean,
    colors: GameColors
  ): void;
  isNearPlanet(
    playerX: number,
    playerY: number,
    planet: IPlanet,
    threshold?: number
  ): boolean;
}

export interface IPlanetRenderer {
  drawHoverEffect(options: Omit<DrawOptions, 'isUnlocked'>): void;
  drawMissionControl(options: DrawOptions): void;
  drawSyntaxia(options: DrawOptions): void;
  drawChromanova(options: DrawOptions): void;
  drawQuantumCore(options: DrawOptions): void;
  drawPlanet(type: PlanetType, options: DrawOptions): void;
}