import { Request, Response } from "express";
import HttpStatusCode from "../../lib/HttpStatusCode";
import { questionsData } from "../../temp-data/questions";
import { UpdateQuestionValidator } from "../../lib/validators/UpdateQuestionValidator";
import { Question } from "../../models/question";
import { ZodError } from "zod";

export const updateQuestion = (request: Request, response: Response) => {
  try {
    if (!request.body || Object.keys(request.body).length === 0) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body is missing.",
      });
      return;
    }

    const { questionId } = request.params;

    // TODO: get the question from the database
    var question = questionsData.find(
      (question) => question.id === questionId
    ) as Question;

    if (!question) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `Question with id ${questionId} not found.`,
      });
      return;
    }

    const updatedQuestionBody = UpdateQuestionValidator.parse(request.body);

    // TODO: check no existing question with the same question name in the database

    // TODO: update question in database using the updatedQuestionBody

    response.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    if (error instanceof ZodError) {
      response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "BAD REQUEST", message: error.message });
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
