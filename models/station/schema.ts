import { IStationDocument } from "@/types/models/station";
import { Schema } from "mongoose";

const StationSchema = new Schema<IStationDocument>({
  name: { type: String, required: true },
  planetId: { type: Schema.Types.ObjectId, ref: 'Planet', required: true },
  stationNumber: { type: Number, required: true },
  description: { type: String, required: true },
  npcDialogue: { type: String, required: true },
  initialCode: { type: String, required: true },
  validationType: { type: String, required: true },
  validationCriteria: { type: String, required: true },
  maxAttempts: { type: Number, default: null },
  timeLimit: { type: Number, required: true },
  baseXP: { type: Number, required: true },
  baseCurrency: { type: Number, required: true },
  penaltyPercent: { type: Number, required: true },
  isFirstOnPlanet: { type: Boolean, required: true, default: false }
});

StationSchema.index({ planetId: 1, stationNumber: 1 }, { unique: true });
StationSchema.index({ isFirstOnPlanet: 1 });

export default StationSchema;