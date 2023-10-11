import { Request, Response } from "express";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";
import db from "../../lib/db";

export async function deleteHistory(request: Request, response: Response) {
  try {
    const { id } = request.params;

    // delete the history
    await db.history.delete({
      where: {
        id: id,
      },
    });

    response.status(HttpStatusCode.NO_CONTENT).send();
  } catch (error) {
    // log the error
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
}
