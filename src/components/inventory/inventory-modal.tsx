"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useStores } from "@/hooks/useStores";
import { useInventory } from "@/hooks/useInventory";

/** ✅ Inventory Form Schema (Validation Using Zod) */
const inventorySchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters."),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  qr_code: z.string().optional(),
  category_id: z.string().min(1, "Please select a category."),
  supplier_id: z.string().min(1, "Please select a supplier."),
  new_category: z.string().optional(),  new_supplier: z.string().optional(),  // ✅ Fix: Add new_supplier field

  stores: z
    .array(
      z.object({
        store_id: z.string().min(1, "Please select a store."),
        price: z.preprocess((val) => parseFloat(val as string), z.number().positive("Price must be greater than zero.")),
        stock_quantity: z.preprocess((val) => parseInt(val as string, 10), z.number().min(0, "Stock must be at least 0.")),
        low_stock_threshold: z.preprocess(
          (val) => (val ? parseInt(val as string, 10) : undefined),
          z.number().min(0, "Low stock threshold must be at least 0.").optional()
        ),
      })
    )
    .optional(),
});

/** ✅ Type Definition for Inventory Data */
type InventorySchemaType = z.infer<typeof inventorySchema>;

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: InventorySchemaType) => Promise<boolean>;
  inventoryData?: any | null;
  refreshInventory: () => void; // ✅ Ensure this is required
}

