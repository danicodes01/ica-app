import { Document, Types } from "mongoose";

export interface IUserProgress {
  userId: Types.ObjectId;
  planetId: Types.ObjectId;
  stationId: Types.ObjectId;
  completed: boolean;
  bestTime: number;
  bestScore: number;
  attemptCount: number;
  completedAt: Date | null;
}

export interface IUserProgressDocument extends IUserProgress, Document {}
