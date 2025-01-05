import { model, models } from 'mongoose';
import PlanetSchema from './schema';
import { attachMethods } from './methods';
import { IPlanetDocument, IPlanetModel } from '../../types/models/planet';

attachMethods(PlanetSchema);
export const Planet = models.Planet || model<IPlanetDocument, IPlanetModel>('Planet', PlanetSchema);