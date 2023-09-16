import * as testPayloads from "../utils/payloads";
import supertest from "supertest";
import createServer from "../utils/server";
import db from "../../lib/db";
import HttpStatusCode from "../../lib/HttpStatusCode";

const dbMock = db;
const app = createServer();

describe("PUT /api/users/:userId", () => {
  describe("Given an existing user id with valid request body payload", () => {
    it("should return 204 with no content", async () => {
      // Arrange
      const userId = "existinguserid123";
      const requestBody = testPayloads.getPostUserPayload();
      const user = testPayloads.getUserPayload({ userId });
      dbMock.user.findFirst = jest
        .fn()
        .mockResolvedValueOnce(user)
        .mockResolvedValueOnce(null);
      dbMock.user.update = jest.fn().mockResolvedValue(null);

      // Act
      const { statusCode } = await supertest(app)
        .put(`/api/users/${userId}`)
        .send(requestBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.NO_CONTENT);
      expect(dbMock.user.findFirst).toBeCalledWith({
        where: {
          id: userId,
        },
      });
      expect(dbMock.user.update).toBeCalledWith({
        where: {
          id: userId,
        },
        data: requestBody,
      });
    });
  });

  describe("Given a non-existing user id", () => {
    it("should return 404 with an error message in json", async () => {
      // Arrange
      const userId = "nonexistinguserid123";
      const requestBody = testPayloads.getPostUserPayload();
      dbMock.user.findFirst = jest.fn().mockResolvedValue(null);

      // Act
      const { body, statusCode } = await supertest(app)
        .put(`/api/users/${userId}`)
        .send(requestBody);

      // Assert
      expect(dbMock.user.findFirst).toBeCalledWith({
        where: {
          id: userId,
        },
      });
      expect(statusCode).toBe(HttpStatusCode.NOT_FOUND);
      expect(body.error).toBe("NOT FOUND");
      expect(body.message).toBe(`User with id ${userId} cannot be found.`);
    });
  });

  describe("Given an existing user id with empty request body", () => {
    it("should return 400 with an error message in json", async () => {
      // Arrange
      const userId = "existinguserid123";
      const requestBody = {};

      // Act
      const { body, statusCode } = await supertest(app)
        .put(`/api/users/${userId}`)
        .send(requestBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body.error).toBe("BAD REQUEST");
      expect(body.message).toBe("Request body is missing.");
    });
  });

  describe("Given an existing user id with invalid request body", () => {
    it("should return 400 with an error message in json", async () => {
      // Arrange
      const userId = "existinguserid123";
      let requestBody = testPayloads.getPostUserPayload();
      requestBody.email = "invalidemail";

      // Act
      const { body, statusCode } = await supertest(app)
        .put(`/api/users/${userId}`)
        .send(requestBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body.error).toBe("BAD REQUEST");
      expect(body.message).not.toBeNull();
    });
  });

  describe("Given an existing user id with duplicated email", () => {
    it("should return 409 with an error message in json", async () => {
      // Arrange
      const email = "duplicated@email.com";
      let requestBody = testPayloads.getPostUserPayload();
      requestBody.email = email;
      const user = testPayloads.getUserPayload({});
      dbMock.user.findFirst = jest
        .fn()
        .mockResolvedValueOnce(user)
        .mockResolvedValueOnce(null);

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/users")
        .send(requestBody);

      // Assert
      expect(statusCode).toBe(HttpStatusCode.CONFLICT);
      expect(body.error).toBe("CONFLICT");
      expect(body.message).toBe(`User with email ${email} already exists.`);
    });
  });
});
