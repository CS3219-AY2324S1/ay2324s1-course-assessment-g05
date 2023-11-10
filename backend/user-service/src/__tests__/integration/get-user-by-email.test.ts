import supertest, { Response } from "supertest";
import { createIntegrationTestServer } from "../utils/server";
import { login, logout } from "../utils/setup";
import HttpStatusCode from "../../lib/enums/HttpStatusCode";

const app = createIntegrationTestServer();

// global jwtCookie
let jwtCookie: string;

// env variables
process.env.NODE_ENV = "test";

describe("GET /user/api/users/email", () => {
  beforeAll(async () => {
    jwtCookie = await login();
  });

  afterAll(async () => {
    jwtCookie = await logout();
  });

  describe("Given a valid userId", () => {
    it("should return 200 with a user object in json", async () => {
      // Assign
      const email = "johndoe@gmail.com";

      // Act
      const response = await supertest(app)
        .get(`/user/api/users/email`)
        .query({ email: email })
        .set("Cookie", jwtCookie);

      // Assert
      expect(response.status).toBe(HttpStatusCode.OK);
      isCorrectUser(response);
    });
  });

  describe("Given a non-existent userId", () => {
    it("should return 404 with an error message in json", async () => {
      // Assign
      const email = "nonexisting@email.com";

      // Act
      const response = await supertest(app)
        .get(`/user/api/users/email`)
        .query({ email: email })
        .set("Cookie", jwtCookie);

      // Assert
      expect(response.status).toBe(HttpStatusCode.NOT_FOUND);
      expect(response.body).toEqual({
        error: "NOT FOUND",
        message: `User with email ${email} cannot be found.`,
      });
    });
  });

  describe("Given the request is not authenticated", () => {
    it("should return 401 with an error message in json", async () => {
      // Assign
      const email = "johndoe@gmail.com";

      // Act
      const response = await supertest(app)
        .get(`/user/api/users/email`)
        .query({ email: email });

      // Assert
      expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
      expect(response.body).toEqual({
        error: "UNAUTHORISED",
        message: "Unauthorised",
      });
    });
  });

  describe("Given the request has jwt token but is invalid", () => {
    it("should return 401 with an error message in json", async () => {
      // Assign
      const email = "johndoe@gmail.com";

      // Act
      const response = await supertest(app)
        .get(`/user/api/users/email`)
        .query({ email: email })
        .set("Cookie", "jwt=invalid-jwt");

      // Assert
      expect(response.status).toBe(HttpStatusCode.UNAUTHORIZED);
      expect(response.body).toEqual({
        error: "UNAUTHORISED",
        message: "Unauthorised",
      });
    });
  });
});

const isCorrectUser = (response: Response) => {
  const expectedProperties = [
    "id",
    "name",
    "email",
    "role",
    "image",
    "bio",
    "gender",
    "preferences",
    "createdOn",
    "updatedOn",
  ];
  expectedProperties.forEach((property) => {
    expect(response.body).toHaveProperty(property);
  });
  expect(response.body.name).toEqual("John Doe");
  expect(response.body.role).toEqual("USER");
  expect(response.body).not.toHaveProperty("password");
};
