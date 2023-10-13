import supertest from "supertest";
import createServer from "../utils/server";
import { HistoryPayload, generateCUID } from "../utils/payloads";
import db from "../../lib/db";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";

const app = createServer();
const dbMock = db as jest.Mocked<typeof db>;

describe("POST /api/history", () => {
  describe("Given a valid user id and question id", () => {
    it("should return 201", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const createHistoryBody = HistoryPayload.getCreateHistoryBodyPayload({
        userId: userId,
        questionId: questionId,
      });
      dbMock.user.findFirst = jest.fn().mockResolvedValueOnce({
        id: userId,
      });
      dbMock.question.findFirst = jest.fn().mockResolvedValueOnce({
        id: questionId,
      });
      dbMock.history.findFirst = jest.fn().mockResolvedValueOnce(null);
      dbMock.history.createMany = jest.fn().mockResolvedValueOnce(null);

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(createHistoryBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.CREATED);
      expect(body).toEqual({ message: "History created successfully" });
    });
  });

  describe("Given 2 user ids and a question id", () => {
    it("should return 201", async () => {
      // Arrange
      const userIds = [generateCUID(), generateCUID()];
      const questionId = generateCUID();
      dbMock.user.findFirst = jest
        .fn()
        .mockResolvedValueOnce({
          id: userIds[0],
        })
        .mockResolvedValueOnce({
          id: userIds[1],
        });
      dbMock.question.findFirst = jest.fn().mockResolvedValueOnce({
        id: questionId,
      });
      dbMock.history.findFirst = jest.fn().mockResolvedValueOnce(null);
      dbMock.history.createMany = jest.fn().mockResolvedValueOnce(null);

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(
          HistoryPayload.getCreateHistoryBodyPayload({
            userId: userIds,
            questionId: questionId,
          })
        );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.CREATED);
      expect(body).toEqual({ message: "History created successfully" });
    });
  });

  describe("Given a non-cuid user id", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const userId = "123";
      const questionId = generateCUID();
      const createHistoryBody = HistoryPayload.getCreateHistoryBodyPayload({
        userId: userId,
        questionId: questionId,
      });

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(createHistoryBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid user id",
      });
    });
  });

  describe("Given more than 2 user ids", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const userIds = [generateCUID(), generateCUID(), generateCUID()];
      const questionId = generateCUID();

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(
          HistoryPayload.getCreateHistoryBodyPayload({
            userId: userIds,
            questionId: questionId,
          })
        );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid userId. Array must contain exactly 2 element(s)",
      });
    });
  });

  describe("Given 2 duplicated user ids", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(
          HistoryPayload.getCreateHistoryBodyPayload({
            userId: [userId, userId],
            questionId: questionId,
          })
        );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Duplicate user ids",
      });
    });
  });

  describe("Given a non-cuid question id", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = "123";
      const createHistoryBody = HistoryPayload.getCreateHistoryBodyPayload({
        userId: userId,
        questionId: questionId,
      });

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(createHistoryBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid question id",
      });
    });
  });

  describe("Given a title less than 3 characters", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const createHistoryBody = HistoryPayload.getCreateHistoryBodyPayload({
        userId: userId,
        questionId: questionId,
      });
      createHistoryBody.title = "2c";

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(createHistoryBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid title. String must contain at least 3 character(s)",
      });
    });
  });

  describe("Given a topics with an empty array", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const createHistoryBody = HistoryPayload.getCreateHistoryBodyPayload({
        userId: userId,
        questionId: questionId,
      });
      createHistoryBody.topics = [];

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(createHistoryBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "At least one topic is required",
      });
    });
  });

  describe("Given a topics with duplicated topics", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const createHistoryBody = HistoryPayload.getCreateHistoryBodyPayload({
        userId: userId,
        questionId: questionId,
      });
      createHistoryBody.topics = ["ARRAY", "ARRAY"];

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(createHistoryBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Each topic must be unique",
      });
    });
  });

  describe("Given a topics with an invalid topic", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const createHistoryBody = HistoryPayload.getCreateHistoryBodyPayload({
        userId: userId,
        questionId: questionId,
      });
      createHistoryBody.topics = ["INVALID"];

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(createHistoryBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid topic",
      });
    });
  });

  describe("Given a complexity with an invalid complexity", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const createHistoryRequestBody =
        HistoryPayload.getCreateHistoryBodyPayload({
          userId: userId,
          questionId: questionId,
        });
      createHistoryRequestBody.complexity = "INVALID";

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(createHistoryRequestBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid complexity",
      });
    });
  });

  describe("Given a language with an invalid language", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const createHistoryRequestBody =
        HistoryPayload.getCreateHistoryBodyPayload({
          userId: userId,
          questionId: questionId,
        });
      createHistoryRequestBody.language = "INVALID";

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(createHistoryRequestBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid language",
      });
    });
  });

  describe("Given no request body", () => {
    it("should return 400 and an error message", async () => {
      // Act
      const { body, statusCode } = await supertest(app).post("/api/history");

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Request body is required",
      });
    });
  });

  describe("Given a request body with extra properties", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const createHistoryBody = HistoryPayload.getCreateHistoryBodyPayload({
        userId: userId,
        questionId: questionId,
      });

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send({ ...createHistoryBody, extra: "extra" });

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid properties in request body",
      });
    });
  });

  describe("Given a user id that does not exist", () => {
    it("should return 404 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const createHistoryBody = HistoryPayload.getCreateHistoryBodyPayload({
        userId: userId,
        questionId: questionId,
      });
      dbMock.user.findFirst = jest.fn().mockResolvedValueOnce(null);

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(createHistoryBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.NOT_FOUND);
      expect(body).toEqual({
        error: "NOT FOUND",
        message: "User id cannot be found",
      });
    });
  });

  describe("Given 2 user id with 1 that does not exist", () => {
    it("should return 404 and an error message", async () => {
      // Arrange
      const userIds = [generateCUID(), generateCUID()];
      const questionId = generateCUID();
      dbMock.user.findFirst = jest
        .fn()
        .mockResolvedValueOnce({
          id: userIds[0],
        })
        .mockResolvedValueOnce(null);

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(
          HistoryPayload.getCreateHistoryBodyPayload({
            userId: userIds,
            questionId: questionId,
          })
        );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.NOT_FOUND);
      expect(body).toEqual({
        error: "NOT FOUND",
        message: "User id cannot be found",
      });
    });
  });

  describe("Given a question id that does not exist", () => {
    it("should return 404 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const createHistoryBody = HistoryPayload.getCreateHistoryBodyPayload({
        userId: userId,
        questionId: questionId,
      });
      dbMock.user.findFirst = jest.fn().mockResolvedValueOnce({
        id: userId,
      });
      dbMock.question.findFirst = jest.fn().mockResolvedValueOnce(null);

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(createHistoryBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.NOT_FOUND);
      expect(body).toEqual({
        error: "NOT FOUND",
        message: "Question id cannot be found",
      });
    });
  });

  describe("Given a pair of user id and question id that already exists", () => {
    it("should return 409 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const createHistoryBody = HistoryPayload.getCreateHistoryBodyPayload({
        userId: userId,
        questionId: questionId,
      });

      dbMock.user.findFirst = jest.fn().mockResolvedValueOnce({
        id: userId,
      });
      dbMock.question.findFirst = jest.fn().mockResolvedValueOnce({
        id: questionId,
      });
      dbMock.history.findFirst = jest.fn().mockResolvedValueOnce({
        userId: userId,
        questionId: questionId,
      });

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(createHistoryBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.CONFLICT);
      expect(body).toEqual({
        error: "CONFLICT",
        message: "History already exists",
      });
    });
  });

  describe("Given the database is down", () => {
    it("should return 500 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const createHistoryBody = HistoryPayload.getCreateHistoryBodyPayload({
        userId: userId,
        questionId: questionId,
      });

      dbMock.user.findFirst = jest.fn().mockRejectedValueOnce({ id: userId });
      dbMock.question.findFirst = jest
        .fn()
        .mockRejectedValueOnce({ question: questionId });
      dbMock.history.findFirst = jest.fn().mockRejectedValueOnce(null);
      dbMock.history.createMany = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database is down"));

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/history")
        .send(createHistoryBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(body).toEqual({
        error: "INTERNAL SERVER ERROR",
        message: "An unexpected error has occurred",
      });
    });
  });
});
