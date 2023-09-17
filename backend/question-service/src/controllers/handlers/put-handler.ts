import { Request, Response } from "express";
import HttpStatusCode from "../../lib/HttpStatusCode";
import { UpdateQuestionValidator } from "../../lib/validators/UpdateQuestionValidator";
import { ZodError } from "zod";
import coll from "../../models/database/db";
import { ObjectId } from "mongodb";


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

    const question = await coll.findOne({ _id: new ObjectId(questionId) });

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
    const duplicateCheck = await coll.findOne({ "question.title": updatedQuestionBody.title });

    if (duplicateCheck) {
      response
        .status(HttpStatusCode.CONFLICT)
        .json({ error: "CONFLICT", message: "Question title already exists" });
      return;
    }


    // Update question in database using the updatedQuestionBody
    const filter = { _id: new ObjectId(questionId) }; 
    const dbQuestionBody: { [key: string]: any }  =  {};
    if (updatedQuestionBody.title) dbQuestionBody["question.title"] = updatedQuestionBody.title;
    if (updatedQuestionBody.description) dbQuestionBody["question.description"] = updatedQuestionBody.description;
    if (updatedQuestionBody.category) dbQuestionBody["question.category"] = updatedQuestionBody.category;
    if (updatedQuestionBody.complexity) dbQuestionBody["question.complexity"] = updatedQuestionBody.complexity;
    if (updatedQuestionBody.url) dbQuestionBody["question.url"] = updatedQuestionBody.url;
    if (updatedQuestionBody.author) dbQuestionBody["question.author"] = updatedQuestionBody.author;
    if (updatedQuestionBody.examples) dbQuestionBody["question.examples"] = updatedQuestionBody.examples;
    if (updatedQuestionBody.constraints) dbQuestionBody["question.constraints"] = updatedQuestionBody.constraints;

    const update = { $set: dbQuestionBody }; 

    await coll.updateOne(filter, update).then(() => {
      console.log("Succesfully updated")

      response.status(HttpStatusCode.NO_CONTENT).send();
    })

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
