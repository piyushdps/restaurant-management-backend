// @ts-ignore
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
// import { Request } from 'express';
import config from '../../config/config';
import User from '../user/user.model';
import { tokenTypes } from '../token';
// import { logger } from '../logger';

// const tokenExtract = (req: Request) => {
//   logger.info(JSON.stringify(req.headers));
//   return () => ExtractJwt.fromAuthHeaderAsBearerToken();
// };

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // jwtFromRequest: tokenExtract as unknown as JwtFromRequestFunction,
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
