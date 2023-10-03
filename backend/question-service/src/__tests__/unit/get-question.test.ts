import supertest from "supertest";
import createServer from "../utils/server";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";
import questionDb from "../../models/database/schema/question";
import * as TestPayload from "../utils/payloads";
import Topic from "../../lib/enums/Topic";

const app = createServer();
const dbMock = questionDb as jest.Mocked<typeof questionDb>;

describe("GET /questions", () => {
  describe("Given an authorized API call", () => {
    it("should return 200 with questions", async () => {
      // Arrange
      const questions = TestPayload.getQuestionsPayload();

      dbMock.find = jest.fn().mockImplementationOnce(() => ({
        select: jest.fn().mockResolvedValue(questions),
      }));

      // Act
      const { body, statusCode } = await supertest(app).get("/api/questions");

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.OK);
      expect(body).toEqual({ count: 3, data: questions });
    });
  });

  describe("Given a request with invalid query params", () => {
    it("should return 400 with zod error message", async () => {
      // Act
      const { body, statusCode } = await supertest(app)
        .get("/api/questions")
        .query({ topics: "invalidtopic" });

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
    });
  });
});

describe("GET /questions/:questionId", () => {
  describe("Given an existing question id in the database", () => {
    it("should return 200 with the question", async () => {
      // Arrange
      const questionId = "existingquestionid123";
      const question = TestPayload.getQuestionPayload(questionId);
      dbMock.findById = jest.fn().mockResolvedValue(question);

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/questions/${questionId}`
      );

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.OK);
      expect(body).toEqual({ ...question, id: questionId });
    });
  });

  describe("Given a non-existing question id in the database", () => {
    it("should return 404 with an error message", async () => {
      const questionId = "nonexistingquestionid123";
      dbMock.findById = jest.fn().mockResolvedValue(null);

      const { body, statusCode } = await supertest(app).get(
        `/api/questions/${questionId}`
      );

      expect(statusCode).toEqual(HttpStatusCode.NOT_FOUND);
      expect(body).toEqual({
        error: "NOT FOUND",
        message: "Question not found.",
      });
    });
  });

  describe("Given an unexpected error has occurred", () => {
    it("should return 500 with an error message", async () => {
      const questionId = "existingquestionid123";
      dbMock.findById = jest
        .fn()
        .mockRejectedValue(new Error("Unexpected error"));

      const { body, statusCode } = await supertest(app).get(
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

describe("GET /topics", () => {
  it("should return 200 with all topics", async () => {
    // Arrange
    const topics = Object.values(Topic);

    // Act
    const { body, statusCode } = await supertest(app).get("/api/topics");

    // Assert
    expect(statusCode).toEqual(HttpStatusCode.OK);
    expect(body).toEqual({ topics });
  });
});
