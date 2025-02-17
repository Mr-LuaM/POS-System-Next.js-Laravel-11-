"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function ManagerDashboard() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <h1 className="text-2xl font-bold">Manager Dashboard</h1>
      <p>Welcome, Manager! View analytics and manage expenses.</p>
    </ProtectedRoute>
  );
}
