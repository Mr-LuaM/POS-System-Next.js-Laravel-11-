"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Banknote  } from "lucide-react";

interface CashDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CashDrawerModal({ isOpen, onClose }: CashDrawerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center">
        <DialogTitle className="flex items-center justify-center gap-2">
          <Banknote  className="h-6 w-6" /> Open Cash Drawer
        </DialogTitle>
        <p className="text-gray-600">The cash drawer has been successfully opened.</p>
        <Button variant="outline" className="w-full mt-4" onClick={onClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
