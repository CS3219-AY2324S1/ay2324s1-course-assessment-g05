import { Request, Response } from "express";
import { CreateUserValidator } from "../../lib/validators/CreateUserValidator";
import { ZodError } from "zod";
import HttpStatusCode from "../../lib/HttpStatusCode";
import { convertStringToRole } from "../../lib/enums/Role";
import { db } from "../../lib/db";

export const postUser = async (request: Request, response: Response) => {
  try {
    const createUserBody = CreateUserValidator.parse(request.body);

    const inputBodyKeys = Object.keys(request.body).sort();
    const parsedBodyKeys = Object.keys(createUserBody).sort();

    if (JSON.stringify(inputBodyKeys) !== JSON.stringify(parsedBodyKeys)) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid properties in request body.",
      });
    }

    // check no duplicate email
    const existingUser = await db.user.findFirst({
      where: {
        email: createUserBody.email,
      },
    });

    if (existingUser) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: `User with email ${createUserBody.email} already exists.`,
      });
    }

    await db.user.create({
      data: {
        name: createUserBody.name,
        email: createUserBody.email,
        role: convertStringToRole(createUserBody.role),
        image: createUserBody.image,
        bio: createUserBody.bio,
        gender: createUserBody.gender,
      },
    });

    response.status(HttpStatusCode.CREATED).json({ message: "User created." });
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: error.message,
      });
    }
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};
