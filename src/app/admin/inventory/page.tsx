import { DataTable } from "./data-table";
import { columns, InventoryItem } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download } from "lucide-react";

async function getInventoryData(): Promise<InventoryItem[]> {
  return [
    { id: "1", name: "Apple", category: "Fruits", supplier: "Fresh Farm", stock: 50, price: 1.5 },
    { id: "2", name: "Banana", category: "Fruits", supplier: "Tropical Imports", stock: 10, price: 0.8 },
    { id: "3", name: "Milk", category: "Dairy", supplier: "DairyCo", stock: 5, price: 2.0 },
    { id: "4", name: "Bread", category: "Bakery", supplier: "Local Bakes", stock: 20, price: 1.2 },
  ];
}

export default async function InventoryPage() {
  const data = await getInventoryData();

  return (
    <div className="container mx-auto py-10 space-y-4">
      {/* Header with Action Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <div className="flex gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Inventory DataTable */}
      <DataTable columns={columns} data={data} />
    </div>
  );
}
