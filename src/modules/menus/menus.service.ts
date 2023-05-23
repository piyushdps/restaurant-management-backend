import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ApiError } from '../errors';

import { IOptions, QueryResult } from '../paginate/paginate';
import { IMenu, IMenuDoc, NewCreatedMenu } from './menus.interfaces';
import Menus from './menus.models';

/**
 * Add new menu
 * @param {NewCreatedRestaurant} restaurantBody
 * @returns {Promise<IUserDoc>}
 */
export const addMenu = async (menuBody: NewCreatedMenu): Promise<IMenuDoc> => {
  return Menus.create(menuBody);
};

/**
 * Query for Menus
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryMenu = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const menus = await Menus.paginate(filter, options);
  return menus;
};

/**
 * Get restaurants by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IRestaurantDoc | null>}
 */
export const getMenuById = async (id: mongoose.Types.ObjectId): Promise<IMenuDoc | null> => Menus.findById(id);

/**
 * Update restaurant by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateRestaurantBody} updateBody
 * @returns {Promise<IRestaurantDoc | null>}
 */
export const updateMenuById = async (menuId: mongoose.Types.ObjectId, menuBody: IMenu): Promise<IMenuDoc | null> => {
  const menu = await getMenuById(menuId);
  if (!menu) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Menu not found');
  }
  Object.assign(menu, menuBody);
  await menu.save();
  return menu;
};

/**
 * Delete restaurant by id
 * @param {mongoose.Types.ObjectId} restaurantId
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteMenuById = async (menuId: mongoose.Types.ObjectId): Promise<IMenuDoc | null> => {
  const menu = await getMenuById(menuId);
  if (!menu) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Menu not found');
  }
  await menu.deleteOne();
  return menu;
};
