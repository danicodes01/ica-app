// types/models/planet.ts

import { Document, Model, Types } from 'mongoose';
import { Position3D } from '../base/position';
import {
  PlanetType,
  StationEnvironmentType,
  CurrencyType,
} from '../base/enums';

interface StationInfo {
  readonly id: Types.ObjectId;
  readonly position: Position3D;
  readonly type: StationEnvironmentType;
}

export interface IPlanet {
  readonly name: string;
  readonly slug: string;
  readonly identifier: string;
  readonly description: string;
  readonly area: string;
  readonly type: PlanetType;
  readonly currencyType: CurrencyType;
  readonly position: Position3D;
  readonly order: number;
  readonly stations: StationInfo[];
  completedStations: number;
  readonly totalStations: number;
  isUnlocked: boolean;
  readonly nextPlanetId?: Types.ObjectId;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export interface IPlanetDocument extends Omit<IPlanet, 'id'>, Document {
  _id: Types.ObjectId;
  calculateTotalXP(): number;
  checkCompletion(): Promise<void>;
}

export interface IPlanetModel extends Model<IPlanetDocument> {
  findBySlug(slug: string): Promise<IPlanetDocument | null>;
  findByIdentifier(identifier: string): Promise<IPlanetDocument | null>;
  getUnlockedPlanets(): Promise<IPlanetDocument[]>;
  findNextAvailablePlanet(currentPlanetId: string): Promise<IPlanetDocument | null>;
  getPlayablePlanets(): Promise<IPlanetDocument[]>;
  getPlanetByArea(area: string): Promise<IPlanetDocument[]>;
  calculateTotalXPForArea(area: string): Promise<number>;
  updateStationPositions(
    planetId: string,
    positions: Record<string, Position3D>
  ): Promise<void>;
}

// Type guard
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