/* -------------------------------------------------------------------------- */
/*                   Helpers to call User Service endpoints                   */
/* -------------------------------------------------------------------------- */

import { UserProfile } from "../common/types";
import { getServiceSecret } from "./utils";

const getUserServiceEndpoint = (): string => {
  return process.env.USER_SERVICE_ENDPOINT || "http://localhost:5005";
};

const createUser = async (user: UserProfile) => {
  const res = await fetch(`${getUserServiceEndpoint()}/api/users/`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
      bypass: getServiceSecret(),
    },
  });

  return res;
};

const getUserByEmail = async (email: string) => {
  const res = await fetch(
    `${getUserServiceEndpoint()}/api/users/email?email=${email}`,
    {
      headers: {
        "Content-Type": "application/json",
        bypass: getServiceSecret(),
      },
    }
  );
  return res;
};

const getUserById = async (id: string) => {
  const res = await fetch(`${getUserServiceEndpoint()}/api/users/${id}`, {
    headers: {
      "Content-Type": "application/json",
      bypass: getServiceSecret(),
    },
  });
  return res;
};

const verifyEmail = async(email:string, token:string) => {
  const res = await fetch(`${getUserServiceEndpoint()}/api/users/verifyEmail/${email}/${token}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      bypass: getServiceSecret(),
    },
  });

  return res;
}

export { createUser, getUserServiceEndpoint, getUserById, getUserByEmail, verifyEmail };
