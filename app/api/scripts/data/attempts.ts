import { Types } from 'mongoose';
import { IAttemptDocument } from '@/types/models/attempt';

export const attempts: Partial<IAttemptDocument>[] = [
  {
    userId: new Types.ObjectId(),
    stationId: new Types.ObjectId(),
    userProgressId: new Types.ObjectId(),
    submittedCode: 'console.log("Hello World!");',
    passed: false,
    attemptNumber: 1,
    earnedXP: 0,
    earnedCurrency: 0,
    startTime: new Date(),
    completionTime: new Date()
  }
];

export default attempts;