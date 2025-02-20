"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Barcode from "react-barcode";
import { QrCode } from "lucide-react";

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[500px]">
          {/* ✅ Product Name & Status */}
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

            {/* ✅ Product Info (Grid for readability) */}
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
                <p className="text-muted-foreground">Supplier</p>
                <p>{product.supplierName || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Store</p>
                <p>{product.storeName || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Store Location</p>
                <p>{product.storeLocation || "N/A"}</p> {/* ✅ Added Store Location */}
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
              <div>
                <p className="text-muted-foreground">Low Stock Threshold</p>
                <p>{product.low_stock_threshold ? `${product.low_stock_threshold} pcs` : "N/A"}</p>
              </div>
            </div>

            <Separator />

            {/* ✅ Barcode & QR Code */}
            {(product.barcode || product.qr_code) && (
              <div className="grid grid-cols-2 gap-4 items-center justify-center text-sm">
                {product.barcode && (
                  <div className="flex flex-col items-center">
                    <p className="text-muted-foreground">Barcode</p>
                    <Barcode value={product.barcode} height={50} width={1.5} displayValue={false} />
                    <p className="text-xs text-muted-foreground">{product.barcode}</p>
                  </div>
                )}
                {product.qr_code && (
                  <div className="flex flex-col items-center">
                    <p className="text-muted-foreground">QR Code</p>
                    <QRCode value={product.qr_code} size={80} />
                    <p className="text-xs text-muted-foreground">{product.qr_code}</p>
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* ✅ Archive & Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                <p>Created At</p>
                <p>{product.created_at ? new Date(product.created_at).toLocaleString() : "N/A"}</p> {/* ✅ Better Date Format */}
              </div>
              <div>
                <p>Updated At</p>
                <p>{product.updated_at ? new Date(product.updated_at).toLocaleString() : "N/A"}</p> {/* ✅ Better Date Format */}
              </div>
              {isGloballyArchived || isStoreArchived ? (
                <div className="col-span-2">
                  <p>Archived At</p>
                  <p>{product.deleted_at ? new Date(product.deleted_at).toLocaleString() : "N/A"}</p> {/* ✅ Better Date Format */}
                </div>
              ) : null}
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
