import { Request, Response } from "express";
import HttpStatusCode from "../../lib/HttpStatusCode";
import coll from "../../models/database/db";
import { ObjectId } from "mongodb";

// Deletes a question from database based on questionId
export const deleteQuestion = async(request: Request, response: Response) => {
  try {
    const { questionId } = request.params;

    // Find the question to delete in the database
    const result = await coll.deleteOne({ _id: new ObjectId(questionId) });

    if (result.deletedCount !== 1) {
      response.status(HttpStatusCode.NOT_FOUND).json({
        error: "NOT FOUND",
        message: `Question with id ${questionId} not found.`,
      });
      return;
    }
    
    response.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    // log the error
    console.log(error);
    response
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .send("An unexpected error has occurred.");
  }
};
