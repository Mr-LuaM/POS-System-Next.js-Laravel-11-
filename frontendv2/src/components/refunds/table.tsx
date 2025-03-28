"use client";

import { useRefunds } from "@/hooks/useRefunds";
import { DataTable } from "@/components/common/data-table";
import { getRefundColumns } from "./columns";
import SalesModal from "../sales/sales-modal"; // ✅ Import Sales Modal
import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * ✅ Refund Table Component
 */
export default function RefundsTable() {
  const { refunds, refreshRefunds, loading } = useRefunds();
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Refund Transactions</h1>
        <Button onClick={refreshRefunds} className="px-4 py-2">🔄 Refresh</Button>
      </div>

      {/* ✅ Refunds Table */}
      <div className="w-full max-w-none px-0">
        <DataTable
          columns={getRefundColumns({ onViewSale: setSelectedSaleId })}
          data={refunds}
          searchKeys={["sale_id", "amount", "reason"]}
          loading={loading}
        />
      </div>

      {/* ✅ Sales Modal (View Sale Details) */}
      {selectedSaleId && (
        <SalesModal saleId={selectedSaleId} onClose={() => setSelectedSaleId(null)} />
      )}
    </div>
  );
}
