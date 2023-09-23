import { Response, Request } from "express";
import { Example, Question } from "@/models/question";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";
import { convertStringToComplexity } from "../../lib/enums/Complexity";
import { CreateQuestionValidator } from "../../lib/validators/CreateQuestionValidator";
import questionDb from "../../models/database/schema/question";
import { formatErrorMessage } from "../../lib/utils/errorUtils";
import { ZodError } from "zod";

export const postQuestion = async (request: Request, response: Response) => {
  try {
    if (!request.body || Object.keys(request.body).length === 0) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body is missing.",
      });
      return;
    }

    const createQuestionBody = CreateQuestionValidator.parse(request.body);

    // Make sure no duplicate question exists by checking the question name in the database
    const duplicateCheck = await questionDb.findOne({
      title: createQuestionBody.title,
    });

    if (duplicateCheck) {
      response
        .status(HttpStatusCode.CONFLICT)
        .json({ error: "CONFLICT", message: "Question title already exists" });
      return;
    }

    // TODO: make sure when we insert new data to the db, we also provide id, author and createdOn
    const question: Question = {
      // id: nanoid(),
      title: createQuestionBody.title,
      description: createQuestionBody.description,
      topics: createQuestionBody.topics,
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

    // insert new question to database
    await questionDb.create(question);

    response
      .status(HttpStatusCode.CREATED)
      .json({ message: "Question created." });
  } catch (error) {
    if (error instanceof ZodError) {
      response
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "BAD REQUEST", message: formatErrorMessage(error) });
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
