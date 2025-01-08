import { Schema } from 'mongoose';
import { IPlanetDocument } from '@/types/models';
import { getRelativePosition } from '@/utils/helper'; // Assuming you have this utility function

// Instance Methods
const instanceMethods = {
  computePosition: function (
    this: IPlanetDocument,
    width: number,
    height: number,
    percentX: number,
    percentY: number
  ): { x: number; y: number; radius: number } {
    return getRelativePosition(width, height, percentX, percentY);
  },
};

// Attach Methods
export const attachMethods = (schema: Schema<IPlanetDocument>): void => {
  schema.methods = { ...schema.methods, ...instanceMethods };
};
