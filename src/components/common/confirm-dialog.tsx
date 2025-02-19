"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => Promise<void>; // ✅ Ensure async support
  onCancel: () => void;
  title: string;
  description: string;
  confirmLabel?: string; // ✅ Custom label for confirmation button
  cancelLabel?: string; // ✅ Custom label for cancel button
  confirmVariant?: "default" | "destructive" | "secondary" | "outline"; // ✅ Custom button variant
}

/**
 * ✅ Reusable Confirm Dialog with Loading State & Dynamic Button Colors
 */
export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "destructive",
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false); // ✅ Added loading state

  // ✅ Debugging to track modal state
  useEffect(() => {
    console.log("ConfirmDialog open state:", open);
  }, [open]);

  /**
   * ✅ Handle Confirm Click with Loading State
   */
  const handleConfirm = async () => {
    setLoading(true); // ✅ Start loading
    await onConfirm();
    setLoading(false); // ✅ Stop loading after completion
  };

  /**
   * ✅ Assign Dynamic Button Colors Based on Action Type
   */
  const getButtonVariant = () => {
    switch (confirmVariant) {
      case "destructive":
        return "bg-red-600 hover:bg-red-700 text-white"; // 🔴 Delete/Remove
      case "secondary":
        return "bg-blue-600 hover:bg-blue-700 text-white"; // 🔵 Restore
      case "outline":
        return "border border-gray-500 text-gray-700 hover:bg-gray-200"; // ⚫ Archive
      default:
        return "bg-green-600 hover:bg-green-700 text-white"; // ✅ Default (Confirm)
    }
  };

  return (
    <Dialog open={open} onOpenChange={!loading ? onCancel : undefined}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">{description}</p>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button 
            className={`${getButtonVariant()} px-4 py-2 rounded`} 
            onClick={handleConfirm} 
            disabled={loading}
          >
            {loading ? "Processing..." : confirmLabel} {/* ✅ Dynamic loading text */}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
