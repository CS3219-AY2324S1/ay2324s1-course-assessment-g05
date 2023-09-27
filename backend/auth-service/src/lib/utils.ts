import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const validatePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

const getJWTSecret = (): string => {
  return process.env.JWT_SECRET || "secret";
};

const issueJWT = (userId: string) => {
  const payload = {
    sub: userId,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, getJWTSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

  return signedToken;
};

export { validatePassword, getJWTSecret, issueJWT };

//fe login -> auth returns token -> fe stores token in cookie -> use next middleware to call auth verify route before every route (temp sol) -> if verified, call next() -> if not verified, redirect to login
