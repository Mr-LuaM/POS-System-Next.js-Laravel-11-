"use client";

import { useState, useCallback } from "react";
import {
  fetchCustomer,
  registerCustomer as apiRegisterCustomer,
  searchCustomerByBarcode as apiSearchCustomerByBarcode, // ✅ Fix Naming
} from "@/services/customers";
import { toast } from "sonner";

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  barcode?: string;
  qr_code?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  loyaltyPoints?: number;
}

export function useCustomers() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);

  /** ✅ Fetch customer by ID */
  const getCustomer = useCallback(async (customerId: number): Promise<Customer | null> => {
    setLoading(true);
    try {
      const customer = await fetchCustomer(customerId);
      setCustomer(customer);
      return customer;
    } catch (error: any) {
      toast.error(error?.message || "Customer not found.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** ✅ Fetch customer by barcode or QR code */
  const getCustomerByCode = useCallback(async (query: string): Promise<Customer | null> => {
    setLoading(true);
    try {
      const customer = await searchCustomerByBarcode(query);
      setCustomer(customer);
      return customer;
    } catch (error: any) {
      toast.error(error?.message || "Customer not found.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /** ✅ Search Customer by Barcode */
  const searchCustomerByBarcode = async (barcode: string) => {
    if (!barcode.trim()) {
      toast.error("❌ Please enter a valid customer barcode.");
      return null;
    }

    setLoading(true);
    try {
      const customerData = await apiSearchCustomerByBarcode(barcode); // ✅ Calls the service
      if (customerData) {
        setCustomer(customerData);
        toast.success(`✅ Customer Loaded: ${customerData.name}`);
        return customerData;
      } else {
        toast.error("❌ Customer not found.");
        return null;
      }
    } catch (error) {
      toast.error("❌ Error searching customer.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /** ✅ Register a new customer */
  const registerCustomer = useCallback(async (
    customerData: Omit<Customer, "id" | "barcode" | "qr_code">
  ): Promise<Customer | null> => {
    setLoading(true);
    try {
      const newCustomer = await apiRegisterCustomer(customerData);
      setCustomer(newCustomer);
      toast.success(`✅ Customer "${newCustomer.name}" added successfully!`);
      return newCustomer;
    } catch (error: any) {
      toast.error(error?.message || "❌ Failed to add customer.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    customer,
    getCustomer,
    getCustomerByCode,
    searchCustomerByBarcode, // ✅ FIXED: Now correctly defined
    registerCustomer,
    loading,
    clearCustomer: () => setCustomer(null),
  };
}
