enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export const convertStringToRole = (role: string): Role => {
  switch (role.toLocaleUpperCase()) {
    case "ADMIN":
      return Role.ADMIN;
    case "USER":
      return Role.USER;
    default:
      throw new Error("Invalid role");
  }
};

export default Role;
