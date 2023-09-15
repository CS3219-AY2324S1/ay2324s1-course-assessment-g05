import { Request, Response } from "express";
import { questionsData } from "../../temp-data/questions";
import HttpStatusCode from "../../lib/HttpStatusCode";
import { convertStringToTopic } from "@/lib/enums/Topic";
import { z } from "zod";
import { QueryParamValidator } from "../../lib/validators/QueryParamValidator";

export const getHealth = (_: Request, response: Response) => {
  // TODO: check database connection is successful
  const isHealthy = true;
  if (isHealthy) {
    response.status(HttpStatusCode.OK).json({ message: "Healthy" });
  } else {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Database connection is not established.",
    });
  }
};

export const getQuestions = (request: Request, response: Response) => {
  try {
    // check if there are any query params provided and the provided values are valid
    const { topics, complexity, author } = QueryParamValidator.parse(
      request.query
    );

    // TODO: get all questions from database based on the filter
    const questions = questionsData.filter((question) => {
      return (
        (!topics || question.topics.includes(topics as any)) &&
        (!complexity || question.complexity === complexity) &&
        (!author || question.author === author)
      );
    });

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
    const { questionId } = request.params;

    // check if the question id exists in the database
    const question = questionsData.find(
      (question) => question.id === questionId
    );

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
