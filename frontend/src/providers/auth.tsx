import { UserService } from "@/helpers/user/user_api_wrappers";
import { Role, Status } from "@/types/enums";
import User from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";

interface IAuthContext {
  user: User;
}

interface IAuthProvider {
  children: React.ReactNode;
}

const defaultUser: User = {
  id: "clmol5ekq00007k00es00hvun",
  image: "",
  name: "",
  email: "",
  role: Role.ADMIN,
  status: Status.ACTIVE,
};

const AuthContext = createContext<IAuthContext>({ user: defaultUser });

const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = useState<User>(defaultUser);
  useEffect(() => {
    fetchUser();
  }, []);

  const context = { user };
  const fetchUser = async () => {
    const rawUser = await UserService.getUserById(user.id);
    console.log(rawUser);
    setUser(rawUser);
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export { useAuthContext, AuthProvider };
