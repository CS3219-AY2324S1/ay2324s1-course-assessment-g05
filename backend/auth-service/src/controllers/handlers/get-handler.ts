import { Request, Response } from "express";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";

export const getHealth = async (_: Request, response: Response) => {
  response.status(HttpStatusCode.OK).json({ message: "Healthy" });
};
