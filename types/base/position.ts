// types/base/position.ts

import { InteractionTrigger } from "./environment";

export type Point = {
  x: number;
  y: number;
};

export interface Position2D {
  readonly x: number;
  readonly y: number;
}


export type Dimensions = {
  width: number;
  height: number;
};

export interface Position3D extends Position2D {
  readonly radius: number;
}

export interface InteractiveElement {
  readonly id: string;
  readonly position: Position3D;
  readonly type: string;
  readonly trigger: InteractionTrigger;
}

export const isPosition = (value: unknown): value is Position3D => {
  return typeof value === 'object' && value !== null &&
    'x' in value && typeof (value as Position2D).x === 'number' &&
    'y' in value && typeof (value as Position2D).y === 'number';
};

export const isPosition3D = (value: unknown): value is Position3D => {
  return isPosition(value) &&
    'radius' in value && typeof (value as Position3D).radius === 'number';
};