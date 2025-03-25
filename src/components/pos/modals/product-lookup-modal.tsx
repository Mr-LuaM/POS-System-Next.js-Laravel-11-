"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useInventory } from "@/hooks/useInventory";
import ProductDetailsModal from "../../inventory/details-modal";

/** ✅ Schema for Searching SKU/Barcode */
const searchSchema = z.object({
  query: z.string().min(3, "SKU or Barcode must be at least 3 characters."),
});

type SearchSchemaType = z.infer<typeof searchSchema>;

interface ProductLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductLookupModal({ isOpen, onClose }: ProductLookupModalProps) {
  const { searchProduct, searchResult } = useInventory();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  /** ✅ Initialize Form */
  const form = useForm<SearchSchemaType>({
    resolver: zodResolver(searchSchema),
    mode: "onChange",
    defaultValues: {
      query: "",
    },
  });

  /** ✅ Handle Search */
  const handleSearch = async (data: SearchSchemaType) => {
    const result = await searchProduct(data.query);

    if (result) {
      // ✅ Extract correct product details and pass them to modal
      const formattedProduct = {
        ...result, 
        productName: result.product?.name || "Unnamed Product",
        productSKU: result.product?.sku || "N/A",
        barcode: result.product?.barcode || "N/A",
        qr_code: result.product?.qr_code || "N/A",
        categoryName: result.product?.category?.name || "N/A",
        supplier: result.product?.supplier ?? {},
        store: result.store ?? {},
      };

      setSelectedProduct(formattedProduct);
      setDetailsOpen(true);
      toast.success("✅ Product found!");
    } else {
      toast.error("❌ Product not found.");
      setSelectedProduct(null);
      setDetailsOpen(false);
    }
  };

  /** ✅ Automatically open details modal when product is found */
  useEffect(() => {
    if (selectedProduct) {
      setDetailsOpen(true);
    }
  }, [selectedProduct]);

  /** ✅ Reset States when Modal is Closed */
  useEffect(() => {
    if (!isOpen) {
      setDetailsOpen(false);
      setSelectedProduct(null);
      form.reset();
    }
  }, [isOpen, form]);

  return (
    <>
      {/* ✅ Dialog now properly updates `isOpen` */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Product Lookup</DialogTitle>
          </DialogHeader>

          {/* ✅ Search Input */}
          <form onSubmit={form.handleSubmit(handleSearch)} className="space-y-4">
            <Input 
              type="text" 
              placeholder="Enter SKU or Scan Barcode" 
              {...form.register("query")}
            />
            <Button type="submit" className="w-full">
              Search Product
            </Button>
          </form>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ Pass the properly formatted product object to ProductDetailsModal */}
      {selectedProduct && (
        <ProductDetailsModal 
          open={detailsOpen} 
          onClose={() => setDetailsOpen(false)}
          product={selectedProduct} // ✅ Now correctly passing product object
        />
      )}
    </>
  );
}
