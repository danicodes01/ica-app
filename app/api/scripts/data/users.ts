import { IUserDocument } from '@/types/models';

export const users: Partial<IUserDocument>[] = [
  {
    email: "user@gmail.com",
    name: "User",
    password: "password123",
    emailVerified: new Date(),
    totalXP: 0,
    totalCurrency: 0
  }
];

export default users;