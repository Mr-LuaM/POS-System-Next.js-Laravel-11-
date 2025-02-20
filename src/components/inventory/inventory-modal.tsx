"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";

/** ✅ Inventory Form Schema (Validation Using Zod) */
const inventorySchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters."),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  qr_code: z.string().optional(),
  price: z.preprocess((val) => parseFloat(val as string), z.number().positive("Price must be greater than zero.")),
  stock_quantity: z.preprocess((val) => parseInt(val as string, 10), z.number().min(0, "Stock must be at least 0.")),
  low_stock_threshold: z.preprocess((val) => parseInt(val as string, 10), z.number().min(0, "Low stock threshold must be at least 0.").optional()),
  category_id: z.string().min(1, "Please select a category."),
  supplier_id: z.string().min(1, "Please select a supplier."),
  new_category: z.string().optional(),
});

/** ✅ Type Definition for Inventory Data */
type InventorySchemaType = z.infer<typeof inventorySchema>;

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: InventorySchemaType) => Promise<boolean>;
  inventoryData?: any | null;
}

export default function InventoryModal({ isOpen, onClose, onSubmit, inventoryData }: InventoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState(false);

  const { categories } = useCategories();
  const { suppliers } = useSuppliers();

  const form = useForm<InventorySchemaType>({
    resolver: zodResolver(inventorySchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      qr_code: "",
      price: "",
      stock_quantity: "",
      low_stock_threshold: "",
      category_id: "",
      supplier_id: "",
      new_category: "",
    },
  });

  /** ✅ Update form when editing */
  useEffect(() => {
    if (inventoryData) {
      console.log("Editing Inventory Data:", inventoryData); // Debugging log
  
      // Find category ID based on category name
      const selectedCategory = categories.find((cat) => cat.name === inventoryData.categoryName);
      const categoryId = selectedCategory ? selectedCategory.id.toString() : "";
  
      // Find supplier ID based on supplier name
      const selectedSupplier = suppliers.find((sup) => sup.name === inventoryData.supplier?.name);
      const supplierId = selectedSupplier ? selectedSupplier.id.toString() : "";
  
      form.reset({
        name: inventoryData.productName || "",
        sku: inventoryData.productSKU || "",
        barcode: inventoryData.barcode || "",
        qr_code: inventoryData.qr_code || "",
        price: inventoryData.price?.toString() || "",
        stock_quantity: inventoryData.stock?.toString() || "",
        low_stock_threshold: inventoryData.low_stock_threshold?.toString() || "",
        category_id: categoryId,
        supplier_id: supplierId,
        new_category: "",
      });
  
      // Ensure "Other" category selection is properly set
      setCustomCategory(categoryId === "other");
    }
  }, [inventoryData, categories, suppliers, form]);
  

  const handleSubmit = async (data: InventorySchemaType) => {
    setLoading(true);
    if (customCategory) {
      data.category_id = "new"; // Indicate new category
      data.new_category = form.getValues("new_category");
    }
    const success = await onSubmit(data);
    setLoading(false);
    if (success) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{inventoryData ? "Edit Inventory" : "Add Product"}</DialogTitle>
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
                <FormLabel>SKU (Optional)</FormLabel>
                <FormControl><Input placeholder="SKU" {...field} /></FormControl>
              </FormItem>
            )} />

            {/* ✅ Barcode */}
            <FormField control={form.control} name="barcode" render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode (Optional)</FormLabel>
                <FormControl><Input placeholder="Barcode" {...field} /></FormControl>
              </FormItem>
            )} />

            {/* ✅ QR Code */}
            <FormField control={form.control} name="qr_code" render={({ field }) => (
              <FormItem>
                <FormLabel>QR Code (Optional)</FormLabel>
                <FormControl><Input placeholder="QR Code" {...field} /></FormControl>
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

            {/* ✅ Category Dropdown with "Other" Option */}
            <FormField control={form.control} name="category_id" render={({ field }) => (
  <FormItem>
    <FormLabel>Category</FormLabel>
    <Select
      onValueChange={(val) => {
        field.onChange(val);
        setCustomCategory(val === "other");
      }}
      value={field.value || ""}
    >
      <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
      <SelectContent>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
        ))}
        <SelectItem value="other">Other (Enter New Category)</SelectItem>
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
)} />


            {customCategory && (
              <FormField control={form.control} name="new_category" render={({ field }) => (
                <FormItem>
                  <FormLabel>New Category</FormLabel>
                  <FormControl><Input placeholder="Enter new category name" {...field} /></FormControl>
                </FormItem>
              )} />
            )}

            {/* ✅ Supplier */}
            <FormField control={form.control} name="supplier_id" render={({ field }) => (
  <FormItem>
    <FormLabel>Supplier</FormLabel>
    <Select
      onValueChange={field.onChange}
      value={field.value || ""}
    >
      <SelectTrigger><SelectValue placeholder="Select Supplier" /></SelectTrigger>
      <SelectContent>
        {suppliers.map((sup) => (
          <SelectItem key={sup.id} value={sup.id.toString()}>{sup.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
)} />


            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : inventoryData ? "Update" : "Save"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
