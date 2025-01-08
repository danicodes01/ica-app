
// models/userProgress/schema.ts
import { Schema } from "mongoose";
import { IUserProgressDocument } from "@/types/models/userProgress";

const UserProgressSchema = new Schema<IUserProgressDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  planetId: { type: Schema.Types.ObjectId, ref: 'Planet', required: true },
  stationId: { type: Schema.Types.ObjectId, ref: 'Station', required: true },
  completed: { type: Boolean, required: true, default: false },
  bestTime: { type: Number, required: true, default: 0 },
  bestScore: { type: Number, required: true, default: 0 },
  attemptCount: { type: Number, required: true, default: 0 },
  completedAt: { type: Date, default: null }
});

// Indexes for efficient querying
UserProgressSchema.index({ userId: 1, stationId: 1 }, { unique: true });
UserProgressSchema.index({ userId: 1, planetId: 1 });
UserProgressSchema.index({ completed: 1 });

export default UserProgressSchema;