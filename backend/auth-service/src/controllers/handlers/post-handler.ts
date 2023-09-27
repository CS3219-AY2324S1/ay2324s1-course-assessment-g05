import { Request, Response } from "express";
import HttpStatusCode from "../../common/HttpStatusCode";
import { createUser, getUserByEmail } from "../../lib/user_api_helpers";
import { getJWTSecret, issueJWT, validatePassword } from "../../lib/utils";
import { UserProfile } from "../../common/types";
import jwt from "jsonwebtoken";

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
  response
    .cookie("jwt", tokenObject, { httpOnly: true, secure: false })
    .status(HttpStatusCode.OK)
    .json({
      success: true,
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
    response
      .cookie("jwt", tokenObject, { httpOnly: true, secure: false })
      .status(HttpStatusCode.OK)
      .json({
        success: true,
        user: user,
      });
    return;
  }
  response.status(HttpStatusCode.UNAUTHORIZED).json({
    error: "UNAUTHORIZED",
    message: `Incorrect password.`,
  });
};

export const logOut = async (request: Request, response: Response) => {
  response.clearCookie("jwt");
  response.redirect(process.env.CLIENT_URL || "http://localhost:3000");
};
