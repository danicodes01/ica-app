import { model, models } from 'mongoose';
import { IUserProgressDocument } from '@/types/models';
import UserProgressSchema from './schema';

// Attach methods to schema

// Create or reuse model
export const Progress = models.Progress || model<IUserProgressDocument>('Progress', UserProgressSchema);
