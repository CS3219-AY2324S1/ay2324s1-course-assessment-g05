"use client";
import Dashboard from "@/components/dashboard/Dashboard";
import Landing from "@/components/landing/Landing";

import { useAuthContext } from "@/providers/auth";

export default function Home() {
  const { isAuthenticated } = useAuthContext();
  const renderComponent = () => {
    if (!isAuthenticated()) {
      return <Landing />;
    } else {
      return <Dashboard />;
    }
  };
  return renderComponent();
}
