"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser, getStoreName } from "@/lib/auth"; // ✅ Fetch user details
import { useStockManagement } from "@/hooks/useStockManagement"; // ✅ Fetch low-stock products
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"; // ✅ Import dropdown

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const [user, setUser] = useState<{ name: string; role: string; storeName: string } | null>(null);
  const { lowStockProducts, refreshLowStockProducts, loading } = useStockManagement();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
console.log(lowStockProducts);
  // ✅ Fetch user info and store name on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser();
        const storeName = await getStoreName();
        setUser({ name: userData.name, role: userData.role, storeName });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Card className="h-16 bg-background flex justify-between items-center px-6 shadow-md border-b">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-primary" onClick={toggleSidebar}>
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold text-primary">
          {user?.storeName ? `${user.storeName} Dashboard` : "Loading..."}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* ✅ Low Stock Notification Dropdown */}
        <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-6 h-6 text-primary" />
              {!loading && lowStockProducts?.length > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                  {lowStockProducts.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3">
            <h3 className="text-sm font-semibold text-primary">Low Stock Alerts</h3>
            {loading ? (
              <p className="text-xs text-muted-foreground">Loading...</p>
            ) : lowStockProducts?.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {lowStockProducts.slice(0, 5).map((product, index) => (
                  <li key={product.store_product_id || index} className="flex justify-between items-center text-xs p-2 bg-gray-100 rounded">
                    <span className="truncate w-40">{product.product_name || "Unknown"}</span>
                    <Badge variant="outline" className="bg-red-500 text-white px-2">
                      {product.stock_quantity} left
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No low-stock items.</p>
            )}
            <div className="mt-2 text-right">
              <Link href="/low-stock" className="text-xs text-primary underline">
                View all low stock items
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* ✅ User Info */}
        <div className="text-right">
          <div className="text-sm font-medium text-primary">{user?.name || "Loading..."}</div>
          <div className="text-xs text-muted-foreground">{user?.role || "Loading..."}</div>
        </div>

        {/* ✅ User Avatar */}
        <Avatar>
          <AvatarImage src="/images/default_avatar.png" alt="User Avatar" />
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            {user?.name?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>

        {/* ✅ Dark Mode Toggle */}
        <ThemeToggle />
      </div>
    </Card>
  );
}
