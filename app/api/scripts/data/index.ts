// Import types directly from their modules
import { IUserDocument } from '@/types/models';
import { IPlanetDocument } from '@/types';
import { IStationDocument } from '@/types/models/station';
import { IUserProgressDocument } from '@/types/models/userProgress';
import { IAttemptDocument } from '@/types/models/attempt';

// Import seed data
import { planets } from './planets';
import { stations } from './stations';
import { users } from './users';
import { progress } from './progress';
import { attempts } from './attempts';

// Types for seed data
export interface SeedData {
  planets: Partial<IPlanetDocument>[];
  stations: Partial<IStationDocument>[];
  users: Partial<IUserDocument>[];
  progress: Partial<IUserProgressDocument>[];
  attempts: Partial<IAttemptDocument>[];
}

// Export seed data
export const seedData: SeedData = {
  planets,
  stations,
  users,
  progress,
  attempts
};

// Export individual collections
export {
  planets,
  stations,
  users,
  progress,
  attempts
};