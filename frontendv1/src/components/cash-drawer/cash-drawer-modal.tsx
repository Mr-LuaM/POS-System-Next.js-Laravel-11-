"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCashDrawer } from "@/hooks/useCashDrawer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cashDrawerId: number;
}

/**
 * ✅ Modal to Update Actual Cash Collected & Closing Balance
 */
export default function UpdateCashModal({ isOpen, onClose, cashDrawerId }: Props) {
  const { updateCashDrawer } = useCashDrawer(); // ✅ Using single function
  const [actualCollected, setActualCollected] = useState("");
  const [closingBalance, setClosingBalance] = useState("");

  /**
   * ✅ Handle Submit for Both Fields
   */
  const handleSubmit = async () => {
    const parsedCollected = actualCollected !== "" ? parseFloat(actualCollected) : undefined;
    const parsedBalance = closingBalance !== "" ? parseFloat(closingBalance) : undefined;

    if ((parsedCollected !== undefined && isNaN(parsedCollected)) || (parsedBalance !== undefined && isNaN(parsedBalance))) {
      alert("Please enter valid amounts.");
      return;
    }

    await updateCashDrawer(cashDrawerId, parsedCollected, parsedBalance);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Cash Drawer</DialogTitle>
        </DialogHeader>

        {/* ✅ Input for Actual Cash Collected */}
        <Input 
          type="number"
          placeholder="Enter actual collected amount"
          value={actualCollected}
          onChange={(e) => setActualCollected(e.target.value)}
        />

        {/* ✅ Input for Closing Balance */}
        <Input 
          type="number"
          placeholder="Enter closing balance"
          value={closingBalance}
          onChange={(e) => setClosingBalance(e.target.value)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button> {/* ✅ One Button for Both */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
