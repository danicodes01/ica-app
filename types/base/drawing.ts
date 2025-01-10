
import { PlanetType } from './enums';
import { BasePlanet } from './planet';

export interface DrawPlanet extends Omit<BasePlanet, '_id'> {
  _id: string;  // Force _id to be string for drawing purposes
  isUnlocked:boolean;
}

export interface GameColors {
  background: string;
  foreground: string;
  accent: string;
  stars: string;
  glow: string;
}

export interface GamePosition {
  x: number;
  y: number;
}

export interface GameState {
  playerPosition: GamePosition;
  currentArea: PlanetType;
  activeChallenge: string | null;
  isPaused: boolean;
}