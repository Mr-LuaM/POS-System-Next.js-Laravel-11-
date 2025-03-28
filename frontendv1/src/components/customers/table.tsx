"use client";

import { useState } from "react";
import { useLoyalty } from "@/hooks/useLoyalty";
import { DataTable } from "@/components/common/data-table";
import { getLoyaltyColumns, LoyaltyCustomer } from "./columns";
import ClaimPointsModal from "./customer-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoyaltyTable() {
  const { customers, loading, handleClaimPoints } = useLoyalty();
  const [selectedCustomer, setSelectedCustomer] = useState<LoyaltyCustomer | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const openClaimModal = (customer: LoyaltyCustomer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* ✅ Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🎟️ Loyalty Points</h1>
      </div>

      {/* ✅ Loyalty Table with Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : customers.length > 0 ? (
        <DataTable columns={getLoyaltyColumns(openClaimModal)} data={customers} />
      ) : (
        <p className="text-gray-500">No customers found.</p>
      )}

      {/* ✅ Claim Points Modal */}
      {isModalOpen && selectedCustomer && (
        <ClaimPointsModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          customer={selectedCustomer}
          onClaim={handleClaimPoints}
        />
      )}
    </div>
  );
}
