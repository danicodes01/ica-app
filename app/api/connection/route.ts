import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";

export async function GET() {
  try {
    await connectDB(); // Use your Mongoose connection utility
    return NextResponse.json({ success: true, message: "Connected to MongoDB" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, message: "Failed to connect to MongoDB", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to connect to MongoDB", error: "Unknown error" },
        { status: 500 }
      );
    }
  }
}