import db from "../../models/db";

export const login = async (role: string = "ADMIN") => {
  const response = await fetch("http://localhost:5050/auth/api/loginByEmail", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email:
        role === "ADMIN"
          ? process.env.TEST_ADMIN_EMAIL
          : process.env.TEST_USER_EMAIL,
      password:
        role === "ADMIN"
          ? process.env.TEST_ADMIN_PASSWORD
          : process.env.TEST_USER_PASSWORD,
    }),
  });
};

export const loginAndCreateHistory = async (purpose: string) => {
  const jwtCookie = await login();

  await db.history.create({
    data: {
      id: "test-" + purpose + "-history-id",
      userId: process.env.TEST_USER_ID,
      questionId: process.env.TEST_QUESTION_ID,
    },
  });
  return jwtCookie;
};
