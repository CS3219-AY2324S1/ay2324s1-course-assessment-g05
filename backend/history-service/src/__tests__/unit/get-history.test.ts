import supertest from "supertest";
import createServer from "../utils/server";
import db from "../../lib/db";
import { HistoryPayload, generateCUID } from "../utils/payloads";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";

// set up for unit test
const app = createServer();
const dbMock = db as jest.Mocked<typeof db>;

describe("GET /api/history", () => {
  describe("Given a valid user id", () => {
    it("should return 200 with a list of history", async () => {
      // Arrange
      const userId = generateCUID();
      const historyPayload = HistoryPayload.getHistoryPayload({
        userId: userId,
      });
      dbMock.history.findMany = jest.fn().mockResolvedValueOnce(historyPayload);

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/history?userId=${userId}`
      );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.OK);
      expect(body).toEqual({
        count: historyPayload.length,
        data: historyPayload,
      });
    });
  });

  describe("Given a valid question id", () => {
    it("should return 200 with a list of history", async () => {
      // Arrange
      const questionId = generateCUID();
      const historyPayload = HistoryPayload.getHistoryPayload({
        questionId: questionId,
      });
      dbMock.history.findMany = jest.fn().mockResolvedValueOnce(historyPayload);

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/history?questionId=${questionId}`
      );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.OK);
      expect(body).toEqual({
        count: historyPayload.length,
        data: historyPayload,
      });
    });
  });

  describe("Given a valid pair of user id and question id", () => {
    it("should return 200 with a list of history of length 1", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const historyPayload = HistoryPayload.getHistoryPayload({
        userId: userId,
        questionId: questionId,
      });
      dbMock.history.findMany = jest.fn().mockResolvedValueOnce(historyPayload);

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/history?userId=${userId}&questionId=${questionId}`
      );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.OK);
      expect(body).toEqual({
        count: historyPayload.length,
        data: historyPayload,
      });
      expect(body.data.length).toBe(1);
    });
  });

  describe("Given an array of user ids", () => {
    it("should return 200 with a list of history", async () => {
      // Arrange
      const userIdList = [generateCUID(), generateCUID(), generateCUID()];
      const historyPayload: {}[] = [];
      userIdList.forEach((userId) => {
        historyPayload.push(...HistoryPayload.getHistoryPayload({ userId }));
      });
      dbMock.history.findMany = jest.fn().mockResolvedValueOnce(historyPayload);

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/history?userId=${userIdList[0]}&userId=${userIdList[1]}&userId=${userIdList[2]}`
      );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.OK);
      expect(body).toEqual({
        count: historyPayload.length,
        data: historyPayload,
      });
    });
  });

  describe("Given an array of question ids", () => {
    it("should return 200 with a list of history", async () => {
      // Arrange
      const questionIdList = [generateCUID(), generateCUID(), generateCUID()];
      const historyPayload: {}[] = [];
      questionIdList.forEach((questionId) => {
        historyPayload.push(
          ...HistoryPayload.getHistoryPayload({ questionId })
        );
      });
      dbMock.history.findMany = jest.fn().mockResolvedValueOnce(historyPayload);

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/history?questionId=${questionIdList[0]}&questionId=${questionIdList[1]}&questionId=${questionIdList[2]}`
      );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.OK);
      expect(body).toEqual({
        count: historyPayload.length,
        data: historyPayload,
      });
    });
  });

  describe("Given a valid user id with extra query parameters", () => {
    it("should return 200 with a list of history", async () => {
      // Arrange
      const userId = generateCUID();
      const historyPayload = HistoryPayload.getHistoryPayload({
        userId: userId,
      });
      dbMock.history.findMany = jest.fn().mockResolvedValueOnce(historyPayload);

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/history?userId=${userId}&extraParam=${generateCUID()}`
      );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.OK);
      expect(body).toEqual({
        count: historyPayload.length,
        data: historyPayload,
      });
    });
  });

  describe("Given a non-cuid user id", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const userId = "123";

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/history?userId=${userId}`
      );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid user id",
      });
    });
  });

  describe("Given 2 duplicated user ids", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const userId = generateCUID();

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/history?userId=${userId}&userId=${userId}`
      );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Duplicate user ids",
      });
    });
  });

  describe("Given question ids more than 10", () => {
    it("should return 400 and an error message", async () => {
      // Arrange
      const questionIdList = [];
      for (let i = 0; i < 11; i++) {
        questionIdList.push(generateCUID());
      }

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/history?questionId=${questionIdList.join("&questionId=")}`
      );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid questionId. Array must contain at most 10 element(s)",
      });
    });
  });

  describe("Given no request query parameters", () => {
    it("should return 400 and an error message", async () => {
      // Act
      const { body, statusCode } = await supertest(app).get("/api/history");

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "At least one of userId and questionId is required",
      });
    });
  });

  describe("Given no history record found from a valid pair of user id and question id", () => {
    it("should return 404 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      dbMock.history.findMany = jest.fn().mockResolvedValueOnce([]);

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/history?userId=${userId}&questionId=${questionId}`
      );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.NOT_FOUND);
      expect(body).toEqual({
        error: "NOT FOUND",
        message: "No history found",
      });
    });
  });

  describe("Given the database is down", () => {
    it("should return 500 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      dbMock.history.findMany = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database is down"));

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/history?userId=${userId}`
      );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(body).toEqual({
        error: "INTERNAL SERVER ERROR",
        message: "An unexpected error has occurred",
      });
    });
  });
});

describe("GET /api/history/user/:userId/question/:questionId/code", () => {
  describe("Given a valid user id and question id", () => {
    it("should return 200 with a code", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      const code = "console.log('Hello World!');";

      dbMock.history.findFirst = jest.fn().mockResolvedValueOnce({
        code,
      });

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/history/user/${userId}/question/${questionId}/code`
      );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.OK);
      expect(body).toEqual({ code });
    });
  });

  describe("Given a user id and a question id with no code submission", () => {
    it("should return 404 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      dbMock.history.findFirst = jest.fn().mockResolvedValueOnce(null);

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/history/user/${userId}/question/${questionId}/code`
      );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.NOT_FOUND);
      expect(body).toEqual({
        error: "NOT FOUND",
        message: "No code submission found",
      });
    });
  });

  describe("Given database is down", () => {
    it("should return 500 and an error message", async () => {
      // Arrange
      const userId = generateCUID();
      const questionId = generateCUID();
      dbMock.history.findFirst = jest
        .fn()
        .mockRejectedValueOnce(new Error("Database is down"));

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/history/user/${userId}/question/${questionId}/code`
      );

      // Assert
      expect(statusCode).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(body).toEqual({
        error: "INTERNAL SERVER ERROR",
        message: "An unexpected error has occurred",
      });
    });
  });
});
