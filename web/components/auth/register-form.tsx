"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Facebook } from "lucide-react";
import { type Locale, dictionary } from "@/i18n-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { createClient } from '@/lib/supabase/client'; // Import Supabase client
import { createProfileServerAction } from '@/actions/authActions'; // Import the server action

interface RegisterFormProps {
  locale: Locale;
}

export default function RegisterForm({ locale }: RegisterFormProps) {
  const t = dictionary[locale] || dictionary['zh-TW'];
  const router = useRouter();
  const supabase = createClient(); // Instantiate Supabase client
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Add error state
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Add success state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
      // Ensure checked is a boolean
      const isChecked = typeof checked === 'boolean' ? checked : false;
      setFormData((prev) => ({ ...prev, agreeTerms: isChecked }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setError(t["password-mismatch"] || "密碼不一致，請重新確認");
      return;
    }
    if (!formData.agreeTerms) {
        setError(t["must-agree-terms"] || "您必須同意服務條款");
        return;
    }

    setIsLoading(true);

    try {
      // Step 1: Sign up with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          // Pass username to be stored in auth.users.raw_user_meta_data
          // This is useful if email confirmation is ON, so we have the username later
          data: {
            username: formData.username,
          },
          // Set this if Email Confirmation is enabled in your Supabase project settings
          // emailRedirectTo: `${location.origin}/${locale}/auth/callback`,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
            setError(t["user-exists"] || "此電子郵件已被註冊");
        } else if (signUpError.message.includes("Password should be")) {
             setError(t["password-too-weak"] || "密碼強度不足");
        }
        else {
            setError(signUpError.message);
        }
        console.error("Supabase Sign Up Error:", signUpError);
        setIsLoading(false);
        return; // Stop execution if Supabase sign up failed
      }

      console.log("Supabase SignUp successful:", signUpData);

      // Check if email confirmation is required by Supabase settings
      // signUpData.user will exist but might not be "active" yet
      const needsEmailConfirmation = signUpData.user && !signUpData.user.email_confirmed_at && signUpData.session === null;

      if (needsEmailConfirmation) {
         // If email verification is required
         console.log("Email confirmation needed.");
         setSuccessMessage(t["check-email-verification"] || "註冊請求已提交！請檢查您的電子郵件以完成驗證。");
         setIsLoading(false);
         // Don't proceed to create profile yet, wait for user to confirm email
      }
      else if (signUpData.user) {
         // If user is created and either auto-confirmed or no confirmation needed
         console.log("User confirmed or no confirmation needed. Creating profile...");

         // Step 2: Call Server Action to create profile in Prisma
         const profileInput = {
            authUserId: signUpData.user.id,
            email: formData.email,
            // Use username from form data directly as it's confirmed now
            username: formData.username,
         };
         console.log("Calling createProfileServerAction with:", profileInput);
         const profileResult = await createProfileServerAction(profileInput);
         console.log("Server Action result:", profileResult);

         if (profileResult.success) {
           // Profile created successfully
           console.log("Prisma profile created/verified.");
           // Redirect to login page or dashboard after successful registration and profile creation
           // Redirecting to login is common as the session might not be fully active yet
           // depending on Supabase flow.
           router.push(`/${locale}/login?message=registration_success`); // Add query param for success message on login page
           // router.refresh(); // Refresh might be needed if redirecting to a page showing user state
         } else {
           // Failed to create profile in Prisma
           console.error("Failed to create Prisma profile:", profileResult.error);
           // This is tricky. The user exists in Supabase Auth but not Prisma.
           // Inform the user, maybe ask them to contact support or try logging in.
           setError(profileResult.error || t["profile-creation-error"] || "註冊成功，但建立用戶資料時發生錯誤。請稍後嘗試登入或聯繫客服。");
         }
         setIsLoading(false); // Stop loading after server action attempt
      } else {
          // Should not happen if signUpError is null, but as a fallback
           console.error("SignUp returned no error but no user data.");
           setError(t["unexpected-signup-error"] || "註冊過程中發生未知錯誤。");
           setIsLoading(false);
      }

    } catch (error) {
      console.error("An unexpected error occurred during registration:", error);
      setError(t["unexpected-error"] || "發生未知錯誤，請稍後再試");
      setIsLoading(false);
    }
    // No finally block needed for isLoading here, handled in specific paths
  };

  // TODO: Implement handleSocialRegister profile creation logic
  // Social registration often uses the same signInWithOAuth.
  // Profile creation for social might need an Auth Hook (DB Trigger/Webhook)
  // or checking on first login if a profile exists in Prisma and creating it then.
  const handleSocialRegister = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
     try {
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
            redirectTo: `${location.origin}/${locale}/auth/callback`,
            // You might pass data here if needed, but username usually comes from provider
            // data: { intent: 'register' } // Example, might not be necessary
            },
        });

        if (oauthError) {
            setError(oauthError.message);
            console.error(`${provider} registration failed:`, oauthError);
            setIsLoading(false);
        }
         // Success redirects away, profile creation needs handling elsewhere (e.g., callback or hook)
    } catch (err) {
        console.error("OAuth failed:", err);
        setError(t["social-login-error"] || `無法使用 ${provider} 註冊`);
        setIsLoading(false);
    }
  };


  return (
    <div className="space-y-6">
       {/* --- Social Register Buttons --- */}
      <div className="space-y-4">
         <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isLoading}
          onClick={() => handleSocialRegister("facebook")}
        >
          <Facebook className="mr-2 h-4 w-4" />
          使用 Facebook 註冊
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isLoading}
          onClick={() => handleSocialRegister("google")}
        >
          {/* Google SVG */}
           <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">...</svg>
          使用 Google 註冊
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

       {/* --- Display Error/Success Messages --- */}
       {error && (
        <p className="text-center text-sm text-red-600 bg-red-100 border border-red-400 rounded p-2">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="text-center text-sm text-green-600 bg-green-100 border border-green-400 rounded p-2">
          {successMessage}
        </p>
      )}

      {/* --- Email/Password Registration Form --- */}
      <form onSubmit={handleSubmit} className="space-y-4">
         {/* Username Input */}
         <div className="space-y-2">
          <Label htmlFor="username">{t["username"]}</Label>
          <Input
            id="username"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
            aria-invalid={!!error}
          />
        </div>
        {/* Email Input */}
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
             aria-invalid={!!error}
          />
        </div>
        {/* Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password">{t["password"]}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
             aria-invalid={!!error}
          />
        </div>
         {/* Confirm Password Input */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t["confirm-password"]}</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
             aria-invalid={!!error}
          />
        </div>
        {/* Terms Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="agreeTerms"
            checked={formData.agreeTerms}
            onCheckedChange={handleCheckboxChange} // Use the updated handler
            disabled={isLoading}
            required
            aria-describedby="terms-label"
          />
          <label
            id="terms-label"
            htmlFor="agreeTerms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t["agree-terms"]} {/* Add link to actual terms if needed */}
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || !formData.agreeTerms}>
          {isLoading ? "註冊中..." : t["sign-up"]}
        </Button>
      </form>
    </div>
  );
}