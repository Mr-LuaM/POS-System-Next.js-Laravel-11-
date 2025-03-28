"use client";

import CustomersTable from "@/components/customers/table";

export default function ManagerInventoryPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Store Inventory</h1>
      {/* Pass "manager" as the role */}
      <CustomersTable  />
    </div>
  );
}
