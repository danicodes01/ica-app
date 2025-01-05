// models/planet/methods

import { Schema } from 'mongoose';
import { IPlanetDocument } from '../../types/models/planet';

export const attachMethods = (schema: Schema): void => {
  // Instance methods
  schema.methods.calculateTotalXP = function(this: IPlanetDocument): number {
    return this.stations.length * 100;
  };

  schema.methods.checkCompletion = async function(this: IPlanetDocument): Promise<void> {
    if (this.completedStations === this.totalStations) {
      this.isUnlocked = true;
      await this.save();
    }
  };

  // Static methods
  schema.static('findBySlug', async function(slug: string) {
    return this.findOne({ slug: slug.toLowerCase() });
  });
};