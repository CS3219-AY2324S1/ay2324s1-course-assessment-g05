import { Request, Response } from "express";
import HttpStatusCode from "../../lib/HttpStatusCode";
import { UpdateUserValidator } from "../../lib/validators/UpdateUserValidator";
import { db } from "../../lib/db";
import { UserProfile } from "../../models/user";
import { convertStringToRole } from "../../lib/enums/Role";
import { convertStringToGender } from "../../lib/enums/Gender";

export const updateUserById = async (request: Request, response: Response) => {
  try {
    const userId = request.params.userId;
    const updateUserBody = UpdateUserValidator.parse(request.body);

    const inputBodyKeys = Object.keys(request.body).sort();
    const parsedBodyKeys = Object.keys(updateUserBody).sort();

    if (JSON.stringify(inputBodyKeys) !== JSON.stringify(parsedBodyKeys)) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid properties in request body.",
      });
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
        email: updateUserBody.email,
      },
    });

    if (existingUserWithSameEmail) {
      response.status(HttpStatusCode.CONFLICT).json({
        error: "CONFLICT",
        message: `User with email ${updateUserBody.email} already exists.`,
      });
    }

    const updatedUser: UserProfile = {
      id: user.id,
      name: updateUserBody.name || user.name,
      email: updateUserBody.email || user.email,
      role: convertStringToRole(updateUserBody.role || user.role),
      image: updateUserBody.image || user.image || undefined,
      bio: updateUserBody.bio || user.bio || undefined,
      gender: updateUserBody.gender
        ? convertStringToGender(updateUserBody.gender)
        : user.gender || undefined,
    };

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        image: updatedUser.image,
        bio: updatedUser.bio,
        gender: updatedUser.gender,
      },
    });

    response.status(HttpStatusCode.NO_CONTENT);
  } catch (error) {
    // log the error
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};
