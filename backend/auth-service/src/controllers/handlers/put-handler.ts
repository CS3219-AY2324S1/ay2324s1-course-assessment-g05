import { Request, Response } from "express";
import HttpStatusCode from "../../common/HttpStatusCode";
import { verifyEmail, generatePasswordResetToken, updatePassword, getUserById } from "../../lib/user_api_helpers";
import { ResetPasswordMail } from "../../lib/email/resetPasswordMail";
import jwt from "jsonwebtoken";



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
    const res = await generatePasswordResetToken(email)
    
    if (res.status !== HttpStatusCode.OK) {
        const data = await res.json();
        response.status(res.status).json({
          error: data.error,
          message: data.message,
        });
        return;
      }

      const user = await res.json();

      const mail = new ResetPasswordMail(user.id, user.email, user.passwordResetToken);
      await mail.send();

      response
        .status(HttpStatusCode.NO_CONTENT)
        .json({
          success: true,
        });
}

const changePassword = async (request: Request, response: Response) => {

  const userId = request.params.id;
  const token = request.body.token;

  const user = await (await getUserById(userId)).json()
  
  // verify if token is valid
  const secretKey = 'resetpasswordkey'; //todo change to env

  const decoded = jwt.verify(token, secretKey) as {email: string};

  if (decoded.email != user.email) {
    //return error
    response.status(HttpStatusCode.BAD_REQUEST).json({messsage: "Token is wrong."})
    return;
    };

  const updateBody = {password: request.body.hashedPassword, passwordResetToken: null}

  const res = await updatePassword(userId, updateBody)
  
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
}


export { verifyUserEmail, sendPasswordResetEmail, changePassword };
