"use client";

import { AuthProvider } from "@/contexts/auth";
import { NextUIProvider } from "@nextui-org/react";
import { CollabProvider } from "@/contexts/collab";
import { HistoryProvider } from "@/contexts/history";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <AuthProvider>
        <CollabProvider>
          <HistoryProvider>{children}</HistoryProvider>
        </CollabProvider>
      </AuthProvider>
    </NextUIProvider>
  );
}
