import { Request, Response } from "express";
import HttpStatusCode from "../../lib/HttpStatusCode";
import questionDb from "../../models/database/schema/question";

// Deletes a question from database based on questionId
export const deleteQuestion = async (request: Request, response: Response) => {
  try {
    const { questionId } = request.params;

    // Find the question to delete in the database
    const questionExist = await questionDb.findById(questionId);

    if (!questionExist) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `Question with id ${questionId} not found.`,
      });
      return;
    }

    await questionDb.deleteOne({ _id: questionId });

    response.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    // log the error
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};
