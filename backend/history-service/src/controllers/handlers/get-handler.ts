import { Request, Response } from "express";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";
import db from "../../lib/db";
import { HistoryQueryParamsValidator } from "../../lib/validators/HistoryQueryParamsValidator";
import { ZodError } from "zod";
import { formatErrorMessage } from "../../lib/utils/errorUtils";

export async function getHealth(_: Request, response: Response) {
  try {
    const result = await db.$queryRaw`SELECT 1`;

    if (!result) {
      throw new Error("No database connection from the server");
    }

    response.status(HttpStatusCode.OK).json({ message: "Healthy" });
  } catch (error) {
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "No database connection from the server",
    });
  }
}

export async function getHistory(request: Request, response: Response) {
  try {
    const { userId, questionId } = HistoryQueryParamsValidator.parse(
      request.query
    );

    if (!userId && !questionId) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "At least one of userId and questionId is required",
      });
      return;
    }

    const userList = userId
      ? Array.isArray(userId)
        ? userId
        : [userId]
      : null;
    const questionList = questionId
      ? Array.isArray(questionId)
        ? questionId
        : [questionId]
      : null;

    const history = await db.history.findMany({
      where: {
        ...(userList && { userId: { in: userList } }),
        ...(questionList && { questionId: { in: questionList } }),
      },
      select: {
        id: false,
      },
    });

    if (!history || history.length === 0) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: "No history found",
      });
      return;
    }

    const result = { count: history.length, data: history };

    response.status(HttpStatusCode.OK).json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "BAD REQUEST", message: formatErrorMessage(error) });
      return;
    }

    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred",
    });
  }
}
