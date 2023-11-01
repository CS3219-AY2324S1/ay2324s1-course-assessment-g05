import supertest from "supertest";
import HttpStatusCode from "../../common/HttpStatusCode";
import { VerificationMail } from "../../lib/email/verificationMail";
import { UserService } from "../../lib/user_api_helpers";
import createUnitTestServer from "../utils/server";
import db from "../../lib/db";
import { Payloads } from "../utils/payloads";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const app = createUnitTestServer();
const userServiceMock = UserService as jest.Mocked<typeof UserService>;
const dbMock = db as jest.Mocked<typeof db>;
const mailerMock = VerificationMail as jest.Mocked<typeof VerificationMail>;
const jwtMock = jwt as jest.Mocked<typeof jwt>;
const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;

// env variables mocking
process.env.EMAIL_RESET_SECRET = "testEmailResetSecret";
process.env.SOMETHING = "";

describe("PUT /auth/api/verifyEmail/:email/:token", () => {});

describe("PUT /auth/api/sendPasswordResetEmail/:email", () => {});

describe("PUT /auth/api/changePassword/:id", () => {
  describe("Given a change password request body with a valid token", () => {
    it("should return 204 and update the password", async () => {
      // Assign
      const token = "testPasswordResetToken";
      const hashedNewPassword = "testHashedNewPassword";
      dbMock.user.findFirst = jest.fn().mockResolvedValue({
        email: "testuser@email.com",
        passwordResetToken: "testPasswordResetToken",
      });
      jwtMock.verify = jest.fn().mockReturnValue({
        email: "testuser@email.com",
      });
      userServiceMock.updatePassword = jest.fn().mockResolvedValue({
        status: HttpStatusCode.NO_CONTENT,
      });

      // Act
      const { status } = await supertest(app)
        .put("/auth/api/changePassword/testUserId")
        .send({
          token: token,
          hashedNewPassword: hashedNewPassword,
        });

      // Assert
      expect(status).toBe(HttpStatusCode.NO_CONTENT);
      expect(dbMock.user.findFirst).toBeCalledTimes(1);
      expect(dbMock.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: "testUserId",
        },
        select: {
          email: true,
          passwordResetToken: true,
        },
      });
      expect(jwtMock.verify).toBeCalledTimes(1);
      expect(userServiceMock.updatePassword).toHaveBeenCalledWith(
        "testUserId",
        {
          password: hashedNewPassword,
          passwordResetToken: "",
        }
      );
    });
  });

  describe("Given a change password request body with a not-self token", () => {
    it("should return 403 with an error message", async () => {
      // Assign
      const token = "invalidToken";
      const hashedNewPassword = "testHashedNewPassword";
      dbMock.user.findFirst = jest.fn().mockResolvedValue({
        email: "testuser@email.com",
      });
      jwtMock.verify = jest.fn().mockResolvedValue({
        email: "someoneelse@email.com",
      });

      // Act
      const { body, status } = await supertest(app)
        .put(`/auth/api/changePassword/testUserId`)
        .send({
          token: token,
          hashedNewPassword: hashedNewPassword,
        });

      // Assert
      expect(status).toBe(HttpStatusCode.FORBIDDEN);
      expect(body).toEqual({
        error: "FORBIDDEN",
        message: "This reset password link is invalid.",
      });
    });
  });

  describe("Given a change password request body with an invalid token", () => {
    it("should return 403 with an error message", async () => {
      // Assign
      const token = "invalidToken";
      const hashedNewPassword = "testHashedNewPassword";
      dbMock.user.findFirst = jest.fn().mockResolvedValue({
        email: "testuser@email.com",
      });
      jwtMock.verify = jest.fn().mockImplementation(() => {
        throw new Error("Invalid token");
      });

      // Act
      const { body, status } = await supertest(app)
        .put(`/auth/api/changePassword/testUserId`)
        .send({
          token: token,
          hashedNewPassword: hashedNewPassword,
        });

      // Assert
      expect(status).toBe(HttpStatusCode.FORBIDDEN);
      expect(body).toEqual({
        error: "FORBIDDEN",
        message: "This reset password link is invalid.",
      });
      expect(dbMock.user.findFirst).not.toBeCalled();
    });
  });

  describe("Given a change password request body with an invalid user id", () => {
    it("should return 403 with an error message", async () => {
      // Assign
      const token = "testToken";
      const hashedNewPassword = "testHashedNewPassword";
      dbMock.user.findFirst = jest.fn().mockResolvedValue(null);
      jwtMock.verify = jest.fn().mockReturnValue({
        email: "testuser@email.com",
      });

      // Act
      const { body, status } = await supertest(app)
        .put(`/auth/api/changePassword/testUserId`)
        .send({
          token: token,
          hashedNewPassword: hashedNewPassword,
        });

      // Assert
      expect(status).toBe(HttpStatusCode.FORBIDDEN);
      expect(body).toEqual({
        error: "FORBIDDEN",
        message: "This reset password link is invalid.",
      });
    });
  });

  describe("Given a change password request body with a request body with extra properties", () => {
    it("should return 400 with an error message", async () => {
      // Mocked functions that should not be called
      dbMock.user.findFirst = jest.fn();
      jwtMock.verify = jest.fn();
      userServiceMock.updatePassword = jest.fn();

      // Act
      const { body, status } = await supertest(app)
        .put(`/auth/api/changePassword/testUserId`)
        .send({
          token: "testToken",
          hashedNewPassword: "testHashedNewPassword",
          extraProperty: "testExtraProperty",
        });

      // Assert
      expect(status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Invalid property.",
      });
      expect(dbMock.user.findFirst).not.toBeCalled();
      expect(jwtMock.verify).not.toBeCalled();
      expect(userServiceMock.updatePassword).not.toBeCalled();
    });
  });

  describe("Given a change password request with empty body", () => {
    it("should return 400 with an error message", async () => {
      // Mocked functions that should not be called
      dbMock.user.findFirst = jest.fn();
      jwtMock.verify = jest.fn();
      userServiceMock.updatePassword = jest.fn();

      // Act
      const { body, status } = await supertest(app)
        .put(`/auth/api/changePassword/testUserId`)
        .send({});

      // Assert
      expect(status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Request body is missing.",
      });
      expect(dbMock.user.findFirst).not.toBeCalled();
      expect(jwtMock.verify).not.toBeCalled();
      expect(userServiceMock.updatePassword).not.toBeCalled();
    });
  });

  describe("Given a change password request with missing hashedNewPassword", () => {
    it("should return 400 with an error message", async () => {
      // Mocked functions that should not be called
      dbMock.user.findFirst = jest.fn();
      jwtMock.verify = jest.fn();
      userServiceMock.updatePassword = jest.fn();

      // Act
      const { body, status } = await supertest(app)
        .put(`/auth/api/changePassword/testUserId`)
        .send({
          token: "testToken",
        });

      // Assert
      expect(status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Change password failed.",
      });
      expect(dbMock.user.findFirst).not.toBeCalled();
      expect(jwtMock.verify).not.toBeCalled();
      expect(userServiceMock.updatePassword).not.toBeCalled();
    });
  });

  describe("Given a change password request with missing token and oldPassword", () => {
    it("should return 400 with an error message", async () => {
      // Mocked functions that should not be called
      dbMock.user.findFirst = jest.fn();
      jwtMock.verify = jest.fn();
      userServiceMock.updatePassword = jest.fn();

      // Act
      const { body, status } = await supertest(app)
        .put(`/auth/api/changePassword/testUserId`)
        .send({
          hashedNewPassword: "testHashedNewPassword",
        });

      // Assert
      expect(status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(body).toEqual({
        error: "BAD REQUEST",
        message: "Token or password is required.",
      });
      expect(dbMock.user.findFirst).not.toBeCalled();
      expect(jwtMock.verify).not.toBeCalled();
      expect(userServiceMock.updatePassword).not.toBeCalled();
    });
  });

  describe("Given a change password request with valid oldPassword", () => {
    it("should return 204 and update the password", async () => {
      // Assign
      const oldPassword = "testOldPassword";
      const hashedNewPassword = "testHashedNewPassword";
      dbMock.user.findFirst = jest.fn().mockResolvedValue({
        password: "testOldPassword",
      });
      bcryptMock.compare = jest.fn().mockResolvedValue(true);
      userServiceMock.updatePassword = jest.fn().mockResolvedValue({
        status: HttpStatusCode.NO_CONTENT,
      });

      // Act
      const { status } = await supertest(app)
        .put("/auth/api/changePassword/testUserId")
        .send({
          oldPassword: oldPassword,
          hashedNewPassword: hashedNewPassword,
        });

      // Assert
      expect(status).toBe(HttpStatusCode.NO_CONTENT);
      expect(dbMock.user.findFirst).toBeCalledTimes(1);
      expect(dbMock.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: "testUserId",
        },
        select: {
          password: true,
        },
      });
      expect(bcryptMock.compare).toBeCalledTimes(1);
      expect(bcryptMock.compare).toHaveBeenCalledWith(
        oldPassword,
        "testOldPassword"
      );
      expect(userServiceMock.updatePassword).toBeCalledTimes(1);
      expect(userServiceMock.updatePassword).toHaveBeenCalledWith(
        "testUserId",
        {
          password: hashedNewPassword,
        }
      );
    });
  });

  describe("Given a change password request with invalid oldPassword", () => {
    it("should return 403 with an error message", async () => {
      // Assign
      const oldPassword = "testOldPassword";
      const hashedNewPassword = "testHashedNewPassword";
      dbMock.user.findFirst = jest.fn().mockResolvedValue({
        password: "testOldPassword",
      });
      bcryptMock.compare = jest.fn().mockResolvedValue(false);

      // Act
      const { body, status } = await supertest(app)
        .put("/auth/api/changePassword/testUserId")
        .send({
          oldPassword: oldPassword,
          hashedNewPassword: hashedNewPassword,
        });

      // Assert
      expect(status).toBe(HttpStatusCode.FORBIDDEN);
      expect(body).toEqual({
        error: "FORBIDDEN",
        message: "You don't have the permission to change password.",
      });
      expect(dbMock.user.findFirst).toBeCalledTimes(1);
      expect(dbMock.user.findFirst).toHaveBeenCalledWith({
        where: {
          id: "testUserId",
        },
        select: {
          password: true,
        },
      });
      expect(bcryptMock.compare).toBeCalledTimes(1);
      expect(bcryptMock.compare).toHaveBeenCalledWith(
        oldPassword,
        "testOldPassword"
      );
    });
  });
});
