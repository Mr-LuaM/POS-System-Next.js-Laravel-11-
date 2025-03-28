"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios"; // ✅ API Calls to Backend
import { getUser, getStoreName } from "@/lib/auth"; // ✅ Fetch full user details & store name
import { useCustomers } from "@/hooks/useCustomers";
import { useInventory } from "@/hooks/useInventory";
import POSHeader from "@/components/pos/header";
import Cart from "@/components/pos/cart";
import PaymentActions from "@/components/pos/payment-actions";
import ReceiptModal from "@/components/pos/receipt-modal";
import POSSearchBar from "@/components/pos/search-bar";
import PaymentModal from "@/components/pos/payment-modal";
import { toast } from "sonner";
import { axiosInstance, handleApiError } from "@/lib/apiService";
// ✅ Define TypeScript Interfaces
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Transaction {
  id: number;
  storeName: string;
  total: number;
  change: number;
  customerId: number;
  customerName: string;
  paymentMethod: "cash" | "credit" | "digital";
  breakdown: CartItem[];
}

export default function POSPage() {
  // ✅ State for Cart, Transactions & Modals
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "credit" | "digital">("cash");

  // ✅ Cashier & Store Data
  const [cashierId, setCashierId] = useState<number | null>(null);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [cashierName, setCashierName] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);

  // ✅ Customer Data
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string>("Guest");
  const [customerLoyaltyPoints, setCustomerLoyaltyPoints] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // 🔥 **Fetch Cashier & Store Data from Backend**
  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getUser(); // ✅ Fetch user data

        if (!user || !user.id) {
          toast.error("❌ Failed to load user data. Please check your login session.");
          return;
        }

        setCashierId(user.id);
        setCashierName(user.name);
        setStoreId(user.store_id ?? null);

        // ✅ Fetch store name from backend
        setStoreName(user.store_id ? await getStoreName() : "Unassigned");

        if (!user.store_id) {
          toast.warning("⚠️ You are not assigned to a store. Transactions may be restricted.");
        }
      } catch (error) {
        console.error("Failed to fetch user/store:", error);
        toast.error("❌ Error fetching cashier/store details.");
      }
    }

    fetchUserData();
  }, []);

  // ✅ Hooks for Inventory and Customers
  const { searchProduct } = useInventory();
  const { customer, searchCustomerByBarcode } = useCustomers();

  // ✅ Update Customer Info
  useEffect(() => {
    setCustomerName(customer?.name ?? "Guest");
    setCustomerId(customer?.id ?? null);
    setCustomerLoyaltyPoints(customer?.loyaltyPoints ?? null);
  }, [customer]);

  // ✅ Focus on Search Input
  useEffect(() => {
    searchInputRef.current?.focus();
  }, [cart, customer]);

  // ✅ Handle Keyboard Shortcuts
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;

      switch (e.key) {
        case "F5":
          e.preventDefault();
          openPaymentModal("cash");
          break;
        case "F6":
          e.preventDefault();
          processTransaction("credit", null);
          break;
        case "F7":
          e.preventDefault();
          processTransaction("digital", null);
          break;
        case "F8":
          e.preventDefault();
          voidTransaction();
          break;
        case "Escape":
          searchInputRef.current?.focus();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [cart]);

  // ✅ Handle Product or Customer Search
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    if (query.startsWith("c@")) {
      // 🔍 Customer Search by Barcode
      const barcode = query.slice(2);
      const foundCustomer = await searchCustomerByBarcode(barcode);

      if (foundCustomer) {
        setCustomerName(foundCustomer.name);
        setCustomerLoyaltyPoints(foundCustomer.loyaltyPoints ?? null);
        toast.dismiss();
        toast.success(`✅ Customer Loaded: ${foundCustomer.name}`);
      } else {
        toast.error("❌ Customer not found.");
      }
      return;
    }

    // Detect "2@barcode" format
    let quantity = 1;
    let barcode = query;
    const match = query.match(/^(\d+)@(.+)$/);
    if (match) {
      quantity = parseInt(match[1], 10);
      barcode = match[2];
    }

    // 🔍 Product Search by SKU or Barcode
    const product = await searchProduct(barcode);
    console.log(product);
    if (product) {
      handleAddToCart({
        id: product.product.id,
        name: product.product.name,
        price: parseFloat(product.price),
        quantity,
      });
    } else {
      toast.error("❌ Product not found.");
    }
  };

  // ✅ Add or Update Item in the Cart
  const handleAddToCart = (newItem: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === newItem.id);
      return existingItem
        ? prevCart.map(item =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
          )
        : [...prevCart, newItem];
    });
  };

  // ✅ Open Payment Modal
  const openPaymentModal = (method: "cash" | "credit" | "digital") => {
    setPaymentMethod(method);
    setIsPaymentModalOpen(true);
  };

  // ✅ Process Transaction (Without `cash_drawer_id`)
  // ✅ Process Transaction (Fixing Missing Data)
