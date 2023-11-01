import supertest from "supertest";
import HttpStatusCode from "../../common/HttpStatusCode";
import { VerificationMail } from "../../lib/email/verificationMail";
import { UserService } from "../../lib/user_api_helpers";
import createUnitTestServer from "../utils/server";
import db from "../../lib/db";
import { Payloads } from "../utils/payloads";

const app = createUnitTestServer();
const userServiceMock = UserService as jest.Mocked<typeof UserService>;
const dbMock = db as jest.Mocked<typeof db>;
const mailerMock = VerificationMail as jest.Mocked<typeof VerificationMail>;

describe("POST /auth/api/registerByEmail", () => {
  describe("Given a valid user creation request body", () => {
    it("should return 201", async () => {
      // mock UserService.createUser
      userServiceMock.createUser = jest.fn().mockResolvedValue({
        status: HttpStatusCode.CREATED,
        json: jest.fn().mockResolvedValue({
          id: "testUserId",
          email: "testuser@email.com",
          verificationToken: "testToken",
        }),
      });

      // mock VerificationMail.send
      mailerMock.prototype.send = jest.fn().mockResolvedValue(true);

      // Act
      const { body, status } = await supertest(app)
        .post("/auth/api/registerByEmail")
        .send({
          name: "testUser",
          email: "Test Username",
          password: "testPassword",
        });

      // Assert
      expect(status).toBe(HttpStatusCode.CREATED);
      expect(body).toEqual({
        success: true,
        userId: "testUserId",
      });
    });
  });

  describe("Given user service returns an 4xx error due to invalid request", () => {
    describe("Given user service returns 400", () => {
      it("should return 400", async () => {
        // Assign
        userServiceMock.createUser = jest.fn().mockResolvedValue({
          status: HttpStatusCode.BAD_REQUEST,
          json: jest.fn().mockResolvedValue({
            error: "BAD REQUEST",
            message: "Email and password are required",
          }),
        });

        // Act
        const { body, status } = await supertest(app)
          .post("/auth/api/registerByEmail")
          .send({
            name: "testUser",
            email: "Test Username",
            password: "testPassword",
          });

        // Assert
        expect(status).toBe(HttpStatusCode.BAD_REQUEST);
        expect(body).toEqual({
          error: "BAD REQUEST",
          message: "Email and password are required",
        });
      });
    });

    describe("Given user service returns 409", () => {});
  });

  describe("Given user service is down", () => {
    it("should return 500 with error message", async () => {
      // Assign
      userServiceMock.createUser = jest
        .fn()
        .mockRejectedValue(new Error("User service is down"));

      // Act
      const { body, status } = await supertest(app)
        .post("/auth/api/registerByEmail")
        .send({
          name: "testUser",
          email: "Test Username",
          password: "testPassword",
        });

      // Assert
      expect(status).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
      expect(body).toEqual({
        error: "INTERNAL SERVER ERROR",
        message: "User service is down.",
      });
    });
  });
});

describe("POST /auth/api/loginByEmail", () => {
  describe("Given a valid user login request body", () => {
    it("should return 200 with the user information without secrets", async () => {
      // Assign
      const userPassword = "testPassword";
      dbMock.user.findFirst = jest
        .fn()
        .mockResolvedValue(
          Payloads.getDatabaseUserWithPassword({ password: userPassword })
        );

      // Act
      const { body, status } = await supertest(app)
        .post("/auth/api/loginByEmail")
        .send({
          email: "testuser@email.com",
          password: userPassword,
        });

      // Assert
      expect(status).toBe(HttpStatusCode.OK);

      const expectedReturnedUser = Payloads.getUserPayloadWithoutSecrets();
      expect(body).toEqual({
        success: true,
        user: expectedReturnedUser,
      });
    });
  });
});

describe("POST /auth/api/logout", () => {
  it("should return 200 and clear the cookie", async () => {
    // Assign
    const jwtCookie = "jwt=testJwtCookie";

    // Act
    const response = await supertest(app)
      .post("/auth/api/logout")
      .set("Cookie", jwtCookie)
      .send();

    // Assert
    expect(response.status).toBe(HttpStatusCode.OK);
    expect(response.body).toEqual({
      success: true,
    });
    // ensure cookie is cleared
    expect(response.header["set-cookie"][0]).toMatch(/jwt=;/);
  });
});
