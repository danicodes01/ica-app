import mongoose from 'mongoose';
import { IStationDocument } from '@/types/models/station';
import StationSchema from '@/models/station/schema';

export interface SeedStationResult {
  success: boolean;
  stations?: IStationDocument[];
  error?: string;
}

interface UnvalidatedStation {
  name?: string;
  planetId?: mongoose.Types.ObjectId;
  stationNumber?: number;
  description?: string;
  npcDialogue?: string;
  initialCode?: string;
  validationType?: string;
  validationCriteria?: string;
  maxAttempts?: number | null;
  timeLimit?: number;
  baseXP?: number;
  baseCurrency?: number;
  penaltyPercent?: number;
  isFirstOnPlanet?: boolean;
}


const getStationModel = () => {
  try {
    return mongoose.model<IStationDocument>('Station');
  } catch {
    return mongoose.model<IStationDocument>('Station', StationSchema);
  }
};


const validateStation = (station: UnvalidatedStation): station is IStationDocument => {
  try {
    const requiredFields = [
      'name', 'planetId', 'stationNumber', 'description', 'npcDialogue',
      'initialCode', 'validationType', 'validationCriteria', 'timeLimit',
      'baseXP', 'baseCurrency', 'penaltyPercent'
    ];
    
    for (const field of requiredFields) {
      const value = station[field as keyof UnvalidatedStation];
      if (value === undefined || value === null || value === '') {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof station.penaltyPercent === 'number' && (station.penaltyPercent < 0 || station.penaltyPercent > 100)) {
      throw new Error('Penalty percent must be between 0 and 100');
    }

    if (typeof station.timeLimit === 'number' && station.timeLimit <= 0) {
      throw new Error('Time limit must be greater than 0');
    }

    return true;
  } catch (error) {
    console.error('Station validation error:', error);
    return false;
  }
};

export async function seedStations(stationsData: UnvalidatedStation[]): Promise<SeedStationResult> {
  const Station = getStationModel();
  
  try {
    const validStations = stationsData.filter(validateStation);
    if (validStations.length !== stationsData.length) {
      throw new Error(`${stationsData.length - validStations.length} stations failed validation`);
    }

    await Station.deleteMany({});
    const insertedStations = await Station.insertMany(validStations);

    return {
      success: true,
      stations: insertedStations
    };

  } catch (error) {
    console.error('Error seeding stations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}