// types/models/user.ts
import { Document, Model, Types } from 'mongoose';
import { CurrencyType } from '../base/enums';

export type TCurrencyBalances = Record<CurrencyType, number>;

export interface ICurrentProgress {
  readonly planetId: Types.ObjectId;
  readonly stationId: Types.ObjectId;
  attemptsRemaining: number;
  currentAttempt?: {
    readonly startedAt: Date;
    readonly expiresAt: Date;
  };
  hintsUsed: number;
  lastAttemptedAt?: Date;
}

interface ICurrentPlanet {
  readonly planetId: Types.ObjectId;
  currentStation: number;
  completedStations: number[];
}


interface IActivePlanet {
  readonly planetId: Types.ObjectId;
  readonly lastActiveAt: Date;
}


interface IPlanetProgress {
  readonly planetId: Types.ObjectId;
  isUnlocked: boolean;
  isCompleted: boolean;
  totalXPEarned: number;
}

interface StationAttempt {
  readonly timestamp: Date;
  readonly passed: boolean;
  readonly code: string;
  readonly executionTime: number;
  readonly memoryUsage: number;
  readonly hintsUsed: number;
  readonly expiresAt: Date;
  completed?: Date;
}

interface CompletedStation {
  readonly stationId: Types.ObjectId;
  readonly planetId: Types.ObjectId;
  readonly completedAt: Date;
  readonly attemptsUsed: number;
  readonly hintsUsed: number;
  readonly xpEarned: number;
  readonly currencyEarned: number;
  readonly timeSpent: number;
  readonly attempts: StationAttempt[];
}

interface CompletedPlanet {
  readonly planetId: Types.ObjectId;
  readonly completedAt: Date;
  readonly totalXPEarned: number;
  readonly totalCurrencyEarned: number;
  readonly timeSpent: number;
}

interface ICompletion {
  readonly planets: CompletedPlanet[];
  readonly stations: CompletedStation[];
}

export interface IUser {
  readonly email: string;
  readonly name: string;
  readonly image?: string;
  readonly emailVerified?: Date;
  readonly password: string;
  totalXP: number;
  currencies: TCurrencyBalances;
  currentProgress: ICurrentProgress;
  currentPlanet: ICurrentPlanet;
  activePlanets: IActivePlanet[];
  planetProgress: IPlanetProgress[];
  completion: ICompletion;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  // Currency methods
  addCurrency(type: CurrencyType, amount: number): Promise<number>;
  addXP(amount: number): Promise<void>;
  updateCurrency(type: CurrencyType, amount: number): Promise<void>;

  // Station methods
  canUseHint(): boolean;
  getStationHistory(stationId: Types.ObjectId): CompletedStation | undefined;
  completeCurrentAttempt(
    passed: boolean,
    metrics: { executionTime?: number; memoryUsage?: number }
  ): void;

  // Progress methods
  isAttemptExpired(): boolean;
  getAttemptTimeRemaining(): number;
  completeStation(
    planetId: Types.ObjectId,
    stationNumber: number,
    earnedXP: number,
    earnedCurrency?: { type: CurrencyType; amount: number },
  ): Promise<void>;

  getCurrentProgress(): Promise<{
    currentPlanet: {
      name: string;
      totalStations: number;
    };
    completedStations: number[];
    totalStations: number;
    currentProgress: ICurrentProgress;
  }>;

  // Virtual properties
  readonly level: number;
  readonly activePlanet: IActivePlanet | null;
}

// Model interface
export interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
  findByEmailWithProgress(email: string): Promise<IUserDocument | null>;
}

// Type guard
export const isUser = (value: unknown): value is IUser => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'email' in value &&
    'name' in value &&
    'totalXP' in value &&
    'currentPlanet' in value &&
    'currentProgress' in value 
  );
};