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