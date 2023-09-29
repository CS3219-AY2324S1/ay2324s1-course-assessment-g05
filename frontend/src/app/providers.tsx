"use client";

import { AuthProvider, ProtectRoute } from "@/contexts/auth";
import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <AuthProvider>
        <ProtectRoute>{children}</ProtectRoute>
      </AuthProvider>
    </NextUIProvider>
  );
}
