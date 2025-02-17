"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Users,
  Settings,
  Store,
  FileText,
  BarChart,
  LogOut,
  Menu,
  Tags,
  DollarSign,
  Truck,
  ClipboardList,
  BarChart2,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // Utility for conditional styling

const menuSections = [
  {
    section: "General",
    items: [
      { name: "Dashboard", href: "/admin", icon: <Home className="w-5 h-5" /> },
      { name: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
    ],
  },
  {
    section: "Management",
    items: [
      { name: "Inventory", href: "/admin/inventory", icon: <Package className="w-5 h-5" /> },
      { name: "Categories", href: "/admin/categories", icon: <Tags className="w-5 h-5" /> },
      { name: "Suppliers", href: "/admin/suppliers", icon: <Truck className="w-5 h-5" /> },
      { name: "Users", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
      { name: "Stores", href: "/admin/stores", icon: <Store className="w-5 h-5" /> },
      { name: "Discounts", href: "/admin/discounts", icon: <DollarSign className="w-5 h-5" /> },
      { name: "Stock Movements", href: "/admin/stock-movements", icon: <ClipboardList className="w-5 h-5" /> },
      { name: "Expenses", href: "/admin/expenses", icon: <BarChart2 className="w-5 h-5" /> },
    ],
  },
  {
    section: "Sales",
    items: [
      { name: "Sales Transactions", href: "/admin/sales", icon: <ShoppingCart className="w-5 h-5" /> },
      { name: "Payments", href: "/admin/payments", icon: <DollarSign className="w-5 h-5" /> },
      { name: "Refunds", href: "/admin/refunds", icon: <FileText className="w-5 h-5" /> },
    ],
  },
  {
    section: "Reports",
    items: [
      { name: "Sales Reports", href: "/admin/reports/sales", icon: <FileText className="w-5 h-5" /> },
      { name: "Analytics", href: "/admin/reports/analytics", icon: <BarChart className="w-5 h-5" /> },
    ],
  },
];

export default function Sidebar({ isOpen, setIsSidebarOpen }: { isOpen: boolean; setIsSidebarOpen: (open: boolean) => void }) {
  const pathname = usePathname();

  return (
    <Card
      className={`h-screen bg-sidebar-background text-sidebar-foreground fixed transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      } shadow-lg border-r p-4 flex flex-col justify-between`}
    >
      {/* Sidebar Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold tracking-wide text-primary transition-all duration-300 ${!isOpen && "hidden"}`}>
          Admin Panel
        </h2>
        <Button variant="ghost" size="icon" className="text-primary" onClick={() => setIsSidebarOpen(!isOpen)}>
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <nav>
          {menuSections.map((section) => (
            <div key={section.section} className="mb-4">
              {/* Section Header */}
              <div
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${
                  !isOpen && "hidden"
                }`}
              >
                {section.section}
              </div>

              {/* Section Items */}
              {section.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-lg transition-all hover:bg-muted hover:text-primary",
                    pathname === item.href && "bg-primary text-primary-foreground"
                  )}
                >
                  {item.icon}
                  <span className={`transition-all duration-300 ${!isOpen && "hidden"}`}>{item.name}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>
             {/* Logout Button */}
      {/* Logout Button */}
      <div className="w-full">
        <Button
          variant="destructive"
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg"
          onClick={() => {
            sessionStorage.clear();
            window.location.href = "/login";
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className={`transition-all duration-300 ${!isOpen && "hidden"}`}>Logout</span>
        </Button>
      </div>
      </div>

 
    </Card>
  );
}
