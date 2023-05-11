import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IRestaurant {
  name: string;
  contact: number;
  pinCode: number;
  isActive: boolean;
  ownerId: mongoose.Types.ObjectId;
}
export interface IRestaurantDoc extends IRestaurant, Document {}

export interface IRestaurantModel extends Model<IRestaurantDoc> {
  isContactTaken(contact: number, excludeUserIds?: mongoose.Types.ObjectId): Promise<boolean>;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type NewCreatedRestaurant = Omit<IRestaurant, 'isActive' | 'ownerId'>;

export type UpdateRestaurantBody = Partial<IRestaurant>;
