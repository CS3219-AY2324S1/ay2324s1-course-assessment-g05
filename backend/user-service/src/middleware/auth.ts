import { Request, Response, NextFunction } from "express";
import HttpStatusCode from "../lib/enums/HttpStatusCode";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  if (req.headers.bypass) {
    const serviceSecret = process.env.SERVICE_SECRET || "secret";
    // bypass auth for calls from auth service
    if (req.headers.bypass === serviceSecret) {
      next();
      return;
    }
  }

  const authRes = await fetch("http://localhost:5050/api/auth/validate", {
    method: "POST",
    headers: req.headers as HeadersInit,
  });

  if (authRes.status !== HttpStatusCode.OK) {
    const message = await authRes.text();
    res.status(authRes.status).json({
      error: message,
      message,
    });
    return;
  }
  next();
};
