"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if we're in the /cashier route (or a subroute)
  const forceLightTheme = pathname.startsWith("/cashier");

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={!forceLightTheme}
      forcedTheme={forceLightTheme ? "light" : undefined}
    >
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {children}
      </div>
    </NextThemesProvider>
  );
}
