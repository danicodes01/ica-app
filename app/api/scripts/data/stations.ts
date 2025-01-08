import { Types } from 'mongoose';
import { IStationDocument } from '@/types/models/station';

export const stations: Partial<IStationDocument>[] = [
  {
    name: "Introduction to Variables",
    planetId: new Types.ObjectId(), // Replace with actual planet ID
    stationNumber: 1,
    description: "Learn about JavaScript variables",
    npcDialogue: "Welcome to your first coding challenge!",
    initialCode: "let x = '';",
    validationType: "output",
    validationCriteria: "x === 'hello'",
    maxAttempts: 3,
    timeLimit: 300,
    baseXP: 100,
    baseCurrency: 50,
    penaltyPercent: 10,
    isFirstOnPlanet: true
  }
];

export default stations;