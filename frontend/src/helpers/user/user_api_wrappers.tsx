import api from "@/helpers/endpoint";
import { getLogger } from "@/helpers/logger";
import { HTTP_METHODS, SERVICE } from "@/types/enums"; 
import { revalidateTag } from "next/cache";
import { Status, Role } from "@/types/enums";
import User from "../../types/user";

const logger = getLogger("user_api_wrappers");

const service = SERVICE.USER;
const scope = [SERVICE.USER];

/**
 * get: /api/user
 * Retrieves the user information from the API
 * @returns {Promise<User>} the user object
 */
export async function getUser(email: string): Promise<User> {
  let user: User = {
    id: "",
    name: "",
    email: "",
    role: Role.USER,

    image: "",
    bio: "",
    gender: "",
    
    status: Status.ACTIVE,
    createdOn: new Date(),
    updatedOn: new Date(),
    preferences: ""
  };

  try {
    const res = await api({
      method: HTTP_METHODS.GET,
      tags: scope,
      service: SERVICE.USER,
      path: `email?email=${email}`,
      });

    if(res.status !== 201) {
      throw new Error(JSON.stringify(res.message));
    }

    if (res.status === 201) {
      logger.info(res.data);
    }
    // user = res.data;
  } catch (e) {
    logger.error("Get user info:" + e);
  }
  return user
}

/**
 * post: /api/user
 * Creates the user information from the API
 * @returns {{ok: boolean, message: string, status: number}} for client side
 */
export async function createUser(name: string, email: string): Promise<{ok: boolean, message: string, status: number}> {

  try {
    const res = await api({
      method: HTTP_METHODS.POST,
      tags: ["user"],
      service: SERVICE.USER,
      body: {
        name: name,
        email: email,
        role: "USER",
      },
    });

    if (res.status != 201) {
      return {
        ok: false,
        message: res.data,
        status: res.status
      }
    }

    if (res.status == 201) {
      logger.info(res.data);
    }

    return {
      ok: true,
      message: res.data,
      status: res.status
    };
  } catch (e) {
    logger.error("User not created:" + e);
    throw e;
  }
}

const getProfileUrl = (username: string) => {
  return "https://i.pravatar.cc/150?u=a042581f4e29026704d";
};

const getUsername = () => {
  return "test user";
};

const getUserPreferences = () => {
  return {
    languages: ["Python", "C++"],
    difficulties: ["Easy", "Medium"],
    topics: ["Array", "String", "Tree"],
  };
};

export const UserService = {
  getProfileUrl,
  getUsername,
  getUserPreferences,
};
