import api from "@/helpers/endpoint";
import { getLogger } from "@/helpers/logger";
import { HTTP_METHODS, SERVICE } from "@/types/enums";
import User from "../../types/user";
import HttpStatusCode from "@/types/HttpStatusCode";
import { PeerPrepErrors } from "@/types/PeerPrepErrors";
import { throwAndLogError } from "@/utils/errorUtils";
import Preference from "@/types/preference";

const logger = getLogger("user_api_wrappers");

const service = SERVICE.USER;
const scope = [SERVICE.USER];

const getUserByEmail = async (
  email: string,
  cache: RequestCache = "no-cache"
): Promise<User | undefined> => {
  const response = await api({
    method: HTTP_METHODS.GET,
    service: service,
    path: `email?email=${email}`,
    tags: scope,
    cache: cache,
  });

  if (response.status === HttpStatusCode.OK) {
    const user = response.data as User;
    logger.info(`[getUserByEmail(${email})] ${user}`);
    return user;
  }

  return throwAndLogError(
    "getUserByEmail",
    response.message,
    getError(response.status)
  );
};

const getUserById = async (
  id: string,
  cache: RequestCache = "no-cache"
): Promise<User> => {
  // call GET /api/users/:id from user service
  const response = await api({
    method: HTTP_METHODS.GET,
    service: service,
    path: id,
    tags: scope,
    cache: cache,
  });

  // successful response should return 200 with the user data
  if (response.status === HttpStatusCode.OK) {
    const user = response.data as User;
    logger.info(`[getUserById(${id})] ${user}`);
    return user;
  }

  return throwAndLogError(
    "getUserById",
    response.message,
    getError(response.status)
  );
};

const createUser = async (user: User, cache: RequestCache = "no-cache") => {
  // call POST /api/users from user service
  console.log(user);
  const response = await api({
    method: HTTP_METHODS.POST,
    service: service,
    tags: scope,
    body: user,
    cache: cache,
  });

  // successful response should return 201 and a user created message
  if (response.status === HttpStatusCode.CREATED) {
    // revalidateTag(SERVICE.USER);
    const res = response.data as User;
    logger.info(`[createUser] ${res}`);
    return res;
  }

  return throwAndLogError(
    "createUser",
    response.message,
    getError(response.status)
  );
};

const updateUser = async (id: string, user: User) => {
  // call PUT /api/users/:id from user service
  const response = await api({
    method: HTTP_METHODS.PUT,
    service: service,
    path: id,
    body: user,
    tags: scope,
  });

  if (response.status === HttpStatusCode.NO_CONTENT) {
    return true;
  }

  return throwAndLogError(
    "updateUser",
    response.message,
    getError(response.status)
  );
};

const deleteUser = async (id: string) => {
  // call DELETE /api/users/:id from user service
  const response = await api({
    method: HTTP_METHODS.DELETE,
    service: service,
    path: id,
    tags: scope,
  });

  // successful response should return 204
  if (response.status === HttpStatusCode.NO_CONTENT) {
    return true;
  }

  return throwAndLogError(
    "deleteUser",
    response.message,
    getError(response.status)
  );
};

const getUserPreferenceById = async (id: string) => {
  // call GET /api/users/:id/preferences from user service
  const response = await api({
    method: HTTP_METHODS.GET,
    service: service,
    path: `${id}/preferences`,
    tags: scope,
  });

  // successful response should return 200 with the user preference data
  if (response.status === HttpStatusCode.OK) {
    const userPreference = response.data as Preference;
    logger.info(`[getUserPreferenceById(${id})] ${userPreference}`);
    return userPreference;
  }

  return throwAndLogError(
    "getUserPreferenceById",
    response.message,
    getError(response.status)
  );
};

const updateUserPreference = async (
  id: string,
  userPreference: Preference,
  cache: RequestCache = "no-cache"
) => {
  // call PUT /api/users/:id/preferences from user service
  const response = await api({
    method: HTTP_METHODS.PUT,
    service: service,
    path: `${id}/preferences`,
    body: userPreference,
    tags: scope,
    cache: cache,
  });

  // successful response should return 204
  if (response.status === HttpStatusCode.NO_CONTENT) {
    // revalidateTag(SERVICE.USER);
    return true;
  }

  return throwAndLogError(
    "updateUserPreference",
    response.message,
    getError(response.status)
  );
};

function getError(status: HttpStatusCode) {
  switch (status) {
    case HttpStatusCode.BAD_REQUEST:
      return PeerPrepErrors.BadRequestError;
    case HttpStatusCode.NOT_FOUND:
      return PeerPrepErrors.NotFoundError;
    case HttpStatusCode.CONFLICT:
      return PeerPrepErrors.ConflictError;
    default:
      return PeerPrepErrors.InternalServerError;
  }
}

export const UserService = {
  //async endpoint functions
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  getUserPreferenceById,
  updateUserPreference,
};
