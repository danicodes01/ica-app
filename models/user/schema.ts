// models/user/schema.ts

import { Schema } from 'mongoose';
import { IUserDocument } from '@/types/models';

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: String,
    emailVerified: Date,
    password: { type: String, required: true, select: false },
    totalXP: { type: Number, default: 0 },
    currencies: {
      lunar: { type: Number, default: 0 },
      chromanova: { type: Number, default: 0 },
      syntaxia: { type: Number, default: 0 },
      quantum: { type: Number, default: 0 },
      galactic: { type: Number, default: 0 }
    },
    currentProgress: {
      planetId: { type: Schema.Types.ObjectId, ref: 'Planet', required: true},
      stationId: { type: Schema.Types.ObjectId, ref: 'Station', required: true },
      attemptsRemaining: { type: Number, min: 0, max: 3, required: true },
      currentAttempt: {
        startedAt: Date,
        expiresAt: Date
      },
      hintsUsed: { type: Number, default: 0, max: 3 },
      lastAttemptedAt: {type: Date}
    },
    currentPlanet: {
      planetId: { type: Schema.Types.ObjectId, ref: 'Planet' },
      currentStation: { type: Number, default: 1 },
      completedStations: [{ type: Number }]
    },
    activePlanets: [{
      planetId: { type: Schema.Types.ObjectId, ref: 'Planet', required: true },
      lastActiveAt: { type: Date, default: Date.now, required: true }
    }],
    planetProgress: [{
      planetId: { type: Schema.Types.ObjectId, ref: 'Planet', required: true},
      isUnlocked: { type: Boolean, default: false },
      isCompleted: { type: Boolean, default: false },
      totalXPEarned: { type: Number, default: 0 }
    }],
    completion: {
      planets: [{
        planetId: { type: Schema.Types.ObjectId, ref: 'Planet', required: true },
        completedAt: Date,
        totalXPEarned: Number,
        totalCurrencyEarned: Number,
        timeSpent: Number
      }],
      stations: [{
        stationId: { type: Schema.Types.ObjectId, ref: 'Station', required: true },
        planetId: { type: Schema.Types.ObjectId, ref: 'Planet', required: true },
        completedAt: { type: Date, required: true },
        attemptsUsed: { type: Number, required: true },
        hintsUsed: { type: Number, required: true },
        xpEarned: { type: Number, required: true },
        currencyEarned: { type: Number, required: true },
        timeSpent: { type: Number, required: true },
        attempts: [{
          imestamp: { type: Date, required: true },
          passed: { type: Boolean, required: true },
          code: { type: String, required: true },
          executionTime: { type: Number, required: true },
          memoryUsage: { type: Number, required: true },
          hintsUsed: { type: Number, required: true },
          expiresAt: { type: Date, required: true },
          completed: { type: Date }
        }]
      }]
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ 'currencies.lunar': 1 });
UserSchema.index({ 'currencies.chromanova': 1 });
UserSchema.index({ 'currencies.syntaxia': 1 });
UserSchema.index({ 'currencies.quantum': 1 });
UserSchema.index({ 'currencies.galactic': 1 });
UserSchema.index({ totalXP: 1 });

// Virtuals
UserSchema.virtual('level').get(function() {
  return Math.floor(this.totalXP / 1000) + 1;
});

UserSchema.virtual('activePlanet').get(function() {
  if (!this.currentProgress?.planetId) return null;
  return this.activePlanets.find(p => 
    p.planetId.equals(this.currentProgress.planetId)
  );
});

export default UserSchema;