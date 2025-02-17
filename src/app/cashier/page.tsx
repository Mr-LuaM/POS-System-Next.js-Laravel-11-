"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function CashierDashboard() {
  return (
    <ProtectedRoute allowedRoles={["cashier"]}>
      <h1 className="text-2xl font-bold">Cashier Dashboard</h1>
      <p>Welcome, Cashier! Process sales and manage transactions.</p>
    </ProtectedRoute>
  );
}
