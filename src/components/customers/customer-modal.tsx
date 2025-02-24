"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ClaimPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
  onClaim: (customerId: number, pointsToClaim: number) => Promise<void>;
}

export default function ClaimPointsModal({ isOpen, onClose, customer, onClaim }: ClaimPointsModalProps) {
  const form = useForm({
    defaultValues: { points_to_claim: "" },
  });

  const [loading, setLoading] = useState(false);

  const handleClaim = async (data: { points_to_claim: string }) => {
    const pointsToClaim = parseInt(data.points_to_claim, 10);
    if (!pointsToClaim || pointsToClaim <= 0 || pointsToClaim > customer.total_points) {
      toast.error("Enter a valid number of points.");
      return;
    }

    setLoading(true);
    try {
      await onClaim(customer.id, pointsToClaim);
      toast.success(`Claimed ${pointsToClaim} points successfully!`);
      onClose();
    } catch (error) {
      toast.error("Failed to claim points.");
    } finally {
      setLoading(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Claim Loyalty Points</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleClaim)} className="space-y-4">
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input value={customer.name} disabled />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Available Points</FormLabel>
              <FormControl>
                <Input value={customer.total_points} disabled />
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Points to Claim</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter points"
                  {...form.register("points_to_claim")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Claim Points"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
