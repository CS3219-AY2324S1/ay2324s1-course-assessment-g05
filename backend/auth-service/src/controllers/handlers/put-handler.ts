import { Request, Response } from "express";
import HttpStatusCode from "../../common/HttpStatusCode";
import { verifyEmail, generatePasswordResetToken } from "../../lib/user_api_helpers";
import { ResetPasswordMail } from "../../lib/email/resetPasswordMail";



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

const sendPasswordResetEmail = async (request: Request, response: Response) => {
    const email = request.params.email;
    console.log(email)
    const res = await generatePasswordResetToken(email)
    console.log("RES")
    
    if (res.status !== HttpStatusCode.OK) {
        const data = await res.json();
        response.status(res.status).json({
          error: data.error,
          message: data.message,
        });
        return;
      }

      const user = await res.json();
      console.log(user)
      console.log("sending email now")
      const mail = new ResetPasswordMail(user.email, user.passwordResetToken);
      await mail.send();

      response
        .status(HttpStatusCode.NO_CONTENT)
        .json({
          success: true,
        });
}


export { verifyUserEmail, sendPasswordResetEmail };
