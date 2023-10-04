"use client";

import { AuthProvider } from "@/contexts/auth";
import { NextUIProvider } from "@nextui-org/react";
import { CollabProvider } from "@/contexts/collab";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <AuthProvider>
        <CollabProvider>{children}</CollabProvider>
      </AuthProvider>
    </NextUIProvider>
  );
}
