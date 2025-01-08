// models/user/methods.ts

import { Schema } from 'mongoose';
import { IUserDocument, IUserModel } from '@/types/models';
// import bcrypt from 'bcryptjs'

// Helper functions

// const instanceMethods = {

//   verifyPassword: async function(this: IUserDocument, candidatePassword: string): Promise<boolean> {
//     try {
//       // Explicitly type the userWithPassword
//       const userWithPassword = await this.model('User')
//         .findById(this._id)
//         .select('+password')
//         .lean() as (IUserDocument & { password: string }) | null;
  
//       if (!userWithPassword?.password) {
//         return false;
//       }
  
//       return bcrypt.compare(candidatePassword, userWithPassword.password);
//     } catch (error) {
//       console.error('Password verification error:', error);
//       return false;
//     }
//   },
// }


const staticMethods = {
  async findByEmail(this: IUserModel, email: string): Promise<IUserDocument | null> {
    return this.findOne({ email });
  },

};

export const attachMethods = (schema: Schema<IUserDocument, IUserModel>): void => {
  // schema.methods = { ...schema.methods, ...instanceMethods };
  schema.statics = { ...schema.statics, ...staticMethods };
};