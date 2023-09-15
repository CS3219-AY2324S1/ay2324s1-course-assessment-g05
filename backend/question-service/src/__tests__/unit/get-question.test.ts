import supertest from "supertest";
import createServer from "../utils/server";
import HttpStatusCode from "../../lib/HttpStatusCode";

const app = createServer();

describe("GET /questions/:questionId", () => {
  describe("Given an existing question id in the database", () => {
    it("should return 200 with the question", async () => {
      // Arrange
      // TODO: mock the database
      const questionId = "existingquestionid123";

      // Act
      const { body, statusCode } = await supertest(app).get(
        `/api/questions/${questionId}`
      );

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.OK);
    });
  });
});
