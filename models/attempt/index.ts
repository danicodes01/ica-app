import { model, models } from 'mongoose';
import { IAttemptDocument } from '@/types/models/attempt';
import AttemptSchema from './schema';

export const Attempt = models.Attempt || model<IAttemptDocument>('Attempt', AttemptSchema);

export default Attempt;