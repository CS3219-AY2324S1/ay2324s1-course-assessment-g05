import { Request, Response } from "express";
import { ZodError } from "zod";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";
import { formatErrorMessage } from "../../lib/utils/errorUtils";
import { CreateHistoryBodyValidator } from "../../lib/validators/CreateHistoryBodyValidator";
import db from "../../lib/db";

export async function postHistory(request: Request, response: Response) {
  try {
    if (!request.body) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body is required",
      });
    }
    // check request body correctness
    const createHistoryBody = CreateHistoryBodyValidator.parse(request.body);

    // check if request body contains extra fields
    const inputBodyKeys = Object.keys(request.body).sort();
    const parsedBodyKeys = Object.keys(createHistoryBody).sort();

    if (JSON.stringify(inputBodyKeys) !== JSON.stringify(parsedBodyKeys)) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid properties in request body.",
      });
      return;
    }

    // verify the user id exists
    const userList = Array.isArray(createHistoryBody.userId)
      ? createHistoryBody.userId
      : [createHistoryBody.userId];
    let userExists = true;
    userList.forEach(async (userId) => {
      const user = await db.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        userExists = false;
        return;
      }
    });

    if (!userExists) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "User id does not exist",
      });
      return;
    }

    // verify the question id exists
    const question = await db.question.findFirst({
      where: {
        id: createHistoryBody.questionId,
      },
      select: {
        id: true,
      },
    });

    if (!question) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Question id does not exist",
      });
      return;
    }

    // check if history already exists
    let historyExists = false;
    userList.forEach(async (userId) => {
      const history = await db.history.findFirst({
        where: {
          userId: userId,
          questionId: createHistoryBody.questionId,
        },
      });

      if (history) {
        historyExists = true;
        return;
      }
    });

    if (historyExists) {
      response.status(HttpStatusCode.CONFLICT).json({
        error: "CONFLICT",
        message: "History already exists",
      });
      return;
    }

    // create history
    await db.history.createMany({
      data: userList.map((userId) => ({
        userId: userId,
        questionId: createHistoryBody.questionId,
      })),
    });

    response.status(HttpStatusCode.CREATED).json({
      message: "History created successfully",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: formatErrorMessage(error),
      });
    }

    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error occurred",
    });
  }
}
