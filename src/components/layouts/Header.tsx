"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const userRole = "Admin"; // Replace with actual role from context or props
  const userName = "John Doe"; // Replace with actual user name from context or props

  return (
    <Card className="h-16 bg-background flex justify-between items-center px-6 shadow-md border-b">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-primary" onClick={toggleSidebar}>
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold text-primary">Admin Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium text-primary">{userName}</div>
          <div className="text-xs text-muted-foreground">{userRole}</div>
        </div>
        <Avatar>
          <AvatarImage src="/images/default_avatar.png" alt="User Avatar" />
          <AvatarFallback className="bg-secondary text-secondary-foreground">{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <ThemeToggle />
      </div>
    </Card>
  );
}
