import { seedData } from '@/app/api/scripts/data';
import connectDB from '@/lib/db/mongoose';
import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';

import { seedUsers } from './userSeeder';
import { seedPlanets } from './planetSeeder';
import { seedStations } from './stationSeeder';
import { seedProgress } from './progressSeeder';
import { seedAttempts } from './attemptSeeder';

export async function seedDatabase(options = { dropCollections: true }) {
  try {
    await connectDB();
    
    if (options.dropCollections) {
      console.log('Dropping existing collections...');
      const collections = ['users', 'planets', 'stations', 'progress', 'attempts'];
      await Promise.all(
        collections.map(async (collectionName) => {
          try {
            await mongoose.connection.db!.dropCollection(collectionName);
          } catch (e) {
            if (e instanceof MongoServerError && e.code !== 26) {
              console.warn(`Failed to drop collection ${collectionName}:`, e);
            }
          }
        })
      );
    }

    console.log('Starting database seed...');

    const users = await seedUsers(seedData.users);
    if (!users.success) throw new Error('User seeding failed: ' + users.error);

    const planets = await seedPlanets(seedData.planets);
    if (!planets.success) throw new Error('Planet seeding failed: ' + planets.error);

    const stations = await seedStations(seedData.stations);
    if (!stations.success) throw new Error('Station seeding failed: ' + stations.error);

    const progress = await seedProgress(seedData.progress);
    if (!progress.success) throw new Error('Progress seeding failed: ' + progress.error);

    const attempts = await seedAttempts(seedData.attempts);
    if (!attempts.success) throw new Error('Attempts seeding failed: ' + attempts.error);

    console.log('Database seeding completed successfully!');

    return {
      success: true,
      data: {
        users,
        planets,
        stations,
        progress,
        attempts,
      },
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export {
  seedUsers,
  seedPlanets,
  seedStations,
  seedProgress,
  seedAttempts,
};