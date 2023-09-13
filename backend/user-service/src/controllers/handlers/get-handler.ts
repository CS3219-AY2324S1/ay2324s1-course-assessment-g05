import { Request, Response } from "express";
import HttpStatusCode from "../../lib/HttpStatusCode";

import { UserProfile } from "../../models/user";
import { convertStringToRole } from "../../lib/enums/Role";
import { db } from "../../lib/db";
import { convertStringToGender } from "../../lib/enums/Gender";

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

    const userProfile: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: convertStringToRole(user.role),

      image: user.image ? user.image : undefined,
      bio: user.bio ? user.bio : undefined,
      gender: user.gender ? convertStringToGender(user.gender) : undefined,
    };

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
    const email = request.params.email;

    // query database for user with email
    const user = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `User with email ${email} cannot be found.`,
      });
      return;
    }

    const userProfile: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: convertStringToRole(user.role),

      image: user.image ? user.image : undefined,
      bio: user.bio ? user.bio : undefined,
      gender: user.gender ? convertStringToGender(user.gender) : undefined,
    };

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
