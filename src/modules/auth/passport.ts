// @ts-ignore
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Request } from 'express';
import config from '../../config/config';
import User from '../user/user.model';
import { tokenTypes } from '../token';

const cookieExtractor = (req: Request) => {
  let jwt = null;
  if (req && req.cookies) {
    jwt = req.cookies.jwt;
  }
  return jwt;
};
const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: cookieExtractor,
    secretOrKey: config.jwt.secret,
  },
  async (payload, done) => {
    try {
      if (payload.type !== tokenTypes.ACCESS) {
        throw new Error('Invalid token type');
      }
      const user = await User.findById(payload.sub);

      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

export default jwtStrategy;
