import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserProfile } from "../common/types";

const validatePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

const getJWTSecret = (): string => {
  return process.env.JWT_SECRET || "secret";
};

const getServiceSecret = (): string => {
  return process.env.SERVICE_SECRET || "secret";
};

const issueJWT = (userId: string) => {
  const payload = {
    sub: userId,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, getJWTSecret());

  return signedToken;
};

export { validatePassword, getJWTSecret, getServiceSecret, issueJWT };
