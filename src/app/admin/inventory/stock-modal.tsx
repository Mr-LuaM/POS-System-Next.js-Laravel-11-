"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { manageStock } from "@/services/inventory";

export default function StockManageModal({ isOpen, onClose, productData }) {
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState<"restock" | "sale" | "adjustment" | "damage" | "return">("restock");

  const handleStockUpdate = async () => {
    await manageStock(productData.id, type, quantity, "Stock adjustment");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Stock - {productData?.name}</DialogTitle>
        </DialogHeader>
        <Input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <Button onClick={handleStockUpdate}>Confirm</Button>
      </DialogContent>
    </Dialog>
  );
}
