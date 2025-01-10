// lib/seed/planetSeeder.ts
import mongoose, { Model } from 'mongoose';
import { IPlanetDocument, LeanPlanetDocument } from '@/types';
import PlanetSchema from '@/models/planet/schema';

export interface SeedPlanetResult {
  success: boolean;
  planets?: LeanPlanetDocument[];
  error?: string;
}

const getPlanetModel = (): Model<IPlanetDocument> => {
  try {
    return mongoose.model<IPlanetDocument>('Planet');
  } catch {
    return mongoose.model<IPlanetDocument>('Planet', PlanetSchema);
  }
};

export async function seedPlanets(planetsData: Partial<IPlanetDocument>[]): Promise<SeedPlanetResult> {
  const Planet = getPlanetModel();
  
  try {
    console.log(`Processing ${planetsData.length} planets for seeding`);

    // Clear existing planets
    console.log('Clearing existing planets...');
    await Planet.deleteMany({});
    
    // Insert planets
    console.log('Inserting planets...');
    const insertedPlanets = await Planet.create(
      planetsData.map(planet => ({
        ...planet,
        unlocked: planet.isUnlocked || false,
        isStartingPlanet: planet.isStartingPlanet || false,
        prerequisites: planet.prerequisites || []
      }))
    );

    // Convert to lean documents
    const leanPlanets = insertedPlanets.map(doc => 
      doc.toObject({
        virtuals: true,
        versionKey: false
      })
    ) as LeanPlanetDocument[];

    console.log(`Successfully seeded ${leanPlanets.length} planets`);
    return {
      success: true,
      planets: leanPlanets
    };

  } catch (error) {
    console.error('Error seeding planets:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}