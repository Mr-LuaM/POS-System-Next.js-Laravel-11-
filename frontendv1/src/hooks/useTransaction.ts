import { useState } from "react";
import { toast } from "sonner";
import { processTransactionApi } from "@/services/transactions"; // ✅ Correct import

export const useTransaction = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processTransaction = async (
    cashierId: number | null,
    storeId: number | null,
    customerId: number | null,
    method: "cash" | "credit" | "digital",
    cart: { id: number; name: string; price: number; quantity: number }[],
    cashReceived: number | null,
    setTransaction: Function,
    setIsReceiptModalOpen: Function,
    setCart: Function
  ) => {
    if (!cashierId || !storeId) {
      toast.error("❌ Missing store or cashier data.");
      return;
    }

    if (cart.length === 0) {
      toast.error("❌ No items in cart.");
      return;
    }

    setIsProcessing(true);
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      const transactionData = {
        cashier_id: cashierId,
        store_id: storeId,
        customer_id: customerId,
        payment_methods: [{ method, amount: cashReceived ?? totalAmount, change: (cashReceived ?? totalAmount) - totalAmount }],
        items: cart.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
      };

      const response = await processTransactionApi(transactionData);

      if (response.success) {
        setTransaction({
          id: response.sale_id,
          storeName: "POS Store",
          total: totalAmount,
          change: response.change ?? 0,
          customerId: customerId ?? Math.floor(Math.random() * 100000) + 1,
          paymentMethod: method,
          breakdown: cart,
        });

        setIsReceiptModalOpen(true);
        setCart([]);
        toast.success("✅ Transaction Completed!");
      } else {
        toast.error(`❌ Transaction failed: ${response.message}`);
      }
    } catch (error: any) {
      toast.error(`❌ Error processing payment: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return { processTransaction, isProcessing };
};
