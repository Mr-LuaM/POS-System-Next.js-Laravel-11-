"use client";

import { useState } from "react";
import { useSalesReport } from "@/hooks/useSalesReport";
import { DataTable } from "@/components/common/data-table";
import { getSalesReportColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

/**
 * ✅ Sales Report Page
 */
export default function SalesReportPage() {
  const { report, loading, fetchSalesReport } = useSalesReport();
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    store_id: "",
  });

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Page Header */}
      <h1 className="text-2xl font-bold text-foreground">📊 Sales Report</h1>

      {/* ✅ Filters Section with Date Pickers */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* 🔹 Start Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.start_date ? format(new Date(filters.start_date), "PPP") : "Start Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.start_date ? new Date(filters.start_date) : undefined}
              onSelect={(date) =>
                setFilters((prev) => ({ ...prev, start_date: date?.toISOString().split("T")[0] || "" }))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* 🔹 End Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.end_date ? format(new Date(filters.end_date), "PPP") : "End Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.end_date ? new Date(filters.end_date) : undefined}
              onSelect={(date) =>
                setFilters((prev) => ({ ...prev, end_date: date?.toISOString().split("T")[0] || "" }))
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* 🔹 Fetch Report Button */}
        <Button onClick={() => fetchSalesReport(filters)}>🔄 Generate Report</Button>
      </div>

      {/* ✅ Sales Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold">Total Sales</h3>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{report?.total_sales ?? "—"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-bold">Total Revenue</h3>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-green-600">
              ₱{report?.total_revenue?.toFixed(2) ?? "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ✅ DataTable with Best-Selling Products */}
      <div className="w-full">
        <h2 className="text-xl font-bold mt-4">Best-Selling Products</h2>
        <DataTable
          columns={getSalesReportColumns()}
          data={report?.best_selling_products ?? []}
          loading={loading}
        />
      </div>
    </div>
  );
}
