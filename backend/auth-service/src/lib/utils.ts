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
  const expiresIn = "1d";
  const payload = {
    sub: userId,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, getJWTSecret(), {
    expiresIn: expiresIn,
  });

  //needs to be stored in localStorage
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
};

export { validatePassword, getJWTSecret, issueJWT };

//fe login -> auth returns token -> fe stores token in localstorage -> use next middleware to call auth verify route before every route (temp sol) -> if verified, call next() -> if not verified, redirect to login
