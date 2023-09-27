import { Request, Response } from "express";
import HttpStatusCode from "../../common/HttpStatusCode";
import { createUser, getUserByEmail } from "../../lib/user_api_helpers";
import { issueJWT, validatePassword } from "../../lib/utils";
import { UserProfile } from "../../common/types";

export const registerByEmail = async (request: Request, response: Response) => {
  const res = await createUser(request.body);
  if (res.status !== HttpStatusCode.CREATED) {
    const data = await res.json();
    response.status(res.status).json({
      error: data.error,
      message: data.message,
    });
    return;
  }

  const user = await res.json();
  const tokenObject = issueJWT(user.id);
  response.status(HttpStatusCode.OK).json({
    success: true,
    token: tokenObject.token,
    expiresIn: tokenObject.expires,
    userId: user.id,
  });
};

export const logInByEmail = async (request: Request, response: Response) => {
  const { email, password } = request.body;

  //check if user exists
  const res = await getUserByEmail(email);
  if (res.status !== HttpStatusCode.OK) {
    const data = await res.json();
    response.status(res.status).json({
      error: data.error,
      message: data.message,
    });
    return;
  }
  //if user exists, check if password is correct
  const user = (await res.json()) as UserProfile;
  if (await validatePassword(password, user.password)) {
    //if password is correct, return jwt and user
    const tokenObject = issueJWT(user.id);
    response.status(HttpStatusCode.OK).json({
      success: true,
      token: tokenObject.token,
      expiresIn: tokenObject.expires,
      user: user,
    });
    return;
  }
  response.status(HttpStatusCode.UNAUTHORIZED).json({
    error: "UNAUTHORIZED",
    message: `Incorrect password.`,
  });
};
