// lib/seed/data/planets.ts
import { PlanetType } from '@/types';
import { IPlanetDocument } from '@/types/models/planet';

export const planets: Partial<IPlanetDocument>[] = [
    {
      slug: 'mission-control',
      name: 'Mission Control',
      order: 0,
      type: PlanetType.MISSION_CONTROL,
      drawType: 'moon',
      description: 'Central hub for learning and progress',
      position: { x: 0.5, y: 0.8, radius: 0 },
      icon: '🪐',
      isUnlocked: true,
      requiredXP: 0,
      prerequisites: [],
      isStartingPlanet: true
    },
    {
      slug: 'syntaxia',
      name: 'SYNTAXIA',
      order: 1,
      type: PlanetType.SYNTAXIA,
      drawType: 'syntaxia',
      position: { x: 0.75, y: 0.56, radius: 0 },
      icon: '🛰️',
      description: 'Core systems & algorithms',
      isUnlocked: false,
      requiredXP: 1000,
      prerequisites: [],
      isStartingPlanet: false
    },
    {
      slug: 'chromanova',
      name: 'CHROMANOVA',
      order: 2,
      type: PlanetType.CHROMANOVA,
      drawType: 'chromanova',
      position: { x: 0.25, y: 0.5, radius: 0 },
      icon: '🌌',
      description: 'Master UI/UX & frontend systems',
      isUnlocked: true,
      requiredXP: 2000,
      prerequisites: [],
      isStartingPlanet: false
    },
    {
      slug: 'quantumcore',
      name: 'QUANTUMCORE',
      order: 3,
      type: PlanetType.QUANTUMCORE,
      drawType: 'quantumCore',
      position: { x: 0.5, y: 0.26, radius: 0 },
      icon: '⚛️',
      description: 'Where quantum algorithms and data science solve complex problems',
      isUnlocked: false,
      requiredXP: 3000,
      prerequisites: [],
      isStartingPlanet: false
    }
  ];

export default planets;