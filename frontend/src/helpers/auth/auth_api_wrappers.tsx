/* -------------------------------------------------------------------------- */
/*                        mock backend for auth service                       */
/* -------------------------------------------------------------------------- */
const validateAuth = () => {
  return false;
};

export const AuthService = {
  validateAuth,
};
