/* -------------------------------------------------------------------------- */
/*                        mock backend for auth service                       */
/* -------------------------------------------------------------------------- */
const validateAuth = () => {
  return true;
};

export const AuthService = {
  validateAuth,
};
