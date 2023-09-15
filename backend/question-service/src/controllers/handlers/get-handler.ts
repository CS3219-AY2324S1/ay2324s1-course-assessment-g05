import { Request, Response } from "express";
import { questionsData } from "../../temp-data/questions";
import HttpStatusCode from "../../lib/HttpStatusCode";

export const getHealth = (_: Request, response: Response) => {
  // check database connection is successful
  const isHealthy = true;
  if (isHealthy) {
    response.status(HttpStatusCode.OK).json({ message: "Healthy" });
  } else {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Database connection is not established.",
    });
  }
};

export const getQuestions = (_: Request, response: Response) => {
  try {
    // get all questions from database
    const questions = questionsData;

    response
      .status(HttpStatusCode.OK)
      .json({ count: questions.length, data: questions });
  } catch (error) {
    // log the error
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};

export const getQuestionById = (request: Request, response: Response) => {
  try {
    // get question by id from database
    const { questionId } = request.params;

    // check if the question id exists in the database
    const question = questionsData.find(
      (question) => question.id === questionId
    );

    if (!question) {
      // handle 404 error
      response
        .status(HttpStatusCode.NOT_FOUND)
        .json({ error: "NOT FOUND", message: "Question not found." });
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
