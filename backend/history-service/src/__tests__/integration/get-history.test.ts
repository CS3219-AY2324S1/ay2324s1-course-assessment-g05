import { createIntegrationTestServer } from "../utils/server";

const app = createIntegrationTestServer();

// global jwtCookie
let jwtCookie: string;

// env variables
process.env.NODE_ENV = "test";

describe("GET /history/api/history", () => {
  describe("Given the user has history", () => {
    beforeAll(async () => {});
  });
});
