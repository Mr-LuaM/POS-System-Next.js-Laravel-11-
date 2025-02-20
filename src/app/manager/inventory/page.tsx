"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function ManagerDashboard() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <p>Welcome, Manager! You can oversee store operations here.</p>

        {/* Example: Manager Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">Total Sales</h2>
            <p className="text-2xl font-bold">$24,500</p>
          </div>

          <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">Pending Refunds</h2>
            <p className="text-2xl font-bold">12</p>
          </div>

          <div className="p-6 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold">Customer Feedback</h2>
            <p className="text-2xl font-bold">4.8 / 5</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
