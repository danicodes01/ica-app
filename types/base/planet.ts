// types/base/planet.ts
import { Types } from 'mongoose';
import { PlanetType } from './enums';
import { DrawType, PlanetPosition } from './shared';

export interface BasePlanet {
  _id?: string | Types.ObjectId;  // Make _id optional and accept both string and ObjectId
  slug: string;
  name: string;
  order: number;
  type: PlanetType;
  drawType: DrawType;
  description: string;
  position: PlanetPosition;
  icon: string;
  isUnlocked: boolean;
  requiredXP: number;
  prerequisites: string[];
  isStartingPlanet: boolean;
}