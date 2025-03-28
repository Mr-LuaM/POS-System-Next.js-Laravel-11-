"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export default function LoadingScreen({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center h-screen bg-muted">
      <Card className="p-8 flex flex-col items-center justify-center gap-4 shadow-lg rounded-lg w-80 bg-background border border-border">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <h2 className="text-xl font-semibold text-primary">Loading...</h2>
        <p className="text-sm text-muted-foreground text-center">
          {message || "Processing request, please wait..."}
        </p>
      </Card>
    </div>
  );
}