export default function InventoryModal({ isOpen, onClose, onSubmit, inventoryData }: InventoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState(false);
  const [customSupplier, setCustomSupplier] = useState(false);

  const { categories } = useCategories();
  const { suppliers } = useSuppliers();
  const { stores } = useStores();

  const { addInventory, updateInventory, refreshInventory } = useInventory(); // ✅ Fix function name

  /** ✅ Initialize Form with Dynamic Default Values */
  const form = useForm<InventorySchemaType>({
    resolver: zodResolver(inventorySchema),
    mode: "onChange",
    defaultValues: inventoryData || {
      name: "",
      sku: "",
      barcode: "",
      qr_code: "",
      category_id: "",
      supplier_id: "",
      new_category: "",
      stores: [],
    },
  });

 /** ✅ Ensure Form Resets Properly When Editing */
/** ✅ Ensure Form Resets Properly When Editing */
useEffect(() => {
    if (inventoryData) {
      const matchedCategory = categories.find(cat => cat.id.toString() === inventoryData.category_id);
      const matchedSupplier = suppliers.find(sup => sup.id.toString() === inventoryData.supplier_id);
  
      form.reset({
        name: inventoryData.productName || "",
        sku: inventoryData.productSKU || "",
        barcode: inventoryData.barcode || "",
        qr_code: inventoryData.qr_code || "",
        category_id: matchedCategory ? matchedCategory.id.toString() : "other",
        new_category: matchedCategory ? "" : inventoryData.categoryName || "",
        supplier_id: matchedSupplier ? matchedSupplier.id.toString() : "other",
        new_supplier: matchedSupplier ? "" : inventoryData.supplierName || "",
        stores: inventoryData.store
          ? [{
              store_id: inventoryData.store.id.toString(),
              price: inventoryData.price.toString(),
              stock_quantity: inventoryData.stock.toString(),
              low_stock_threshold: inventoryData.low_stock_threshold?.toString() || "0",
            }]
          : [],
      });
  
      setCustomCategory(!matchedCategory); // ✅ Only set "Other" if no match found
      setCustomSupplier(!matchedSupplier); // ✅ Only set "Other" if no match found
    } else {
      form.reset({
        name: "",
        sku: "",
        barcode: "",
        qr_code: "",
        category_id: "",
        new_category: "",
        supplier_id: "",
        new_supplier: "",
        stores: [],
      });
  
      setCustomCategory(false);
      setCustomSupplier(false);
    }
  }, [inventoryData, categories, suppliers, form]);
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "stores",
  });

  /** ✅ Handle Form Submission */
  const handleSubmit = async (data: InventorySchemaType) => {
    setLoading(true);

    let success = false;
    if (inventoryData) {
      success = await updateInventory(inventoryData.id, data);
    } else {
      success = await addInventory(data);
    }

    if (success) {
      refreshInventory();
      onClose();
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{inventoryData ? "Edit Product Details" : "Add Product & Inventory"}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[75vh] p-2 space-y-4">
          {inventoryData && (
            <Alert variant="warning">
              <AlertTitle>⚠️ Warning: Global Product Edit</AlertTitle>
              <AlertDescription>
                Changes made here will **affect all stores** carrying this product.
              </AlertDescription>
            </Alert>
          )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="border-b pb-4">
          <h2 className="text-lg font-semibold">Global Product Details</h2>
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
    {/* ✅ Category Selection */}
<FormField control={form.control} name="category_id" render={({ field }) => (
  <FormItem>
    <FormLabel>Category</FormLabel>
    <Select 
      onValueChange={(val) => { 
        field.onChange(val); 
        setCustomCategory(val === "other"); 
      }} 
      value={field.value ?? ""}
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

{/* ✅ Show New Category Input When "Other" is Selected */}
{customCategory && (
  <FormField control={form.control} name="new_category" render={({ field }) => (
    <FormItem>
      <FormLabel>New Category</FormLabel>
      <FormControl><Input placeholder="Enter new category" {...field} /></FormControl>
      <FormMessage />
    </FormItem>
  )} />
)}

{/* ✅ Supplier Selection */}
<FormField control={form.control} name="supplier_id" render={({ field }) => (
  <FormItem>
    <FormLabel>Supplier</FormLabel>
    <Select 
      onValueChange={(val) => { 
        field.onChange(val); 
        setCustomSupplier(val === "other"); 
      }} 
      value={field.value ?? ""}
    >
      <SelectTrigger><SelectValue placeholder="Select Supplier" /></SelectTrigger>
      <SelectContent>
        {suppliers.map((sup) => (
          <SelectItem key={sup.id} value={sup.id.toString()}>{sup.name}</SelectItem>
        ))}
        <SelectItem value="other">Other (Enter New Supplier)</SelectItem>
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
)} />

{/* ✅ Show New Supplier Input When "Other" is Selected */}
{customSupplier && (
  <FormField control={form.control} name="new_supplier" render={({ field }) => (
    <FormItem>
      <FormLabel>New Supplier</FormLabel>
      <FormControl><Input placeholder="Enter new supplier" {...field} /></FormControl>
      <FormMessage />
    </FormItem>
  )} />
)}

</div>

{/* ✅ Store-Specific Details */}
<div>
            {/* ✅ Store-Level Pricing & Stock Management */}
            {!inventoryData && (  <div className="space-y-4">
                <h2 className="text-lg font-semibold">Store-Level Inventory</h2>
                <Button type="button" onClick={() => append({ store_id: "", price: "", stock_quantity: "", low_stock_threshold: "" })}>➕ Add Store</Button>
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-2 p-3 border rounded-lg">
                  <FormField control={form.control} name={`stores.${index}.store_id`} render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger><SelectValue placeholder="Select Store" /></SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id.toString()}>{store.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )} />

                  <FormField control={form.control} name={`stores.${index}.price`} render={({ field }) => (
                    <Input type="number" step="0.01" placeholder="Price" className="text-lg" {...field} />
                  )} />

                  <FormField control={form.control} name={`stores.${index}.stock_quantity`} render={({ field }) => (
                    <Input type="number" placeholder="Stock Quantity" className="text-lg" {...field} />
                  )} />

                  <FormField control={form.control} name={`stores.${index}.low_stock_threshold`} render={({ field }) => (
                    <Input type="number" placeholder="Low Stock Threshold" className="text-lg" {...field} />
                  )} />

                  <Button type="button" variant="destructive" onClick={() => remove(index)}>🗑 Remove</Button>
                </div>
              ))}
            </div>
            )}</div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : inventoryData ? "Update" : "Save"}</Button>
            </DialogFooter>
          </form>
        </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
