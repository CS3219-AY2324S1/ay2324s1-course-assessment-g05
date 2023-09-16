import Dashboard from "@/components/dashboard/Dashboard";
import Landing from "@/components/landing/Landing";
import { AuthService } from "@/helpers/auth/api_wrappers";

export default function Home() {
  const isAuthenticated = AuthService.validateAuth();
  return isAuthenticated ? <Dashboard /> : <Landing />;
}
