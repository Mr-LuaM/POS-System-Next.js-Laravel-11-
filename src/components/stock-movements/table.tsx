"use client";

import { useStockManagement } from "@/hooks/useStockManagement";
import { DataTable } from "@/components/common/data-table";
import { getStockMovementColumns } from "./columns";
import { Button } from "@/components/ui/button";

/**
 * ✅ Stock Movement Table Component
 */
export default function StockMovementsTable() {
  const { stockMovements, refreshStockMovements, loading } = useStockManagement();

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Stock Movements</h1>
        {/* <Button onClick={refreshStockMovements} className="px-4 py-2">🔄 Refresh</Button> */}
      </div>

      {/* ✅ Stock Movement Table */}
      <div className="w-full max-w-none px-0">
        <DataTable
          columns={getStockMovementColumns()}
          data={stockMovements}
          searchKeys={["product_name", "store_name", "type", "reason"]}
          loading={loading}
        />
      </div>
    </div>
  );
}
