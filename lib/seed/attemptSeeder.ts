import mongoose from 'mongoose';
import { IAttemptDocument } from '@/types/models/attempt';
import AttemptSchema from '@/models/attempt/schema';

export interface SeedAttemptResult {
  success: boolean;
  attempts?: IAttemptDocument[];
  error?: string;
}

interface UnvalidatedAttempt {
  userId?: mongoose.Types.ObjectId;
  stationId?: mongoose.Types.ObjectId;
  userProgressId?: mongoose.Types.ObjectId;
  submittedCode?: string;
  passed?: boolean;
  attemptNumber?: number;
  earnedXP?: number;
  earnedCurrency?: number;
  startTime?: Date;
  completionTime?: Date;
}

const getAttemptModel = () => {
  try {
    return mongoose.model<IAttemptDocument>('Attempt');
  } catch {
    return mongoose.model<IAttemptDocument>('Attempt', AttemptSchema);
  }
};

const validateAttempt = (
  attempt: UnvalidatedAttempt,
): attempt is IAttemptDocument => {
  try {
    const requiredFields = [
      'userId',
      'stationId',
      'userProgressId',
      'submittedCode',
      'attemptNumber',
      'startTime',
      'completionTime',
    ];

    for (const field of requiredFields) {
      if (!attempt[field as keyof UnvalidatedAttempt]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (
      attempt.completionTime &&
      attempt.startTime &&
      attempt.completionTime < attempt.startTime
    ) {
      throw new Error('Completion time cannot be before start time');
    }

    return true;
  } catch (error) {
    console.error('Attempt validation error:', error);
    return false;
  }
};

export async function seedAttempts(
  attemptsData: UnvalidatedAttempt[],
): Promise<SeedAttemptResult> {
  const Attempt = getAttemptModel();

  try {
    const validAttempts = attemptsData.filter(validateAttempt);
    if (validAttempts.length !== attemptsData.length) {
      throw new Error(
        `${
          attemptsData.length - validAttempts.length
        } attempts failed validation`,
      );
    }

    await Attempt.deleteMany({});
    const insertedAttempts = await Attempt.insertMany(
      validAttempts.map(attempt => ({
        ...attempt,
        passed: attempt.passed || false,
        earnedXP: attempt.earnedXP || 0,
        earnedCurrency: attempt.earnedCurrency || 0,
      })),
    );

    return {
      success: true,
      attempts: insertedAttempts,
    };
  } catch (error) {
    console.error('Error seeding attempts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
