import { Role, Status } from "@/types/enums";
import User from "@/types/user";
import { createContext, useContext, useState } from "react";

interface IAuthContext {
  user: User;
}

interface IAuthProvider {
  children: React.ReactNode;
}

const defaultUser: User = {
  id: "clmol5ekq00007k00es00hvun",
  image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  name: "Your Updated Name",
  email: "",
  role: Role.ADMIN,
  status: Status.ACTIVE,
};

const AuthContext = createContext<IAuthContext>({ user: defaultUser });

const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = useState<User>(defaultUser);
  const context = { user };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export { useAuthContext, AuthProvider };
