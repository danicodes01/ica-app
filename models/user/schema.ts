// models/user/schema.ts

import { Schema } from 'mongoose';
import { IUserDocument } from '@/types/models';

const UserSchema = new Schema<IUserDocument>(
  {
    email: {type: String,required: true,unique: true },
    name: {type: String,required: true },
    emailVerified: Date,
    image: String,
    password: { type: String, required: true, select: false },
    totalXP: { type: Number, default: 0 },
    totalCurrency: { type: Number, default: 0},
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
UserSchema.index({ totalXP: 1 });

// Virtuals
UserSchema.virtual('level').get(function() {
  return Math.floor(this.totalXP / 1000) + 1;
});


export default UserSchema;