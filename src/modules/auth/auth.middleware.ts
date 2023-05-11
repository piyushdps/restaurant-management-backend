import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import ApiError from '../errors/ApiError';
import User from '../user/user.model';
import { roleRights } from '../../config/roles';
import { IUserDoc } from '../user/user.interfaces';

import config from '../../config/config';

const verifyCallback =
  (req: Request, resolve: any, reject: any, requiredRights: string[]) =>
  async (err: Error, user: IUserDoc, info?: string) => {
    if (err) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    if (!user || info) {
      const token = req.cookies.jwt;
      if (!token) return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
      const verifiedTokenDoc = jwt.verify(token, config.jwt.secret);
      const fUser = (await User.findById(verifiedTokenDoc.sub)) as IUserDoc;
      req.user = fUser;
    } else {
      req.user = user;
    }

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      if (!userRights) return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      const hasRequiredRights = requiredRights.every((requiredRight: string) => userRights.includes(requiredRight));
      if (!hasRequiredRights && req.params['userId'] !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }

    resolve();
  };

const authMiddleware =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) =>
    new Promise<void>((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));

export default authMiddleware;
