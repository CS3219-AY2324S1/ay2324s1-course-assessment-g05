"use client";

import { AuthService } from "@/helpers/auth/auth_api_wrappers";
import { AuthProvider } from "@/providers/auth";
import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <AuthProvider>{children}</AuthProvider>
    </NextUIProvider>
  );
}
