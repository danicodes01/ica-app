// models/Planet.ts
import mongoose from 'mongoose';
import PlanetSchema from './schema';
import { attachMethods } from './methods';
import { IPlanetDocument } from '@/types/models/planet';

attachMethods(PlanetSchema);

export const Planet = mongoose.models.Planet || mongoose.model<IPlanetDocument>('Planet', PlanetSchema);
