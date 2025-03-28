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
import { toast } from "sonner";

/** ✅ Schema for Price & Threshold */
const storeDetailsSchema = z.object({
  price: z
    .preprocess((val) => (val ? parseFloat(val as string) : undefined), z.number().positive("Price must be greater than zero."))
    .optional(),
  low_stock_threshold: z
    .preprocess((val) => (val ? parseInt(val as string, 10) : undefined), z.number().min(0, "Threshold must be at least 0."))
    .optional(),
});

type StoreDetailsSchemaType = z.infer<typeof storeDetailsSchema>;

interface ManageStoreLevelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeData?: any | null;
  refreshInventory: () => void; // ✅ Ensure inventory refresh after update
}

export default function ManageStoreLevelDetailsModal({ isOpen, onClose, storeData, refreshInventory }: ManageStoreLevelDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const { updatePrice, updateThreshold } = useStockManagement();

  /** ✅ Initialize Form */
  const form = useForm<StoreDetailsSchemaType>({
    resolver: zodResolver(storeDetailsSchema),
    mode: "onChange",
    defaultValues: {
      price: storeData?.price ?? "", // ✅ Ensure value is prefilled
      low_stock_threshold: storeData?.low_stock_threshold ?? "", // ✅ Ensure value is prefilled
    },
  });

  /** ✅ Reset Form on Open with Predefined Data */
  useEffect(() => {
    if (storeData) {
      form.reset({
        price: storeData.price?.toString() ?? "",
        low_stock_threshold: storeData.low_stock_threshold?.toString() ?? "",
      });
    }
  }, [storeData, form]);

  /** ✅ Handle Form Submission */
  const handleSubmit = async (data: StoreDetailsSchemaType) => {
    if (!storeData?.id) {
      toast.error("❌ Error: Missing product ID.");
      return;
    }

    setLoading(true);

    const priceSuccess = data.price !== undefined ? await updatePrice(storeData.id, data.price) : false;
    const thresholdSuccess = data.low_stock_threshold !== undefined ? await updateThreshold(storeData.id, data.low_stock_threshold) : false;

    if (priceSuccess || thresholdSuccess) {
      refreshInventory(); // ✅ Refresh table after successful update
      onClose();
    } else {
      toast.error("❌ No changes detected.");
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Store-Level Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-2">
          {storeData && (
            <Alert variant="info">
              <AlertTitle>Store-Level Details</AlertTitle>
              <AlertDescription>
                Updating details for: <strong>{storeData.productName}</strong><br />
                Store: <strong>{storeData.storeName}</strong>
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* ✅ Price (Preloaded) */}
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter new price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* ✅ Low Stock Threshold (Preloaded) */}
              <FormField control={form.control} name="low_stock_threshold" render={({ field }) => (
                <FormItem>
                  <FormLabel>Low Stock Threshold</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter threshold" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* ✅ View-Only Stock Quantity (Disabled) */}
              <FormItem>
                <FormLabel>Current Stock</FormLabel>
                <FormControl>
                  <Input type="number" value={storeData?.stock ?? 0} disabled className="opacity-50" />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Stock management is handled in the <strong>Manage Stock</strong> modal.
                </p>
              </FormItem>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Update Details"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
