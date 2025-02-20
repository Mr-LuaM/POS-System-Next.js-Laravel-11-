"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ConfirmDialog from "@/components/common/confirm-dialog";

export default function StockModal({ isOpen, onClose, product, onSubmit }) {
  const [type, setType] = useState("restock");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * ✅ Opens Confirm Dialog Before Submitting
   */
  const handleConfirm = () => setConfirmDialog(true);

  /**
   * ✅ Handles Stock Update Submission
   */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(product.id, { type, quantity, reason });
      onClose(); // ✅ Close modal after success
    } catch (error) {
      console.error("Stock update failed:", error);
    } finally {
      setConfirmDialog(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Stock for {product.product.name}</DialogTitle>
            <DialogDescription>
              Adjust the stock levels for this product. Ensure correct quantities to prevent inventory errors.
            </DialogDescription>
          </DialogHeader>

          {/* ✅ Stock Type Selection */}
          <div className="space-y-2">
            <Label>Stock Adjustment Type</Label>
            <select 
              className="w-full p-2 border rounded-md"
              value={type} 
              onChange={(e) => setType(e.target.value)}
            >
              <option value="restock">🟢 Restock</option>
              <option value="damage">❌ Record Damage</option>
              <option value="adjustment">⚙ Adjust Stock</option>
            </select>
          </div>

          {/* ✅ Quantity Input */}
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input 
              type="number" 
              min="1"
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
          </div>

          {/* ✅ Reason (Optional) */}
          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Textarea 
              placeholder="Enter reason for adjustment..." 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* ✅ Submit Button */}
          <Button onClick={handleConfirm} className="w-full mt-3">
            ✅ Submit Stock Update
          </Button>
        </DialogContent>
      </Dialog>

      {/* ✅ Confirm Dialog Before Submitting */}
      {confirmDialog && (
        <ConfirmDialog
          open={true}
          onConfirm={handleSubmit}
          onCancel={() => setConfirmDialog(false)}
          title="Confirm Stock Adjustment"
          description={`Are you sure you want to ${type} ${quantity} units for ${product.product.name}?`}
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          loading={loading}
        />
      )}
    </>
  );
}
