import { Request, Response } from "express";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";

export const getHealth = async (_: Request, response: Response) => {
  try {
    response.status(HttpStatusCode.OK).json({ message: "Healthy" });
  } catch (error) {
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};
