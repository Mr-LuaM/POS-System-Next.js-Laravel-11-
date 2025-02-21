"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useInventory } from "@/hooks/useInventory";

export default function POSPage() {
  const { inventory, loading, setArchivedFilter, refreshInventory } = useInventory();
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setArchivedFilter(false); // ✅ Ensure only active products are fetched
    refreshInventory(); // ✅ Refresh inventory when POS loads
  }, [setArchivedFilter, refreshInventory]);

  const addToCart = (product: { id: number; name: string; price: number }) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(cart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col h-full">
      {/* ✅ Search Bar for Products */}
      <div className="mb-4">
        <Input
          placeholder="Scan barcode or enter product name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        {/* ✅ Store-Specific Inventory */}
        <Card className="flex-1">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-3">Inventory</h2>
            {loading ? <p>Loading inventory...</p> : (
              <div className="grid grid-cols-2 gap-4">
                {inventory
                  .filter((product) =>
                    product.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.product.barcode.includes(searchQuery)
                  )
                  .map((product) => (
                    <Button key={product.id} onClick={() => addToCart(product.product)}>
                      {product.product.name} (${product.product.price.toFixed(2)})
                    </Button>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ✅ Cart Section */}
        <Card className="w-1/3">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-3">Cart</h2>
            {cart.length === 0 ? <p>No items in cart.</p> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button onClick={() => removeFromCart(item.id)} variant="destructive" size="sm">X</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="mt-4 text-lg font-bold">Total: ${totalAmount.toFixed(2)}</div>

            {/* ✅ Checkout Dialog */}
            <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 w-full">Checkout</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Complete Payment</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <p>Total Amount: <span className="font-bold">${totalAmount.toFixed(2)}</span></p>

                  {/* ✅ Payment Method Selection */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">{paymentMethod}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => setPaymentMethod("Cash")}>Cash</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setPaymentMethod("Credit Card")}>Credit Card</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setPaymentMethod("E-Wallet")}>E-Wallet</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button className="w-full" onClick={() => setIsCheckoutOpen(false)}>
                    Confirm Payment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
