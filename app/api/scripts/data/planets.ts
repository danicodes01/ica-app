// lib/seed/data/planets.ts
import { PlanetType } from '@/types';
import { IPlanetDocument } from '@/types/models/planet';

export const planets: Partial<IPlanetDocument>[] = [
  {
    name: 'CHROMANOVA',
    type: PlanetType.CHROMANOVA,
    order: 2,
    description: 'Master UI/UX & frontend systems',
    position: {
      x: 25,
      y: 30,
      radius: 5
    },
    requiredXP: 0,
    prerequisites: ['SYNTAXIA'],
    isStartingPlanet: false,
    isUnlocked: true
  },
  {
    name: 'SYNTAXIA',
    type: PlanetType.SYNTAXIA,
    order: 1,
    description: 'Core systems & algorithms',
    position: {
      x: 75,
      y: 56,
      radius: 5
    },
    requiredXP: 100,
    prerequisites: ['Mission Control'],
    isStartingPlanet: false,
    isUnlocked: true
  },
  {
    name: 'Mission Control',
    type: PlanetType.MISSION_CONTROL,
    order: 0,
    description: 'Central hub for learning and progress',
    position: {
      x: 50,
      y: 80,
      radius: 5
    },
    requiredXP: 0,
    prerequisites: [],
    isStartingPlanet: true,
    isUnlocked: true
  },
  {
    name: 'QUANTUMCORE',
    type: PlanetType.QUANTUMCORE,
    order: 3,
    description: 'Where quantum algorithms and data science solve complex problems',
    position: {
      x: 50,
      y: 26,
      radius: 5
    },
    requiredXP: 200,
    prerequisites: ['CHROMANOVA', 'SYNTAXIA', 'Mission Control'],
    isStartingPlanet: false,
    isUnlocked: false
  }
];

export default planets;