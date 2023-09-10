import { Request, Response } from "express";
import { db } from "../../lib/db";
import HttpStatusCode from "../../lib/HttpStatusCode";

export const deleteUserById = async (request: Request, response: Response) => {
  try {
    const userId = request.params.userId;

    // query database for user with id
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
    }

    await db.user.delete({
      where: {
        id: userId,
      },
    });

    response.status(HttpStatusCode.NO_CONTENT);
  } catch (error) {}
};
