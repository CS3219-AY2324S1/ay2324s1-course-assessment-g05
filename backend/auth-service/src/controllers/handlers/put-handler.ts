import { Request, Response } from "express";
import HttpStatusCode from "../../common/HttpStatusCode";
import { ResetPasswordMail } from "../../lib/email/resetPasswordMail";
import jwt from "jsonwebtoken";
import { UserService } from "../../lib/user_api_helpers";
import db from "../../lib/db";
import bcrypt from "bcrypt";
import { validatePasswordResetToken } from "../../lib/utils";

const verifyUserEmail = async (request: Request, response: Response) => {
  try {
    const email = request.params.email;
    const token = request.params.token;

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

    // query database for user email
    const user = await db.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `User with email ${email} cannot be found.`,
      });
      return;
    }

    const res = await UserService.updateVerification(user.id);

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

    // query database for user email
    const user = await db.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `User with email ${email} cannot be found.`,
      });
      return;
    }

    // generate verification token for email verification
    const secretKey = process.env.EMAIL_RESET_SECRET!;

    const passwordResetToken = jwt.sign({ email: email }, secretKey);

    const res = await UserService.updatePasswordResetToken(
      user.id,
      passwordResetToken
    );

    if (res.status !== HttpStatusCode.NO_CONTENT) {
      const data = await res.json();
      response.status(res.status).json({
        error: data.error,
        message: data.message,
      });
      return;
    }

    const mail = new ResetPasswordMail(user.id, email, passwordResetToken);
    await mail.send();

    response.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "Send reset password failed.",
    });
  }
};

const changePassword = async (request: Request, response: Response) => {
  try {
    const userId = request.params.id;

    // check no extra properties in the request body
    const receivedProperties = Object.keys(request.body);
    const allowedProperties = ["token", "oldPassword", "hashedNewPassword"];

    const hasExtraProperty = receivedProperties.some(
      (property) => !allowedProperties.includes(property)
    );

    if (hasExtraProperty) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid property.",
      });
      return;
    }

    const { token, oldPassword, hashedNewPassword } = request.body;

    if (!token && !oldPassword) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Token or password is required.",
      });
      return;
    }

    // if token is not provided, this is a request to change password
    if (!token) {
      const user = await db.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          password: true,
        },
      });

      if (!user) {
        response.status(HttpStatusCode.NOT_FOUND).json({
          error: "NOT FOUND",
          message: `User with id ${userId} cannot be found.`,
        });
        return;
      }

      const isCorrectPassword = await bcrypt.compare(
        oldPassword,
        user.password
      );

      if (!isCorrectPassword) {
        response.status(HttpStatusCode.FORBIDDEN).json({
          error: "FORBIDDEN",
          message: "You don't have the permission to change password",
        });
        return;
      }

      const updateBody = {
        password: hashedNewPassword,
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
      return;
    }

    // it token is provided, this is a request to reset password from email
    const isTokenValid = await validatePasswordResetToken(token, userId);
    if (!isTokenValid) {
      response.status(HttpStatusCode.FORBIDDEN).json({
        error: "FORBIDDEN",
        message: "This reset password link is invalid.",
      });
      return;
    }

    const updateBody = {
      password: hashedNewPassword,
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

    response.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    response.status(HttpStatusCode.BAD_REQUEST).json({
      error: "BAD REQUEST",
      message: "Change password failed.",
    });
  }
};

export { verifyUserEmail, sendPasswordResetEmail, changePassword };
