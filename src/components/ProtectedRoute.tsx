"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    console.log("🔍 Checking access for role:", role);
    
    if (!token) {
      toast.error("❌ Unauthorized", { description: "Please log in first." });
      router.push("/login");
      return;
    }

    if (!allowedRoles.includes(role!)) {
      toast.error("⛔ Access Denied", { description: "You don't have permission to view this page." });

      // ✅ Redirect user to their correct section
      if (role === "admin") router.push("/admin");
      else if (role === "cashier") router.push("/cashier");
      else if (role === "manager") router.push("/manager");
      else router.push("/login");

      return;
    }

    setIsAllowed(true);
  }, [router, allowedRoles]);

  if (isAllowed === null) return <p>Loading...</p>; // ✅ Prevents flickering

  return <>{children}</>;
}
