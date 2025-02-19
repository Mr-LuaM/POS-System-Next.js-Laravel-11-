"use client";

import { useInventoryFilters } from "@/hooks/useInventoryFilters";
import FilterDropdown from "@/components/common/filter-dropdown";

interface InventoryFiltersProps {
  selectedStore: string;
  setSelectedStore: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSupplier: string;
  setSelectedSupplier: (value: string) => void;
}

/**
 * ✅ Inventory Filters Component (Uses Cached Data from `useInventoryFilters`)
 */
export default function InventoryFilters({
  selectedStore,
  setSelectedStore,
  selectedCategory,
  setSelectedCategory,
  selectedSupplier,
  setSelectedSupplier,
}: InventoryFiltersProps) {
  const { stores, categories, suppliers, loading } = useInventoryFilters();

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {/* ✅ Store Filter (Uses Cached Stores) */}
      <FilterDropdown
        label="Store"
        options={stores} // ✅ Pass cached store data instead of making another API call
        selectedValue={selectedStore}
        onChange={setSelectedStore}
        loading={loading}
      />

      {/* ✅ Category Filter (Uses Cached Categories) */}
      <FilterDropdown
        label="Category"
        options={categories} // ✅ Pass cached category data instead of making another API call
        selectedValue={selectedCategory}
        onChange={setSelectedCategory}
        loading={loading}
      />

      {/* ✅ Supplier Filter (Uses Cached Suppliers) */}
      <FilterDropdown
        label="Supplier"
        options={suppliers} // ✅ Pass cached supplier data instead of making another API call
        selectedValue={selectedSupplier}
        onChange={setSelectedSupplier}
        loading={loading}
      />
    </div>
  );
}
