"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login } from "@/services/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await login(email, password);
      const { token, user } = response.data;

      // ✅ Store session data
      sessionStorage.clear();
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("role", user.role);
      sessionStorage.setItem("userId", user.id);
      sessionStorage.setItem("userName", user.name);
      sessionStorage.setItem("userEmail", user.email);

      toast.success("✅ Login successful!", {
        description: "Redirecting to dashboard...",
        duration: 3000,
      });

      // ✅ Redirect based on role
      setTimeout(() => {
        if (user.role === "admin") router.push("/admin");
        else if (user.role === "cashier") router.push("/cashier");
        else if (user.role === "manager") router.push("/manager");
        else router.push("/");
      }, 1500);
    } catch (error) {
      let message = "Invalid credentials. Please try again.";
      
      if (error.response?.status === 403) message = "Please verify your email before logging in.";
      else if (error.response?.status === 500) message = "Server error. Please try again later.";
      else message = "Network error. Check your connection.";

      toast.error("❌ Login failed!", { description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-96 shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <Image src="/images/default_logo.png" alt="POS Logo" width={80} height={80} priority />
          <CardTitle className="text-xl text-center mt-2">Login to POS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button className="w-full bg-primary text-white" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
