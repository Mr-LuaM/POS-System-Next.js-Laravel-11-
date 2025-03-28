"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Barcode from "react-barcode";
import QRCode from "react-qr-code";

interface ProductDetailsModalProps {
  open: boolean;
  onClose: () => void;
  product: any; // Product details from API
}

export default function ProductDetailsModal({ open, onClose, product }: ProductDetailsModalProps) {
  if (!product) return null;

  // ✅ Fix: Ensure accurate archive status checks
  const isGloballyArchived = product.product_deleted_at && product.product_deleted_at !== "null";
  const isStoreArchived = product.deleted_at && product.deleted_at !== "null";

  // ✅ Fix: Ensure supplier & store objects exist
  const supplier = product.supplier ?? {}; // ✅ Fix supplier undefined issue
  const store = product.store ?? {}; // ✅ Fix store undefined issue

  // ✅ Debugging Logs (Check if supplier & store are properly passed)
  console.log("Product Details:", product);
  console.log("Supplier Details:", supplier);
  console.log("Store Details:", store);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[500px]">
          {/* ✅ Product Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{product.productName || "Unnamed Product"}</h2>
              <Badge
                variant={
                  isGloballyArchived ? "destructive" :
                  isStoreArchived ? "warning" :
                  "default"
                }
              >
                {isGloballyArchived ? "Globally Archived" : isStoreArchived ? "Store Archived" : "Active"}
              </Badge>
            </div>

            <Separator />

            {/* ✅ Product Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">SKU</p>
                <p>{product.productSKU || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Category</p>
                <p>{product.categoryName || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Price</p>
                <p className="font-semibold text-primary">
                  {product.price ? `₱${new Intl.NumberFormat().format(product.price)}` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Stock</p>
                <p>{product.stock ? `${product.stock} pcs` : "Out of Stock"}</p>
              </div>
            </div>

            <Separator />

            {/* ✅ Supplier Details */}
            {supplier && supplier.name && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Supplier</p>
                  <p>{supplier.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contact</p>
                  <p>{supplier.contact || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p>{supplier.email || "N/A"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Address</p>
                  <p>{supplier.address || "N/A"}</p>
                </div>
              </div>
            )}

            <Separator />

            {/* ✅ Store Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Store</p>
                <p>{store.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Store Location</p>
                <p>{store.location || "N/A"}</p>
              </div>
            </div>

            <Separator />

            {/* ✅ Barcode & QR Code */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.barcode && (
                <div className="flex flex-col items-center bg-white p-2 rounded-md">
                  <p className="text-muted-foreground">Barcode</p>
                  <Barcode value={product.barcode} height={50} width={1.5} displayValue={true} />
                  <p className="text-xs text-muted-foreground">{product.barcode}</p>
                </div>
              )}

              {product.qr_code && (
                <div className="flex flex-col items-center bg-white p-2 rounded-md">
                  <p className="text-muted-foreground">QR Code</p>
                  <QRCode value={product.qr_code} size={80} />
                  <p className="text-xs text-muted-foreground">{product.qr_code}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* ✅ Archive & Timestamps */}
<div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
  <div>
    <p>Created At</p>
    <p>{product.created_at ? new Date(product.created_at).toLocaleString() : "N/A"}</p>
  </div>
  <div>
    <p>Updated At</p>
    <p>{product.updated_at ? new Date(product.updated_at).toLocaleString() : "N/A"}</p>
  </div>
  
  {/* ✅ Store Archive Date */}
  {isStoreArchived && (
    <div className="col-span-2">
      <p>Store Archived At</p>
      <p>{product.deleted_at ? new Date(product.deleted_at).toLocaleString() : "N/A"}</p>
    </div>
  )}

  {/* ✅ Global Archive Date (Fix applied) */}
  {isGloballyArchived && (
    <div className="col-span-2">
      <p>Globally Archived At</p>
      <p>{product.product_deleted_at ? new Date(product.product_deleted_at).toLocaleString() : "N/A"}</p>
    </div>
  )}
</div>

          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
