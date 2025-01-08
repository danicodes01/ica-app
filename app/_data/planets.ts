// planets.ts
import { PlanetType } from '@/types';
import { DrawPlanet } from '@/types/base/drawing'

// Helper function to calculate positions
const getRelativePosition = (
  width: number,
  height: number,
  percentX: number,
  percentY: number,
): { x: number; y: number; radius: number } => ({
  x: width * percentX,
  y: height * percentY,
  radius: Math.min(width, height) * 0.05, // 5% of the smallest dimension
});

export const getGamePlanets = (width: number, height: number): DrawPlanet[] => [
    {
      id: 'mission-control',
      slug: 'mission-control',
      name: 'Mission Control',
      order: 0,
      type: PlanetType.MISSION_CONTROL,
      drawType: 'moon',
      position: getRelativePosition(width, height, 0.5, 0.8),
      icon: '🪐',
      description: 'Central hub for learning and progress',
      requiredXP: 0,
      isUnlocked: true,
      prerequisites: [],
      isStartingPlanet: true
    },
    {
      id: 'systems-division',
      slug: 'syntaxia',
      name: 'SYNTAXIA',
      order: 1,
      type: PlanetType.SYNTAXIA,
      drawType: 'syntaxia',
      position: getRelativePosition(width, height, 0.75, 0.56),
      icon: '🛰️',
      description: 'Core systems & algorithms',
      isUnlocked: false,
      requiredXP: 1000,
      prerequisites: [],
      isStartingPlanet: false
    },
    {
    id: 'frontend-corps',
    slug: 'chromanova',
    name: 'CHROMANOVA',
    order: 2,
    type: PlanetType.MISSION_CONTROL,
    drawType: 'chromanova',
    description: 'Master UI/UX & frontend systems',
    position: getRelativePosition(width, height, 0.25, 0.5),
    icon: '🌌',
    isUnlocked: true,
    requiredXP: 2000,
    prerequisites: [],
    isStartingPlanet: false
  },
  {
    id: 'quantum-core',
    slug: 'quantumcore',
    name: 'QUANTUMCORE',
    order: 3,
    type: PlanetType.QUANTUMCORE,
    drawType: 'quantumCore',
    position: getRelativePosition(width, height, 0.5, 0.26),
    icon: '⚛️',
    description: 'Where quantum algorithms and data science solve complex problems',
    isUnlocked: false,
    requiredXP: 3000,
    prerequisites: [],
    isStartingPlanet: false
  },
];