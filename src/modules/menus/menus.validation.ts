import Joi from 'joi';
import { objectId } from '../validate/custom.validation';
import { NewCreatedMenu } from './menus.interfaces';

const createMenuBody: Record<keyof NewCreatedMenu, any> = {
  name: Joi.string().required(),
  restaurantId: Joi.string().custom(objectId).required(),
  isActive: Joi.boolean(),
};

export const createMenu = {
  body: Joi.object().keys(createMenuBody),
};

export const getMenus = {
  query: Joi.object().keys({
    name: Joi.string(),
    isActive: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getMenu = {
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
    })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
