import supertest from "supertest";
import HttpStatusCode from "../../lib/HttpStatusCode";
import createServer from "../utils/server";

const app = createServer();

describe("GET /health", () => {
  it("should return 200 with a message in json", async () => {
    // Arrange
    const expectedMessage = "Healthy";

    // Act
    const { body, statusCode } = await supertest(app).get("/api/health");

    // Assert
    expect(statusCode).toBe(HttpStatusCode.OK);
    expect(body.message).toBe(expectedMessage);
  });
});
