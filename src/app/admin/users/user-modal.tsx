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
  onSubmit: (values: Partial<UserSchemaType>) => Promise<boolean>; // ✅ Returns boolean for success
  userData?: Partial<UserSchemaType> | null;
}

/**
 * ✅ User Modal Component (Add & Edit User)
 */
export default function UserModal({ isOpen, onClose, onSubmit, userData }: UserModalProps) {
  const [loading, setLoading] = useState(false); // ✅ Added loading state

  const form = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "", // ✅ Exclude password when editing
      role: "cashier",
    },
  });

  // ✅ Ensure form updates when switching users
  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData.name || "",
        email: userData.email || "",
        password: "", // ✅ Prevents password from being pre-filled
        role: userData.role || "cashier",
      });
    }
  }, [userData, form]);

 /**
 * ✅ Handle Submit with Loading State
 */
const handleSubmit = async (data: UserSchemaType) => {
  setLoading(true); // ✅ Start loading

  console.log("Submitting form data:", data); // ✅ Debugging

  // ✅ Ensure password is excluded on edit
  const userPayload: Partial<UserSchemaType> = { ...data };
  if (!userData) userPayload.password = data.password; // Only include password for new users
  else delete userPayload.password;

  console.log("Final payload sent:", userPayload); // ✅ Debugging final payload

  const success = await onSubmit(userPayload);
  
  setLoading(false); // ✅ Stop loading
  if (success) onClose(); // ✅ Close modal only on success
};

  return (
    <Dialog open={isOpen} onOpenChange={!loading ? onClose : undefined}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{userData ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

            {/* ✅ Only Show Password Field for New Users */}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="cashier">Cashier</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

<DialogFooter>
  <Button 
    type="button" 
    variant="outline" 
    onClick={onClose} 
    disabled={loading}
  >
    Cancel
  </Button>

  <Button 
    type="submit" 
    disabled={loading} 
    onClick={form.handleSubmit(handleSubmit)} // ✅ Ensure form submission triggers
  >
    {loading ? "Saving..." : userData ? "Update User" : "Add User"}
  </Button>
</DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
