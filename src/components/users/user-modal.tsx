"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getStores } from "@/services/stores";
import { Store } from "@/services/stores";

/**
 * ✅ Define User Schema Using Zod (Validation)
 */
const userSchema = z.object({
  name: z.string().min(2, { message: "User name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).optional(),
  role: z.enum(["admin", "cashier", "manager"], { message: "Invalid role selected." }),
  store_id: z.coerce.number().optional().nullable(), // store_id is optional for admin
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
  onSubmit: (values: Partial<UserSchemaType>) => Promise<boolean>;
  userData?: Partial<UserSchemaType> | null;
}

/**
 * ✅ User Modal Component (Add & Edit User)
 */
export default function UserModal({ isOpen, onClose, onSubmit, userData }: UserModalProps) {
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);

  const form = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "cashier",
      store_id: null,
    },
  });

  /**
   * ✅ Load Stores on Mount
   */
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const result = await getStores("false");
        setStores(result);
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      }
    };
    fetchStores();
  }, []);

  /**
   * ✅ Reset Form When Editing
   */
  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData.name || "",
        email: userData.email || "",
        password: "",
        role: userData.role || "cashier",
        store_id: userData.store_id ?? null,
      });
    }
  }, [userData, form]);

  /**
   * ✅ Handle Form Submission
   */
  const handleSubmit = async (data: UserSchemaType) => {
    setLoading(true);
    const payload: Partial<UserSchemaType> = { ...data };

    // Only include password on new user
    if (userData) delete payload.password;

    // If admin, clear store_id
    if (data.role === "admin") payload.store_id = null;

    const success = await onSubmit(payload);
    setLoading(false);
    if (success) onClose();
  };

  const watchRole = form.watch("role");

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

            {/* ✅ Conditionally Show Store Selection */}
            {(watchRole === "cashier" || watchRole === "manager") && (
              <FormField control={form.control} name="store_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Store</FormLabel>
                  <FormControl>
                    <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value?.toString() ?? ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a store" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id.toString()}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : userData ? "Update User" : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
