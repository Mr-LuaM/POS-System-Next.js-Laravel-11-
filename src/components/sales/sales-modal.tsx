"use client";

import { useEffect, useState } from "react";
import { getSaleItems } from "@/services/sales";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
        const data = await getSaleItems(saleId);
        setSaleItems(data);
      } catch (error: any) {
        console.error("❌ Failed to fetch sale items:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleItems();
  }, [saleId]);

  return (
    <Dialog open={!!saleId} onOpenChange={onClose}>
      <DialogContent
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Sale Breakdown (ID #{saleId})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : saleItems.length === 0 ? (
            <p className="text-center text-gray-500">No sale items found.</p>
          ) : (
            <ul className="space-y-3">
              {saleItems.map((item) => (
                <li key={item.id} className="flex justify-between border-b pb-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.product_name} (x{item.quantity})
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ₱{(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white" onClick={onClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SalesModal;
