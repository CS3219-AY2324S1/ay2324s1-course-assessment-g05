/* -------------------------------------------------------------------------- */
/*                      mock backend for user service                     */
/* -------------------------------------------------------------------------- */

const getProfileUrl = (username: string) => {
  return "https://i.pravatar.cc/150?u=a042581f4e29026704d";
};

const getUsername = () => {
  return "test user";
};

export const UserService = {
  getProfileUrl,
  getUsername,
};
