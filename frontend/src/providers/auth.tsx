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
  name: undefined,
  email: undefined,
  role: Role.USER,
  preferences: {
    languages: [],
    difficulties: [],
    topics: [],
  },
};

const AuthContext = createContext<IAuthContext>({ user: defaultUser });

const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = useState<User>(defaultUser);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const rawUser = await UserService.getUserById(user.id);
    console.log(rawUser);
    setUser(rawUser);
  };

  const context = { user, fetchUser };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export { useAuthContext, AuthProvider };
