"use client";

import InventoryTable from "@/components/inventory/table";

/**
 * ✅ Inventory Page (Renders Full CRUD Table)
 */
export default function AdminInventoryPage() {
  return (
    <div className="w-full">
      <InventoryTable role="admin" />
    </div>
  );
}
