"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUserRole } from "@/lib/auth";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

/**
 * ✅ Role-Based Protected Route (Optimized)
 */
export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        toast.error("❌ Unauthorized", { description: "Please log in first." });
        router.replace("/login");
        return;
      }

      try {
        const role = await getUserRole();
        console.log("🔍 Checking access for role:", role);

        if (!role) {
          toast.error("⚠️ Role Not Found", { description: "Invalid session. Please log in again." });
          router.replace("/login");
          return;
        }

        if (!allowedRoles.includes(role)) {
          toast.error("⛔ Access Denied", { description: "You don't have permission to view this page." });

          const redirectPath =
            role === "admin" ? "/admin" :
            role === "cashier" ? "/cashier" :
            role === "manager" ? "/manager" : "/login";

          router.replace(redirectPath);
          return;
        }

        setIsAllowed(true);
      } catch (error) {
        console.error("🚨 Error fetching role:", error);
        toast.error("⚠️ Error", { description: "Something went wrong. Please try again." });
        router.replace("/login");
      }
    };

    checkAccess();
  }, [allowedRoles, router]);

  return isAllowed ? <>{children}</> : null; // ✅ No more unnecessary loading state
}
