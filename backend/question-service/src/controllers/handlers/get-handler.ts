import { Request, Response } from "express";
import HttpStatusCode from "../../lib/HttpStatusCode";
import { convertStringToTopic } from "@/lib/enums/Topic";
import { z } from "zod";
import { QueryParamValidator } from "../../lib/validators/QueryParamValidator";
import coll from "../../models/database/db";
import { ObjectId } from "mongodb";

// Check if database connection is successful
export const getHealth = async (_: Request, response: Response) => {
  // Try to perform a simple query on the collection. Assumption: there is at least 1 set of data in collection
  const result = await coll.findOne({});
  
  if (result) {
    response.status(HttpStatusCode.OK).json({ message: "Healthy" });
  } else {
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Database connection is not established.",
    });
  }
};

// Query mulitple questions from database by filter
export const getQuestions = async (request: Request, response: Response) => {
  try {
    // check if there are any query params provided and the provided values are valid
    const { topics, complexity, author } = QueryParamValidator.parse(
      request.query
    );
    
    const filters: { [key: string]: any }  =  {};

    if (topics) filters["question.topics"] = topics;
    if (complexity) filters["question.complexity"] = complexity;
    if (author) filters["question.author"] = author;

    const questions = await coll.find(filters).toArray()

    response
      .status(HttpStatusCode.OK)
      .json({ count: questions.length, data: questions });
  } catch (error) {
    // log the error
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};

// Query unique question from database by questionId
export const getQuestionById = async (request: Request, response: Response) => {
  try {
    const { questionId } = request.params;

    const question = await coll.findOne({ _id: new ObjectId(questionId) });

    if (!question) {
      response
        .status(HttpStatusCode.NOT_FOUND)
        .json({ error: "NOT FOUND", message: "Question not found." });
      return;
    }

    response.status(HttpStatusCode.OK).json(question);
  } catch (error) {
    // log the error
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};
