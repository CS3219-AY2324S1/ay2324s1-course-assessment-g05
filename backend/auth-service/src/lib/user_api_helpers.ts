/* -------------------------------------------------------------------------- */
/*                   Helpers to call User Service endpoints                   */
/* -------------------------------------------------------------------------- */

import { UserProfile } from "../common/types";

const getUserServiceEndpoint = (): string => {
  return process.env.USER_SERVICE_ENDPOINT || "http://localhost:5005";
};

const createUser = async (user: UserProfile) => {
  const res = await fetch(`${getUserServiceEndpoint()}/api/users/`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" },
  });

  return res;
};

const getUserByEmail = async (email: string) => {
  const res = await fetch(
    `${getUserServiceEndpoint()}/api/users/email?email=${email}`
  );
  return res;
};

const getUserById = async (id: string) => {
  const res = await fetch(`${getUserServiceEndpoint()}/api/users/${id}`);
  return res;
};

export { createUser, getUserServiceEndpoint, getUserById, getUserByEmail };
