import mongoose, { Model, Document } from 'mongoose';
import { QueryResult } from '../paginate/paginate';

export interface IMenu {
  restaurantId: mongoose.Types.ObjectId;
  isActive: boolean;
  name: string;
}
export interface IMenuDoc extends IMenu, Document {}

export interface IMenuModel extends Model<IMenuDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type NewCreatedMenu = IMenu;
