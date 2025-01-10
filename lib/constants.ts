import { GameColors } from "@/types/base/game";

export const DEFAULT_USER_STATE = {
  totalXP: 0,
  currencies: {
    lunar: 0,
    chromanova: 0,
    syntaxia: 0,
    quantum: 0,
    galactic: 0,
  },
  currentProgress: {
    attemptsRemaining: 3,
    hintsUsed: 0,
    currentAttempt: null,
    lastAttemptedAt: null,
  },
  currentPlanet: {
    currentStation: 1,
    completedStations: [],
  },
  activePlanets: [],
  planetProgress: [],
  completion: {
    planets: [],
    stations: [],
  },
};


export const COLORS: GameColors = {
  background: '#1C1C1EFF',
  foreground: '#EBEBF599',
  accent: '#64D2FFFF',
  stars: 'rgba(235, 235, 245, 0.8)',
  glow: 'rgba(100, 210, 255, 0.6)',
};

export const PLANET_RADIUS_FACTOR = 0.05;