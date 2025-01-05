import { model, models } from 'mongoose';
import ProgressSchema from './schema';
import { attachMethods } from './methods';
import { IProgressDocument, IProgressModel } from '@/types/models';

// Attach methods to schema
attachMethods(ProgressSchema);

// Create or reuse model
export const Progress =
  models.Progress || model<IProgressDocument, IProgressModel>('Progress', ProgressSchema);
