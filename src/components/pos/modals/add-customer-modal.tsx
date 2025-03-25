"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import PrintableCustomerCard from "@/components/pos/modals/printable-customer-card";

/** ✅ Customer Form Schema (Validation Using Zod) */
const customerSchema = z.object({
  name: z.string().min(2, "Customer name must be at least 2 characters."),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().regex(/^\d{7,15}$/, "Invalid phone number format").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
});

/** ✅ Type Definition for Customer Data */
type CustomerSchemaType = z.infer<typeof customerSchema>;

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
  const { registerCustomer } = useCustomers();
  const [registeredCustomer, setRegisteredCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  /** ✅ Initialize Form */
  const form = useForm<CustomerSchemaType>({
    resolver: zodResolver(customerSchema),
    mode: "onChange", // ✅ Real-time validation
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
    },
  });

  /** ✅ Handle Form Submission */
  const handleSubmit = async (data: CustomerSchemaType) => {
    setLoading(true);
    try {
      const newCustomer = await registerCustomer(data);
      setRegisteredCustomer(newCustomer);
      form.reset(); // ✅ Reset only after success
    } catch (error) {
      console.error("Error saving customer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg text-left">
        <DialogTitle className="flex justify-start gap-2">
          <UserPlus className="h-6 w-6" /> Add Customer
        </DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* ✅ Customer Name */}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl><Input placeholder="Enter customer name" {...field} disabled={loading} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ Customer Email */}
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl><Input placeholder="Enter email" {...field} disabled={loading} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ Customer Phone */}
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (Optional)</FormLabel>
                <FormControl><Input placeholder="Enter phone number" {...field} disabled={loading} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ Customer Address */}
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>Address (Optional)</FormLabel>
                <FormControl><Input placeholder="Enter address" {...field} disabled={loading} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ City */}
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem>
                <FormLabel>City (Optional)</FormLabel>
                <FormControl><Input placeholder="Enter city" {...field} disabled={loading} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ State */}
            <FormField control={form.control} name="state" render={({ field }) => (
              <FormItem>
                <FormLabel>State (Optional)</FormLabel>
                <FormControl><Input placeholder="Enter state" {...field} disabled={loading} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* ✅ Zip Code */}
            <FormField control={form.control} name="zip_code" render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code (Optional)</FormLabel>
                <FormControl><Input placeholder="Enter zip code" {...field} disabled={loading} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Customer"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      {registeredCustomer && <PrintableCustomerCard customer={registeredCustomer} onClose={() => setRegisteredCustomer(null)} />}
    </Dialog>
  );
}
