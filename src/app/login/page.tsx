"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";

/**
 * ✅ Login Page - Uses `useAuth` Hook for Authentication
 */
export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // ✅ Use Auth Hook

  /**
   * ✅ Handle Input Change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  /**
   * ✅ Handle Login
   */
  const handleLogin = async () => {
    setLoading(true);
    await login(credentials.email, credentials.password);
    setLoading(false);
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
            {/* ✅ Email Input */}
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleChange}
              autoComplete="email"
            />

            {/* ✅ Password Input */}
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

            {/* ✅ Login Button */}
            <Button className="w-full bg-primary text-white" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
