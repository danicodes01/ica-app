import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';
import {Planet} from '@/models/planet';

export async function GET() {
  try {
    await connectDB();
    const planets = await Planet.find({}).lean();
    
    return NextResponse.json({
      success: true,
      planets
    });
  } catch (error) {
    console.error('Error fetching planets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch planets' },
      { status: 500 }
    );
  }
}


// // app/api/planets/route.ts
// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/db/mongoose';
// import { Planet } from '@/models/planet';

// export async function GET() {
//   try {
//     await connectDB();
//     const planets = await Planet.find().lean();
//     return NextResponse.json(planets);
//   } catch (error) {
//     console.error('Error fetching planets:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch planets' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     await connectDB();
//     const body = await request.json();
//     const planet = await Planet.create(body);
//     return NextResponse.json(planet);
//   } catch (error) {
//     console.error('Error creating planet:', error);
//     return NextResponse.json(
//       { error: 'Failed to create planet' },
//       { status: 500 }
//     );
//   }
// }