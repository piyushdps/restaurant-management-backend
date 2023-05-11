import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as restaurantService from './restaurants.service';
import { catchAsync, pick } from '../utils';
import { ApiError } from '../errors';
import { IOptions } from '../paginate/paginate';
import { logger } from '../logger';

export const addRestaurant = catchAsync(async (req: Request, res: Response) => {
  const restaurant = await restaurantService.addRestaurant({
    ...req.body,
    ...(req.user.role === 'admin' && { ownerId: req.user.id }),
  });
  res.status(httpStatus.CREATED).send(restaurant);
});

export const getRestaurant = catchAsync(async (req: Request, res: Response) => {
  const restaurantId = req.params['restaurantId'] ?? undefined;
  if (typeof restaurantId === 'string') {
    const restaurant = await restaurantService.getRestaurantById(new mongoose.Types.ObjectId(restaurantId));
    if (!restaurant) throw new ApiError(httpStatus.NOT_FOUND, 'Restaurant not found');
    res.send(restaurant);
  }
  res.status(httpStatus.FOUND).send();
});

export const getRestaurants = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  logger.info(JSON.stringify(filter));
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const restaurants = await restaurantService.queryRestaurants(filter, options);
  res.send(restaurants);
});

export const getOwnedRestaurants = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const restaurants = await restaurantService.queryRestaurants({ ...filter, ownerId: req.user.id }, options);
  res.send(restaurants);
});

export const updateRestaurant = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['restaurantId'] === 'string') {
    const restaurant = await restaurantService.updateRestaurantById(
      new mongoose.Types.ObjectId(req.params['restaurantId']),
      req.body
    );
    res.send(restaurant);
  }
});

export const deleteRestaurant = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['restaurantId'] === 'string') {
    const restaurant = await restaurantService.deleteRestaurantById(new mongoose.Types.ObjectId(req.params['restaurantId']));
    res.send(restaurant);
  }
});
