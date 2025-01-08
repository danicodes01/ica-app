import { PlanetType } from '@/types/base/enums'
import { PlanetPosition } from '@/types/models';



export type DrawType = 'moon' | 'chromanova' | 'syntaxia' | 'quantumCore';
export const drawTypeValues: DrawType[] = ['moon', 'chromanova', 'syntaxia', 'quantumCore'];
export interface DrawPlanet {
  id: string;
  slug: string;
  name: string;
  order: number;
  type: PlanetType;
  drawType: DrawType;
  description: string;
  position: PlanetPosition;
  icon: string;
  isUnlocked: boolean;
  requiredXP: number;
  prerequisites: string[];
  isStartingPlanet: boolean;
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