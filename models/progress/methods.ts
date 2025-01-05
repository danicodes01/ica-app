// models/progress/methods.ts

import mongoose, { Schema, Model } from 'mongoose';
import { IStationDocument } from '@/types/models/station';
import { IProgressDocument } from '@/types/models/progress';
import { ProgressStatus } from '@/types/base/enums';

export const attachMethods = (schema: Schema): void => {
  // Calculate base rewards for a challenge attempt
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

  // Update station accessibility based on previous station completion
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

  // Complete a challenge
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
    
    // Update planet completion count
    await this.model('Planet').updateOne(
      { _id: this.planetId },
      { $inc: { completedStations: 1 } }
    );
  };

  // Handle failed attempt and station progression
  schema.methods.handleFailedAttempt = async function(
    this: IStationDocument,
    progress: IProgressDocument
  ): Promise<void> {
    if (progress.attempts.length >= 3) {
      // Find previous station
      const previousStation = await this.model('Station').findOne({
        planetId: this.planetId,
        stationNumber: this.stationNumber - 1
      });
      
      if (previousStation) {
        // Create new progress for previous station
        const newProgress = new (mongoose.model('Progress'))({
          userId: progress.userId,
          entityId: previousStation._id,
          entityType: 'station',
          status: ProgressStatus.NOT_STARTED,
          attempts: []
        });
        await newProgress.save();
        
        // Update current progress status
        progress.status = ProgressStatus.FAILED;
        await progress.save();
      }
    }
  };

  // Get progress for all stations in a planet
  schema.statics.getProgress = async function(
    this: Model<IStationDocument>, 
    planetId: string
  ) {
    return this.find({ planetId })
      .sort('stationNumber')
      .then((stations: IStationDocument[]) => stations.map(station => ({
        stationNumber: station.stationNumber,
        isComplete: station.progress?.isComplete ?? false,
        bestAttempt: station.progress?.bestAttempt,
        isAccessible: station.isAccessible,
      })));
  };
};