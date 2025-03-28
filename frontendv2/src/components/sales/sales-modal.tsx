"use client";

import { useEffect, useState } from "react";
import { getSaleItems } from "@/services/sales";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SalesModalProps {
  saleId: number;
  onClose: () => void;
}

const SalesModal: React.FC<SalesModalProps> = ({ saleId, onClose }) => {
  const [saleItems, setSaleItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSaleItems = async () => {
      setLoading(true);
      try {
        const res = await getSaleItems(saleId);
        setSaleItems(res || []);
      } catch (error: any) {
        console.error("❌ Failed to fetch sale items:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleItems();
  }, [saleId]);

  const totalAmount = saleItems.reduce(
    (acc, item) => acc + parseFloat(item.total || 0),
    0
  );

  return (
    <Dialog open={!!saleId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg px-6 py-5">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
            Sale Breakdown - #{saleId}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading sale items...</p>
          ) : saleItems.length === 0 ? (
            <p className="text-center text-muted-foreground">No sale items found.</p>
          ) : (
            <ul className="divide-y divide-border">
              {saleItems.map((item) => (
                <li key={item.id} className="py-2 flex justify-between">
                  <span className="text-sm text-foreground">
                    {item.product_name}{" "}
                    <span className="text-muted-foreground">(x{item.quantity})</span>
                  </span>
                  <span className="font-semibold text-green-600">
                    ₱{parseFloat(item.total).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!loading && saleItems.length > 0 && (
          <div className="border-t pt-4 mt-4 flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">Total</span>
            <span className="text-foreground font-bold text-base text-green-700">
              ₱{totalAmount.toFixed(2)}
            </span>
          </div>
        )}

        <Button
          className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white"
          onClick={onClose}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SalesModal;
