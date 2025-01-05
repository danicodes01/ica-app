// types/base/game.ts

import { GameArea } from "./enums";
  
  export interface GameColors {
    readonly background: string;
    readonly foreground: string;
    readonly accent: string;
    readonly stars: string;
    readonly glow: string;
  }
  
  export interface GamePosition {
    readonly x: number;
    readonly y: number;
  }
  
  export interface GameState {
    readonly playerPosition: GamePosition;
    readonly currentArea: GameArea;
    readonly activeChallenge: string | null;
    isPaused: boolean;
  }