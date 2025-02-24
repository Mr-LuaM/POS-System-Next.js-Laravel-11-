"use client";

import { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format, addDays } from "date-fns";
// ✅ Import & Register Chart.js Components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar, Pie } from "react-chartjs-2";

// ✅ Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/**
 * ✅ Analytics Page (Charts & Data)
 */
export default function AnalyticsPage() {
  const { analytics, loading, fetchAnalytics } = useAnalytics();

  // ✅ Default date range: First day of month to today (+1 day)
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const tomorrow = addDays(today, 1);

  const [filters, setFilters] = useState({
    start_date: firstDayOfMonth.toISOString().split("T")[0],
    end_date: tomorrow.toISOString().split("T")[0],
    store_id: "",
  });

  // ✅ Fetch initial analytics on load
  useEffect(() => {
    fetchAnalytics(filters);
  }, [filters]);

  // ✅ Transform sales trend data for the line chart
  const salesTrendData = {
    labels: analytics?.sales_trend?.map((entry) => entry.sales_date) || [],
    datasets: [
      {
        label: "Revenue",
        data: analytics?.sales_trend?.map((entry) => parseFloat(entry.revenue)) || [],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
      },
    ],
  };

  // ✅ Transform best-selling products for the bar chart
  const bestSellingProductsData = {
    labels: analytics?.best_selling_products?.map((product) => product.product_name) || [],
    datasets: [
      {
        label: "Units Sold",
        data: analytics?.best_selling_products?.map((product) => parseInt(product.total_sold)) || [],
        backgroundColor: ["#007C3D", "#FFC72C", "#004D1A"],
      },
    ],
  };

  // ✅ Transform payment methods for the pie chart
  const paymentMethodsGrouped = analytics?.payment_methods?.reduce((acc, item) => {
    acc[item.payment_method] = (acc[item.payment_method] || 0) + item.count;
    return acc;
  }, {});

  const paymentMethodsData = {
    labels: paymentMethodsGrouped ? Object.keys(paymentMethodsGrouped) : [],
    datasets: [
      {
        label: "Payments",
        data: paymentMethodsGrouped ? Object.values(paymentMethodsGrouped) : [],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Page Header */}
      <h1 className="text-2xl font-bold text-foreground">📊 Analytics</h1>

      {/* ✅ Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* 🔹 Start Date */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="w-[200px]">
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(filters.start_date), "PPP")}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={new Date(filters.start_date)}
              onSelect={(date) => {
                setFilters((prev) => ({
                  ...prev,
                  start_date: date ? date.toISOString().split("T")[0] : prev.start_date,
                }));
              }}
            />
          </PopoverContent>
        </Popover>

        {/* 🔹 End Date */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="w-[200px]">
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(filters.end_date), "PPP")}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={new Date(filters.end_date)}
              onSelect={(date) => {
                setFilters((prev) => ({
                  ...prev,
                  end_date: date ? date.toISOString().split("T")[0] : prev.end_date,
                }));
              }}
            />
          </PopoverContent>
        </Popover>

        {/* 🔹 Fetch Report */}
        <Button onClick={() => fetchAnalytics(filters)} disabled={loading}>
          🔄 {loading ? "Loading..." : "Generate Analytics"}
        </Button>
      </div>

      {/* ✅ Sales Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>Total Sales</CardHeader>
          <CardContent>{analytics?.total_sales ?? "—"}</CardContent>
        </Card>
        <Card>
          <CardHeader>Total Revenue</CardHeader>
          <CardContent>₱{analytics?.total_revenue ?? "0.00"}</CardContent>
        </Card>
        <Card>
          <CardHeader>Total Profit</CardHeader>
          <CardContent>₱{analytics?.total_profit ?? "0.00"}</CardContent>
        </Card>
        <Card>
          <CardHeader>Total Expenses</CardHeader>
          <CardContent className="text-red-600">₱{analytics?.total_expenses ?? "0.00"}</CardContent>
        </Card>
        <Card>
          <CardHeader>Net Income</CardHeader>
          <CardContent className="text-green-600">₱{analytics?.net_income ?? "0.00"}</CardContent>
        </Card>
      </div>

      {/* ✅ Sales Trend Chart */}
      <Card>
        <CardHeader>Sales Trend</CardHeader>
        <CardContent>
          <Line data={salesTrendData} options={{ responsive: true, maintainAspectRatio: false }} />
        </CardContent>
      </Card>

      {/* ✅ Best-Selling Products Chart */}
      <Card>
        <CardHeader>Best-Selling Products</CardHeader>
        <CardContent>
          <Bar data={bestSellingProductsData} options={{ responsive: true, maintainAspectRatio: false }} />
        </CardContent>
      </Card>

      {/* ✅ Payment Methods Pie Chart */}
      <Card>
        <CardHeader>Payment Methods</CardHeader>
        <CardContent>
          <Pie data={paymentMethodsData} options={{ responsive: true, maintainAspectRatio: false }} />
        </CardContent>
      </Card>
    </div>
  );
}
