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

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: StoreSchemaType) => void;
  storeData?: StoreSchemaType | null;
}

/**
 * ✅ Define Store Form Schema Using Zod
 */
const storeSchema = z.object({
  name: z.string().min(2, { message: "Store name must be at least 2 characters." }),
  location: z.string().optional().or(z.literal("")),
});

type StoreSchemaType = z.infer<typeof storeSchema>;

/**
 * ✅ Store Modal with Dynamic Handling
 */
export default function StoreModal({ isOpen, onClose, onSubmit, storeData }: StoreModalProps) {
  const form = useForm<StoreSchemaType>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  // ✅ Effect to update form values when switching between Add/Edit mode
  useEffect(() => {
    if (storeData) {
      form.reset({
        name: storeData.name || "",
        location: storeData.location || "",
      });
    } else {
      form.reset({ name: "", location: "" });
    }
  }, [storeData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{storeData?.name ? "Edit Store" : "Add Store"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* ✅ Store Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Store Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Location (Optional) */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{storeData?.name ? "Update" : "Save"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
