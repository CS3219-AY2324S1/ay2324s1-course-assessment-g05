import { Request, Response } from "express";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";

import { UserProfile } from "../../models/types/user";
import { convertStringToRole } from "../../lib/enums/Role";
import db from "../../lib/db";
import { convertStringToGender } from "../../lib/enums/Gender";
import { EmailValidator } from "../../lib/validators/EmailValidator";
import { ZodError } from "zod";

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
    });

    if (!user) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `User with id ${userId} cannot be found.`,
      });
      return;
    }

    const userProfile = parseDbUserToUserProfile(user);

    response.status(HttpStatusCode.OK).json(userProfile);
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
    });

    if (!user) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `User with email ${email} cannot be found.`,
      });
      return;
    }

    const userProfile: UserProfile = parseDbUserToUserProfile(user);

    response.status(HttpStatusCode.OK).json(userProfile);
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

function parseDbUserToUserProfile(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  bio: string | null;
  gender: string | null;
  createdOn: Date;
  updatedOn: Date;
}): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: convertStringToRole(user.role),
    gender: user.gender ? convertStringToGender(user.gender) : undefined,
    image: user.image || undefined,
    bio: user.bio || undefined,
    createdOn: user.createdOn,
    updatedOn: user.updatedOn,
  };
}
