import { UserService } from "@/helpers/user/user_api_wrappers";
import { Role, Status } from "@/types/enums";
import User from "@/types/user";
import { StringUtils } from "@/utils/stringUtils";
import { Spinner } from "@nextui-org/react";
import { P } from "pino";
import { createContext, useContext, useEffect, useState } from "react";

interface IAuthContext {
  user: User;
  fetchUser: (userId: string) => Promise<void>;
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
  fetchUser: (userId: string) => Promise.resolve(),
  logIn: () => Promise.resolve(),
  isAuthenticated: () => true,
});

const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      const parsedUserId = JSON.parse(userId);
      fetchUser(parsedUserId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (userId: string) => {
    try {
      setIsLoading(true);

      if (!userId) return;

      const rawUser = await UserService.getUserById(userId);
      updateUser(rawUser);

      setUser(rawUser);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPreferences = (rawUser: User) => {
    rawUser.preferences = {
      languages: StringUtils.convertEnumsToCamelCase(
        rawUser.preferences?.languages
      ),
      difficulties: StringUtils.convertEnumsToCamelCase(
        rawUser.preferences?.difficulties
      ),
      topics: StringUtils.convertEnumsToCamelCase(rawUser.preferences?.topics),
    };
  };

  const logIn = async (email: string) => {
    const rawUser = await UserService.getUserByEmail(email);
    updateUser(rawUser);
  };

  const updateUser = (rawUser: User | undefined) => {
    if (!rawUser) return;
    formatPreferences(rawUser);
    setUser(rawUser);
    localStorage.setItem("userId", JSON.stringify(rawUser.id));
  };

  const isAuthenticated = () => {
    console.log(user.id);
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
