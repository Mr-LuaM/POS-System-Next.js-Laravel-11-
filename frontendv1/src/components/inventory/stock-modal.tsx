"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useStockManagement } from "@/hooks/useStockManagement";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useInventory } from "@/hooks/useInventory"; // ✅ Import to refresh inventory table

/** ✅ Stock Adjustment Schema */
const stockSchema = z.object({
  type: z.enum(["restock", "adjustment", "damage"], {
    required_error: "Stock type is required.",
  }),
  quantity: z
    .string()
    .refine((val) => /^-?\d+$/.test(val.trim()), { message: "Invalid quantity format." }) // ✅ Only allow numbers with a single `+` or `-`
    .transform((val) => parseInt(val, 10))
    .refine((val) => val !== 0, { message: "Quantity cannot be 0." }),
  reason: z.string().optional(),
});

type StockSchemaType = z.infer<typeof stockSchema>;

interface ManageStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockData?: any | null;
  refreshInventory: () => void; // ✅ Ensure this is required

}

export default function ManageStockModal({ isOpen, onClose, stockData }: ManageStockModalProps) {
  const [loading, setLoading] = useState(false);
  const { updateStock } = useStockManagement();
  const { refreshInventory } = useInventory(); // ✅ Ensure inventory refresh

  /** ✅ Initialize Form */
  const form = useForm<StockSchemaType>({
    resolver: zodResolver(stockSchema),
    mode: "onChange",
    defaultValues: {
      type: "adjustment",
      quantity: "0", // ✅ Ensure a controlled input
      reason: "",
    },
  });

  /** ✅ Reset Form on Open */
  useEffect(() => {
    if (stockData) {
      form.reset({
        type: "adjustment",
        quantity: "0", // ✅ Reset quantity on open
        reason: "",
      });
    }
  }, [stockData, form]);

  /** ✅ Handle Form Submission */
  const handleSubmit = async (data: StockSchemaType) => {
    if (!stockData?.id) {
      toast.error("❌ Error: Missing product ID.");
      return;
    }

    setLoading(true);

    // ✅ Validate stock based on type
    if (data.type === "restock" && data.quantity < 1) {
      toast.error("❌ Restock quantity must be positive.");
      setLoading(false);
      return;
    }

    if (data.type === "damage" && data.quantity >= 0) {
      toast.error("❌ Damage quantity must be negative.");
      setLoading(false);
      return;
    }

    const success = await updateStock(stockData.id, {
      type: data.type,
      quantity: data.quantity,
      reason: data.reason || "Stock adjustment",
    });

    if (success) {
      refreshInventory(); // ✅ Refresh inventory table on success
      onClose();
    }

    setLoading(false);
  };

  /** ✅ Handle Quantity Input */
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.trim();

    // ✅ Prevent multiple `++` or `--`
    if (/(\+\+|--)/.test(val)) {
      toast.error("❌ Invalid format: Use only a single `+` or `-`.");
      return;
    }

    // ✅ Ensure valid number or `-` for negative
    if (!/^(-?\d+)?$/.test(val)) {
      return;
    }

    // ✅ Ensure restock is always positive
    if (form.getValues("type") === "restock" && val.startsWith("-")) {
      toast.error("❌ Restock must be positive.");
      return;
    }

    // ✅ Ensure damage is always negative
    if (form.getValues("type") === "damage" && !val.startsWith("-")) {
      toast.error("❌ Damage must be negative.");
      return;
    }

    form.setValue("quantity", val);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Stock</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-2">
          {stockData && (
            <Alert variant="info">
              <AlertTitle>Stock Update</AlertTitle>
              <AlertDescription>
                Managing stock for: <strong>{stockData.productName}</strong><br />
                Store: <strong>{stockData.storeName}</strong><br />
                Current Stock: <strong>{stockData.stock} pcs</strong>
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* ✅ Stock Type Dropdown */}
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Adjustment Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(val) => form.setValue("type", val as "restock" | "adjustment" | "damage")}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select adjustment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restock">Restock (Increase stock)</SelectItem>
                        <SelectItem value="adjustment">Adjustment (Correct stock levels, +/-)</SelectItem>
                        <SelectItem value="damage">Damage (Remove damaged stock)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* ✅ Stock Quantity Input */}
              <FormField control={form.control} name="quantity" render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter quantity"
                      {...field}
                      onChange={handleQuantityChange}
                      value={field.value.toString()}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> Use `+` or leave empty for addition. Use `-` for subtraction (only in Adjustment).
                  </p>
                </FormItem>
              )} />

              {/* ✅ Reason (Optional) */}
              <FormField control={form.control} name="reason" render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Optional reason for stock change" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Update Stock"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
