import { Request, Response } from "express";
import { questionsData } from "../../temp-data/questions";
import HttpStatusCode from "../../lib/HttpStatusCode";

export const deleteQuestion = (request: Request, response: Response) => {
  try {
    const { questionId } = request.params;

    const questionToDelete = questionsData.find(
      (question) => question.id === questionId
    );

    if (!questionToDelete) {
      response.status(HttpStatusCode.NOT_FOUND).send("Question not found.");
    }

    // delete question from database
    console.log("Delete this question: ", questionToDelete!.title);

    response.status(HttpStatusCode.NO_CONTENT);
  } catch (error) {
    // log the error
    console.log(error);
    response
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send("An unexpected error has occurred.");
  }
};
