import supertest from "supertest";
import createServer from "../utils/server";
import questionDb from "../../models/database/schema/question";
import * as TestPayload from "../utils/payloads";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";

const app = createServer();
const dbMock = questionDb as jest.Mocked<typeof questionDb>;

describe("PUT /api/questions/:questionId", () => {
  describe("Given a valid request body", () => {
    it("should return 204 with no content", async () => {
      // Arrange
      const questionId = "existingquestionid123";
      const updateQuestionRequestBody =
        TestPayload.getCreateQuestionRequestBody();
      dbMock.findById = jest
        .fn()
        .mockResolvedValue(TestPayload.getQuestionPayload(questionId));
      dbMock.findOne = jest.fn().mockResolvedValue(null);
      dbMock.updateOne = jest.fn().mockResolvedValue(null);

      // Act
      const { statusCode } = await supertest(app)
        .put(`/api/questions/${questionId}`)
        .send(updateQuestionRequestBody);

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.NO_CONTENT);
    });
  });

  describe("Given the questionId does not exist", () => {
    it("should return 404 with a not found message", async () => {
      // Arrange
      const questionId = "nonexistingquestionid123";
      const updateQuestionRequestBody =
        TestPayload.getCreateQuestionRequestBody();
      dbMock.findById = jest.fn().mockResolvedValue(null);

      // Act
      const { body, statusCode } = await supertest(app)
        .put(`/api/questions/${questionId}`)
        .send(updateQuestionRequestBody);

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.NOT_FOUND);
      expect(body).toEqual({
        error: "NOT FOUND",
        message: `Question with id ${questionId} not found.`,
      });
    });
  });

  describe("Given the question title already exists", () => {
    it("should return 409 with a conflict message", async () => {
      // Arrange
      const questionId = "existingquestionid123";
      const updateQuestionRequestBody =
        TestPayload.getCreateQuestionRequestBody();
      dbMock.findById = jest
        .fn()
        .mockResolvedValue(TestPayload.getQuestionPayload(questionId));
      dbMock.findOne = jest
        .fn()
        .mockResolvedValue(TestPayload.getQuestionPayload());

      // Act
      const { body, statusCode } = await supertest(app)
        .put(`/api/questions/${questionId}`)
        .send(updateQuestionRequestBody);

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.CONFLICT);
      expect(body).toEqual({
        error: "CONFLICT",
        message: "Question title already exists",
      });
    });
  });

  describe("Given the question description is too short", () => {
    it("should return 400 with a zod error message indicating that the description is too short", async () => {
      // Arrange
      const questionId = "existingquestionid123";
      const updateQuestionRequestBody =
        TestPayload.getCreateQuestionRequestBody();
      updateQuestionRequestBody.description = "a";
      dbMock.findById = jest
        .fn()
        .mockResolvedValue(TestPayload.getQuestionPayload(questionId));

      // Act
      const { body, statusCode } = await supertest(app)
        .put(`/api/questions/${questionId}`)
        .send(updateQuestionRequestBody);

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(body.message).toEqual(
        "Invalid description. String must contain at least 3 character(s)"
      );
    });
  });

  describe("Given an empty request body", () => {
    it("should return 400 with an empty request body alert message", async () => {
      // Arrange
      const questionId = "existingquestionid123";

      // Act
      const { body, statusCode } = await supertest(app).put(
        `/api/questions/${questionId}`
      );

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Request body is missing.",
      });
    });
  });
});
