"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onCompletePayment: (payments: { method: string; amount: number; change: number }[]) => void;
}

export default function PaymentModal({ isOpen, onClose, totalAmount, onCompletePayment }: PaymentModalProps) {
  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState("cash");
  const change = amount !== "" ? amount - totalAmount : 0;

  const handleCompletePayment = () => {
    if (amount === "" || amount <= 0) {
      toast.error("❌ Enter a valid payment amount.");
      return;
    }

    if (method === "cash" && amount < totalAmount) {
      toast.error("❌ Insufficient cash received.");
      return;
    }

    const payments = [
      {
        method,
        amount: parseFloat(amount.toString()), // ✅ Ensure correct numeric format
        change: change > 0 ? parseFloat(change.toFixed(2)) : 0, // ✅ Fix decimal places
      },
    ];

    console.log("✅ Payments Sent to onCompletePayment:", payments); // ✅ Debugging Log
    onCompletePayment(payments); // ✅ Pass correct payments array
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between font-semibold">
            <span>Total Amount:</span>
            <span>₱{totalAmount.toFixed(2)}</span>
          </div>

          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          {/* 🔹 Auto Compute Change for Cash Payments */}
          {method === "cash" && (
            <div className="flex justify-between font-semibold text-green-600">
              <span>Change:</span>
              <span>₱{change > 0 ? change.toFixed(2) : "0.00"}</span>
            </div>
          )}

          <Button className="w-full" onClick={handleCompletePayment}>
            Complete Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
