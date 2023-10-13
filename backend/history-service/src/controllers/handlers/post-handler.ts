import { Request, Response } from "express";
import { ZodError } from "zod";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";
import { formatErrorMessage } from "../../lib/utils/errorUtils";
import { CreateHistoryBodyValidator } from "../../lib/validators/CreateHistoryBodyValidator";
import db from "../../lib/db";

export async function postHistory(request: Request, response: Response) {
  try {
    if (!request.body || Object.keys(request.body).length === 0) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body is required",
      });
      return;
    }
    // check request body correctness
    const createHistoryBody = CreateHistoryBodyValidator.parse(request.body);

    // check if request body contains extra fields
    const inputBodyKeys = Object.keys(request.body).sort();
    const parsedBodyKeys = Object.keys(createHistoryBody).sort();

    if (JSON.stringify(inputBodyKeys) !== JSON.stringify(parsedBodyKeys)) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid properties in request body",
      });
      return;
    }

    // verify the user id exists
    const userList = Array.isArray(createHistoryBody.userId)
      ? createHistoryBody.userId
      : [createHistoryBody.userId];

    let userExists = true;

    for (const id in userList) {
      const user = await db.user.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        userExists = false;
        break;
      }
    }

    if (!userExists) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: "User id cannot be found",
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
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: "Question id cannot be found",
      });
      return;
    }

    // check if history already exists
    let historyExists = false;
    for (const id in userList) {
      const history = await db.history.findFirst({
        where: {
          userId: id,
          questionId: createHistoryBody.questionId,
        },
        select: {
          id: true,
        },
      });

      if (history) {
        historyExists = true;
        break;
      }
    }

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
        title: createHistoryBody.title,
        topics: createHistoryBody.topics,
        complexity: createHistoryBody.complexity,
        language: createHistoryBody.language,
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
      return;
    }

    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred",
    });
  }
}
