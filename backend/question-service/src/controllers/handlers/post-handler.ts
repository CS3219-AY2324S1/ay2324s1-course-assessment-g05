import { Response, Request } from "express";
import { Example, Question } from "../../models/question";
import HttpStatusCode from "../../lib/HttpStatusCode";
import { convertStringToComplexity } from "../../lib/enums/Complexity";
import { nanoid } from "nanoid";
import { ZodError } from "zod";
import {
  CreateQuestionRequestBody,
  CreateQuestionValidator,
} from "../../lib/validators/CreateQuestionValidator";

export const postQuestion = (request: Request, response: Response) => {
  try {
    console.log(request.body);
    const createQuestionBody: CreateQuestionRequestBody =
      CreateQuestionValidator.parse(request.body);

    const question: Question = {
      id: nanoid(),
      title: createQuestionBody.title,
      description: createQuestionBody.description,
      category: createQuestionBody.category,
      complexity: convertStringToComplexity(createQuestionBody.complexity),
      url: createQuestionBody.url,
      createdOn: Date.now(),
      // author must be the current user, to be implemented
      author: createQuestionBody.author || "LeetCode",
    };

    if (createQuestionBody.examples) {
      const examples: Example[] = createQuestionBody.examples.map((example) => {
        return {
          input: example.input,
          output: example.output,
          explanation: example.explanation,
        } as Example;
      });
      question.examples = examples;
    }

    if (createQuestionBody.constraints) {
      question.constraints = createQuestionBody.constraints;
    }

    // save question to database
    console.log(question);

    response.status(HttpStatusCode.CREATED).send({ message: "Successful" });
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
