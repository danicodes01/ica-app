// types/base/environment.ts

import { Types } from "mongoose";
import { StationEnvironmentType } from "./enums";
import { Position3D } from "./position";

// Core types
export type InteractionTrigger = 'CLICK' | 'HOVER' | 'PROXIMITY';

export type EnvironmentStateValue = 
  | string 
  | number 
  | boolean 
  | null 
  | { [key: string]: EnvironmentStateValue }
  | EnvironmentStateValue[];

// Animation and Sound interfaces
export interface Animation {
  readonly idle: readonly string[];
  readonly active: readonly string[];
}

export interface SoundEffects {
  readonly ambient: string;
  readonly interaction: string;
}

// Main environment assets interface
export interface EnvironmentAssets {
  readonly background: string;
  readonly props: readonly string[];
  readonly animations: Animation;
  readonly soundEffects?: SoundEffects;
}

// Interactive elements
export interface InteractiveElement {
  readonly id: string;
  readonly position: Position3D;
  readonly type: string;
  readonly trigger: InteractionTrigger;
}

// Main environment configuration
export interface StationEnvironmentConfig {
  readonly type: StationEnvironmentType;
  readonly assets: EnvironmentAssets;
  readonly interactiveElements: InteractiveElement[];
}

// Progress tracking interfaces
export interface ProgressAttempt {
  readonly timestamp: Date;
  readonly code: string;
  readonly passed: boolean;
  readonly executionTime?: number;
  readonly memoryUsage?: number;
  readonly earnedXP: number;
}

export interface Achievement {
  readonly id: string;
  readonly unlockedAt: Date;
}

export interface ProgressMetrics {
  readonly totalTime: number;
  readonly completionRate: number;
  readonly averageAttempts: number;
}

export interface Progress {
  readonly userId: Types.ObjectId | string;
  readonly entityId: Types.ObjectId | string;  // Station or Planet ID
  readonly entityType: 'station' | 'planet';
  readonly attempts: ProgressAttempt[];
  readonly currentState: {
    readonly code: string;
    readonly lastSaved: Date;
    readonly environmentState?: Record<string, EnvironmentStateValue>;
  };
  readonly achievements: Achievement[];
  readonly metrics: ProgressMetrics;
}