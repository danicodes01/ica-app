// File: models/user/index.ts
import { model, models } from 'mongoose';
import UserSchema from './schema';
import { attachMethods } from './methods';
import { IUserDocument, IUserModel } from '@/types/models';

attachMethods(UserSchema);

export const User = models.User || model<IUserDocument, IUserModel>('User', UserSchema);