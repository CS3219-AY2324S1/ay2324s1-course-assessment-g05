import { Request, Response } from "express";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";
import { UpdateUserValidator } from "../../lib/validators/UpdateUserValidator";
import db from "../../lib/db";
import { ZodError } from "zod";

export const updateUserById = async (request: Request, response: Response) => {
  try {
    const userId = request.params.userId;

    if (!request.body || Object.keys(request.body).length === 0) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body is missing.",
      });
      return;
    }

    const updateUserBody = UpdateUserValidator.parse(request.body);

    const inputBodyKeys = Object.keys(request.body).sort();
    const parsedBodyKeys = Object.keys(updateUserBody).sort();

    if (JSON.stringify(inputBodyKeys) !== JSON.stringify(parsedBodyKeys)) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid properties in request body.",
      });
      return;
    }

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

    const existingUserWithSameEmail = await db.user.findFirst({
      where: {
        id: { not: userId },
        email: updateUserBody.email,
      },
    });

    if (existingUserWithSameEmail) {
      response.status(HttpStatusCode.CONFLICT).json({
        error: "CONFLICT",
        message: `User with email ${updateUserBody.email} already exists.`,
      });
      return;
    }

    await db.user.update({
      where: {
        id: userId,
      },
      data: updateUserBody,
    });

    response.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error.message);
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid input request body.",
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
