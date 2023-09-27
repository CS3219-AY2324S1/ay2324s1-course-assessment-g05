import { Request, Response } from "express";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";
import db, { client_s3 } from "../../lib/db";
import { EmailValidator } from "../../lib/validators/EmailValidator";
import { ZodError } from "zod";
import { GetObjectRequest } from "aws-sdk/clients/s3";

export const getHealth = async (_: Request, response: Response) => {
  try {
    if (typeof db.$disconnect !== "function") {
      throw new Error("No database connection from the server.");
    }
    response.status(HttpStatusCode.OK).json({ message: "Healthy" });
  } catch (error) {
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "No database connection from the server.",
    });
  }
};

export const getUserById = async (request: Request, response: Response) => {
  try {
    const userId = request.params.userId;
    // query database for user with id
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        preferences: {
          select: {
            languages: true,
            topics: true,
            difficulties: true,
          },
        },
      },
    });

    if (!user) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `User with id ${userId} cannot be found.`,
      });
      return;
    }

    response.status(HttpStatusCode.OK).json(user);
  } catch (error) {
    // log the error
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};

export const getUserByEmail = async (request: Request, response: Response) => {
  try {
    const email = request.query.email as string;

    if (!email) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Email is missing in the query parameter.",
      });
      return;
    }

    const parsedEmail = EmailValidator.parse(email);

    // query database for user with email
    const user = await db.user.findFirst({
      where: {
        email: parsedEmail,
      },
      include: {
        preferences: {
          select: {
            languages: true,
            topics: true,
            difficulties: true,
          },
        },
      },
    });

    if (!user) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `User with email ${email} cannot be found.`,
      });
      return;
    }

    response.status(HttpStatusCode.OK).json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid input email.",
      });
      return;
    }
    // log the error
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};

export const getPreferencesByUserId = async (
  request: Request,
  response: Response
) => {
  try {
    const userId = request.params.userId;

    // query database for user preferences with the given user id
    const preferences = await db.preferences.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!preferences) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `Preferences for user with id ${userId} cannot be found. It is either the user does not exist or the user has not set preferences yet.`,
      });
      return;
    }

    response.status(HttpStatusCode.OK).json(preferences);
  } catch (error) {
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};

export const getImage = async (
  request: Request,
  response: Response
) => {
  const { userId, fileName } = request.params;

  try {

    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/users/${userId}/image/${fileName}`

    console.log(url);

    response.status(HttpStatusCode.OK).json({ 
      ok: true, 
      url: url 
    });
        

    // TODO
  } catch (error) {
    console.log(error)
    response.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({
      ok: false,
      error: error,
      message: `Request with file named: ${fileName}`,
    });
  }
}
