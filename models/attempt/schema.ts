import { Schema } from "mongoose";
import { IAttemptDocument } from "@/types/models/attempt";

const AttemptSchema = new Schema<IAttemptDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  stationId: { type: Schema.Types.ObjectId, ref: 'Station', required: true },
  userProgressId: { type: Schema.Types.ObjectId, ref: 'UserProgress', required: true },
  submittedCode: { type: String, required: true },
  passed: { type: Boolean, required: true, default: false },
  attemptNumber: { type: Number, required: true },
  earnedXP: { type: Number, required: true, default: 0 },
  earnedCurrency: { type: Number, required: true, default: 0 },
  startTime: { type: Date, required: true },
  completionTime: { type: Date, required: true }
});

AttemptSchema.index({ userId: 1, stationId: 1, attemptNumber: 1 });
AttemptSchema.index({ userProgressId: 1 });
AttemptSchema.index({ startTime: 1 });

export default AttemptSchema;