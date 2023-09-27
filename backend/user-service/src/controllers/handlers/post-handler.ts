import { Request, Response } from "express";
import { CreateUserValidator } from "../../lib/validators/CreateUserValidator";
import { ZodError } from "zod";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";
import db, { client_s3 } from "../../lib/db";
import { formatErrorMessage } from "../../lib/utils/errorUtils";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import multer from 'multer';

export const postUser = async (request: Request, response: Response) => {
  try {
    if (!request.body || Object.keys(request.body).length === 0) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Request body is missing.",
      });
      return;
    }

    const createUserBody = CreateUserValidator.parse(request.body);

    const inputBodyKeys = Object.keys(request.body).sort();
    const parsedBodyKeys = Object.keys(createUserBody).sort();

    if (JSON.stringify(inputBodyKeys) !== JSON.stringify(parsedBodyKeys)) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: "Invalid properties in request body.",
      });
      return;
    }

    // check no duplicate email
    const existingUser = await db.user.findFirst({
      where: {
        email: createUserBody.email,
      },
    });

    if (existingUser) {
      response.status(HttpStatusCode.CONFLICT).json({
        error: "CONFLICT",
        message: `User with email ${createUserBody.email} already exists.`,
      });
      return;
    }

    const user = await db.user.create({
      data: createUserBody,
    });

    if (!user) {
      throw new Error("Failed to register user.");
    }

    await db.preferences.create({
      data: {
        userId: user.id,
        languages: [],
        topics: [],
        difficulties: [],
      },
    });

    response
      .status(HttpStatusCode.CREATED)
      .json({ id: user.id, message: "User created." });
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(HttpStatusCode.BAD_REQUEST).json({
        error: "BAD REQUEST",
        message: formatErrorMessage(error),
      });
      return;
    }
    console.log(error);
    response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      error: "INTERNAL SERVER ERROR",
      message: "An unexpected error has occurred.",
    });
  }
};

const upload = multer({ dest: 'uploads/'})

export const postImage = async (
  request: Request,
  response: Response
) => {
  try {

    const { method } = request;

    switch (method) {

      case "POST":
        try {

          // await upload.single('file')

          // const file = request.file;
          // if (!file) throw Error("File not found.");
          // const fileKey = `users/${request.params.userId}/image/${file.filename}`;
          // console.log(file)
          // const fileType = request.body.fileType;

          const fileParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: request.body.fileKey,
            Expires: 600,
            ContentType: request.body.fileType,
          };

          const url = await client_s3.getSignedUrlPromise(
            "putObject",
            fileParams,
          );

          console.log("Signature success!", url);

          response.status(HttpStatusCode.OK).json({ ok: true, url: url });

          
          // const putObjectParams:PutObjectRequest = {
          //   Bucket: process.env.AWS_BUCKET_NAME!,
          //   Key: request.body.fileKey,
          //   Body: request.body.file,
          //   ContentType: request.body.fileType,
          // };

          // const res = await client_s3.putObject(putObjectParams).promise();


          // console.log("post success!", res);

          // response.status(HttpStatusCode.OK).json({ ok: true, res: res });

        } catch (error) {

          response.status(HttpStatusCode.BAD_REQUEST).json({ ok: false, error: error });

        }

        break;
      default:
        response.setHeader("Allow", ["PUT"]);
        response.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({
          ok: false,
          error: "METHOD NOT ALLOWED",
          message: `Method ${method} not allowed.`,
        });
    }
    // TODO
  } catch (error) {
    // TODO
  }
}

