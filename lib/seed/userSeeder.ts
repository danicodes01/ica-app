import mongoose from 'mongoose';
import { IUserDocument } from '@/types/models';
import UserSchema from '@/models/user/schema';
import bcrypt from 'bcryptjs';

export interface SeedUserResult {
  success: boolean;
  users?: IUserDocument[];
  error?: string;
}

interface UnvalidatedUser {
  email?: string;
  name?: string;
  password?: string;
  emailVerified?: Date;
  totalXP?: number;
  totalCurrency?: number;
}

// Get User model safely - prevents model recompilation error
const getUserModel = () => {
  try {
    return mongoose.model<IUserDocument>('User');
  } catch {
    return mongoose.model<IUserDocument>('User', UserSchema);
  }
};

const validateUser = (user: UnvalidatedUser): user is IUserDocument => {
  try {
    if (!user.email || !user.name || !user.password) {
      console.error('Validation failed for user:', { email: user.email, name: user.name });
      throw new Error('Missing required fields: email, name, or password');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      console.error('Invalid email format for:', user.email);
      throw new Error('Invalid email format');
    }

    if (user.password.length < 6) {  // Fixed to match error message
      console.error('Password too short for user:', user.email);
      throw new Error('Password must be at least 6 characters');
    }

    return true;
  } catch (error) {
    console.error('User validation error:', error);
    return false;
  }
};

export async function seedUsers(usersData: UnvalidatedUser[]): Promise<SeedUserResult> {
  const User = getUserModel();
  
  try {
    // Log total users being processed
    console.log(`Processing ${usersData.length} users for seeding`);

    const validUsers = usersData.filter((user) => {
      const isValid = validateUser(user);
      if (!isValid) {
        console.error('Invalid user data:', {
          email: user.email,
          nameProvided: !!user.name,
          passwordLength: user.password?.length
        });
      }
      return isValid;
    });

    if (validUsers.length !== usersData.length) {
      const failedCount = usersData.length - validUsers.length;
      console.error(`Validation failed for ${failedCount} users`);
      throw new Error(`${failedCount} users failed validation`);
    }

    // Clear existing users
    console.log('Clearing existing users...');
    await User.deleteMany({});

    // Insert new users
    const insertedUsers: IUserDocument[] = [];
    for (const userData of validUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = new User({
        ...userData,
        password: hashedPassword,
        totalXP: userData.totalXP || 0,
        totalCurrency: userData.totalCurrency || 0
      });

      await user.save();
      insertedUsers.push(user);
    }

    console.log(`Successfully seeded ${insertedUsers.length} users`);
    return {
      success: true,
      users: insertedUsers
    };

  } catch (error) {
    console.error('Error seeding users:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}