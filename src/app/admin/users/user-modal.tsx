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
 * ✅ Define User Schema Using Zod (Validation)
 */
const userSchema = z.object({
  name: z.string().min(2, { message: "User name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).optional(),
  role: z.enum(["admin", "cashier", "manager"], { message: "Invalid role selected." }),
});

/**
 * ✅ Type Definition for Form Data
 */
type UserSchemaType = z.infer<typeof userSchema>;

/**
 * ✅ Props Interface
 */
interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: UserSchemaType) => void;
  userData?: Partial<UserSchemaType> | null;
}

/**
 * ✅ User Modal Component (Add & Edit User)
 */
export default function UserModal({ isOpen, onClose, onSubmit, userData }: UserModalProps) {
  const form = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "cashier",
    },
  });

  // ✅ Ensure form updates when switching users
  useEffect(() => {
    form.reset({
      name: userData?.name || "",
      email: userData?.email || "",
      password: "", // Empty password when editing
      role: userData?.role || "cashier",
    });
  }, [userData, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{userData ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>User Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {!userData && (
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem>
                <FormLabel>User Role</FormLabel>
                <FormControl>
                  <select className="w-full p-2 border border-gray-300 rounded" {...field}>
                    <option value="admin">Admin</option>
                    <option value="cashier">Cashier</option>
                    <option value="manager">Manager</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{userData ? "Update User" : "Add User"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
