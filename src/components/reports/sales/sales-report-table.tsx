"use client";

import { useState, useEffect } from "react";
import { useSalesReport } from "@/hooks/useSalesReport";
import { DataTable } from "@/components/common/data-table";
import { getSalesReportColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format, addDays } from "date-fns";

/**
 * ✅ Sales Report Page (Automatically fetches initial data)
 */
export default function SalesReportPage() {
  const { report, loading, fetchSalesReport } = useSalesReport();

  // ✅ Default to first day of the month -> current date (+1 day)
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const tomorrow = addDays(today, 1); // ✅ Add 1 day to the end date

  const [filters, setFilters] = useState({
    start_date: firstDayOfMonth.toISOString().split("T")[0], // YYYY-MM-DD format
    end_date: tomorrow.toISOString().split("T")[0], // ✅ Now includes full current day
    store_id: "",
  });

  // ✅ Automatically fetch initial sales report when the page loads
  useEffect(() => {
    fetchSalesReport(filters);
  }, []); // Runs once on component mount

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Page Header */}
      <h1 className="text-2xl font-bold text-foreground">📊 Sales Report</h1>

      {/* ✅ Filters Section with Date Pickers */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* 🔹 Start Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="w-[200px]">
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.start_date ? format(new Date(filters.start_date), "PPP") : "Start Date"}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.start_date ? new Date(filters.start_date) : undefined}
              onSelect={(date) => {
                if (date) {
                  const fixedDate = addDays(date, 1); // ✅ Fixes 1-day-back issue
                  setFilters((prev) => ({ ...prev, start_date: fixedDate.toISOString().split("T")[0] }));
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* 🔹 End Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="w-[200px]">
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.end_date ? format(new Date(filters.end_date), "PPP") : "End Date"}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.end_date ? new Date(filters.end_date) : undefined}
              onSelect={(date) => {
                if (date) {
                  const fixedDate = addDays(date, 1); // ✅ Fixes 1-day-back issue
                  setFilters((prev) => ({ ...prev, end_date: fixedDate.toISOString().split("T")[0] }));
                }
              }}
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
              ₱{report?.total_revenue?.toFixed(2) ?? "0.00"}
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
