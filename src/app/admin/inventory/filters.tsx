"use client";

import { useInventoryFilters } from "@/hooks/useInventoryFilters";
import FilterDropdown from "@/components/common/filter-dropdown";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

/**
 * ✅ Inventory Filters Component (Uses Cached Data from `useInventoryFilters`)
 */
export default function InventoryFilters() {
  const {
    stores,
    categories,
    suppliers,
    selectedStore,
    setSelectedStore,
    selectedCategory,
    setSelectedCategory,
    selectedSupplier,
    setSelectedSupplier,
    loading,
    refreshFilters
  } = useInventoryFilters();

  return (
    <div className="flex flex-wrap gap-4 mb-4 items-center">
      {/* ✅ Store Filter */}
      <FilterDropdown
        label="Store"
        options={stores}
        selectedValue={selectedStore}
        onChange={setSelectedStore}
        loading={loading}
        disabled={loading} // Disable during loading for clarity
      />

      {/* ✅ Category Filter */}
      <FilterDropdown
        label="Category"
        options={categories}
        selectedValue={selectedCategory}
        onChange={setSelectedCategory}
        loading={loading}
        disabled={loading}
      />

      {/* ✅ Supplier Filter */}
      <FilterDropdown
        label="Supplier"
        options={suppliers}
        selectedValue={selectedSupplier}
        onChange={setSelectedSupplier}
        loading={loading}
        disabled={loading}
      />

      {/* ✅ Refresh Filters Button with Loading State */}
      <Button variant="outline" onClick={refreshFilters} disabled={loading}>
        <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Refreshing..." : "Refresh Filters"}
      </Button>
    </div>
  );
}
