// models/station/methods.ts

import { Schema, Model } from 'mongoose';
import { IStationDocument, IProgressDocument } from '@/types/models';
import { ProgressStatus } from '@/types/base/enums';

export const attachMethods = (schema: Schema): void => {
  // Check if a new attempt can be started
  schema.methods.canAttempt = function(
    this: IStationDocument,
    progress: IProgressDocument
  ): boolean {
    if (progress.attempts.length >= 3) return false;
    
    const currentAttempt = progress.attempts[progress.attempts.length - 1];
    if (!currentAttempt) return true;
    
    return new Date() > currentAttempt.expiresAt;
  };
  
  // Calculate rewards based on attempt number
  schema.methods.calculateRewards = function(
    this: IStationDocument,
    attemptNumber: number
  ) {
    const baseXP = this.challenge.baseXPReward;
    const baseCurrency = 100;
    
    switch(attemptNumber) {
      case 1: return { xp: baseXP, currency: baseCurrency };
      case 2: return { xp: baseXP * 0.5, currency: baseCurrency * 0.5 };
      case 3: return { xp: baseXP * 0.1, currency: 0 };
      default: return { xp: 0, currency: 0 };
    }
  };

  // Calculate XP with decay factor
  schema.methods.calculateXP = function(
    this: IStationDocument, 
    attemptNumber: number
  ): number {
    return Math.floor(
      this.challenge.baseXPReward * 
      Math.pow(this.challenge.xpDecayFactor, attemptNumber - 1)
    );
  };

  // Check hint availability
  schema.methods.isHintAvailable = function(
    this: IStationDocument,
    hintIndex: number, 
    currentAttempts: number, 
    timeSpent: number
  ): boolean {
    const hint = this.hints[hintIndex];
    if (!hint) return false;
    
    return currentAttempts >= hint.unlockRequirement.attempts && 
           timeSpent >= hint.unlockRequirement.timeSpent;
  };

  // Handle station failure
  schema.methods.handleStationFailure = async function(
    this: IStationDocument,
    userId: string
  ): Promise<void> {
    const progress = await this.model('Progress').findOne({
      userId,
      entityId: this._id,
      entityType: 'station'
    }) as IProgressDocument | null;
    
    if (!progress) return;
    
    if (progress.attempts.length >= 3) {
      progress.status = ProgressStatus.FAILED;
      
      // If there's a previous station, send them back
      if (this.failureHandling.previousStationId) {
        const newProgress = new (this.model('Progress'))({
          userId,
          entityId: this.failureHandling.previousStationId,
          entityType: 'station',
          status: ProgressStatus.NOT_STARTED,
          attempts: []
        });
        await newProgress.save();
      }
      
      await progress.save();
    }
  };

  // Update station accessibility
  schema.methods.updateAccessibility = async function(
    this: IStationDocument
  ): Promise<void> {
    if (this.stationNumber === 1) {
      this.isAccessible = true;
    } else {
      const previousStation = await this.model('Station').findOne({
        planetId: this.planetId,
        stationNumber: this.stationNumber - 1,
      }) as IStationDocument | null;

      this.isAccessible = previousStation?.progress?.isComplete ?? false;
    }
    await this.save();
  };

  // Complete challenge
  schema.methods.completeChallenge = async function(
    this: IStationDocument,
    attemptNumber: number,
    earnedXP: number
  ): Promise<void> {
    this.progress = {
      isComplete: true,
      bestAttempt: {
        attemptNumber,
        earnedXP
      }
    };
    await this.save();
    await this.model('Planet').updateOne(
      { _id: this.planetId },
      { $inc: { completedStations: 1 } }
    );
  };

  // Get station progress
  schema.statics.getProgress = async function(
    this: Model<IStationDocument>, 
    planetId: string
  ) {
    return this.find({ planetId }).sort('stationNumber')
      .then((stations: IStationDocument[]) => stations.map(station => ({
        stationNumber: station.stationNumber,
        isComplete: station.progress?.isComplete ?? false,
        bestAttempt: station.progress?.bestAttempt,
        isAccessible: station.isAccessible,
      })));
  };
};