"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
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
  name: z.string()
    .trim()
    .min(2, { message: "Supplier name must be at least 2 characters." })
    .max(100, { message: "Supplier name must not exceed 100 characters." }),

  contact: z.string()
    .trim()
    .min(5, { message: "Contact number must be at least 5 digits." })
    .max(15, { message: "Contact number must not exceed 15 digits." })
    .regex(/^\d+$/, { message: "Contact number must contain only numbers." }),

  email: z.string()
    .trim()
    .max(100)
    .email({ message: "Invalid email format." })
    .optional(),

  address: z.string()
    .trim()
    .max(200)
    .nullable() // ✅ Allow `null` as a valid value
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
 * ✅ Supplier Modal Component (With Real-Time Validation & Loading State)
 */
export default function SupplierModal({ isOpen, onClose, onSubmit, supplierData }: SupplierModalProps) {
  const [loading, setLoading] = useState(false); // ✅ Added loading state

  const form = useForm<SupplierSchemaType>({
    resolver: zodResolver(supplierSchema),
    mode: "onChange",
    defaultValues: { name: "", contact: "", email: "", address: "" },
  });

  // ✅ Update form when editing, replacing `null` with empty strings
  useEffect(() => {
    form.reset({
      name: supplierData?.name || "",
      contact: supplierData?.contact || "",
      email: supplierData?.email || "",
      address: supplierData?.address ?? "", // ✅ Convert `null` to empty string before validation
    });
  }, [supplierData, form]);

  /**
   * ✅ Handle Submit with Validation & Loading State
   */
  const handleSubmit = async (data: SupplierSchemaType) => {
    setLoading(true); // ✅ Start loading state
    const success = await onSubmit(data);
    setLoading(false); // ✅ Stop loading state
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
            {/* ✅ Supplier Name */}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier Name</FormLabel>
                <FormControl>
                  <Input placeholder="Supplier Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ Contact Number (Numbers Only) */}
            <FormField control={form.control} name="contact" render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input 
                    type="tel"
                    placeholder="Contact Number" 
                    {...field}
                    onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))} // ✅ Remove non-numeric characters dynamically
                    pattern="\d*"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ Email (Optional) */}
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ Address (Optional) */}
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>Address (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ Footer with Cancel & Save Buttons */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : supplierData ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
