// models/Planet.ts
import mongoose from 'mongoose';
import PlanetSchema from './schema';
import { IPlanetDocument } from '@/types/models/planet';


export const Planet = mongoose.models.Planet || mongoose.model<IPlanetDocument>('Planet', PlanetSchema);
