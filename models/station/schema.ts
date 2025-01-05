// models/station/schema.ts

import { Schema } from 'mongoose';
import { IStationDocument } from '@/types/models/station';
import { StationEnvironmentType } from '@/types/base';
import { NPCType } from '@/types/ui/npc';

const StationSchema = new Schema<IStationDocument>(
  {
    planetId: { type: Schema.Types.ObjectId, ref: 'Planet', required: true },
    stationNumber: { type: Number, required: true, min: 1, max: 10 },
    name: { type: String, required: true },
    hints: [{
      text: { type: String, required: true },
      cost: { type: Number, required: true },
      unlockRequirement: {
        attempts: { type: Number, required: true },
        timeSpent: { type: Number, required: true }
      }
    }],
    failureHandling: {
      maxAttempts: { type: Number, default: 3 },
      previousStationId: { type: Schema.Types.ObjectId, ref: 'Station' }
    },
    isAccessible: { type: Boolean, default: false },
    environment: {
      type: {
        type: String,
        enum: Object.values(StationEnvironmentType),
        required: true,
      },
      assets: {
        background: String,
        props: [String],
        animations: { idle: [String], active: [String] },
        soundEffects: { ambient: String, interaction: String },
      },
      interactiveElements: [
        {
          position: {
            x: Number,
            y: Number,
            radius: Number,
          },
          type: String,
          trigger: {
            type: String,
            enum: ['click', 'hover', 'proximity'],
          },
        },
      ],
    },
    npc: {
      type: {
        type: String,
        enum: Object.values(NPCType),
        required: true,
      },
      name: { type: String, required: true },
      dialogue: {
        greeting: { type: String, required: true },
        hint: { type: String, required: true },
        success: { type: String, required: true },
        failure: { type: String, required: true },
      },
      appearance: { type: String, required: true },
      defaultPosition: {
        x: Number,
        y: Number,
      },
      position: {
        x: Number,
        y: Number,
      },
    },
    canvasSettings: {
      dimensions: {
        width: Number,
        height: Number,
      },
      layers: [String],
      renderOrder: [Number],
    },
    challenge: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      difficulty: { type: String, required: true },
      initialCode: { type: String, required: true },
      solution: { type: String, required: true },
      testCases: [
        {
          input: { type: String, required: true },
          expectedOutput: { type: String, required: true },
        },
      ],
      hints: [String],
      baseXPReward: { type: Number, required: true },
      xpDecayFactor: { type: Number, default: 0.8 },
    },
    requiredStations: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Station',
      },
    ],
    progress: {
      isComplete: { type: Boolean, default: false },
      lastAttemptAt: { type: Date },
      bestAttempt: {
        attemptNumber: Number,
        earnedXP: Number
      }
    },
  },
  { timestamps: true }
);

StationSchema.pre('save', async function(next) {
    if (this.stationNumber === 1) {
      this.isAccessible = true;
    }
    next();
  });

// Index for uniqueness and query optimization
StationSchema.index({ planetId: 1, stationNumber: 1 }, { unique: true });
StationSchema.index({ 'npc.type': 1 }); // If you query by NPC type
StationSchema.index({ isAccessible: 1 }); // For accessibility queries
StationSchema.index({ 'challenge.difficulty': 1 });

export default StationSchema;