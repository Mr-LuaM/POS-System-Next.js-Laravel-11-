"use client";

import { useSales } from "@/hooks/useSales";
import { DataTable } from "@/components/common/data-table";
import { getSalesColumns } from "./columns";
import { Button } from "@/components/ui/button";
import SalesModal from "./sales-modal";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { useState } from "react";
import { processRefund } from "@/services/sales"; // ✅ Refund Service

/**
 * ✅ Sales Table Component
 */
export default function SalesTable() {
  const { sales, refreshSales, loading } = useSales();
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ saleId: number } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const role = sessionStorage.getItem("role"); // ✅ Get user role

  /** ✅ Open Refund Confirmation */
  const openRefundDialog = (saleId: number) => {
    setConfirmDialog({ saleId });
  };

  /** ✅ Process Refund */
  const handleConfirmRefund = async () => {
    if (!confirmDialog) return;
    setConfirmLoading(true);
    try {
      await processRefund(confirmDialog.saleId);
      refreshSales(); // ✅ Refresh after refund
    } finally {
      setConfirmDialog(null);
      setConfirmLoading(false);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Sales Transactions</h1>
        <Button onClick={refreshSales} className="px-4 py-2">🔄 Refresh</Button>
      </div>

      {/* ✅ Sales Table */}
      <DataTable
        columns={getSalesColumns({ 
          onViewSale: setSelectedSaleId, 
          onRefundSale: openRefundDialog, 
          userRole: role 
        })}
        data={sales}
        searchKeys={["store_name", "cashier_name", "customer_name", "status"]}
        loading={loading}
      />

      {/* ✅ Sales Modal */}
      {selectedSaleId && (
        <SalesModal saleId={selectedSaleId} onClose={() => setSelectedSaleId(null)} />
      )}

      {/* ✅ Confirm Dialog for Refund */}
      {confirmDialog && (
        <ConfirmDialog
          open={true}
          onConfirm={handleConfirmRefund}
          onCancel={() => setConfirmDialog(null)}
          title="Confirm Refund"
          description="Are you sure you want to refund this sale? This action cannot be undone."
          confirmLabel="Refund"
          confirmVariant="destructive"
          loading={confirmLoading}
        />
      )}
    </div>
  );
}
