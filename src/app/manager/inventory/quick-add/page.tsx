"use client";

import { useState, useEffect, useRef } from "react";
import { addProductByBarcode } from "@/services/inventory";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function QuickAddInventory() {
  const [barcode, setBarcode] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Focus input automatically when page loads
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /**
   * ✅ Manual input only (wait for Enter)
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(e.target.value.trim());
  };

  /**
   * ✅ Trigger submission only on Enter
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitBarcode(barcode);
    }
  };

  /**
   * ✅ Submit to backend
   */
  const submitBarcode = async (barcodeValue: string) => {
    if (!barcodeValue) return;

    try {
      const storeId = sessionStorage.getItem("storeId");
      if (!storeId) {
        toast.error("Store ID not found. Please refresh.");
        return;
      }

      await addProductByBarcode(barcodeValue, storeId);
      toast.success("✅ Product added successfully!");
    } catch (error) {
      toast.error("❌ Failed to add product. Check barcode or try again.");
    } finally {
      setBarcode("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-[400px] p-6 shadow-lg">
        <CardHeader className="text-xl font-bold text-center">
          📦 Quick Add Product
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-gray-600 text-center">
            Scan or enter barcode, then press <strong>Enter</strong>
          </p>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Scan barcode..."
            value={barcode}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoFocus
            className="text-center text-lg font-semibold"
          />
        </CardContent>
      </Card>
    </div>
  );
}
