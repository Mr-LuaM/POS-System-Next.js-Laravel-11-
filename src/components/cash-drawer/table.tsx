"use client";

import { useCashDrawer } from "@/hooks/useCashDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
import UpdateCashModal from "./cash-drawer-modal";
import { DataTable } from "@/components/common/data-table"; // ✅ Reusable Table Component
import { getCashDrawerColumns } from "./columns"; // ✅ Table Columns Definition
import { useAuth } from "@/hooks/useAuth"; // ✅ Hook to get current user role (Assuming you have this)

export default function CashDrawerTable() {
  const { cashDrawers = [], loading, fetchCashDrawers } = useCashDrawer(); // ✅ Ensure `cashDrawers` is never undefined
  const { user } = useAuth(); // ✅ Get current logged-in user details
  const isAdmin = user?.role === "admin"; // ✅ Determine if the user is an Admin
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDrawerId, setSelectedDrawerId] = useState<number | null>(null);

  /**
   * ✅ Open the modal to update actual cash collected
   */
  const openCashModal = (cashDrawerId: number) => {
    setSelectedDrawerId(cashDrawerId);
    setModalOpen(true);
  };

  if (loading) return <Skeleton className="h-20 w-full" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Drawers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* ✅ Prevents rendering issues if cashDrawers is empty */}
        {cashDrawers.length > 0 ? (
          <DataTable
            columns={getCashDrawerColumns(openCashModal)}
            data={cashDrawers}
            searchKeys={["cashier_name", "total_sales", "total_collected", "status"]} // ✅ Search by cashier or status
          />
        ) : (
          <p className="text-muted-foreground text-center">No cash drawers available.</p>
        )}

        {/* ✅ Update Cash Modal (Only opens when a valid `selectedDrawerId` exists) */}
        {isModalOpen && selectedDrawerId !== null && (
          <UpdateCashModal
            isOpen={isModalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedDrawerId(null); // ✅ Reset after closing
              fetchCashDrawers(); // ✅ Refresh table after update
            }}
            cashDrawerId={selectedDrawerId}
            isAdmin={isAdmin} // ✅ Pass isAdmin flag properly
          />
        )}
      </CardContent>
    </Card>
  );
}
