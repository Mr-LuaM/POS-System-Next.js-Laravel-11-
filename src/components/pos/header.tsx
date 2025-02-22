"use client";

import React, { useEffect, useState } from "react";

interface POSHeaderProps {
  cashierName: string | null; // ✅ The cashier's name
  storeName: string | null;
  customerName: string | null; // ✅ The customer's name
  customerLoyaltyPoints?: number | null; // ✅ Loyalty points (optional)
}

export default function POSHeader({ cashierName, storeName, customerName, customerLoyaltyPoints }: POSHeaderProps) {
  const [currentTime, setCurrentTime] = useState("");

  // ✅ Real-time Clock
  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(
        new Intl.DateTimeFormat("en-PH", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(new Date())
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-primary text-white p-4 rounded-md mb-4 shadow-md">
      {/* ✅ Main Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Point of Sale</h1>
          <p className="opacity-80">
            <strong>Cashier:</strong> {cashierName ?? "Not Assigned"}
          </p>
        </div>
        <div className="text-right">
          <p className="opacity-80">
            <strong>Store:</strong> {storeName ?? "Not Assigned"}
          </p>
          <p className="opacity-80">
            <strong>Time:</strong> {currentTime}
          </p>
        </div>
      </div>

      {/* ✅ Customer Info Card */}
      <div className="bg-white text-primary p-3 mt-4 rounded-lg shadow-md text-center">
        <p className="font-semibold text-sm">
          {customerName ?? `Guest #${Math.floor(Math.random() * 100000)}`} {/* Random Guest ID */}
        </p>
        {/* {customerLoyaltyPoints !== undefined && (
          <p className="text-sm opacity-80">Loyalty Points: {customerLoyaltyPoints}</p>
        )} */}
      </div>
    </header>
  );
}
