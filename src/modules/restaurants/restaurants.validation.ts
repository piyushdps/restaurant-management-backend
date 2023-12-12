import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedRestaurant } from './restaurants.interfaces';

const createRestaurantBody: Record<keyof NewCreatedRestaurant, any> = {
  name: Joi.string().required(),
  contact: Joi.number().less(9999999999).greater(6000000000),
  pinCode: Joi.number().required(),
  logo: Joi.string(),
  address: Joi.string().required(),
};

export const createRestaurant = {
  body: Joi.object().keys(createRestaurantBody),
};

export const getRestaurants = {
  query: Joi.object().keys({
    name: Joi.string(),
    isActive: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getRestaurant = {
  params: Joi.object().keys({
    restaurantId: Joi.string().custom(objectId),
  }),
};

export const updateRestaurant = {
  params: Joi.object().keys({
    restaurantId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      contact: Joi.number().less(9999999999).greater(6000000000),
      pinCode: Joi.number(),
      logo: Joi.string(),
      address: Joi.string(),
    })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
