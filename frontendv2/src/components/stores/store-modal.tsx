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
 * ✅ Define Store Schema Using Zod (Validation)
 */
const storeSchema = z.object({
  name: z.string().min(2, { message: "Store name must be at least 2 characters." }),
  location: z.string().optional().or(z.literal("")),
});

/**
 * ✅ Type Definition for Form Data
 */
type StoreSchemaType = z.infer<typeof storeSchema>;

/**
 * ✅ Props Interface
 */
interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: StoreSchemaType, id?: number) => Promise<boolean>; // ✅ Returns boolean for success
  storeData?: StoreSchemaType & { id?: number } | null;
}

/**
 * ✅ Store Modal Component (Add & Edit Store)
 */
export default function StoreModal({ isOpen, onClose, onSubmit, storeData }: StoreModalProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<StoreSchemaType>({
    resolver: zodResolver(storeSchema),
    mode: "onChange",
    defaultValues: { name: "", location: "" },
  });

  // ✅ Ensure form updates when switching stores
  useEffect(() => {
    form.reset(storeData || { name: "", location: "" });
  }, [storeData, form]);

  /**
   * ✅ Handle Submit with Validation & Loading State
   */
  const handleSubmit = async (data: StoreSchemaType) => {
    setLoading(true);
    const success = await onSubmit(data, storeData?.id);
    setLoading(false);

    if (success) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{storeData ? "Edit Store" : "Add Store"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Store Name</FormLabel>
                <FormControl>
                  <Input placeholder="Store Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="location" render={({ field }) => (
              <FormItem>
                <FormLabel>Location (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : storeData ? "Update" : "Save"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
