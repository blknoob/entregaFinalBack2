import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import UsersRepository from "../../repositories/users.repository.js";

const { JWT_SECRET } = process.env;

function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
}

export const initializePassport = () => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        secretOrKey: JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      },
      async (payload, done) => {
        try {
          const usersRepository = new UsersRepository();
          const user = await usersRepository.findById(payload._id);
          if (!user) return done(null, false);
          return done(null, user, payload);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const usersRepository = new UsersRepository();
      const user = await usersRepository.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
