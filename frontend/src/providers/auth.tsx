import { UserService } from "@/helpers/user/user_api_wrappers";
import { Role, Status } from "@/types/enums";
import User from "@/types/user";
import { StringUtils } from "@/utils/stringUtils";
import { Spinner } from "@nextui-org/react";
import { createContext, useContext, useEffect, useState } from "react";

interface IAuthContext {
  user: User;
  fetchUser: () => Promise<void>;
  logIn: (email: string) => Promise<void>;
  isAuthenticated: () => boolean;
}

interface IAuthProvider {
  children: React.ReactNode;
}

const defaultUser: User = {
  id: "",
  name: "",
  email: "",
  role: Role.USER,
  image: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  preferences: {
    languages: [],
    difficulties: [],
    topics: [],
  },
};

const AuthContext = createContext<IAuthContext>({
  user: defaultUser,
  fetchUser: () => Promise.resolve(),
  logIn: () => Promise.resolve(),
  isAuthenticated: () => false,
});

const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setIsLoading(true);

      if (!user.id) return;

      const rawUser = await UserService.getUserById(user.id);
      console.log(rawUser);
      rawUser.preferences = {
        languages: StringUtils.convertEnumsToCamelCase(
          rawUser.preferences?.languages
        ),
        difficulties: StringUtils.convertEnumsToCamelCase(
          rawUser.preferences?.difficulties
        ),
        topics: StringUtils.convertEnumsToCamelCase(
          rawUser.preferences?.topics
        ),
      };

      setUser(rawUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logIn = async (email: string) => {
    const rawUser = await UserService.getUserByEmail(email);
    if (rawUser) {
      setUser(rawUser);
    }
  };

  const isAuthenticated = () => {
    return !!user.id;
  };

  const renderChildren = () => {
    if (isLoading) {
      return <Spinner color="primary" />;
    }
    return children;
  };

  const context = { user, fetchUser, logIn, isAuthenticated };

  return (
    <AuthContext.Provider value={context}>
      {renderChildren()}
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthProvider };
