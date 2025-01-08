import { Document, Types } from "mongoose";
import { PlanetType } from '@/types/base/enums';
import { DrawType } from "../base/drawing";

export interface PlanetPosition {
  x: number;
  y: number;
  radius: number;
}

export const drawTypeValues: DrawType[] = ['moon', 'chromanova', 'syntaxia', 'quantumCore'];

export interface IPlanetDocument extends Document {
  id: string;
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

export interface GamePlanetData {
  id: string;
  name: string;
  type: PlanetType;
  area: PlanetType;
  position: PlanetPosition;
  description: string;
  isUnlocked: boolean;
  firstStationId?: string;
}

export type LeanPlanetDocument = Omit<IPlanetDocument, keyof Document> & {
  _id: Types.ObjectId;
  stations?: Array<{ id: string; stationNumber: number }>;
};