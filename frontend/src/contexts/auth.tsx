import { CLIENT_ROUTES } from "@/common/constants";
import { AuthService } from "@/helpers/auth/auth_api_wrappers";
import { Role, Status } from "@/types/enums";
import User from "@/types/user";
import { StringUtils } from "@/utils/stringUtils";
import { Spinner } from "@nextui-org/react";
import { cookies } from "next/headers";
import { useRouter, usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface IAuthContext {
  user: User;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  logIn: (email: string, password: string) => Promise.resolve(),
  logOut: () => Promise.resolve(),
  isAuthenticated: false,
  isLoading: true,
});

interface IAuthProvider {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: IAuthProvider) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const isAuthenticated = !!user.id;

  useEffect(() => {
    console.log("authenticating");
    authenticateUser();
  }, []);

  // checks if user has token and is logged in, if not, redirect to home page
  const authenticateUser = async () => {
    setIsLoading(true);
    try {
      const rawUser = await AuthService.validateUser();
      updateUser(rawUser);
      console.log("authenticated");
    } catch (error) {
      console.log({ error });
      setUser(defaultUser);
      router.push(CLIENT_ROUTES.HOME);
    }
    setIsLoading(false);
  };

  // formats preferences and sets user in state
  const updateUser = (rawUser: User) => {
    formatPreferences(rawUser);
    setUser(rawUser);
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

  const logIn = async (email: string, password: string) => {
    const rawUser = await AuthService.logInByEmail(email, password);
    rawUser && updateUser(rawUser);
  };

  // delete JWT cookie, set user to default, and redirect to home page
  const logOut = async () => {
    await AuthService.logOut();
    setUser(defaultUser);
  };

  const context = {
    user,
    logIn,
    isAuthenticated: !!user.id,
    logOut,
    isLoading,
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

const useAuthContext = () => useContext(AuthContext);

interface IProtectRoute {
  children: React.ReactNode;
}

const ProtectRoute = ({ children }: IProtectRoute) => {
  const router = useRouter();
  const pathName = usePathname();
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && isAuthenticated && pathName === CLIENT_ROUTES.LOGIN) {
      router.push(CLIENT_ROUTES.HOME);
    }
  }, [isLoading, isAuthenticated, pathName]);

  if (
    isLoading ||
    (!isAuthenticated &&
      // pathName !== CLIENT_ROUTES.LOGIN &&
      pathName !== CLIENT_ROUTES.HOME)
  ) {
    return <Spinner color="primary" />;
  }
  return children;
};

export { useAuthContext, AuthProvider, ProtectRoute };
