import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import { seedPlanets } from '@/lib/seed/planetSeeder';
import { seedStations } from '@/lib/seed/stationSeeder';
import { seedUsers } from '@/lib/seed/userSeeder';
import { seedProgress } from '@/lib/seed/progressSeeder';
import { seedAttempts } from '@/lib/seed/attemptSeeder';
import { seedData } from '../data';
import mongoose from 'mongoose';

interface SeedResult {
  success: boolean;
  error?: string;
}

async function handleSeedOperation<T extends SeedResult>(
  operation: () => Promise<T>,
  errorMessage: string
): Promise<T> {
  const result = await operation();
  if (!result.success) {
    throw new Error(result.error || errorMessage);
  }
  return result;
}

export async function POST() {
  try {
    await connectDB();
    console.log('Starting seeding process...');

    // Drop all collections first
    console.log('Dropping existing collections...');
    await Promise.all([
      mongoose.connection.dropCollection('users'),
      mongoose.connection.dropCollection('planets'),
      mongoose.connection.dropCollection('stations'),
      mongoose.connection.dropCollection('progress'),
      mongoose.connection.dropCollection('attempts')
    ]).catch(err => {
      // Ignore collection doesn't exist errors
      console.log(err, 'Some collections may not exist yet, continuing...');
    });

    const results = await Promise.all([
      handleSeedOperation(
        () => seedUsers(seedData.users),
        'User seeding failed'
      ),
      handleSeedOperation(
        () => seedPlanets(seedData.planets),
        'Planet seeding failed'
      ),
      handleSeedOperation(
        () => seedStations(seedData.stations),
        'Station seeding failed'
      ),
      handleSeedOperation(
        () => seedProgress(seedData.progress),
        'Progress seeding failed'
      ),
      handleSeedOperation(
        () => seedAttempts(seedData.attempts),
        'Attempts seeding failed'
      )
    ]);


    const [userResult, planetResult, stationResult, progressResult, attemptResult] = results;

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        users: userResult.users?.length || 0,
        planets: planetResult.planets?.length || 0,
        stations: stationResult.stations?.length || 0,
        progress: progressResult.progress?.length || 0,
        attempts: attemptResult.attempts?.length || 0
      }
    });

  } catch (error) {
    console.error('Error in seed route:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during seeding'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    
    const [userCount, planetCount, stationCount, progressCount, attemptCount] = await Promise.all([
      mongoose.models.User.countDocuments(),
      mongoose.models.Planet.countDocuments(),
      mongoose.models.Station.countDocuments(),
      mongoose.models.Progress.countDocuments(),
      mongoose.models.Attempt.countDocuments()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users: userCount,
        planets: planetCount,
        stations: stationCount,
        progress: progressCount,
        attempts: attemptCount
      }
    });

  } catch (error) {
    console.error('Error checking seed status:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred checking seed status'
      },
      { status: 500 }
    );
  }
}