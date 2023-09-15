import { Response, Request } from "express";
import HttpStatusCode from "../../lib/HttpStatusCode";
import { ZodError } from "zod";
import { CreateQuestionValidator } from "../../lib/validators/CreateQuestionValidator";

export const postQuestion = (request: Request, response: Response) => {
  try {
    if (!request.body || Object.keys(request.body).length === 0) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body is missing.",
      });
      return;
    }

    const createQuestionBody = CreateQuestionValidator.parse(request.body);

    // TODO: make sure no duplicate question exists by checking the question name in the database

    // TODO: make sure when we insert new data to the db, we also provide id, author and createdOn
    // TODO: save into the database

    response
      .status(HttpStatusCode.CREATED)
      .json({ message: "Question created." });
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
