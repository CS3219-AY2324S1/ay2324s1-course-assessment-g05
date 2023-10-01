import { Request, Response } from "express";
import HttpStatusCode from "../../common/HttpStatusCode";
import { verifyEmail } from "../../lib/user_api_helpers";


const verifyUserEmail = async (request: Request, response: Response) => {
    const email = request.params.email;
    const token = request.params.token;

  const res = await verifyEmail(email,token);

  if (res.status !== HttpStatusCode.NO_CONTENT) {
    const data = await res.json();
    response.status(res.status).json({
      error: data.error,
      message: data.message,
    });
    return;
  }
  response
    .status(HttpStatusCode.NO_CONTENT)
    .json({
      success: true,
    });
};


export { verifyUserEmail };
