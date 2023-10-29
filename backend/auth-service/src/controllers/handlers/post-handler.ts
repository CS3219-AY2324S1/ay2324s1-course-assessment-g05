import { Request, Response } from "express";
import HttpStatusCode from "../../common/HttpStatusCode";
import { UserService } from "../../lib/user_api_helpers";
import { issueJWT, validatePassword } from "../../lib/utils";
import { UserProfile } from "../../common/types";
import { VerificationMail } from "../../lib/email/verificationMail";
import db from "../../lib/db";

const registerByEmail = async (request: Request, response: Response) => {
  try {
    const res = await UserService.createUser(request.body);

    if (res.status !== HttpStatusCode.CREATED) {
      const data = await res.json();
      response.status(res.status).json({
        error: data.error,
        message: data.message,
      });
      return;
    }

    const user = await res.json();

    // TODO: instead of getting verificationToken, generate here
    const mail = new VerificationMail(user.email, user.verificationToken);
    await mail.send();

    response.status(HttpStatusCode.CREATED).json({
      success: true,
      userId: user.id,
    });
  } catch (error) {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "User service is down.",
    });
  }
};

const logInByEmail = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Email and password are required",
      });
      return;
    }

    const user = (await db.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        isVerified: true,
        role: true,
        gender: true,
        bio: true,
        image: true,
        createdOn: true,
        updatedOn: true,
      },
    })) as UserProfile;

    if (!user) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `User with email ${email} cannot be found`,
      });
      return;
    }

    // check if user is verified
    if (!user.isVerified) {
      response.status(HttpStatusCode.FORBIDDEN).json({
        error: "FORBIDDEN",
        message: `User is not verified`,
      });
      return;
    }

    // if user exists, check if password is correct
    if (!(await validatePassword(password, user.password))) {
      response.status(HttpStatusCode.UNAUTHORIZED).json({
        error: "UNAUTHORIZED",
        message: `The user credentials are incorrect`,
      });
      return;
    }

    //user exists + pw is correct + user is verified -> attach cookie and return user
    const tokenObject = issueJWT(user);

    response
      .cookie("jwt", tokenObject, { httpOnly: true, secure: false })
      .status(HttpStatusCode.OK)
      .json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          gender: user.gender,
          bio: user.bio,
          image: user.image,
          createdOn: user.createdOn,
          updatedOn: user.updatedOn,
          isVerified: user.isVerified,
        },
      });
  } catch (error) {
    console.log(error);
  }
};

const logOut = async (_: Request, response: Response) => {
  response.clearCookie("jwt");
  response.status(HttpStatusCode.OK).json({
    success: true,
  });
};

export { registerByEmail, logInByEmail, logOut };
