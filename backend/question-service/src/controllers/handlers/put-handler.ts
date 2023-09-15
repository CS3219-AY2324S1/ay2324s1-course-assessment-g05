import { Request, Response } from "express";
import HttpStatusCode from "../../lib/HttpStatusCode";
import { questionsData } from "../../temp-data/questions";
import {
  UpdateQuestionRequestBody,
  UpdateQuestionValidator,
} from "../../lib/validators/UpdateQuestionValidator";
import { convertStringToComplexity } from "../../lib/enums/Complexity";
import { Example } from "../../models/question";
import { ZodError } from "zod";

export const updateQuestion = (request: Request, response: Response) => {
  try {
    var isEmptyObject = true;
    for (const key in request.body) {
      if (request.body.hasOwnProperty(key)) {
        isEmptyObject = false;
        break;
      }
    }
    if (!request.body || isEmptyObject) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body cannot be empty.",
      });
    }

    const { questionId } = request.params;

    // get the question from the database
    var question = questionsData.find((question) => question.id === questionId);

    if (!question) {
      response.status(HttpStatusCode.NOT_FOUND).send("Question not found.");
    }

    console.log("Original:", question);

    const updatedQuestionBody: UpdateQuestionRequestBody =
      UpdateQuestionValidator.parse(request.body);

    question = {
      ...question!,
      title: updatedQuestionBody.title || question!.title,
      description: updatedQuestionBody.description || question!.description,
      category: updatedQuestionBody.category || question!.category,
      complexity: updatedQuestionBody.complexity
        ? convertStringToComplexity(updatedQuestionBody.complexity)
        : question!.complexity,
      url: updatedQuestionBody.url || question!.url,
      updatedOn: Date.now(),
    };

    if (updatedQuestionBody.examples) {
      const examples: Example[] = updatedQuestionBody.examples.map(
        (example) => {
          return {
            input: example.input,
            output: example.output,
            explanation: example.explanation,
          } as Example;
        }
      );
      question.examples = examples;
    }

    if (updatedQuestionBody.constraints) {
      question.constraints = updatedQuestionBody.constraints;
    }

    // update question in database
    console.log("Updated:", question);

    response.status(HttpStatusCode.OK).json({ message: "Question updated." });
  } catch (error) {
    if (error instanceof ZodError) {
      response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "BAD REQUEST", message: error.message });
    }

    // log the error
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};
