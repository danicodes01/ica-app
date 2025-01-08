import mongoose from 'mongoose';
import { IPlanetDocument } from '@/types';
import PlanetSchema from '@/models/planet/schema';

export interface SeedPlanetResult {
  success: boolean;
  planets?: IPlanetDocument[];
  error?: string;
}

interface UnvalidatedPlanet {
  name?: string;
  order?: number;
  description?: string;
  unlocked?: boolean;
  requiredXP?: number;
  prerequisites?: string[];
  isStartingPlanet?: boolean;
}

const getPlanetModel = () => {
  try {
    return mongoose.model<IPlanetDocument>('Planet');
  } catch {
    return mongoose.model<IPlanetDocument>('Planet', PlanetSchema);
  }
};

const validatePlanet = (planet: UnvalidatedPlanet): planet is IPlanetDocument => {
  try {
    const requiredFields = ['name', 'order', 'description', 'requiredXP'];
    
    for (const field of requiredFields) {
      const value = planet[field as keyof UnvalidatedPlanet];
      if (value === undefined || value === null || value === '') {
        console.error(`Missing ${field} for planet:`, planet.name);
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof planet.requiredXP === 'number' && planet.requiredXP < 0) {
      console.error(`Invalid requiredXP for planet ${planet.name}:`, planet.requiredXP);
      throw new Error('Required XP must be non-negative');
    }

    return true;
  } catch (error) {
    console.error('Planet validation error:', error);
    return false;
  }
};

export async function seedPlanets(planetsData: UnvalidatedPlanet[]): Promise<SeedPlanetResult> {
  const Planet = getPlanetModel(); // Use the safe getter instead of direct model creation
  
  try {
    console.log(`Processing ${planetsData.length} planets for seeding`);

    const validPlanets = planetsData.filter((planet) => {
      const isValid = validatePlanet(planet);
      if (!isValid) {
        console.error('Invalid planet data:', {
          name: planet.name,
          order: planet.order,
          hasDescription: !!planet.description,
          requiredXP: planet.requiredXP
        });
      }
      return isValid;
    });

    if (validPlanets.length !== planetsData.length) {
      const failedCount = planetsData.length - validPlanets.length;
      console.error(`Validation failed for ${failedCount} planets`);
      throw new Error(`${failedCount} planets failed validation`);
    }

    console.log('Clearing existing planets...');
    await Planet.deleteMany({});
    
    // First insert planets without prerequisites
    console.log('Inserting planets...');
    const insertedPlanets = await Planet.insertMany(
      validPlanets.map(planet => ({
        ...planet,
        unlocked: planet.isUnlocked || false,
        isStartingPlanet: planet.isStartingPlanet || false,
        prerequisites: [] // temporarily empty
      }))
    );

    // Create a map of planet names to their ObjectIds
    const planetMap = new Map(insertedPlanets.map(planet => [planet.name, planet._id]));

    // Update each planet with correct prerequisite ObjectIds
    console.log('Updating prerequisites...');
    const updatePromises = insertedPlanets.map(async planet => {
      const originalData = planetsData.find(p => p.name === planet.name);
      if (originalData?.prerequisites?.length) {
        const prerequisiteIds = originalData.prerequisites
          .map(name => {
            const id = planetMap.get(name);
            if (!id) {
              console.warn(`Warning: Prerequisite planet "${name}" not found for planet "${planet.name}"`);
            }
            return id;
          })
          .filter(id => id); // Remove any undefined values
        
        await Planet.findByIdAndUpdate(planet._id, {
          prerequisites: prerequisiteIds
        });
      }
    });

    await Promise.all(updatePromises);

    // Fetch the final state of planets
    console.log('Fetching final planet state...');
    const finalPlanets = await Planet.find({});

    console.log(`Successfully seeded ${finalPlanets.length} planets`);
    return {
      success: true,
      planets: finalPlanets
    };

  } catch (error) {
    console.error('Error seeding planets:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}