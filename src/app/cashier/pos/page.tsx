"use client";

import { useEffect, useState, useRef } from "react";
import { getUserName, getStoreName } from "@/lib/auth"; // ✅ Fetch cashier/store info
import { useCustomers } from "@/hooks/useCustomers"; // ✅ Fetch customer info
import { useInventory } from "@/hooks/useInventory"; // ✅ Inventory Hook
import POSHeader from "@/components/pos/header";
import Cart from "@/components/pos/cart";
import PaymentActions from "@/components/pos/payment-actions";
import ReceiptModal from "@/components/pos/receipt-modal";
import POSSearchBar from "@/components/pos/search-bar";
import { toast } from "sonner";
import PaymentModal from "@/components/pos/payment-modal"; // ✅ New modal for cash payments

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
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "credit" | "digital">("cash");
  const [cashReceived, setCashReceived] = useState<number | null>(null);
  const [cashChange, setCashChange] = useState<number>(0);
  const [cashierName, setCashierName] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string>("Guest");
  const [customerLoyaltyPoints, setCustomerLoyaltyPoints] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Load Cashier & Store Data
  useEffect(() => {
    getUserName().then(setCashierName);
    getStoreName().then(setStoreName);
  }, []);

  // ✅ Hooks for Inventory and Customers
  const { searchProduct } = useInventory();
  const { customer, searchCustomerByBarcode } = useCustomers();

  /**
   * ✅ Update Customer Info When a Customer is Selected
   */
  useEffect(() => {
    setCustomerName(customer?.name ?? "Guest");
    setCustomerLoyaltyPoints(customer?.loyaltyPoints ?? null);
  }, [customer]);

  /**
   * ✅ Focus on Search Input on Load & After Every Scan
   */
  useEffect(() => {
    searchInputRef.current?.focus();
  }, [cart, customer]);

  /**
   * ✅ Handle Keyboard Shortcuts
   */
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return; // Prevent browser shortcuts

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

  /**
   * ✅ Handle Barcode & Product Search
   */
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    if (query.startsWith("c@")) {
      const barcode = query.slice(2);
      const foundCustomer = await searchCustomerByBarcode(barcode);

      if (foundCustomer) {
        setCustomerName(foundCustomer.name);
        setCustomerLoyaltyPoints(foundCustomer.loyaltyPoints ?? null);
        toast.success(`✅ Customer Loaded: ${foundCustomer.name}`);
      } else {
        toast.error("❌ Customer not found.");
      }
      return;
    }

    let quantity = 1;
    let barcode = query;
    const match = query.match(/^(\d+)@(.+)$/);
    if (match) {
      quantity = parseInt(match[1], 10);
      barcode = match[2];
    }

    const product = await searchProduct(barcode);
    if (product) {
      handleAddToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity,
      });
    } else {
      toast.error("❌ Product not found.");
    }
  };

  /**
   * ✅ Add or Update Item in the Cart
   */
  const handleAddToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === newItem.id);
      return existingItem
        ? prevCart.map((item) =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
          )
        : [...prevCart, newItem];
    });
  };

  /**
   * ✅ Open Payment Modal for Cash Payment
   */
  const openPaymentModal = (method: "cash") => {
    setPaymentMethod(method);
    setIsPaymentModalOpen(true);
  };
  const handlePaymentCompletion = (payments: { method: string; amount: number; change: number }[]) => {
    if (cart.length === 0) {
      toast.error("❌ No items in cart.");
      return;
    }
  
    const { method, amount, change } = payments[0];
  
    const newTransaction: Transaction = {
      id: Date.now(),
      storeName: storeName ?? "POS Store",
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      change,
      customerId: customer?.id ?? Math.floor(Math.random() * 100000) + 1,
      customerName: customer?.name ?? "Guest",
      paymentMethod: method,
    };
  
    setTransaction(newTransaction);
    setIsReceiptModalOpen(true);
    setIsPaymentModalOpen(false);
    setCart([]); // ✅ Clear cart after successful payment
  
    toast.success(`✅ Payment Successful (${method.toUpperCase()})`);
  };
  
  /**
   * ✅ Process Payment & Push Transaction
   */
  const processTransaction = (method: "cash" | "credit" | "digital", cashAmount: number | null) => {
    if (cart.length === 0) {
      toast.error("❌ Cart is empty.");
      return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (method === "cash" && cashAmount !== null && cashAmount < totalAmount) {
      toast.error("❌ Insufficient cash received.");
      return;
    }

    const change = method === "cash" && cashAmount !== null ? cashAmount - totalAmount : 0;
    setCashChange(change);

    const newTransaction: Transaction = {
      id: Date.now(),
      storeName: storeName ?? "POS Store",
      total: totalAmount,
      change: change,
      customerId: customer?.id ?? Math.floor(Math.random() * 100000) + 1,
      customerName: customer?.name ?? "Guest",
      paymentMethod: method,
    };

    setTransaction(newTransaction);
    setIsReceiptModalOpen(true);
    setIsPaymentModalOpen(false);
    toast.success(`✅ Paid via ${method.toUpperCase()}. Change: ₱${change.toFixed(2)}`);

    setCart([]);
  };

  /**
   * ✅ Void Transaction (Clear Cart)
   */
  const voidTransaction = () => {
    setCart([]);
    toast.warning("🛑 Transaction Voided.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <POSHeader cashierName={cashierName} storeName={storeName} customerName={customerName} customerLoyaltyPoints={customerLoyaltyPoints} />
      <POSSearchBar ref={searchInputRef} onSearch={handleSearch} />
      <Cart cart={cart} updateQuantity={handleAddToCart} removeItem={(id) => setCart(cart.filter((item) => item.id !== id))} voidTransaction={voidTransaction} />
      <PaymentActions processTransaction={openPaymentModal} />
      <ReceiptModal isOpen={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)} transaction={transaction} />
      <PaymentModal
  isOpen={isPaymentModalOpen}
  onClose={() => setIsPaymentModalOpen(false)}
  totalAmount={cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
  onCompletePayment={handlePaymentCompletion} // ✅ Correctly passed function
/>
    </div>
  );
}
