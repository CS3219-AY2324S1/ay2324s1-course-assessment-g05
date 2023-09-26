import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//consider moving this to frontend
const saltRounds = 10;
const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};

const validatePassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

const getJWTSecret = (): string => {
  return process.env.JWT_SECRET || "secret";
};

const getUserServiceEndpoint = (): string => {
  return process.env.USER_SERVICE_ENDPOINT || "http://localhost:5005";
};

const issueJWT = (userId: number) => {
  const expiresIn = "1d";
  const payload = {
    sub: userId,
    iat: Date.now(),
    userId: userId,
  };

  const signedToken = jwt.sign(payload, getJWTSecret(), {
    expiresIn: expiresIn,
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
};

export { validatePassword, getJWTSecret, getUserServiceEndpoint, issueJWT };
