import { Types } from 'mongoose';
import { IUserProgressDocument } from '@/types/models/userProgress';

export const progress: Partial<IUserProgressDocument>[] = [
  {
    userId: new Types.ObjectId(), // Replace with actual user ID during seeding
    planetId: new Types.ObjectId(), // Replace with actual planet ID
    stationId: new Types.ObjectId(), // Replace with actual station ID
    completed: false,
    bestTime: 0,
    bestScore: 0,
    attemptCount: 0,
    completedAt: null
  }
];

export default progress;