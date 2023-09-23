import api from "@/helpers/endpoint";
import { getLogger } from "@/helpers/logger";
import { HTTP_METHODS, SERVICE } from "@/types/enums"; 
import { revalidateTag } from "next/cache";
import { Status, Role } from "@/types/enums";
import User from "../../types/user";
import HttpStatusCode from "@/types/HttpStatusCode";
import { PeerPrepErrors } from "@/types/PeerPrepErrors";
import { throwAndLogError } from "@/utils/errorUtils";

const logger = getLogger("user_api_wrappers");

const service = SERVICE.USER;
const scope = [SERVICE.USER];

const getUserByEmail = async (email: string): Promise<User | undefined> => {
  const response = await api({
    method: HTTP_METHODS.GET,
    service: service,
    path: `email?email=${email}`,
    tags: scope,
  });

  // successful response should return 200 with the user data
  if (response.status === HttpStatusCode.OK) {
    const user = response.data as User;
    logger.info(`[getUserByEmail(${email})] ${user}`);
    return user;
  } else if (response.status === HttpStatusCode.NOT_FOUND) {
    return throwAndLogError(
      "getUserByEmail",
      response.message,
      PeerPrepErrors.NotFoundError
    );
  } else if (response.status === HttpStatusCode.BAD_REQUEST) {
    return throwAndLogError(
      "getUserByEmail",
      response.message,
      PeerPrepErrors.BadRequestError
    );
  }
  return throwAndLogError(
    "getUserByEmail",
    response.message,
    PeerPrepErrors.InternalServerError
  );
};

const getUserById = async (id: string): Promise<User> => {
  // call GET /api/users/:id from user service
  const response = await api({
    method: HTTP_METHODS.GET,
    service: service,
    path: id,
    tags: scope,
  });

  // successful response should return 200 with the user data
  if (response.status === HttpStatusCode.OK) {
    const user = response.data as User;
    logger.info(`[getUserById(${id})] ${user}`);
    return user;
  } else if (response.status === HttpStatusCode.NOT_FOUND) {
    return throwAndLogError(
      "getUserById",
      response.message,
      PeerPrepErrors.NotFoundError
    );
  }
  return throwAndLogError(
    "getUserById",
    response.message,
    PeerPrepErrors.InternalServerError
  );
};

const createUser = async (user: User) => {
  // call POST /api/users from user service
  const response = await api({
    method: HTTP_METHODS.POST,
    service: service,
    tags: scope,
    body: user,
  });

  // successful response should return 201 and a user created message
  if (response.status === HttpStatusCode.CREATED) {
    revalidateTag(SERVICE.USER);
    return true;
  } else if (response.status === HttpStatusCode.BAD_REQUEST) {
    return throwAndLogError(
      "createUser",
      response.message,
      PeerPrepErrors.BadRequestError
    );
  } else if (response.status === HttpStatusCode.CONFLICT) {
    return throwAndLogError(
      "createUser",
      response.message,
      PeerPrepErrors.ConflictError
    );
  }
  return throwAndLogError(
    "createUser",
    response.message,
    PeerPrepErrors.InternalServerError
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

  // successful response should return 204
  if (response.status === HttpStatusCode.NO_CONTENT) {
    revalidateTag(SERVICE.USER);
    return true;
  } else if (response.status === HttpStatusCode.BAD_REQUEST) {
    return throwAndLogError(
      "updateUser",
      response.message,
      PeerPrepErrors.BadRequestError
    );
  } else if (response.status === HttpStatusCode.NOT_FOUND) {
    return throwAndLogError(
      "updateUser",
      response.message,
      PeerPrepErrors.NotFoundError
    );
  } else if (response.status === HttpStatusCode.CONFLICT) {
    return throwAndLogError(
      "updateUser",
      response.message,
      PeerPrepErrors.ConflictError
    );
  }
  return throwAndLogError(
    "updateUser",
    response.message,
    PeerPrepErrors.InternalServerError
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
  } else if (response.status === HttpStatusCode.NOT_FOUND) {
    return throwAndLogError(
      "deleteUser",
      response.message,
      PeerPrepErrors.NotFoundError
    );
  }
  return throwAndLogError(
    "deleteUser",
    response.message,
    PeerPrepErrors.InternalServerError
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
  } else if (response.status === HttpStatusCode.NOT_FOUND) {
    return throwAndLogError(
      "getUserPreferenceById",
      response.message,
      PeerPrepErrors.NotFoundError
    );
  }
  return throwAndLogError(
    "getUserPreferenceById",
    response.message,
    PeerPrepErrors.InternalServerError
  );
};

const createUserPreference = async (id: string, userPreference: Preference) => {
  // call POST /api/users/:id/preferences from user service
  const response = await api({
    method: HTTP_METHODS.POST,
    service: service,
    path: `${id}/preferences`,
    body: userPreference,
    tags: scope,
  });

  // successful response should return 201 and a user preference created message
  if (response.status === HttpStatusCode.CREATED) {
    revalidateTag(SERVICE.USER);
    return true;
  } else if (response.status === HttpStatusCode.BAD_REQUEST) {
    return throwAndLogError(
      "createUserPreference",
      response.message,
      PeerPrepErrors.BadRequestError
    );
  } else if (response.status === HttpStatusCode.NOT_FOUND) {
    return throwAndLogError(
      "createUserPreference",
      response.message,
      PeerPrepErrors.NotFoundError
    );
  } else if (response.status === HttpStatusCode.CONFLICT) {
    return throwAndLogError(
      "createUserPreference",
      response.message,
      PeerPrepErrors.ConflictError
    );
  }
  return throwAndLogError(
    "createUserPreference",
    response.message,
    PeerPrepErrors.InternalServerError
  );
};

const updateUserPreference = async (id: string, userPreference: Preference) => {
  // call PUT /api/users/:id/preferences from user service
  const response = await api({
    method: HTTP_METHODS.PUT,
    service: service,
    path: `${id}/preferences`,
    body: userPreference,
    tags: scope,
  });

  // successful response should return 204
  if (response.status === HttpStatusCode.NO_CONTENT) {
    revalidateTag(SERVICE.USER);
    return true;
  } else if (response.status === HttpStatusCode.BAD_REQUEST) {
    return throwAndLogError(
      "updateUserPreference",
      response.message,
      PeerPrepErrors.BadRequestError
    );
  } else if (response.status === HttpStatusCode.NOT_FOUND) {
    return throwAndLogError(
      "updateUserPreference",
      response.message,
      PeerPrepErrors.NotFoundError
    );
  }
  return throwAndLogError(
    "updateUserPreference",
    response.message,
    PeerPrepErrors.InternalServerError
  );
};

export const UserService = {
  //async endpoint functions
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  getUserPreferenceById,
  createUserPreference,
  updateUserPreference,
};
