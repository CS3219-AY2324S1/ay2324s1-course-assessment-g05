import { Request, Response } from "express";
import HttpStatusCode from "../../common/HttpStatusCode";
import { ResetPasswordMail } from "../../lib/email/resetPasswordMail";
import jwt from "jsonwebtoken";
import { UserService } from "../../lib/user_api_helpers";
import db from "../../lib/db";

const verifyUserEmail = async (request: Request, response: Response) => {
  try {
    const email = request.params.email;
    const token = request.params.token;

    if (!email || !token) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Email and token are required.",
      });
      return;
    }

    // verify if token is valid
    const secretKey = process.env.EMAIL_VERIFICATION_SECRET!;

    const decoded = jwt.verify(token, secretKey) as { email: string };

    if (decoded.email !== email) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Email verification failed.",
      });
      return;
    }

    const res = await UserService.updateVerfication(email, token);

    if (res.status !== HttpStatusCode.NO_CONTENT) {
      const data = await res.json();
      response.status(res.status).json({
        error: data.error,
        message: data.message,
      });
      return;
    }

    response.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    response.status(HttpStatusCode.BAD_REQUEST).json({
      error: "BAD REQUEST",
      message: "Email verification failed.",
    });
  }
};

const sendPasswordResetEmail = async (request: Request, response: Response) => {
  try {
    const email = request.params.email;

    if (!email) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Email is required.",
      });
      return;
    }

    // generate verification token for email verification
    const secretKey = process.env.EMAIL_RESET_SECRET!;

    const passwordResetToken = jwt.sign({ email: email }, secretKey);

    const res = await UserService.updatePasswordResetToken(email, {
      passwordResetToken: passwordResetToken,
    });

    if (res.status !== HttpStatusCode.OK) {
      const data = await res.json();
      response.status(res.status).json({
        error: data.error,
        message: data.message,
      });
      return;
    }

    const user = await res.json();

    const mail = new ResetPasswordMail(
      user.id,
      user.email,
      user.passwordResetToken
    );
    await mail.send();

    response.status(HttpStatusCode.NO_CONTENT).json({
      success: true,
    });
  } catch (error) {
    response.status(HttpStatusCode.BAD_REQUEST).json({
      error: "BAD REQUEST",
      message: "Send reset password failed.",
    });
  }
};

const changePassword = async (request: Request, response: Response) => {
  try {
    const userId = request.params.id;

    if (!userId) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "User id is required.",
      });
      return;
    }

    // check no extra properties in the request body
    const receivedProperties = Object.keys(request.body);
    const allowedProperties = ["token", "hashedPassword"];

    const isInvalidProperty = receivedProperties.some(
      (property) => !allowedProperties.includes(property)
    );

    if (isInvalidProperty) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid property in request body.",
      });
      return;
    }

    const token = request.body.token;

    // check if token is missing
    if (!token) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Token is missing in the request body.",
      });
      return;
    }

    // verify if token is valid
    const secretKey = process.env.EMAIL_RESET_SECRET!;

    const decoded = jwt.verify(token, secretKey) as { email: string };

    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        email: true,
      },
    });

    // check if user exists
    if (!user) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `User with id ${userId} cannot be found.`,
      });
      return;
    }

    if (decoded.email !== user.email) {
      //return error
      response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "BAD REQUEST", messsage: "Token is wrong." });
      return;
    }

    const updateBody = {
      password: request.body.hashedPassword,
      passwordResetToken: "",
    };

    const res = await UserService.updatePassword(userId, updateBody);

    if (res.status !== HttpStatusCode.NO_CONTENT) {
      const data = await res.json();
      response.status(res.status).json({
        error: data.error,
        message: data.message,
      });
      return;
    }

    response.status(HttpStatusCode.NO_CONTENT).json({
      success: true,
    });
  } catch (error) {
    response.status(HttpStatusCode.BAD_REQUEST).json({
      error: "BAD REQUEST",
      message: "Change password failed.",
    });
  }
};

export { verifyUserEmail, sendPasswordResetEmail, changePassword };
