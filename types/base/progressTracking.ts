// types/base/progressTracking.ts

import { ProgressStatus } from './enums';

// Base progress interface
export interface BaseProgress {
  readonly userId: string;
  readonly timestamp: Date;
}

// Progress tracking with discriminated unions
export interface AttemptProgress extends BaseProgress {
  readonly type: 'ATTEMPT';
  readonly code: string;
  readonly passed: boolean;
  readonly executionTime?: number;
  readonly memoryUsage?: number;
  readonly earnedXP: number;
}

export interface StationProgress extends BaseProgress {
  readonly type: 'STATION';
  readonly stationId: string;
  readonly attempts: AttemptProgress[];
  readonly hintsUsed: number;
  readonly status: ProgressStatus;
}

export interface PlanetProgress extends BaseProgress {
  readonly type: 'PLANET';
  readonly planetId: string;
  readonly completedStations: number[];
  readonly totalXPEarned: number;
  readonly status: ProgressStatus;
}

export type Progress = AttemptProgress | StationProgress | PlanetProgress;

// Type guards
export const isAttemptProgress = (progress: Progress): progress is AttemptProgress => 
  progress.type === 'ATTEMPT';

export const isStationProgress = (progress: Progress): progress is StationProgress =>
  progress.type === 'STATION';
  
export const isPlanetProgress = (progress: Progress): progress is PlanetProgress =>
  progress.type === 'PLANET';