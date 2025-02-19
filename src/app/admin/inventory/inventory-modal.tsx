"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().trim().min(2, { message: "Product name must be at least 2 characters." }).max(100),
  sku: z.string().trim().min(3, { message: "SKU must be at least 3 characters." }).max(50),
  barcode: z.string().trim().max(50).optional(),
  price: z.number().min(0, { message: "Price must be a positive number." }),
  stock_quantity: z.number().int().min(0, { message: "Stock must be at least 0." }).optional(), // ✅ Only for adding
});

type ProductSchemaType = z.infer<typeof productSchema>;

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ProductSchemaType) => Promise<boolean>;
  productData?: ProductSchemaType | null;
}

export default function InventoryModal({ isOpen, onClose, onSubmit, productData }: InventoryModalProps) {
  const [loading, setLoading] = useState(false);
  const isEditMode = !!productData;

  const form = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: { name: "", sku: "", barcode: "", price: 0, stock_quantity: 0 },
  });

  useEffect(() => {
    form.reset(productData || { name: "", sku: "", barcode: "", price: 0, stock_quantity: 0 });
  }, [productData, form]);

  const handleSubmit = async (data: ProductSchemaType) => {
    setLoading(true);
    const success = await onSubmit(data);
    setLoading(false);
    if (success) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* ✅ Product Name */}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl><Input placeholder="Product Name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ SKU */}
            <FormField control={form.control} name="sku" render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl><Input placeholder="SKU" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ Barcode (Optional) */}
            <FormField control={form.control} name="barcode" render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode (Optional)</FormLabel>
                <FormControl><Input placeholder="Barcode" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ Price */}
            <FormField control={form.control} name="price" render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl><Input type="number" step="0.01" placeholder="Price" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ Initial Stock (Only in Add Mode) */}
            {!isEditMode && (
              <FormField control={form.control} name="stock_quantity" render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Stock</FormLabel>
                  <p className="text-xs text-muted-foreground mb-1">This will be the initial stock upon product creation.</p>
                  <FormControl><Input type="number" placeholder="Stock Quantity" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {/* ✅ Footer with Cancel & Save */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : isEditMode ? "Update" : "Save"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
