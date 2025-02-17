"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    console.log("🔄 Revalidating token with backend...");

    // ✅ Check with Laravel if the token is valid
    axios
      .get(`${API_URL}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("✅ Token is valid:", response.data);
        setIsAuthenticated(true);
        setUserRole(response.data.role);
      })
      .catch(() => {
        console.log("❌ Token expired. Logging out...");
        toast.error("Session expired. Please log in again.");
        sessionStorage.clear();
        router.push("/login");
      });
  }, [router]);

  return { isAuthenticated, userRole };
}
