"use client";

import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface Transaction {
  storeName: string;
  total: number;
  change: number;
  customerId?: number;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function ReceiptModal({ isOpen, onClose, transaction }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .receipt-container { text-align: center; padding: 20px; border: 1px solid #ddd; }
                .receipt-container p { margin: 5px 0; font-size: 16px; }
                .bold { font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="receipt-container">
                <h2>Transaction Receipt</h2>
                <p><span class="bold">Store:</span> ${transaction?.storeName ?? "N/A"}</p>
                <p><span class="bold">Total:</span> ₱${transaction?.total.toFixed(2) ?? "0.00"}</p>
                <p><span class="bold">Change:</span> ₱${transaction?.change.toFixed(2) ?? "0.00"}</p>
                <p><span class="bold">Customer ID:</span> ${transaction?.customerId ?? "Guest"}</p>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  if (!transaction) {
    return null; // Prevent rendering if transaction is null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle>Transaction Receipt</DialogTitle>
        </DialogHeader>

        <div ref={receiptRef} className="p-4 bg-gray-100 rounded-md text-center">
          <p><strong>Store:</strong> {transaction.storeName ?? "N/A"}</p>
          <p><strong>Total:</strong> ₱{transaction.total.toFixed(2)}</p>
          <p><strong>Change:</strong> ₱{transaction.change.toFixed(2)}</p>
          <p><strong>Customer ID:</strong> {transaction.customerId ?? "Guest"}</p>
        </div>

        <DialogFooter className="flex justify-between">
          <Button onClick={onClose} variant="secondary">
            Close
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
