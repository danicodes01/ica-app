// types/models/planet.ts
import { Document, Types } from "mongoose";
import { BasePlanet } from "../base/planet";
import { PlanetType } from "../base/enums";
import { PlanetPosition } from "../base/shared";

// Extend Document but override the _id type
export interface IPlanetDocument extends Omit<Document, '_id'>, BasePlanet {
  _id: Types.ObjectId;  // Force _id to be ObjectId for Mongoose documents
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

export type PlanetData = Omit<BasePlanet, '_id'> & {
  _id: string | Types.ObjectId;
};