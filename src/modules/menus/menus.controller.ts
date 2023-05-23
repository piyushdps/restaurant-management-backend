import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as menuService from './menus.service';
import { catchAsync, pick } from '../utils';
import { ApiError } from '../errors';
import { IOptions } from '../paginate/paginate';
import { logger } from '../logger';

export const addMenu = catchAsync(async (req: Request, res: Response) => {
  const menu = await menuService.addMenu({
    ...req.body,
    ...(req.user.role === 'admin' && { ownerId: req.user.id }),
  });
  res.status(httpStatus.CREATED).send(menu);
});

export const getMenu = catchAsync(async (req: Request, res: Response) => {
  const menuId = req.params['menuId'] ?? undefined;
  if (typeof menuId === 'string') {
    const menu = await menuService.getMenuById(new mongoose.Types.ObjectId(menuId));
    if (!menu) throw new ApiError(httpStatus.NOT_FOUND, 'Menu not found');
    res.send(menu);
  }
  res.status(httpStatus.FOUND).send();
});

export const getMenus = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  logger.info(JSON.stringify(filter));
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const menus = await menuService.queryMenu(filter, options);
  res.send(menus);
});

export const getOwnMenus = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['name', 'role']);
  const options: IOptions = pick(req.query, ['sortBy', 'limit', 'page', 'projectBy']);
  const menus = await menuService.queryMenu({ ...filter, ownerId: req.user.id }, options);
  res.send(menus);
});

export const updateMenu = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['menuId'] === 'string') {
    const menu = await menuService.updateMenuById(new mongoose.Types.ObjectId(req.params['menuId']), req.body);
    res.send(menu);
  }
});

export const deleteMenu = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params['menuId'] === 'string') {
    const menu = await menuService.deleteMenuById(new mongoose.Types.ObjectId(req.params['menuId']));
    res.send(menu);
  }
});
