import api from "@/helpers/endpoint";
import { getLogger } from "@/helpers/logger";
import { SERVICE } from "@/types/enums"; 
import { revalidateTag } from "next/cache";
import { Status, Role } from "@/types/enums";
import User from "../../types/user";

const logger = getLogger("user_api_wrappers");

/**
 * get: /api/user
 * Retrieves the user information from the API
 * @returns {Promise<User>} the user object
 */
export async function getUser(userid: string): Promise<User> {
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
      method: `get`,
      // service: "user",
      tags: ["user"],
      service: SERVICE.USER,
      path: `/user/${userid}`,
    });

    if(!res.ok) {
      throw new Error(JSON.stringify(res.message));
    }

    if (res.ok) {
      logger.info(res.data);
    }
    // user = res.data;
  } catch (e) {
    logger.error("Get user info:" + e);
  }
  return user
}

export async function createUser(name: string, email: string): Promise<User> {

  let user: User = {
    id: "abcdef",
    name: name,
    email: email,
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
      method: `post`,
      tags: ["user"],
      service: SERVICE.USER,
      path: `/user`,
      body: user,
    });

    if (!res.ok) {
      throw new Error(JSON.stringify(res.message));
    }

    if (res.ok) {
      logger.info(res.data);
    }

    return res.data;
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
