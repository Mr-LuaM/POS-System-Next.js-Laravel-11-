"use client";

import { useAuth } from "@/hooks/useAuth"; // ✅ Import your authentication hook
import { useState, useEffect } from "react";
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
  MessageSquare,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// ✅ Full Role-Based Menu
const roleMenus = {
  admin: [
    {
      section: "General",
      items: [
        { name: "Dashboard", href: "/admin", icon: Home, shortcut: "⌘D" },
        { name: "Settings", href: "/admin/settings", icon: Settings, shortcut: "⌘," },
      ],
    },
    {
      section: "Management",
      items: [
        { name: "Inventory", href: "/admin/inventory", icon: Package, shortcut: "⌘I" },
        { name: "Categories", href: "/admin/categories", icon: Tags },
        { name: "Suppliers", href: "/admin/suppliers", icon: Truck },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Stores", href: "/admin/stores", icon: Store },
        { name: "Discounts", href: "/admin/discounts", icon: DollarSign },
        { name: "Stock Movements", href: "/admin/stock-movements", icon: ClipboardList },
        { name: "Expenses", href: "/admin/expenses", icon: BarChart2 },
      ],
    },
    {
      section: "Sales",
      items: [
        { name: "Sales Transactions", href: "/admin/sales", icon: ShoppingCart, shortcut: "⌘S" },
        { name: "Payments", href: "/admin/payments", icon: DollarSign },
        { name: "Refunds", href: "/admin/refunds", icon: FileText, shortcut: "⌘⇧F" },
      ],
    },
    {
      section: "Reports",
      items: [
        { name: "Sales Reports", href: "/admin/reports/sales", icon: FileText, shortcut: "⌘⇧R" },
        { name: "Analytics", href: "/admin/reports/analytics", icon: BarChart },
      ],
    },
  ],
  manager: [
    {
      section: "General",
      items: [
        { name: "Dashboard", href: "/manager/dashboard", icon: Home, shortcut: "⌘D" },
        { name: "Settings", href: "/manager/settings", icon: Settings, shortcut: "⌘," },
      ],
    },
    {
      section: "Store Management",
      items: [
        { name: "Customers", href: "/manager/customers", icon: Users, shortcut: "⌘C" },
        { name: "Inventory", href: "/manager/inventory", icon: Package, shortcut: "⌘I" },
        { name: "Sales Reports", href: "/manager/sales", icon: FileText, shortcut: "⌘⇧R" },
        { name: "Refund Requests", href: "/manager/refunds", icon: RefreshCcw, shortcut: "⌘⇧F" },
        { name: "Expenses", href: "/manager/expenses", icon: BarChart2, shortcut: "⌘E" },
        { name: "Quick Add", href: "/manager/inventory/quick-add", icon: Package, shortcut: "⌘F" },
        { name: "Cash Drawer", href: "/manager/cash-drawer", icon: Package, shortcut: "⌘F" },

      ],
    },
  ],
  cashier: [
    {
      section: "Sales",
      items: [
        { name: "POS Checkout", href: "/cashier/checkout", icon: ShoppingCart, shortcut: "⌘S" },
        { name: "Transactions", href: "/cashier/transactions", icon: FileText },
        { name: "Refund Requests", href: "/cashier/refunds", icon: RefreshCcw, shortcut: "⌘⇧F" },
      ],
    },
  ],
};

export default function Sidebar({
  isOpen,
  setIsSidebarOpen,
  role = "admin",
}: {
  isOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  role?: "admin" | "manager" | "cashier";
}) {
  const pathname = usePathname();
  const [menus, setMenus] = useState(roleMenus[role] || roleMenus["admin"]);

  useEffect(() => {
    setMenus(roleMenus[role] || roleMenus["admin"]); // ✅ Ensure menu updates when role changes
  }, [role]);

  const { logout } = useAuth(); // ✅ Get logout function from the hook

  return (
    <TooltipProvider>
      <Card
        className={`h-screen bg-sidebar-background text-sidebar-foreground fixed transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } shadow-lg border-r p-4 flex flex-col justify-between`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl font-bold tracking-wide text-primary transition-all duration-300 ${!isOpen && "hidden"}`}>
            {role.charAt(0).toUpperCase() + role.slice(1)} Panel
          </h2>
          <Button variant="ghost" size="icon" className="text-primary" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <nav>
            {menus.map((section) => (
              <div key={section.section} className="mb-4">
                {/* Section Header */}
                <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${!isOpen && "hidden"}`}>
                  {section.section}
                </div>

                {/* Section Items */}
                {section.items.map(({ name, href, icon: Icon }) => (
                  <Tooltip key={name} disableHoverableContent={isOpen}>
                    <TooltipTrigger asChild>
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3 rounded-lg transition-all hover:bg-muted hover:text-primary",
                          pathname === href && "bg-primary text-primary-foreground"
                        )}
                      >
                        {/* ✅ Always show the icon */}
                        <Icon className="w-5 h-5" />

                        {/* ✅ Show text only when sidebar is expanded */}
                        {isOpen && <span>{name}</span>}
                      </Link>
                    </TooltipTrigger>

                    {/* ✅ Show tooltip only when sidebar is collapsed */}
                    {!isOpen && <TooltipContent>{name}</TooltipContent>}
                  </Tooltip>
                ))}
              </div>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="w-full">
        <Button
      variant="destructive"
      className="w-full flex items-center gap-4 px-4 py-3 rounded-lg"
      onClick={logout} // ✅ Calls your existing logout function
    >
      <LogOut className="w-5 h-5" />
      <span className={`transition-all duration-300 ${!isOpen && "hidden"}`}>Logout</span>
    </Button>
        </div>
      </Card>
    </TooltipProvider>
  );
}
