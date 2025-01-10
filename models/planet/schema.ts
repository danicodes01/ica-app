
 
 // models/planet/schema.ts
 import { Schema } from 'mongoose';
import { IPlanetDocument } from '@/types'; 
import { PlanetType } from '@/types/base/enums';
import { drawTypeValues } from '@/types/base/shared';

 const PlanetSchema = new Schema<IPlanetDocument>({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  order: {
    type: Number,
    required: true,
    unique: true
  },
  type: { type: String, enum: Object.values(PlanetType), required: true },
  drawType: {
    type: String,
    enum: drawTypeValues,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    radius: { type: Number, required: true}
  },
  isUnlocked: {
    type: Boolean,
    default: false
  },
  requiredXP: {
    type: Number,
    required: true,
    min: 0
  },
  prerequisites: [{
    type: String,
    enum: Object.values(PlanetType)
  }],
  isStartingPlanet: {
    type: Boolean,
    default: false
  }
 }, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
 });
 
 // Indexes
 PlanetSchema.index({ isStartingPlanet: 1 });
 PlanetSchema.index({ unlocked: 1 });
 
 export default PlanetSchema;