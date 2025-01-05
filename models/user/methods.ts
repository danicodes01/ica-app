// models/user/methods.ts

import { Schema, Types } from 'mongoose';
import {ICurrentProgress , IUserDocument, IUserModel } from '@/types/models';
import { CurrencyBalance } from '@/types/base/enums';
import { IPlanetDocument } from '@/types/models/planet';
import { IStationDocument } from '@/types/models/station';


// Helper functions
const updateStationCompletionHelper = (
  user: IUserDocument,
  stationDoc: IStationDocument,
  now: Date,
  earnedXP: number,
  earnedCurrency?: { type: keyof CurrencyBalance; amount: number }
): void => {
  user.completion.stations.push({
    stationId: stationDoc._id,
    planetId: stationDoc.planetId,
    completedAt: now,
    attemptsUsed: user.currentProgress.attemptsRemaining,
    hintsUsed: user.currentProgress.hintsUsed,
    xpEarned: earnedXP,
    currencyEarned: earnedCurrency?.amount || 0,
    timeSpent: now.getTime() - (user.currentProgress.lastAttemptedAt?.getTime() || now.getTime()),
    attempts: []
  });

  user.currentProgress = {
    ...user.currentProgress,
    hintsUsed: 0,
    attemptsRemaining: 3,
    lastAttemptedAt: undefined,
    currentAttempt: undefined
  };
};

const updatePlanetProgressHelper = (
  user: IUserDocument,
  planetId: Types.ObjectId,
  stationNumber: number,
  earnedXP: number
): void => {
  if (!user.currentPlanet.completedStations.includes(stationNumber)) {
    user.currentPlanet.completedStations.push(stationNumber);
  }

  const planetProgress = user.planetProgress.find(p => p.planetId.equals(planetId));
  if (planetProgress) {
    planetProgress.totalXPEarned += earnedXP;
  }
};

const handlePlanetCompletionHelper = async (
  user: IUserDocument,
  planetId: Types.ObjectId,
  earnedXP: number,
  earnedCurrency?: { type: keyof CurrencyBalance; amount: number }
): Promise<void> => {
  const planet = await user.model('Planet').findById(planetId) as IPlanetDocument | null;
  if (planet && planet._id instanceof Types.ObjectId) {
    const totalCompleted = user.currentPlanet.completedStations.length;
    if (totalCompleted === planet.totalStations) {
      planet.isUnlocked = true;
      await planet.save();

      const planetProgress = user.planetProgress.find(p =>
        p.planetId.equals(planetId)
      );

      user.completion.planets.push({
        planetId: planet._id as Types.ObjectId,
        completedAt: new Date(),
        totalXPEarned: planetProgress?.totalXPEarned || 0,
        totalCurrencyEarned: earnedCurrency?.amount || 0,
        timeSpent: 0
      });

      if (planetProgress) {
        planetProgress.isCompleted = true;
      }
    }
  }
};

const instanceMethods = {
  // Currency Methods
  async addCurrency(this: IUserDocument, type: keyof CurrencyBalance, amount: number): Promise<number> {
    this.currencies[type] += amount;
    await this.save();
    return this.currencies[type];
  },

  async updateCurrency(this: IUserDocument, type: keyof CurrencyBalance, amount: number): Promise<void> {
    this.currencies[type] = Math.max(0, this.currencies[type] + amount);
    await this.save();
  },

  async addXP(this: IUserDocument, amount: number): Promise<void> {
    this.totalXP += amount;
    await this.save();
  },

  // Station Methods
  canUseHint(this: IUserDocument): boolean {
    return this.currentProgress.hintsUsed < 3;
  },

  getStationHistory(this: IUserDocument, stationId: Types.ObjectId) {
    return this.completion.stations.find(s => 
      s.stationId.equals(stationId)
    );
  },

  completeCurrentAttempt(
    this: IUserDocument,
    passed: boolean,
    metrics: { executionTime?: number; memoryUsage?: number }
  ): void {
    const { currentAttempt } = this.currentProgress;
    if (!currentAttempt || !currentAttempt.expiresAt) return;
  
    const now = new Date();
    if (now > currentAttempt.expiresAt) {
      this.currentProgress.attemptsRemaining--;
      this.currentProgress.currentAttempt = undefined;  // Changed from null
      return;
    }
  
    const station = this.getStationHistory(this.currentProgress.stationId);
    if (station && station.attempts.length > 0) {
      const currentAttempt = station.attempts[station.attempts.length - 1];
      Object.assign(currentAttempt, {
        ...metrics,
        passed,
        completed: now
      });
    }
  
    this.currentProgress.currentAttempt = undefined;  // Changed from null
  },
  
  // Progress Methods
  isAttemptExpired(this: IUserDocument): boolean {
    const { currentAttempt } = this.currentProgress;
    if (!currentAttempt?.expiresAt) return false;
    return new Date() > currentAttempt.expiresAt;
  },

  getAttemptTimeRemaining(this: IUserDocument): number {
    const { currentAttempt } = this.currentProgress;
    if (!currentAttempt?.expiresAt) return 0;
    const remaining = currentAttempt.expiresAt.getTime() - Date.now();
    return Math.max(0, remaining);
  },

  async completeStation(
    this: IUserDocument,
    planetId: Types.ObjectId,
    stationNumber: number,
    earnedXP: number,
    earnedCurrency?: { type: keyof CurrencyBalance; amount: number },
  ): Promise<void> {
    const now = new Date();
    const stationDoc = await this.model('Station').findOne({ planetId, stationNumber }) as IStationDocument;
    
    if (stationDoc) {
      updateStationCompletionHelper.call(
        this, 
        this,
        stationDoc, 
        now, 
        earnedXP, 
        earnedCurrency
      );
  
      updatePlanetProgressHelper.call(
        this,
        this, 
        planetId, 
        stationNumber, 
        earnedXP
      );
  
      await handlePlanetCompletionHelper.call(
        this,
        this, 
        planetId, 
        earnedXP, 
        earnedCurrency
      );
  
      await this.addXP(earnedXP);
      if (earnedCurrency) {
        await this.addCurrency(earnedCurrency.type, earnedCurrency.amount);
      }
    
      await this.save();
    }
  },

  async getCurrentProgress(this: IUserDocument): Promise<{
    currentPlanet: IPlanetDocument;
    completedStations: number[];
    totalStations: number;
    currentProgress: ICurrentProgress;
  }> {
    const planet = await this.model('Planet')
      .findById(this.currentPlanet.planetId)
      .select('totalStations name') as IPlanetDocument;

    return {
      currentPlanet: planet,
      completedStations: this.currentPlanet.completedStations,
      totalStations: planet?.totalStations || 0,
      currentProgress: this.currentProgress
    };
  }
};


const staticMethods = {
  async findByEmail(this: IUserModel, email: string): Promise<IUserDocument | null> {
    return this.findOne({ email });
  },

  async findByEmailWithProgress(this: IUserModel, email: string): Promise<IUserDocument | null> {
    return this.findOne({ email })
      .populate('currentPlanet.planetId')
      .populate('planetProgress.planetId');
  }
};

export const attachMethods = (schema: Schema<IUserDocument, IUserModel>): void => {
  schema.methods = { ...schema.methods, ...instanceMethods };
  schema.statics = { ...schema.statics, ...staticMethods };
};