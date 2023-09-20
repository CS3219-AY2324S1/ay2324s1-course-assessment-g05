import { Request, Response } from "express";
import HttpStatusCode from "../../lib/HttpStatusCode";
import { UpdateQuestionValidator } from "../../lib/validators/UpdateQuestionValidator";
import { ZodError } from "zod";
import questionDb from "../../models/database/schema/question";

export const updateQuestion = async (request: Request, response: Response) => {
  try {
    if (!request.body || Object.keys(request.body).length === 0) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body is missing.",
      });
      return;
    }

    const { questionId } = request.params;

    const question = await questionDb.findById(questionId).exec();

    if (!question) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `Question with id ${questionId} not found.`,
      });
      return;
    }
    // console.log(request.body)
    const updatedQuestionBody = UpdateQuestionValidator.parse(request.body);

    // Check no existing question with the same question name in the database
    if (updatedQuestionBody.title) {
      const duplicateCheck = await questionDb.findOne({
        _id: { $ne: questionId },
        title: updatedQuestionBody.title,
      });

      if (duplicateCheck) {
        response.status(HttpStatusCode.CONFLICT).json({
          error: "CONFLICT",
          message: "Question title already exists",
        });
        return;
      }

      question.title = updatedQuestionBody.title;
    }

    // Update question in database using the updatedQuestionBody
    if (updatedQuestionBody.description) {
      question.description = updatedQuestionBody.description;
    }

    if (updatedQuestionBody.topics) {
      question.topics = updatedQuestionBody.topics;
    }

    if (updatedQuestionBody.complexity) {
      question.complexity = updatedQuestionBody.complexity;
    }

    if (updatedQuestionBody.url) {
      question.url = updatedQuestionBody.url;
    }

    if (updatedQuestionBody.author) {
      question.author = updatedQuestionBody.author;
    }

    if (updatedQuestionBody.examples) {
      question.examples = updatedQuestionBody.examples;
    }

    if (updatedQuestionBody.constraints) {
      question.constraints = updatedQuestionBody.constraints;
    }

    question.updatedOn = new Date(Date.now());

    await question.save();

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
