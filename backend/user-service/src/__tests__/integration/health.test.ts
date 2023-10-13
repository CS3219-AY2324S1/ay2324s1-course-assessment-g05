import supertest from "supertest";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";
import createServer from "../utils/server";

const app = createServer();

describe("GET /health", () => {
  it("should return 200 with a message in json", async () => {});
});
