import Dashboard from "@/components/Dashboard";
import Landing from "@/components/Landing";
import { AuthService } from "@/helpers/auth/api_wrappers";

export default function Home() {
  const isAuthenticated = AuthService.validateAuth();
  return isAuthenticated ? <Dashboard /> : <Landing />;
}
