"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: SupplierSchemaType) => void;
  supplierData?: SupplierSchemaType | null; // ✅ Allow null
}

/**
 * ✅ Define Supplier Form Schema Using Zod
 */
const supplierSchema = z.object({
  name: z.string().min(2, { message: "Supplier name must be at least 2 characters." }),
  contact: z.string().min(5, { message: "Contact number must be valid." }),
  email: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => val === "" || /\S+@\S+\.\S+/.test(val), {
      message: "Invalid email format.",
    }),
  address: z.string().optional().or(z.literal("")),
});

type SupplierSchemaType = z.infer<typeof supplierSchema>;

/**
 * ✅ Supplier Modal with Proper Handling for Optional Fields and Buttons
 */
export default function SupplierModal({ isOpen, onClose, onSubmit, supplierData }: SupplierModalProps) {
  const form = useForm<SupplierSchemaType>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      contact: "",
      email: "",
      address: "",
    },
  });

  // ✅ Effect to update form values when editing
  useEffect(() => {
    if (supplierData) {
      form.reset({
        name: supplierData.name || "", // ✅ Ensure empty string instead of null
        contact: supplierData.contact || "",
        email: supplierData.email || "",
        address: supplierData.address || "",
      });
    } else {
      form.reset({ name: "", contact: "", email: "", address: "" });
    }
  }, [supplierData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{supplierData?.name ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ✅ Supplier Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Supplier Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Contact Number */}
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Email (Optional) */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Address (Optional) */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{supplierData?.name ? "Update" : "Save"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
