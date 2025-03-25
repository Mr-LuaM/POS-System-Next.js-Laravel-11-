"use client";

import { useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface TransactionItem {
  name: string;
  price: number;
  quantity: number;
}

interface Transaction {
  storeName: string;
  date: string;
  items?: TransactionItem[];
  subtotal: number;
  // tax: number;
  discount: number;
  total: number;
  paid: number;
  change: number;
  cashier: string;
  transactionId: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export default function ReceiptModal({ isOpen, onClose, transaction }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  // 🔍 **Debugging: Log transaction before rendering**
  useEffect(() => {
    if (transaction) {
      console.log("📄 Rendering Receipt for Transaction:", transaction);
      console.log("🛒 Items in Receipt:", transaction.items);
    }
  }, [transaction]);

  const handlePrint = () => {
    if (receiptRef.current && transaction) {
      console.log("🖨️ Printing Receipt:", transaction); // ✅ Log transaction before printing
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt</title>
              <style>
                body { font-family: 'Courier New', monospace; font-size: 12px; padding: 10px; }
                .receipt-container { width: 250px; text-align: center; border: 1px solid #ddd; padding: 10px; margin: auto; }
                .receipt-header { font-size: 14px; font-weight: bold; }
                .line { border-top: 1px dashed #000; margin: 5px 0; }
                .item-row { display: flex; justify-content: space-between; }
                .total-row { font-weight: bold; }
                .thank-you { margin-top: 10px; font-size: 12px; font-style: italic; }
              </style>
            </head>
            <body>
              <div class="receipt-container">
                <div class="receipt-header">${transaction?.storeName ?? "STORE NAME"}</div>
                <div>${transaction?.date ?? new Date().toLocaleString()}</div>
                <div class="line"></div>

                ${
                  transaction?.items && transaction.items.length > 0
                    ? transaction.items
                        .map(
                          (item, index) => `
                    <div class="item-row">
                      <span>${item.quantity} x ${item.name ?? "Unknown Item"}</span>
                      <span>₱${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  `
                        )
                        .join("")
                    : `<p>No items available</p>`
                }

                <div class="line"></div>
                <div class="item-row total-row">
                  <span>Subtotal:</span>
                  <span>₱${Number(transaction?.subtotal || 0).toFixed(2)}</span>
                </div>
              
                <div class="item-row">
                  <span>Discount:</span>
                  <span>-₱${Number(transaction?.discount || 0).toFixed(2)}</span>
                </div>
                <div class="line"></div>
                <div class="item-row total-row">
                  <span>Total:</span>
                  <span>₱${Number(transaction?.total || 0).toFixed(2)}</span>
                </div>
                <div class="item-row">
                  <span>Paid:</span>
                  <span>₱${Number(transaction?.paid || 0).toFixed(2)}</span>
                </div>
                <div class="item-row">
                  <span>Change:</span>
                  <span>₱${Number(transaction?.change || 0).toFixed(2)}</span>
                </div>

                <div class="line"></div>
                <div>Transaction ID: ${transaction?.transactionId ?? "N/A"}</div>
                <div>Cashier: ${transaction?.cashier ?? "Unknown"}</div>

                <div class="line"></div>
                <div class="thank-you">Thank you for shopping with us!</div>
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
      <DialogContent className="max-w-sm p-6">
        <DialogHeader>
          <DialogTitle>Transaction Receipt</DialogTitle>
        </DialogHeader>

        <div ref={receiptRef} className="p-4 bg-gray-100 rounded-md text-center text-sm font-mono">
          <h2 className="font-bold text-lg">{transaction?.storeName ?? "STORE NAME"}</h2>

          <p>{transaction?.date ?? new Date().toLocaleString()}</p>
          <hr className="my-2 border-dashed" />

          <div className="text-left">
            {transaction?.items && transaction.items.length > 0 ? (
              transaction.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.quantity} x {item.name ?? "Unknown Item"}</span>
                  <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items available</p>
            )}
          </div>

          <hr className="my-2 border-dashed" />
          <div className="flex justify-between font-semibold">
            <span>Subtotal:</span>
            <span>₱{Number(transaction?.subtotal || 0).toFixed(2)}</span>
          </div>
          {/* <div className="flex justify-between">
            <span>Tax:</span>
            <span>₱{Number(transaction?.tax || 0).toFixed(2)}</span>
          </div> */}
          <div className="flex justify-between">
            <span>Discount:</span>
            <span>-₱{Number(transaction?.discount || 0).toFixed(2)}</span>
          </div>
          <hr className="my-2 border-dashed" />
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>₱{Number(transaction?.total || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Paid:</span>
            <span>₱{Number(transaction?.paid || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Change:</span>
            <span>₱{Number(transaction?.change || 0).toFixed(2)}</span>
          </div>

          <hr className="my-2 border-dashed" />
          <p className="text-xs">Transaction ID: {transaction?.transactionId ?? "N/A"}</p>
          <p className="text-xs">Cashier: {transaction?.cashier ?? "Unknown"}</p>
          <hr className="my-2 border-dashed" />
          <p className="text-sm italic">Thank you for shopping with us!</p>
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
