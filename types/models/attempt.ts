import { Document, Types } from "mongoose";

export interface IAttempt {
  userId: Types.ObjectId;
  stationId: Types.ObjectId;
  userProgressId: Types.ObjectId;
  submittedCode: string;
  passed: boolean;
  attemptNumber: number;
  earnedXP: number;
  earnedCurrency: number;
  startTime: Date;
  completionTime: Date;
}

export interface IAttemptDocument extends IAttempt, Document {}