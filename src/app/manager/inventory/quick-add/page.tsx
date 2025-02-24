"use client";

import { useState, useEffect, useRef } from "react";
import { addProductByBarcode } from "@/services/inventory";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function QuickAddInventory() {
  const [barcode, setBarcode] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Focus input automatically when page loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  /**
   * ✅ Handle Barcode Input
   * - Waits for Enter Key (`Enter` press)
   * - Detects Barcode Scanning (Auto-submit after delay)
   */
  const handleBarcodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setBarcode(value);

    // Clear any previous timer (for barcode scanner)
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Set new timeout (Auto-submit after 700ms - typical barcode scanner delay)
    timeoutRef.current = setTimeout(() => {
      submitBarcode(value);
    }, 700);
  };

  /**
   * ✅ Handle Enter Key Submission
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitBarcode(barcode);
    }
  };

  /**
   * ✅ Submit Barcode to Backend
   */
  const submitBarcode = async (barcodeValue: string) => {
    if (!barcodeValue) return; // Prevent empty submissions

    try {
      const storeId = sessionStorage.getItem("storeId");

      if (!storeId) {
        toast.error("Store ID not found. Please refresh.");
        return;
      }

      // ✅ Trigger backend call with barcode & store_id
      await addProductByBarcode(barcodeValue, storeId);
      toast.success(`✅ Product added successfully!`);
    } catch (error) {
      toast.error("❌ Failed to add product. Check barcode or try again.");
    } finally {
      // ✅ Reset input field for next scan
      setBarcode("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <Card className="w-[400px] p-6 shadow-lg">
        <CardHeader className="text-xl font-bold text-center">
          📦 Quick Add Product
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-gray-600 text-center">Scan or enter barcode, then press Enter</p>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Scan barcode..."
            value={barcode}
            onChange={handleBarcodeInput}
            onKeyDown={handleKeyDown} // ✅ Detect Enter Key
            autoFocus
            className="text-center text-lg font-semibold"
          />
        </CardContent>
      </Card>
    </div>
  );
}
