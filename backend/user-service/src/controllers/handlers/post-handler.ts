import { Request, Response } from "express";
import { CreateUserValidator } from "../../lib/validators/CreateUserValidator";
import { ZodError } from "zod";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";
import db from "../../lib/db";
import { CreateUserPreferencesValidator } from "../../lib/validators/CreateUserPreferencesValidator";
import { formatErrorMessage } from "../../lib/utils/errorUtils";

export const postUser = async (request: Request, response: Response) => {
  try {
    if (!request.body || Object.keys(request.body).length === 0) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body is missing.",
      });
      return;
    }

    const createUserBody = CreateUserValidator.parse(request.body);

    const inputBodyKeys = Object.keys(request.body).sort();
    const parsedBodyKeys = Object.keys(createUserBody).sort();

    if (JSON.stringify(inputBodyKeys) !== JSON.stringify(parsedBodyKeys)) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid properties in request body.",
      });
      return;
    }

    // check no duplicate email
    const existingUser = await db.user.findFirst({
      where: {
        email: createUserBody.email,
      },
    });

    if (existingUser) {
      response.status(HttpStatusCode.CONFLICT).json({
        error: "CONFLICT",
        message: `User with email ${createUserBody.email} already exists.`,
      });
      return;
    }

    await db.user.create({
      data: createUserBody,
    });

    response.status(HttpStatusCode.CREATED).json({ message: "User created." });
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: formatErrorMessage(error),
      });
      return;
    }
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};

export const postUserPreferences = async (
  request: Request,
  response: Response
) => {
  try {
    const userId = request.params.userId;

    if (!request.body || Object.keys(request.body).length === 0) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body is missing.",
      });
      return;
    }

    const createUserPreferencesBody = CreateUserPreferencesValidator.parse(
      request.body
    );

    const inputBodyKeys = Object.keys(request.body).sort();
    const parsedBodyKeys = Object.keys(createUserPreferencesBody).sort();

    if (JSON.stringify(inputBodyKeys) !== JSON.stringify(parsedBodyKeys)) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid properties in request body.",
      });
      return;
    }

    // check user exists
    const existingUser = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `User with id ${userId} cannot be found.`,
      });
      return;
    }

    // check no duplicate preference exists
    const existingUserPreferences = await db.preferences.findFirst({
      where: {
        userId: userId,
      },
    });

    if (existingUserPreferences) {
      response.status(HttpStatusCode.CONFLICT).json({
        error: "CONFLICT",
        message: `User with id ${userId} already has preferences.`,
      });
      return;
    }

    await db.preferences.create({
      data: { ...createUserPreferencesBody, userId: userId },
    });

    response
      .status(HttpStatusCode.CREATED)
      .json({ message: "User preferences created." });
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: formatErrorMessage(error),
      });
      return;
    }
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};