// ✅ Process Transaction (Fixing Missing Data)
const processTransaction = async (payments: { method: string; amount: number; change: number }[]) => {
  if (!cashierId || !storeId) {
    toast.error("❌ Missing store or cashier data.");
    return;
  }

  if (cart.length === 0) {
    toast.error("❌ No items in cart.");
    return;
  }

  // ✅ Calculate subtotal (sum of all item prices)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ✅ Assume tax is 10% for now (you can replace this with actual tax logic)
  // const tax = subtotal * 0.10;

  // ✅ Assume discount is 0 for now (modify if needed)
  const discount = 0;

  // ✅ Calculate total
  const totalAmount = subtotal  - discount;

  // ✅ Ensure valid payment amount
  const cashReceived = payments.length > 0 ? payments[0].amount : 0;
  const change = payments.length > 0 ? payments[0].change : 0;

  if (cashReceived < totalAmount) {
    toast.error("❌ Insufficient payment.");
    return;
  }

  console.log("✅ Payments Received in processTransaction:", payments); // ✅ Debugging Log

  try {
    const response = await axiosInstance.post("/transaction/complete", {
      cashier_id: cashierId,
      store_id: storeId,
      customer_id: customerId,
      payment_methods: payments, // ✅ Now sending correct payments array
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    });

    if (response.data.success) {
      // ✅ Update Transaction State for Receipt
      setTransaction({
        id: response.data.sale_id,
        storeName: storeName ?? "POS Store",
        date: new Date().toLocaleString(),
        items: cart, // ✅ Send cart items to the receipt
        subtotal,
        // tax,
        discount,
        total: totalAmount,
        paid: cashReceived, // ✅ Show actual paid amount
        change, // ✅ Show correct change
        cashier: cashierName ?? "Unknown",
        transactionId: response.data.sale_id
      });

      setIsReceiptModalOpen(true);
      setCart([]);
      toast.success("✅ Transaction Completed!");
    } else {
      toast.error(`❌ Transaction failed: ${response.data.message}`);
    }
  } catch (error: any) {
    console.error("❌ Error processing payment:", error);
    toast.error("❌ Error processing payment.");
  } finally {
    setIsPaymentModalOpen(false);
  }
};


// ✅ Void Transaction (Clear Cart)
const voidTransaction = () => {
  setCart([]);
  toast.warning("🛑 Transaction Voided.");
};

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <POSHeader cashierName={cashierName} storeName={storeName} customerName={customerName} customerLoyaltyPoints={customerLoyaltyPoints} />
      <POSSearchBar ref={searchInputRef} onSearch={handleSearch} />
      <Cart cart={cart} updateQuantity={handleAddToCart} removeItem={id => setCart(cart.filter(item => item.id !== id))} voidTransaction={voidTransaction} />
      <PaymentActions processTransaction={openPaymentModal} />
      <ReceiptModal isOpen={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)} transaction={transaction} />
      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} totalAmount={cart.reduce((sum, item) => sum + item.price * item.quantity, 0)} onCompletePayment={processTransaction} />
    </div>
  );}
