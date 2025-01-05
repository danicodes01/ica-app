// models/progress/schema.ts

import { Schema } from 'mongoose';
import { IProgressDocument } from '@/types/models';
import { ProgressStatus } from '@/types/base/enums';
import { isValidTransition } from '@/utils/progress/transitions';

const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds

const ProgressSchema = new Schema<IProgressDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    entityType: {
      type: String,
      enum: ['station', 'planet'],
      required: true,
      index: true,
    },
    attempts: [
      {
        timestamp: { type: Date, default: Date.now },
        code: String,
        passed: Boolean,
        executionTime: Number,
        memoryUsage: Number,
        earnedXP: Number,
        earnedCurrency: Number,
        attemptNumber: { type: Number, min: 1, max: 3 },
        startedAt: { type: Date, required: true },
        expiresAt: { type: Date, required: true },
      },
    ],
    hintsUsed: {
      type: Number,
      default: 0,
      max: 3,
    },
    status: {
      type: String,
      enum: Object.values(ProgressStatus),
      default: ProgressStatus.NOT_STARTED,
      validate: {
        validator: function(newStatus: ProgressStatus) {
          // Skip validation if this is a new document
          if (this.isNew) return true;
          const oldStatus = this.status;
          return isValidTransition(oldStatus as ProgressStatus, newStatus);
        },
        message: props => `Invalid status transition from ${props.value}`
      }
    },
    achievements: [
      {
        id: String,
        unlockedAt: { type: Date, default: Date.now },
        type: { type: String, required: true },
        metadata: Schema.Types.Mixed,
      },
    ],
    metrics: {
      totalTime: { type: Number, default: 0 },
      completionRate: { type: Number, default: 0 },
      averageAttempts: { type: Number, default: 0 },
      bestExecutionTime: Number,
      bestMemoryUsage: Number,
      totalXPEarned: { type: Number, default: 0 },
      totalCurrencyEarned: { type: Number, default: 0 },
    },
    lastActiveAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes
ProgressSchema.index({ userId: 1, entityType: 1 });
ProgressSchema.index({ entityId: 1, entityType: 1 });
ProgressSchema.index({ status: 1 });
ProgressSchema.index({ lastActiveAt: 1 });
ProgressSchema.index(
  { userId: 1, entityId: 1, entityType: 1 },
  { unique: true }
);

// Add validation for status transitions
ProgressSchema.methods.isCurrentAttemptExpired = function (): boolean {
  const currentAttempt = this.attempts[this.attempts.length - 1];
  if (!currentAttempt) return false;
  return new Date() > currentAttempt.expiresAt;
};

ProgressSchema.methods.getRemainingAttempts = function (): number {
  return 3 - this.attempts.length;
};

ProgressSchema.methods.getAttemptTimeRemaining = function (): number {
  const currentAttempt = this.attempts[this.attempts.length - 1];
  if (!currentAttempt) return 0;
  const remaining = currentAttempt.expiresAt.getTime() - Date.now();
  return Math.max(0, remaining);
};

// Pre-save middleware
ProgressSchema.pre('save', function(next) {
  if (this.isModified('status') && this.isNew === false) {
    // Only validate for existing documents
    const oldDoc = this.$getAllSubdocs();
    if (oldDoc && !isValidTransition(this.status as ProgressStatus, this.status as ProgressStatus)) {
      return next(new Error(`Invalid status transition to ${this.status}`));
    }
  }

  if (this.isModified('attempts')) {
    this.lastActiveAt = new Date();

    // Update metrics
    const passedAttempts = this.attempts.filter(a => a.passed);
    this.metrics.completionRate = (passedAttempts.length / this.attempts.length) * 100;
    this.metrics.averageAttempts = this.attempts.length;

    if (passedAttempts.length > 0) {
      this.metrics.bestExecutionTime = Math.min(
        ...passedAttempts.map(a => a.executionTime || Infinity)
      );
      this.metrics.bestMemoryUsage = Math.min(
        ...passedAttempts.map(a => a.memoryUsage || Infinity)
      );
    }

    // Check if all attempts are used and failed
    if (this.attempts.length >= 3 && !this.attempts.some(a => a.passed)) {
      this.status = ProgressStatus.FAILED;
    }
  }

  next();
});

// Add middleware to set expiration on new attempts
ProgressSchema.pre('save', function(next) {
  if (this.isModified('attempts')) {
    const currentAttempt = this.attempts[this.attempts.length - 1];
    if (currentAttempt && !currentAttempt.expiresAt) {
      currentAttempt.startedAt = new Date();
      currentAttempt.expiresAt = new Date(currentAttempt.startedAt.getTime() + ONE_HOUR);
    }
  }
  next();
});

// Virtual for completion status
ProgressSchema.virtual('isComplete').get(function() {
  return (
    this.status === ProgressStatus.COMPLETED ||
    (this.attempts.length > 0 && this.attempts.some(a => a.passed))
  );
});

export default ProgressSchema;
