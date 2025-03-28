"use client";
// Define types for the data objects
interface SalesTrendEntry {
  sales_date: string; // or Date if it's a Date object
  revenue: number;
}

interface BestSellingProduct {
  product_name: string;
  total_sold: number;
}

interface PaymentMethod {
  payment_method: string;
  count: number;
}




import { useDashboard } from "@/hooks/useDashboard";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import "@/lib/chartConfig"; // Ensure Chart.js is registered

export default function DashboardPage() {
  const { dashboard, loading } = useDashboard(); // Use the type in the hook

  if (loading) return <p className="text-center">Loading dashboard...</p>;

  return (
    <div className="w-full p-6 space-y-6">
      <h1 className="text-2xl font-bold">📊 Dashboard</h1>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>Total Sales</CardHeader>
          <CardContent>{dashboard?.total_sales ?? "—"}</CardContent>
        </Card>
        <Card>
          <CardHeader>Total Revenue</CardHeader>
          <CardContent>₱{dashboard?.total_revenue ?? "0.00"}</CardContent>
        </Card>
        <Card>
          <CardHeader>Total Profit</CardHeader>
          <CardContent>₱{dashboard?.total_profit ?? "0.00"}</CardContent>
        </Card>
        <Card>
          <CardHeader>Total Expenses</CardHeader>
          <CardContent className="text-red-600">₱{dashboard?.total_expenses ?? "0.00"}</CardContent>
        </Card>
        <Card>
          <CardHeader>Net Income</CardHeader>
          <CardContent className="text-green-600">₱{dashboard?.net_income ?? "0.00"}</CardContent>
        </Card>
      </div>

      {/* ✅ Sales Trend Chart */}
      <Card>
        <CardHeader>📈 Sales Trend</CardHeader>
        <CardContent>
          <Line
            data={{
              labels: dashboard?.sales_trend?.map((entry: SalesTrendEntry) => entry.sales_date) || [],
              datasets: [
                {
                  label: "Revenue",
                  data: dashboard?.sales_trend?.map((entry: SalesTrendEntry) => entry.revenue) || [],
                  borderColor: "#007C3D",
                  backgroundColor: "rgba(0, 124, 61, 0.3)",
                  fill: true,
                },
              ],
            }}
          />
        </CardContent>
      </Card>

      {/* ✅ Best-Selling Products Chart */}
      <Card>
        <CardHeader>🏆 Best-Selling Products</CardHeader>
        <CardContent>
          <Bar
            data={{
              labels: dashboard?.best_selling_products?.map((p: BestSellingProduct) => p.product_name) || [],
              datasets: [
                {
                  label: "Total Sold",
                  data: dashboard?.best_selling_products?.map((p: BestSellingProduct) => p.total_sold) || [],
                  backgroundColor: "#FFC72C",
                },
              ],
            }}
          />
        </CardContent>
      </Card>

      {/* ✅ Payment Methods Pie Chart */}
      <Card>
        <CardHeader>💳 Payment Methods</CardHeader>
        <CardContent>
          <Pie
            data={{
              labels: dashboard?.payment_methods?.map((m: PaymentMethod) => m.payment_method) || [],
              datasets: [
                {
                  data: dashboard?.payment_methods?.map((m: PaymentMethod) => m.count) || [],
                  backgroundColor: ["#007C3D", "#FFC72C", "#FF5733"],
                },
              ],
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
