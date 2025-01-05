// types/models/station.ts

import { Document, Model, Types } from 'mongoose';
import { Position3D } from '../base/position';
import { 
  StationEnvironmentType,
  ChallengeDifficulty 
} from '../base/enums';
import { 
  EnvironmentAssets,
  InteractiveElement 
} from '../base/environment';
import { NPCType } from '../ui/npc';

// Core interfaces
interface Hint {
  readonly text: string;
  readonly cost: number;
  readonly unlockRequirement: {
    readonly attempts: number;
    readonly timeSpent: number;
  };
}

interface TestCase {
  readonly input: string;
  readonly expectedOutput: string;
}

interface StationProgress {
  readonly isComplete: boolean;
  readonly lastAttemptAt?: Date;
  readonly bestAttempt?: {
    readonly attemptNumber: number;
    readonly earnedXP: number;
  };
}

interface Challenge {
  readonly title: string;
  readonly description: string;
  readonly difficulty: ChallengeDifficulty;
  readonly initialCode: string;
  readonly solution: string;
  readonly testCases: readonly TestCase[];
  readonly hints: readonly string[];
  readonly baseXPReward: number;
  readonly xpDecayFactor: number;
}

interface FailureHandling {
  readonly maxAttempts: number;
  readonly previousStationId?: Types.ObjectId;
}

// Main Station interface
export interface IStation {
  readonly planetId: Types.ObjectId;
  readonly stationNumber: number;
  readonly name: string;
  readonly hints: readonly Hint[];
  readonly failureHandling: FailureHandling;
  isAccessible: boolean;
  readonly environment: {
    readonly type: StationEnvironmentType;
    readonly assets: EnvironmentAssets;
    readonly interactiveElements: readonly InteractiveElement[];
  };
  readonly npc: {
    readonly type: NPCType;
    readonly name: string;
    readonly dialogue: {
      readonly greeting: string;
      readonly hint: string;
      readonly success: string;
      readonly failure: string;
    };
    readonly appearance: string;
    readonly defaultPosition: Position3D;
    position: Position3D; // Mutable as it can change during gameplay
  };
  readonly canvasSettings: {
    readonly dimensions: {
      readonly width: number;
      readonly height: number;
    };
    readonly layers: readonly string[];
    readonly renderOrder: readonly number[];
  };
  readonly challenge: Challenge;
  readonly requiredStations: readonly Types.ObjectId[];
  progress: StationProgress;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

// Document interface
export interface IStationDocument extends Omit<IStation, 'id'>, Document {
  _id: Types.ObjectId;
  calculateXP(attemptNumber: number): number;
  updateAccessibility(): Promise<void>;
  completeChallenge(attempt: number, xpEarned: number): Promise<void>;
}

// Model interface
export interface IStationModel extends Model<IStationDocument> {
  getProgress(planetId: string): Promise<Array<{
    readonly stationNumber: number;
    readonly isComplete: boolean;
    readonly bestAttempt?: {
      readonly attemptNumber: number;
      readonly earnedXP: number;
    };
    readonly isAccessible: boolean;
  }>>;
}

// Type guard
export const isStation = (obj: unknown): obj is IStation => {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'planetId' in obj &&
    'stationNumber' in obj &&
    'name' in obj &&
    'environment' in obj &&
    'npc' in obj &&
    'challenge' in obj
  );
};