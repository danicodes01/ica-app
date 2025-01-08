import mongoose from 'mongoose';
import { IUserProgressDocument } from '@/types/models/userProgress';
import UserProgressSchema from '@/models/userProgress/schema';

export interface SeedProgressResult {
  success: boolean;
  progress?: IUserProgressDocument[];
  error?: string;
}

interface UnvalidatedProgress {
  userId?: mongoose.Types.ObjectId;
  planetId?: mongoose.Types.ObjectId;
  stationId?: mongoose.Types.ObjectId;
  completed?: boolean;
  bestTime?: number;
  bestScore?: number;
  attemptCount?: number;
  completedAt?: Date | null;
}


const getUserProgressModel = () => {
  try {
    return mongoose.model<IUserProgressDocument>('UserProgress');
  } catch {
    return mongoose.model<IUserProgressDocument>('UserProgress', UserProgressSchema);
  }
};


const validateProgress = (progress: UnvalidatedProgress): progress is IUserProgressDocument => {
  try {
    if (!progress.userId || !progress.planetId || !progress.stationId) {
      throw new Error('Missing required fields: userId, planetId, or stationId');
    }
    return true;
  } catch (error) {
    console.error('Progress validation error:', error);
    return false;
  }
};

export async function seedProgress(progressData: UnvalidatedProgress[]): Promise<SeedProgressResult> {
  const UserProgress = getUserProgressModel();
  
  try {
    const validProgress = progressData.filter(validateProgress);
    if (validProgress.length !== progressData.length) {
      throw new Error(`${progressData.length - validProgress.length} progress records failed validation`);
    }

    await UserProgress.deleteMany({});

    const insertedProgress = await UserProgress.insertMany(validProgress.map(progress => ({
      ...progress,
      completed: progress.completed || false,
      bestTime: progress.bestTime || 0,
      bestScore: progress.bestScore || 0,
      attemptCount: progress.attemptCount || 0,
      completedAt: progress.completedAt || null
    })));

    return {
      success: true,
      progress: insertedProgress
    };

  } catch (error) {
    console.error('Error seeding progress:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
