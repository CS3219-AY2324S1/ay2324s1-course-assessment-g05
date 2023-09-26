import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { PassportStatic } from "passport";
import { getJWTSecret, getUserServiceEndpoint } from "../lib/utils";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: getJWTSecret(),
};

interface JwtPayload {
  sub: string;
  iat: number;
  userId: string;
}

const authenticateWithJWT = async (jwt_payload: JwtPayload) => {
  const response = await fetch(
    `${getUserServiceEndpoint()}/api/users/${jwt_payload.userId}`
  );
  // query database for user with id
  // if user exists, return user
  // else return false
  return false;
};

const getEmailJwtStrategy = (): JwtStrategy => {
  return new JwtStrategy(options, (jwt_payload, done) => {
    authenticateWithJWT(jwt_payload);
  });
};

export { getEmailJwtStrategy };
