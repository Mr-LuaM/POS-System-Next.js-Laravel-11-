"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Barcode from "react-barcode";
import { useState, useRef } from "react";
import Image from "next/image";

interface PrintableCustomerCardProps {
  customer: {
    id: number;
    name: string;
    barcode?: string;
  };
  onClose: () => void;
}

export default function PrintableCustomerCard({ customer, onClose }: PrintableCustomerCardProps) {
  const [isFront, setIsFront] = useState(true);
  const printRef = useRef<HTMLDivElement | null>(null);

  // ✅ Print Function (Captures ShadCN/Tailwind Styles)
  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Card</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @media print {
                  @page { margin: 0; }
                  body { 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    height: 100vh; 
                    background: white;
                    margin: 0;
                  }
                  .print-card { 
                    width: 400px; 
                    height: 250px; 
                    border: 1px solid #ccc; 
                    box-shadow: 3px 3px 10px rgba(0,0,0,0.2); 
                    padding: 20px; 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center;
                    justify-content: center;
                    font-family: Inter, sans-serif !important;
                  }
                }
              </style>
            </head>
            <body>
              ${printRef.current.outerHTML}
              <script>
                window.onload = function() {
                  setTimeout(() => {
                    window.print();
                    window.close();
                  }, 500);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <>
      {/* ✅ Main Membership Card Modal (Retains ShadCN Styles) */}
      <Dialog open={!!customer} onOpenChange={onClose}>
        <DialogContent className="max-w-lg text-center p-8 bg-white shadow-lg rounded-lg">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Customer Membership Card
          </DialogTitle>

          {/* ✅ Toggle Front/Back */}
          <div className="flex justify-center my-4 space-x-2">
            <Button 
              variant={isFront ? "default" : "outline"} 
              className="px-5 py-2"
              onClick={() => setIsFront(true)}
            >
              Front
            </Button>
            <Button 
              variant={!isFront ? "default" : "outline"} 
              className="px-5 py-2"
              onClick={() => setIsFront(false)}
            >
              Back
            </Button>
          </div>

          {/* ✅ Printable Card Layout (Inside ref for printing) */}
          <div className="flex justify-center mt-4">
            <Card ref={printRef} className="w-[400px] h-[250px] border shadow-lg rounded-lg bg-white relative flex flex-col items-center p-4 print-card">
              
              {isFront ? (
                // ✅ Front Side
                <>
                  {/* ✅ Logo & Branding */}
                  <div className="absolute top-3 left-3">
                    <Image 
                      src="/images/default_logo.png" 
                      alt="POS Logo" 
                      width={40} 
                      height={40} 
                      priority 
                      onLoad={(e) => e.currentTarget.style.display = 'block'} 
                    />
                  </div>

                  {/* ✅ Customer Name */}
                  <CardHeader className="text-[16px] font-bold text-primary mt-5">
                    {customer.name.toUpperCase()}
                  </CardHeader>

                  <CardContent className="flex flex-col items-center justify-center w-full text-center">
                    {/* ✅ Barcode */}
                    {customer.barcode && (
                      <div className="w-full flex flex-col items-center mt-2">
                        <Barcode value={customer.barcode} height={50} width={1.6} displayValue={false} />
                        <p className="text-sm font-semibold text-gray-700 mt-2">{customer.barcode}</p>
                      </div>
                    )}

                    {/* ✅ Membership ID */}
                    <div className="text-[12px] font-semibold text-gray-800 mt-3">
                      Membership ID: {customer.id}
                    </div>
                  </CardContent>
                </>
              ) : (
                // ✅ Back Side
                <>
                  <CardHeader className="text-[16px] font-bold text-primary mt-2">
                    Membership Terms & Contact
                  </CardHeader>

                  <CardContent className="flex flex-col items-center justify-center w-full text-center text-gray-800 text-xs mt-2">
                    <p className="font-semibold">Customer Support:</p>
                    <p>+1-800-123-4567</p>
                    <p>support@yourcompany.com</p>

                    <p className="mt-2 font-semibold">Store Address:</p>
                    <p>123 Business Street, City, Country</p>

                    <p className="mt-2 italic text-gray-600 text-[11px]">
                      "This card is non-transferable and remains the property of Your Company. Misuse may result in revocation."
                    </p>
                  </CardContent>
                </>
              )}
            </Card>
          </div>

          {/* ✅ Buttons */}
          <div className="mt-6 flex flex-col gap-2">
            <Button 
              variant="default" 
              className="w-full bg-black text-white hover:bg-gray-800"
              onClick={handlePrint}
            >
              Print Card
            </Button>
            <Button variant="outline" className="w-full" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
