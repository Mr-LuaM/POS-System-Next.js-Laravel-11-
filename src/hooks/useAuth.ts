"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { login as apiLogin, logout as apiLogout, fetchUser } from "@/services/auth";

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  const checkAuth = useCallback(async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const userData = await fetchUser();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    } catch {
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const result = await apiLogin(email, password);
    if (result.success) {
      sessionStorage.setItem("role", result.user.role);
      sessionStorage.setItem("userId", result.user.id.toString());
      sessionStorage.setItem("userName", result.user.name);

      setUser(result.user);
      setIsAuthenticated(true);

      toast.success("✅ Login successful!", { description: "Redirecting...", duration: 3000 });

      setTimeout(() => {
        const storedRole = sessionStorage.getItem("role");
        switch (storedRole) {
          case "admin":
            router.replace("/admin");
            break;
          case "cashier":
            router.replace("/cashier/pos");
            break;
          case "manager":
            router.replace("/manager");
            break;
          default:
            router.replace("/");
        }
      }, 1500);
    } else {
      toast.error("❌ Login failed!", { description: result.message });
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      sessionStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
      toast.success("✅ Logged out successfully!");

      if (pathname !== "/login") {
        router.replace("/login");
      }
    }
  };

  useEffect(() => {
    if (pathname !== "/login") {
      checkAuth();
    }
  }, [checkAuth, pathname]);

  return { isAuthenticated, user, login, logout: handleLogout, loading };
}
