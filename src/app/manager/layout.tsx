"use client";

import Sidebar from "@/components/layouts/Sidebar";
import Header from "@/components/layouts/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingScreen from "@/components/loading-screen"; // ✅ ShadCN Loading Screen
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth"; // ✅ Use auth state to prevent layout flash

interface ManagerLayoutProps {
  children: React.ReactNode;
}

/**
 * ✅ Admin Layout with Role Protection (Now Handles Loading)
 */
export default function ManagerLayout({ children }: ManagerLayoutProps) {
  const { user, loading } = useAuth(); // ✅ Get user & loading state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ✅ Prevent unauthorized content from flashing
  if (loading || !user) return <LoadingScreen message="Checking access..." />;

  return (
    <ProtectedRoute allowedRoles={["manager"]}> {/* ✅ Manager-Only Access */}
      <div className="flex h-screen">
        {/* ✅ Sidebar with role-based navigation */}
        <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} role="manager" />

        {/* ✅ Main Page Content */}
        <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
