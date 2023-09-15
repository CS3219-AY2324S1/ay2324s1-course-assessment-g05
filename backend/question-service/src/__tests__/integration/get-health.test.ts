import HttpStatusCode from "../../lib/HttpStatusCode";
import createServer from "../utils/server";
import supertest from "supertest";

const app = createServer();

describe("GET /health", () => {
  describe("Given the database is connected successfully", () => {
    it("should return 200 with a json message of healthy", async () => {
      const { body, statusCode } = await supertest(app).get("/api/health");
      expect(statusCode).toBe(HttpStatusCode.OK);
      expect(body).toEqual({ message: "Healthy" });
    });
  });
});
