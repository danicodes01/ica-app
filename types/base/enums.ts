// types/base/enums.ts
export enum GameArea {
  MISSION_CONTROL = 'MISSION_CONTROL',
  CHROMANOVA = 'CHROMANOVA',
  SYNTAXIA = 'SYNTAXIA',
  QUANTUMCORE = 'QUANTUMCORE'
}
  
export enum ProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}
  
  export enum EntityType {
    STATION = 'station',
    PLANET = 'planet'
  }

  export enum PlanetType {
    CHROMANOVA = 'CHROMANOVA',
    SYNTAXIA = 'SYNTAXIA',
    QUANTUMCORE = 'QUANTUMCORE',
    MISSION_CONTROL = 'MISSION_CONTROL'
  }
  
  export enum ModuleStatus {
    LOCKED = 'LOCKED',
    UNLOCKED = 'UNLOCKED',
    AVAILABLE = 'AVAILABLE',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
  }
  
  export enum StationEnvironmentType {
    GAS_STATION = 'GAS_STATION',
    LAB = 'LAB',
    SPACE_DOCK = 'SPACE_DOCK',
    TRAINING_GROUND = 'TRAINING_GROUND',
    SPACE_STATION = 'SPACE_STATION'
  }

  export enum CurrencyType {
    LUNAR = 'lunar',
    CHROMANOVA = 'chromanova',
    SYNTAXIA = 'syntaxia',
    QUANTUM = 'quantum',
    GALACTIC = 'galactic'
  }

  export enum ChallengeDifficulty {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
    EXPERT = 'EXPERT'
  }

  export type ReadonlyCurrencyBalance = {
    readonly [K in CurrencyType]: number;
  };
  
  // Mutable version for operations
  export type CurrencyBalance = {
    [K in CurrencyType]: number;
  };