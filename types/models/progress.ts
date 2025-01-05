// types/models/progress.ts
import { Document, Model, Types } from 'mongoose';
import { EntityType, ProgressStatus } from '@/types/base/enums';


export interface ProgressAttempt {
  timestamp: Date;
  code: string;
  passed: boolean;
  executionTime?: number;
  memoryUsage?: number;
  earnedXP: number;
  earnedCurrency: number;
  attemptNumber: number;
  startedAt: Date;
  expiresAt: Date;
}

interface ProgressMetrics {
  totalTime: number;
  completionRate: number;
  averageAttempts: number;
  bestExecutionTime?: number;
  bestMemoryUsage?: number;
  totalXPEarned: number;
  totalCurrencyEarned: number;
}

export interface IProgress {
  userId: Types.ObjectId;
  entityId: Types.ObjectId;
  entityType: EntityType;
  status: ProgressStatus;
  attempts: ProgressAttempt[];
  hintsUsed: number;
  currentState: {
    code: string;
    lastSaved: Date;
    environmentState?: Record<string, unknown>;
  };
  achievements: {
    id: string;
    unlockedAt: Date;
    type: string;
    metadata: Record<string, unknown>;
  }[];
  metrics: ProgressMetrics;
  lastActiveAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ReadonlyProgress = {
  readonly userId: Types.ObjectId;
  readonly entityId: Types.ObjectId;
  readonly entityType: EntityType;
  readonly status: ProgressStatus;
  readonly attempts: readonly ProgressAttempt[];
  readonly hintsUsed: number;
  readonly currentState: {
    readonly code: string;
    readonly lastSaved: Date;
    readonly environmentState?: Record<string, unknown>;
  };
  readonly achievements: readonly {
    readonly id: string;
    readonly unlockedAt: Date;
    readonly type: string;
    readonly metadata: Record<string, unknown>;
  }[];
  readonly metrics: Readonly<ProgressMetrics>;
  readonly lastActiveAt: Date;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
};


export interface IProgressDocument extends IProgress, Document {
  calculateAverageAttempts(): number;
  updateMetrics(): void;
  isCurrentAttemptExpired(): boolean;
  getRemainingAttempts(): number;
  getAttemptTimeRemaining(): number;
  synchronizeWithStation(stationId: Types.ObjectId): Promise<void>;
  readonly isComplete: boolean;
}

export interface IProgressModel extends Model<IProgressDocument> {
  findByUserAndEntity(
    userId: Types.ObjectId,
    entityId: Types.ObjectId,
    entityType: EntityType,
  ): Promise<IProgressDocument | null>;
}

export const isProgress = (value: unknown): value is IProgress => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'userId' in value &&
    'entityId' in value &&
    'entityType' in value &&
    'attempts' in value
  );
};

export const isValidProgressStatus = (
  status: string,
): status is ProgressStatus => {
  return Object.values(ProgressStatus).includes(status as ProgressStatus);
};

export const isValidTransition = (
  from: ProgressStatus,
  to: ProgressStatus,
): boolean => {
  const validTransitions: Record<ProgressStatus, ProgressStatus[]> = {
    [ProgressStatus.NOT_STARTED]: [ProgressStatus.IN_PROGRESS],
    [ProgressStatus.IN_PROGRESS]: [
      ProgressStatus.COMPLETED,
      ProgressStatus.FAILED,
    ],
    [ProgressStatus.COMPLETED]: [],
    [ProgressStatus.FAILED]: [ProgressStatus.IN_PROGRESS],
  };
  return validTransitions[from].includes(to);
};
