import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ApiError } from '../errors';
import { IRestaurantDoc, NewCreatedRestaurant, UpdateRestaurantBody } from './restaurants.interfaces';
import Restaurants from './restaurants.model';
import { IOptions, QueryResult } from '../paginate/paginate';

/**
 * Add new restaurant
 * @param {NewCreatedRestaurant} restaurantBody
 * @returns {Promise<IUserDoc>}
 */
export const addRestaurant = async (restaurantBody: NewCreatedRestaurant): Promise<IRestaurantDoc> => {
  if (await Restaurants.isContactTaken(restaurantBody.contact)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contact already taken');
  }
  return Restaurants.create(restaurantBody);
};

/**
 * Query for Restaurants
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryRestaurants = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const restaurants = await Restaurants.paginate(filter, options);
  return restaurants;
};

/**
 * Get restaurants by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IRestaurantDoc | null>}
 */
export const getRestaurantById = async (id: mongoose.Types.ObjectId): Promise<IRestaurantDoc | null> =>
  Restaurants.findById(id);

/**
 * Get restaurant by contact
 * @param {number} contact
 * @returns {Promise<IRestaurantDoc | null>}
 */
export const getRestaurantByContact = async (contact: string): Promise<IRestaurantDoc | null> =>
  Restaurants.findOne({ contact });

/**
 * Update restaurant by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateRestaurantBody} updateBody
 * @returns {Promise<IRestaurantDoc | null>}
 */
export const updateRestaurantById = async (
  restaurantId: mongoose.Types.ObjectId,
  updateBody: UpdateRestaurantBody
): Promise<IRestaurantDoc | null> => {
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
  }
  if (updateBody.contact && (await Restaurants.isContactTaken(updateBody.contact, restaurantId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Contact already taken');
  }
  Object.assign(restaurant, updateBody);
  await restaurant.save();
  return restaurant;
};

/**
 * Delete restaurant by id
 * @param {mongoose.Types.ObjectId} restaurantId
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteRestaurantById = async (restaurantId: mongoose.Types.ObjectId): Promise<IRestaurantDoc | null> => {
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'restaurant not found');
  }
  await restaurant.deleteOne();
  return restaurant;
};
