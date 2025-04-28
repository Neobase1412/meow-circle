"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Facebook } from "lucide-react";
import { type Locale, dictionary } from "@/i18n-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Checkbox for "Remember Me" is removed as Supabase handles session persistence automatically
import { Separator } from "@/components/ui/separator";
import { createClient } from '@/lib/supabase/client'; // Import Supabase client

interface LoginFormProps {
  locale: Locale;
}

export default function LoginForm({ locale }: LoginFormProps) {
  const t = dictionary[locale];
  const router = useRouter();
  const supabase = createClient(); // Instantiate Supabase client
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    // rememberMe: false, // Removed, Supabase handles session cookies
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handleCheckboxChange removed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        // Provide more user-friendly errors if possible
        if (signInError.message === 'Invalid login credentials') {
          setError(t["invalid-credentials"] || "帳號或密碼錯誤");
        } else {
          setError(signInError.message);
        }
        console.error("Login failed:", signInError);
      } else {
        // Login successful
        router.push(`/${locale}`); // Redirect to home or dashboard
        router.refresh(); // IMPORTANT: Refresh server components to reflect login state
      }
    } catch (error) {
      console.error("An unexpected error occurred during login:", error);
      setError(t["unexpected-error"] || "發生未知錯誤，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          // Redirect back to the app after successful social login
          // Supabase will handle the callback and session creation
          redirectTo: `${location.origin}/${locale}/auth/callback`, // Use location.origin for dynamic base URL
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        console.error(`${provider} login failed:`, oauthError);
        setIsLoading(false); // Stop loading if OAuth initiation fails
      }
      // No finally block needed for isLoading here, as successful OAuth redirects away.
      // Error case handles setIsLoading(false)
    } catch(err) {
       console.error("OAuth failed:", err);
       setError(t["social-login-error"] || `無法使用 ${provider} 登入`);
       setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* --- Social Login Buttons --- */}
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isLoading}
          onClick={() => handleSocialLogin("facebook")}
        >
          <Facebook className="mr-2 h-4 w-4" />
          使用 Facebook 登入
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isLoading}
          onClick={() => handleSocialLogin("google")}
        >
          {/* Google SVG */}
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">...</svg>
          使用 Google 登入
        </Button>
      </div>

      {/* --- Separator --- */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-primary/70">或使用電子郵件</span>
        </div>
      </div>

       {/* --- Display Error Message --- */}
       {error && (
        <p className="text-center text-sm text-red-600 bg-red-100 border border-red-400 rounded p-2">
          {error}
        </p>
      )}

      {/* --- Email/Password Form --- */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t["email"]}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            aria-invalid={!!error} // Indicate error state for accessibility
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t["password"]}</Label>
            <Link href={`/${locale}/forgot-password`} className="text-sm text-primary hover:underline">
              {t["forgot-password"]}
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            aria-invalid={!!error}
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>
        {/* Remember Me Checkbox Removed */}
        {error && <span id="login-error" className="sr-only">{error}</span>} {/* For screen readers */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "登入中..." : t["sign-in"]}
        </Button>
      </form>
    </div>
  );
}