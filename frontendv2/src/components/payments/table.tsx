"use client";

import { usePayments } from "@/hooks/usePayments";
import { DataTable } from "@/components/common/data-table";
import { getPaymentsColumns } from "./columns";
import { Button } from "@/components/ui/button";

/**
 * ✅ Payments Table Component
 */
export default function PaymentsTable() {
  const { payments, refreshPayments, loading } = usePayments();

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>
        <Button onClick={refreshPayments} className="px-4 py-2">🔄 Refresh</Button>
      </div>

      {/* ✅ Payments Table */}
      <div className="w-full max-w-none px-0">
        <DataTable
          columns={getPaymentsColumns()}
          data={payments}
          searchKeys={["sale_id", "method", "transaction_id"]}
          loading={loading}
        />
      </div>
    </div>
  );
}
