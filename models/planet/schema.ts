// models/planet/schema

import mongoose, { Schema } from 'mongoose';
import { IPlanetDocument, IPlanet } from '../../types/models/planet';
import { StationEnvironmentType, PlanetType, CurrencyType, GameArea, CurrencyBalance } from '@/types/base/enums';
const PlanetSchema = new Schema<IPlanetDocument>(
  {
    area: { 
      type: String, 
      required: true,
      enum: Object.values(GameArea)
    },
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    identifier: { type: String, required: true, unique: true },
    type: { type: String, enum: Object.values(PlanetType), required: true },
    description: { type: String, required: true },
    currencyType: {
      type: String,
      enum: Object.values(CurrencyType),
      required: true,
    },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      radius: { type: Number, required: true },
    },
    order: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      validate: {
        validator: async function(v: number) {
          try {
            const Planet = mongoose.model('Planet');
            const count = await Planet.countDocuments();
            return v <= count;
          } catch (error){
            console.log(error, 'Error in order validator')
            return true;
          }
        },
        message: 'Planet order cannot exceed total number of planets'
      }
    },
    stations: [
      {
        id: { type: Schema.Types.ObjectId, ref: 'Station' },
        position: {
          x: { type: Number, required: true, min: 0, max: 1000 },
          y: { type: Number, required: true, min: 0, max: 1000 },
          radius: { type: Number, required: true, min: 5, max: 50 },
        },
        type: { type: String, enum: Object.values(StationEnvironmentType) },
      },
    ],
    completedStations: {
      type: Number,
      default: 0,
      validate: {
        validator: function (v: number) {
          return v <= this.totalStations;
        },
      },
    },
    totalStations: { type: Number, required: true, min: 1 },
    isUnlocked: { type: Boolean, default: false },
    nextPlanetId: {
      type: Schema.Types.ObjectId,
      ref: 'Planet',
      validate: {
        validator: async function(v: Schema.Types.ObjectId) {
          if (!v) return true; // Allow null for last planet
          const nextPlanet = await mongoose.model('Planet').findById(v);
          return nextPlanet?.order === this.order + 1;
        },
        message: 'Next planet must have the next sequential order number'
      }
    },
  },
  { timestamps: true },
);

PlanetSchema.pre('save', async function (next) {
  if (this.completedStations === this.totalStations) {
    this.isUnlocked = true;
    // Could also automatically unlock next planet if needed
  }
  next();
});

PlanetSchema.index({ 'stations.id': 1 });
PlanetSchema.index({ isUnlocked: 1 });
PlanetSchema.index({ slug: 1 });
PlanetSchema.index({ identifier: 1 });
PlanetSchema.index({ order: 1 });

export default PlanetSchema;

// Helper function to create empty currency balance
export const createEmptyCurrencyBalance = (): CurrencyBalance => {
  return Object.values(CurrencyType).reduce((acc, curr) => {
    acc[curr] = 0;
    return acc;
  }, {} as CurrencyBalance);
};

export const isPlanet = (value: unknown): value is IPlanet => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'type' in value &&
    'area' in value &&
    'currencyType' in value &&
    'order' in value &&
    Object.values(CurrencyType).includes((value as IPlanet).currencyType)
  );
};