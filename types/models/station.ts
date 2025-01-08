import { Document, Types } from "mongoose";

export interface IStation {
  name: string;
  planetId: Types.ObjectId;
  stationNumber: number;
  description: string;
  npcDialogue: string;
  initialCode: string;
  validationType: string;
  validationCriteria: string;
  maxAttempts: number | null;
  timeLimit: number;
  baseXP: number;
  baseCurrency: number;
  penaltyPercent: number;
  isFirstOnPlanet: boolean;
}

export interface IStationDocument extends IStation, Document {}