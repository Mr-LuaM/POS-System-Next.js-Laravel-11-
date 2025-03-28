"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: number, amount: number) => void;
  removeItem: (id: number) => void;
  voidTransaction: () => void; // ✅ Changed from `clearCart`
}

export default function Cart({ cart, updateQuantity, removeItem, voidTransaction }: CartProps) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col bg-white rounded-md shadow-md h-full p-4">
      <h2 className="text-xl font-semibold mb-3">🛒 Cart</h2>

      <div className="flex-1 overflow-y-auto space-y-2">
        {cart.length === 0 ? (
          <p className="text-gray-700 text-center">No items in cart.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-2 border rounded-md">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">₱{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>
                  <Minus className="w-4 h-4" />
                </Button>
                <Input type="number" value={item.quantity} readOnly className="w-12 text-center" />
                <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => removeItem(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>₱{total.toFixed(2)}</span>
        </div>
        <div className="flex mt-4">
          <Button variant="destructive" className="w-full" onClick={voidTransaction} disabled={cart.length === 0}>
            Void Cart (F8)
          </Button>
        </div>
      </div>
    </div>
  );
}
