// types/base/shared.ts
export interface PlanetPosition {
    x: number;
    y: number;
    radius: number;
  }
  
  export type DrawType = 'moon' | 'chromanova' | 'syntaxia' | 'quantumCore';
  export const drawTypeValues: DrawType[] = ['moon', 'chromanova', 'syntaxia', 'quantumCore'];