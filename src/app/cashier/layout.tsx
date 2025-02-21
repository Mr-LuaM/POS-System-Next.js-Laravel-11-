"use client"; // ✅ Mark this as a Client Component

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // ✅ Works only in Client Components

export default function POSLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen">
      {/* ✅ Top Bar Navigation for Cashier */}
      <header className="bg-primary text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">POS System</h1>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push("/cashier/sales-history")}>Sales History</Button>
          <Button variant="outline" onClick={() => alert('Cash Drawer Opened!')}>Open Drawer</Button>
          <Button variant="destructive" onClick={() => router.push("/logout")}>Logout</Button>
        </div>
      </header>

      {/* ✅ Main POS Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
