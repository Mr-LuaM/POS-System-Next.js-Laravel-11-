"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface PaymentActionsProps {
  processTransaction: (paymentType: "cash" | "credit" | "digital") => void;
}

export default function PaymentActions({ processTransaction }: PaymentActionsProps) {
  /**
   * ✅ Listen for `F5` (Cash), `F6` (Credit), `F7` (Digital)
   */
  useEffect(() => {
    const handlePaymentShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return; // Prevent browser shortcuts

      switch (e.key) {
        case "F5":
          e.preventDefault();
          processTransaction("cash");
          break;
        // case "F6":
        //   e.preventDefault();
        //   processTransaction("credit");
        //   break;
        // case "F7":
        //   e.preventDefault();
        //   processTransaction("digital");
        //   break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handlePaymentShortcut);
    return () => document.removeEventListener("keydown", handlePaymentShortcut);
  }, []);

  return (
    <div className="flex flex-col space-y-2">
      <Button className="w-full bg-green-500 text-white p-4 text-lg" onClick={() => processTransaction("cash")}>
        Cash (F5)
      </Button>
      {/* <Button className="w-full bg-yellow-500 text-white p-4 text-lg" onClick={() => processTransaction("credit")}>
        Credit Card (F6)
      </Button>
      <Button className="w-full bg-blue-500 text-white p-4 text-lg" onClick={() => processTransaction("digital")}>
        Digital Payment (F7)
      </Button> */}
    </div>
  );
}
