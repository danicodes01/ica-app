// scripts/seedPlanets.ts
import connectDB from '@/lib/db/mongoose'; // Adjust the path based on where connectDB is located
import mongoose from 'mongoose';
import { Planet } from '@/models/planet';
import { getGamePlanets } from '@/app/_data/planets';

const seedPlanets = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Define canvas dimensions for position calculation
    const width = 1920; // Example canvas width
    const height = 1080; // Example canvas height

    // Transform game planets data into the format required by the database
    const planets = getGamePlanets(width, height).map(planet => ({
      slug: planet.slug,
      name: planet.name,
      order: planet.order,
      type: planet.type,
      drawType: planet.drawType,
      description: planet.description,
      position: {
        x: planet.position.x,
        y: planet.position.y,
        radius: planet.position.radius,
      },
      icon: planet.icon,
      isUnlocked: planet.isUnlocked,
      requiredXP: planet.requiredXP,
      prerequisites: planet.prerequisites,
      isStartingPlanet: planet.isStartingPlanet,
    }));

    console.log('Seeding planets...');

    // Clear existing planet data
    await Planet.deleteMany();
    console.log('Existing planets cleared.');

    // Insert new planets
    await Planet.insertMany(planets);
    console.log('Planets seeded successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    // Disconnect from the database
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
};

// Run the seed script
seedPlanets().catch(error => {
  console.error('Unexpected error:', error);
});
