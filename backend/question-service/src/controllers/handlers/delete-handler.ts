import { Request, Response } from "express";
import { questionsData } from "../../temp-data/questions";
import HttpStatusCode from "../../lib/HttpStatusCode";

export const deleteQuestion = (request: Request, response: Response) => {
  try {
    const { questionId } = request.params;

    // Find the question to delete in the database
    const questionToDelete = questionsData.find(
      (question) => question.id === questionId
    );

    if (!questionToDelete) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `Question with id ${questionId} not found.`,
      });
      return;
    }

    // delete question from database
    console.log("Delete this question: ", questionToDelete.title);

    response.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    // log the error
    console.log(error);
    response
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send("An unexpected error has occurred.");
  }
};
