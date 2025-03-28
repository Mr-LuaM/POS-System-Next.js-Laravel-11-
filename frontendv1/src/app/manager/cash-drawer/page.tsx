"use client";

import CashDrawerTable from "@/components/cash-drawer/table";

export default function ManagerInventoryPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Cash Drawer</h1>
      {/* Pass "manager" as the role */}
      <CashDrawerTable  />
    </div>
  );
}
