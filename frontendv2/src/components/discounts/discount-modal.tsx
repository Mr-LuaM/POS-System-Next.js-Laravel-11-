"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { useInventory } from "@/hooks/useInventory";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

/**
 * ✅ Zod Schema for Validation
 */
const discountSchema = z.object({
  code: z.string().min(1, "Discount code is required"),
  discount_value: z.preprocess(
    (val) => (val ? parseFloat(val as string) : 0),
    z.number().min(0, "Discount value must be a positive number")
  ),
  discount_type: z.enum(["fixed", "percentage"]),
  applies_to: z.enum(["all", "category", "product", "min_purchase"]),
  valid_until: z.string().optional(),
  category_id: z.string().optional(),
  product_id: z.string().optional(),
  min_purchase_amount: z.preprocess(
    (val) => (val ? parseFloat(val as string) : null),
    z.number().min(0, "Minimum purchase must be positive").nullable()
  ),
});

export default function DiscountModal({
  isOpen,
  onClose,
  onSubmit,
  discountData,
  isEdit,
}: any) {
  const [loading, setLoading] = useState(false);
  const { categories } = useCategories();
  const { inventory } = useInventory();

  /**
   * ✅ Extract Unique Products from Inventory
   */
  const uniqueProducts = Array.from(
    new Map(inventory.map((item) => [item.product.id, item.product])).values()
  );

  /**
   * ✅ Use React Hook Form with Zod
   */
  const form = useForm({
    resolver: zodResolver(discountSchema),
    mode: "onChange",
    defaultValues: discountData,
  });

  /**
   * ✅ Ensure Form Resets When Editing
   */
  useEffect(() => {
    if (isEdit && discountData) {
      form.reset({
        id: discountData.id,  // ✅ Ensure ID is included for updates
        code: discountData.code,
        discount_value: discountData.discount_value,
        discount_type: discountData.discount_type,
        applies_to: discountData.applies_to,
        valid_until: discountData.valid_until,
        category_id: discountData.category_id || "",
        product_id: discountData.product_id || "",
        min_purchase_amount: discountData.min_purchase_amount || null,
      });
    }
  }, [isEdit, discountData, form]);
  

  /**
   * ✅ Handle Form Submission Properly
   */
  const handleSubmit = async (data: any) => {
    setLoading(true);
  
    // 🔍 Debugging: Check if ID exists
    console.log("Submitting Discount Data:", data);
  
    if (isEdit && discountData?.id) {
      data.id = discountData.id; // ✅ Ensure ID is included for updates
    }
  
    await onSubmit(data);
    setLoading(false);
    onClose();
  };
  

  const appliesTo = form.watch("applies_to"); // ✅ Watch "Applies To" selection
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Discount" : "Add Discount"}</DialogTitle>
        </DialogHeader>

        {/* ✅ Form using ShadCN's FormField */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            
            {/* ✅ Discount Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Discount Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Discount Value */}
            <FormField
              control={form.control}
              name="discount_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Value</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Discount Value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Discount Type (Select) */}
            <FormField
              control={form.control}
              name="discount_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Applies To (Select) */}
            <FormField
              control={form.control}
              name="applies_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applies To</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Applies To" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Products</SelectItem>
                        <SelectItem value="category">Specific Category</SelectItem>
                        <SelectItem value="product">Specific Product</SelectItem>
                        <SelectItem value="min_purchase">Min Purchase Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Category Selection (Only if "Specific Category" is chosen) */}
            {appliesTo === "category" && (
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Category</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* ✅ Product Selection (Only if "Specific Product" is chosen) */}
            {appliesTo === "product" && (
              <FormField
                control={form.control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Product</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* ✅ Minimum Purchase Amount (Only if "Min Purchase Amount" is chosen) */}
            {appliesTo === "min_purchase" && (
              <FormField
                control={form.control}
                name="min_purchase_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Purchase Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Minimum Purchase Amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* ✅ Valid Until */}
            <FormField
              control={form.control}
              name="valid_until"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid Until</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEdit ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
