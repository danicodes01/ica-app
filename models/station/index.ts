import { model, models } from 'mongoose';
import StationSchema from './schema';
import { attachMethods } from './methods';
import { IStationDocument, IStationModel } from '../../types/models/station';

attachMethods(StationSchema);

export const Station = 
  models.Station || model<IStationDocument, IStationModel>('Station', StationSchema);