import supertest from "supertest";
import createServer from "../utils/server";
import questionDb from "../../models/database/schema/question";
import * as TestPayload from "../utils/payloads";
import HttpStatusCode from "../../lib/HttpStatusCode";

const app = createServer();
const dbMock = questionDb as jest.Mocked<typeof questionDb>;

describe("DELETE /api/questions/:questionId", () => {
  describe("Given an existing question id", () => {
    it("should return 204 with no content", async () => {
      const questionId = "existingquestionid123";
      dbMock.findById = jest
        .fn()
        .mockResolvedValue(TestPayload.getQuestionPayload(questionId));
      dbMock.deleteOne = jest.fn().mockResolvedValue(null);

      const { statusCode } = await supertest(app).delete(
        `/api/questions/${questionId}`
      );

      expect(statusCode).toEqual(HttpStatusCode.NO_CONTENT);
    });
  });

  describe("Given a non-existing question id", () => {
    it("should return 404 with a not found message", async () => {
      const questionId = "nonexistingquestionid123";
      dbMock.findById = jest.fn().mockResolvedValue(null);

      const { body, statusCode } = await supertest(app).delete(
        `/api/questions/${questionId}`
      );

      expect(statusCode).toEqual(HttpStatusCode.NOT_FOUND);
      expect(body).toEqual({
        error: "NOT FOUND",
        message: `Question with id ${questionId} not found.`,
      });
    });
  });

  describe("Given an unexpected error", () => {
    it("should return 500 with an unexpected error message", async () => {
      const questionId = "existingquestionid123";
      dbMock.findById = jest
        .fn()
        .mockResolvedValue(TestPayload.getQuestionPayload(questionId));
      dbMock.deleteOne = jest
        .fn()
        .mockRejectedValue(new Error("Unexpected error"));

      const { body, statusCode } = await supertest(app).delete(
        `/api/questions/${questionId}`
      );

      expect(statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(body).toEqual({
        error: "INTERNAL SERVER ERROR",
        message: "An unexpected error has occurred.",
      });
    });
  });
});
