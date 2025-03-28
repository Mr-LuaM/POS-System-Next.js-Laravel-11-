"use client"; // ✅ Mark this as a Client Component

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Works only in Client Components
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import CashDrawerModal from "@/components/pos/modals/cash-drawer-modal";
import ProductLookupModal from "@/components/pos/modals/product-lookup-modal";
import AddCustomerModal from "@/components/pos/modals/add-customer-modal";
import { PackageSearch, UserPlus, Banknote  } from "lucide-react"; // ✅ Icons


export default function POSLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [isProductLookupOpen, setProductLookupOpen] = useState(false);
  const [isAddCustomerOpen, setAddCustomerOpen] = useState(false);
  const [isCashDrawerOpen, setCashDrawerOpen] = useState(false);

  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      switch (event.key) {
        case "F1":
          event.preventDefault();
          router.push("/cashier/sales-history");
          break;
        case "F2":
          event.preventDefault();
          setCashDrawerOpen(true);
          break;
        case "F3":
          event.preventDefault();
          setProductLookupOpen(true);
          break;
        case "F4":
          event.preventDefault();
          setAddCustomerOpen(true);
          break;
        case "F12":
          event.preventDefault();
          logout();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcuts);
    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcuts);
    };
  }, [router, logout]);

  return (
    <div className="flex flex-col h-screen">
      {/* ✅ Top Bar Navigation for Cashier */}
      <header className="bg-primary text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">POS System</h1>

        <div className="flex gap-4 text-black">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => router.push("/cashier/sales-history")}>
          <span className="text-lg font-bold">₱</span>
          Sales History
            <span className="ml-auto text-sm text-gray-300">F1</span>
          </Button>

          <Button variant="outline" className="flex items-center gap-2" onClick={() => setCashDrawerOpen(true)}>
            <Banknote  className="h-5 w-5" /> Open Drawer
            <span className="ml-auto text-sm text-gray-300">F2</span>
          </Button>

          <Button variant="outline" className="flex items-center gap-2" onClick={() => setProductLookupOpen(true)}>
            <PackageSearch className="h-5 w-5" /> Product Lookup
            <span className="ml-auto text-sm text-gray-300">F3</span>
          </Button>

          <Button variant="outline" className="flex items-center gap-2" onClick={() => setAddCustomerOpen(true)}>
            <UserPlus className="h-5 w-5" /> Add Customer
            <span className="ml-auto text-sm text-gray-300">F4</span>
          </Button>

          <Button variant="destructive" className="flex items-center gap-2" onClick={logout}>
            Logout
            <span className="ml-auto text-sm text-gray-300">F12</span>
          </Button>
        </div>
      </header>

      {/* ✅ Main POS Content */}
      <main className="flex-1 p-6">{children}</main>

      {/* ✅ Modals */}
      <CashDrawerModal isOpen={isCashDrawerOpen} onClose={() => setCashDrawerOpen(false)} />
      <ProductLookupModal isOpen={isProductLookupOpen} onClose={() => setProductLookupOpen(false)} />
      <AddCustomerModal isOpen={isAddCustomerOpen} onClose={() => setAddCustomerOpen(false)} />
    </div>
  );
}
