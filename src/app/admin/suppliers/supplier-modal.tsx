"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

/**
 * ✅ Supplier Form Schema (Validation Using Zod)
 */
const supplierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Supplier name must be at least 2 characters." })
    .max(100, { message: "Supplier name must not exceed 100 characters." }),

  contact: z
    .string()
    .trim()
    .min(5, { message: "Contact number must be at least 5 digits." })
    .max(15, { message: "Contact number must not exceed 15 digits." })
    .regex(/^\d+$/, { message: "Contact number must contain only numbers." }),

  email: z
    .union([
      z.string().trim().max(100).email({ message: "Invalid email format." }),
      z.literal(""),
    ])
    .optional(),

  address: z
    .union([
      z.string().trim().max(200),
      z.literal(""),
    ])
    .optional(),
});

/**
 * ✅ Type Definition for Supplier Data
 */
type SupplierSchemaType = z.infer<typeof supplierSchema>;

/**
 * ✅ Props Interface
 */
interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SupplierSchemaType) => Promise<boolean>; // ✅ Returns boolean for success
  supplierData?: SupplierSchemaType | null;
}

/**
 * ✅ Supplier Modal Component (Now with Real-Time Validation)
 */
export default function SupplierModal({ isOpen, onClose, onSubmit, supplierData }: SupplierModalProps) {
  const form = useForm<SupplierSchemaType>({
    resolver: zodResolver(supplierSchema),
    mode: "onChange", // ✅ Real-time validation
    defaultValues: { name: "", contact: "", email: "", address: "" },
  });

  // ✅ Update form when editing
  useEffect(() => {
    form.reset(supplierData || { name: "", contact: "", email: "", address: "" });
  }, [supplierData, form]);

  /**
   * ✅ Handle Submit with Validation
   */
  const handleSubmit = async (data: SupplierSchemaType) => {
    const success = await onSubmit(data);
    if (success) onClose(); // ✅ Close modal only on success
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{supplierData ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* ✅ Supplier Name (Real-time validation) */}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier Name</FormLabel>
                <FormControl>
                  <Input placeholder="Supplier Name" {...field} />
                </FormControl>
                <FormMessage /> {/* ✅ Real-time error message */}
              </FormItem>
            )} />

            {/* ✅ Contact Number (Real-time validation) */}
            <FormField control={form.control} name="contact" render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="Contact Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ Email (Optional, Real-time validation) */}
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ Address (Optional, Real-time validation) */}
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>Address (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{supplierData ? "Update" : "Save"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
