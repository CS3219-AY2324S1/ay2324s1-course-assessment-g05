import Role from "../lib/enums/Role";
// import Language from "../lib/enums/Language";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: Role; //enum

  //optional attributes
  // languages?: Language[];
  image?: string;
  createdAt?: number;
  updatedAt?: number;
};
