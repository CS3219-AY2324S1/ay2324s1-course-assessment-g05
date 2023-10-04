import { Request, Response } from "express";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";
import { QueryParamValidator } from "../../lib/validators/QueryParamValidator";
import questionDb from "../../models/database/schema/question";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { formatErrorMessage } from "../../lib/utils/errorUtils";
import Topic from "../../lib/enums/Topic";

// Check if database connection is successful
export const getHealth = async (_: Request, response: Response) => {
  if (mongoose.connection.readyState === 1) {
    response.status(HttpStatusCode.OK).json({ message: "Healthy" });
  } else {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Database connection is not established.",
    });
  }
};

// Query mulitple questions from database by filter
export const getQuestions = async (request: Request, response: Response) => {
  try {
    // check if there are any query params provided and the provided values are valid
    const { topics, complexity, author } = QueryParamValidator.parse(
      request.query
    );

    const filters = {
      ...(topics && { topics: { $in: topics } }),
      ...(complexity && { complexity: complexity }),
      ...(author && { author: author }),
    };

    const questions = await questionDb.find(filters).select({
      _id: 1,
      title: 1,
      topics: 1,
      complexity: 1,
    });

    if (!questions) {
      response
        .status(HttpStatusCode.NOT_FOUND)
        .json({ error: "NOT FOUND", message: "No questions found." });
      return;
    }

    response
      .status(HttpStatusCode.OK)
      .json({ count: questions.length, data: questions });
  } catch (error) {
    if (error instanceof ZodError) {
      response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "BAD REQUEST", message: formatErrorMessage(error) });
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

// Query unique question from database by questionId
export const getQuestionById = async (request: Request, response: Response) => {
  try {
    const { questionId } = request.params;

    const question = await questionDb.findById(questionId);

    if (!question) {
      response
        .status(HttpStatusCode.NOT_FOUND)
        .json({ error: "NOT FOUND", message: "Question not found." });
      return;
    }

    response.status(HttpStatusCode.OK).json(question);
  } catch (error) {
    // log the error
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};

export const getQuestionTopics = (_: Request, response: Response) => {
  try {
    const topics = Object.values(Topic);
    response.status(HttpStatusCode.OK).json({ topics });
  } catch (error) {
    // log the error
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};
