import HttpStatusCode from "@/types/HttpStatusCode";
import { getLogger } from "@/helpers/logger";
import { HTTP_METHODS, SERVICE } from "@/types/enums";
import { throwAndLogError } from "@/utils/errorUtils";
import api from "../endpoint";
import { PeerPrepErrors } from "@/types/PeerPrepErrors";
import User from "@/types/user";

const logger = getLogger("auth_api_wrappers");

const service = SERVICE.AUTH;
const scope = [SERVICE.AUTH];

const logInByEmail = async (
  email: string,
  password: string,
  cache: RequestCache = "default"
): Promise<User | undefined> => {
  // call POST /api/auth/loginByEmail from auth service
  const response = await api({
    method: HTTP_METHODS.POST,
    service: service,
    path: "loginByEmail",
    body: { email, password },
    tags: scope,
    cache: cache,
  });

  if (response.status === HttpStatusCode.OK) {
    const user = (await response.data.user) as User;
    console.log(user);

    return user;
  }

  return throwAndLogError(
    "logInByEmail",
    response.message,
    getError(response.status)
  );
};

const registerByEmail = async (user: User, cache: RequestCache = "default") => {
  // call POST /api/auth/registerbyEmail from auth service
  console.log(user);
  const response = await api({
    method: HTTP_METHODS.POST,
    service: service,
    path: "registerByEmail",
    body: user,
    tags: scope,
    cache: cache,
  });

  // successful response should return 201 and userid
  if (response.status === HttpStatusCode.CREATED) {
    const res = response.data as { id: string; message: string };
    logger.info(`[registerByEmail] ${res}`);
    return res;
  }

  return throwAndLogError(
    "registerByEmail",
    response.message,
    getError(response.status)
  );
};

const validateUser = async () => {
  // call POST /api/auth/validate from auth service
  const response = await api({
    method: HTTP_METHODS.POST,
    service: service,
    path: "validate",
    tags: scope,
  });

  if (response.status === HttpStatusCode.OK) {
    const user = response.data as User;
    return user;
  }

  return throwAndLogError(
    "validateUser",
    "User is not authenticated",
    getError(response.status)
  );
};

const logOut = async () => {
  // call POST /api/auth/logout from auth service, which will also handle the routing
  const response = await api({
    method: HTTP_METHODS.POST,
    service: service,
    path: "logout",
    tags: scope,
    deleteJWTCookie: true,
  });

  return;
};

function getError(status: HttpStatusCode) {
  switch (status) {
    case HttpStatusCode.BAD_REQUEST:
      return PeerPrepErrors.BadRequestError;
    case HttpStatusCode.NOT_FOUND:
      return PeerPrepErrors.NotFoundError;
    case HttpStatusCode.CONFLICT:
      return PeerPrepErrors.ConflictError;
    case HttpStatusCode.UNAUTHORIZED:
      return PeerPrepErrors.UnauthorisedError;
    default:
      return PeerPrepErrors.InternalServerError;
  }
}

export const AuthService = {
  logInByEmail,
  registerByEmail,
  validateUser,
  logOut,
};
