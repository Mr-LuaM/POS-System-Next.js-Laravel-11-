import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-background text-foreground min-h-screen h-screen overflow-hidden">
        <ThemeProvider  >
          <div className="fixed top-4 right-4 z-50">
            {/* <ThemeToggle /> */}
          </div>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
