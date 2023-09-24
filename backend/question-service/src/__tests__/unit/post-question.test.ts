import questionDb from "../../models/database/schema/question";
import * as TestPayload from "../utils/payloads";
import createServer from "../utils/server";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";
import supertest from "supertest";

const app = createServer();

const dbMock = questionDb as jest.Mocked<typeof questionDb>;

describe("POST /questions", () => {
  describe("Given a valid question payload", () => {
    it("should return 201 with a question created message", async () => {
      // Arrange
      const questionPayload = TestPayload.getCreateQuestionRequestBody();
      dbMock.findOne = jest.fn().mockResolvedValue(null);
      dbMock.create = jest.fn().mockResolvedValue(null);

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/questions")
        .send(questionPayload);

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.CREATED);
      expect(body).toEqual({ message: "Question created." });
    });
  });

  describe("Given a duplicate question title", () => {
    it("should return 409 with a conflict message", async () => {
      // Arrange
      const questionPayload = TestPayload.getCreateQuestionRequestBody();
      dbMock.findOne = jest
        .fn()
        .mockResolvedValue(TestPayload.getQuestionPayload());

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/questions")
        .send(questionPayload);

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.CONFLICT);
      expect(body).toEqual({
        error: "CONFLICT",
        message: "Question title already exists",
      });
    });
  });

  describe("Given an empty request body", () => {
    it("should return 400 with an empty request body alert message", async () => {
      // Act
      const { body, statusCode } = await supertest(app).post("/api/questions");

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Request body is missing.",
      });
    });
  });

  describe("Given an invalid url in the request body", () => {
    it("should return 400 with a zod error message indicating that there is an invalid url", async () => {
      // Arrange
      const questionPayload = TestPayload.getCreateQuestionRequestBody();
      questionPayload.url = "invalidurl";

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/questions")
        .send(questionPayload);

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(body.message).toEqual("Invalid url");
    });
  });

  describe("Given duplicated topics in the request body", () => {
    it("should return 400 with a zod error message indicating that there are duplicated topics", async () => {
      // Arrange
      const createQuestionRequestBody =
        TestPayload.getCreateQuestionRequestBody();
      createQuestionRequestBody.topics.push(
        createQuestionRequestBody.topics[0]
      );

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/questions")
        .send(createQuestionRequestBody);

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(body.message).toEqual("Each topic must be unique.");
    });
  });

  describe("Given an example with no input in the request body", () => {
    it("should return 400 with a zod error message indicating that the example is invalid", async () => {
      // Arrange
      const createQuestionRequestBody =
        TestPayload.getCreateQuestionRequestBody();
      const actualRequestBody = {
        ...createQuestionRequestBody,
        examples: [
          {
            output: "output",
            explanation: "explanation",
          },
        ],
      };

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/questions")
        .send(actualRequestBody);

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(body.message).toEqual("Input in examples is required.");
    });
  });

  describe("Given an empty constraints array in the request body", () => {
    it("should return 400 with a zod error message indicating that the constraints array is empty", async () => {
      // Arrange
      const CreateQuestionRequestBody =
        TestPayload.getCreateQuestionRequestBody();
      const actualRequestBody = {
        ...CreateQuestionRequestBody,
        constraints: [],
      };

      // Act
      const { body, statusCode } = await supertest(app)
        .post("/api/questions")
        .send(actualRequestBody);

      // Assert
      expect(statusCode).toEqual(HttpStatusCode.BAD_REQUEST);
      expect(body.message).toEqual("At least one constraint is required.");
    });
  });
});
