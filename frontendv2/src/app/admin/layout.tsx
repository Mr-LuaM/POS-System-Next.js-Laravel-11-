"use client";

import Sidebar from "@/components/layouts/Sidebar";
import Header from "@/components/layouts/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingScreen from "@/components/loading-screen";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (loading || !user) return <LoadingScreen message="Checking access..." />;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex h-screen overflow-hidden">
        {/* ✅ Fixed Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} role="admin" />

        {/* ✅ Right Side: Header + Main Content */}
        <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
          {/* ✅ Fixed Header */}
          <div className="fixed top-0 right-0 left-0 z-20 h-16 bg-white shadow">
            <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>

          {/* ✅ Scrollable Main Content below Header */}
          <main className="mt-16 flex-1 overflow-y-auto p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
