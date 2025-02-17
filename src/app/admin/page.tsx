"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, Admin! Manage your POS system here.</p>
    </ProtectedRoute>
  );
}
