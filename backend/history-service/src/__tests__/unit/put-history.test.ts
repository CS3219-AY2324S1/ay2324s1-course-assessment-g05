import supertest from "supertest";
import createServer from "../utils/server";
import db from "../../lib/db";
import { generateCUID } from "../utils/payloads";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";

const app = createServer();
const dbMock = db as jest.Mocked<typeof db>;

describe("PUT /history/user/:userId/question/:questionId/code", () => {
  describe("Given a valid user id and question id with a valid code request body", () => {
    it("should return 204", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const code = "console.log('Hello World!');";
      dbMock.user.findFirst = jest.fn().mockResolvedValue({
        id: userId,
      });
      dbMock.question.findFirst = jest.fn().mockResolvedValue({
        id: questionId,
      });
      dbMock.history.findFirst = jest.fn().mockResolvedValue({
        id: generateCUID(),
      });
      dbMock.history.update = jest.fn().mockResolvedValue(null);

      // Act
      const { statusCode } = await supertest(app)
        .put(`/api/history/user/${userId}/question/${questionId}/code`)
        .send({ code });

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.NO_CONTENT);
      expect(dbMock.history.update).toBeCalledTimes(1);
    });
  });

  describe("Given a non-existent user id", () => {
    it("should return 404 with an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const code = "console.log('Hello World!');";
      dbMock.user.findFirst = jest.fn().mockResolvedValue(null);

      // Act
      const { statusCode, body } = await supertest(app)
        .put(`/api/history/user/${userId}/question/${questionId}/code`)
        .send({ code });

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.NOT_FOUND);
      expect(body).toEqual({
        error: "NOT FOUND",
        message: "User does not exist",
      });
    });
  });

  describe("Given a non-existent question id", () => {
    it("should return 404 with an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const code = "console.log('Hello World!');";
      dbMock.user.findFirst = jest.fn().mockResolvedValue({
        id: userId,
      });
      dbMock.question.findFirst = jest.fn().mockResolvedValue(null);

      // Act
      const { statusCode, body } = await supertest(app)
        .put(`/api/history/user/${userId}/question/${questionId}/code`)
        .send({ code });

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.NOT_FOUND);
      expect(body).toEqual({
        error: "NOT FOUND",
        message: "Question does not exist",
      });
    });
  });

  describe("Given empty request body", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      dbMock.user.findFirst = jest.fn().mockResolvedValue({
        id: userId,
      });
      dbMock.question.findFirst = jest.fn().mockResolvedValue({
        id: questionId,
      });

      // Act
      const { statusCode, body } = await supertest(app).put(
        `/api/history/user/${userId}/question/${questionId}/code`
      );

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Request body is required",
      });
    });
  });

  describe("Given the request body contains extra fields", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const code = "console.log('Hello World!');";
      dbMock.user.findFirst = jest.fn().mockResolvedValue({
        id: userId,
      });
      dbMock.question.findFirst = jest.fn().mockResolvedValue({
        id: questionId,
      });

      // Act
      const { statusCode, body } = await supertest(app)
        .put(`/api/history/user/${userId}/question/${questionId}/code`)
        .send({ code, extra: "field" });

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid properties in request body",
      });
    });
  });

  describe("Given the code is larger than the threshold", () => {
    it("should return 400 with an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const code = "console.log('Hello World!');".repeat(1000);
      dbMock.user.findFirst = jest.fn().mockResolvedValue({
        id: userId,
      });
      dbMock.question.findFirst = jest.fn().mockResolvedValue({
        id: questionId,
      });

      // Act
      const { statusCode, body } = await supertest(app)
        .put(`/api/history/user/${userId}/question/${questionId}/code`)
        .send({ code });

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid code. String must contain at most 10000 character(s)",
      });
    });
  });

  describe("Given a non-existent history", () => {
    it("should return 404 with an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const code = "console.log('Hello World!');";
      dbMock.user.findFirst = jest.fn().mockResolvedValue({
        id: userId,
      });
      dbMock.question.findFirst = jest.fn().mockResolvedValue({
        id: questionId,
      });
      dbMock.history.findFirst = jest.fn().mockResolvedValue(null);

      // Act
      const { statusCode, body } = await supertest(app)
        .put(`/api/history/user/${userId}/question/${questionId}/code`)
        .send({ code });

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.NOT_FOUND);
      expect(body).toEqual({
        error: "NOT FOUND",
        message: "History does not exist",
      });
    });
  });

  describe("Given the database is down", () => {
    it("should return 500 with an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const code = "console.log('Hello World!');";
      dbMock.user.findFirst = jest.fn().mockRejectedValue(null);

      // Act
      const { statusCode, body } = await supertest(app)
        .put(`/api/history/user/${userId}/question/${questionId}/code`)
        .send({ code });

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(body).toEqual({
        error: "INTERNAL SERVER ERROR",
        message: "An unexpected error has occurred",
      });
    });
  });
});
