// web/components/settings/AccountSettingsForm.tsx
"use client";

import React, { useState, useTransition, useEffect } from "react";
import { type Locale, dictionary } from "@/i18n-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator"; // Import Separator
import { useAuth } from "@/context/AuthContext"; // Use context
import { updateUserEmailAction, updateUserPasswordAction } from "@/actions/authActions"; // Import actions
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AccountSettingsFormProps {
  locale: Locale;
}

export default function AccountSettingsForm({ locale }: AccountSettingsFormProps) {
  const t = dictionary[locale] || dictionary['zh-TW'];
  const { authUser } = useAuth(); // Get user data from context
  const { toast } = useToast();

  // State for forms
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Separate loading/error states for each action
  const [isEmailPending, startEmailTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Load current email when component mounts or authUser changes
  useEffect(() => {
    if (authUser?.email) {
      setEmail(authUser.email);
    }
  }, [authUser]);


  // --- Handle Email Update ---
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    if (isEmailPending || !email.trim()) return;
    if (email === authUser?.email) {
        setEmailError("新電子郵件與目前的相同");
        return;
    }

    startEmailTransition(async () => {
      const result = await updateUserEmailAction({ newEmail: email });
      if (result.success) {
        toast({
          title: "請求已送出",
          description: result.message || "請檢查您的信箱以完成電子郵件變更。",
        });
        // Note: Email field won't update here until user confirms via email link
        // and potentially logs back in or session refreshes.
      } else {
        setEmailError(result.error || "發生未知錯誤");
        toast({ title: "錯誤", description: result.error || "無法更新電子郵件", variant: "destructive" });
      }
    });
  };

  // --- Handle Password Update ---
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 6) { // Basic client-side length check
       setPasswordError("新密碼至少需要 6 個字元");
       return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("新密碼與確認密碼不符");
      return;
    }
    if (isPasswordPending) return;


    startPasswordTransition(async () => {
      const result = await updateUserPasswordAction({ newPassword: newPassword });
      if (result.success) {
        toast({ description: "密碼已成功更新！" });
        // Clear password fields after successful update
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(result.error || "發生未知錯誤");
        toast({ title: "錯誤", description: result.error || "無法更新密碼", variant: "destructive" });
      }
    });
  };

  // Render loading or login prompt if authUser isn't available yet
   if (!authUser) {
     return (
        <Card>
            <CardHeader><CardTitle>帳號設定</CardTitle></CardHeader>
            <CardContent><p>正在載入帳號資訊...</p></CardContent>
        </Card>
      );
   }


  return (
    <Card>
      <CardHeader>
        <CardTitle>帳號設定</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8"> {/* Increased spacing */}

        {/* --- Email Form --- */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
           <h3 className="text-lg font-medium border-b pb-2">電子郵件地址</h3>
           {emailError && <p className="text-sm text-destructive">{emailError}</p>}
          <div className="space-y-2">
            <Label htmlFor="email">電子郵件</Label>
            <div className="flex gap-2">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
                    disabled={isEmailPending}
                    required
                    className="flex-1"
                />
                 <Button type="submit" disabled={isEmailPending || email === authUser.email}>
                    {isEmailPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "更新郵件"}
                 </Button>
            </div>
            <p className="text-xs text-muted-foreground">
                變更電子郵件可能需要透過新舊信箱進行確認。
            </p>
          </div>
        </form>

        <Separator /> {/* Add separator */}

        {/* --- Password Form --- */}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
           <h3 className="text-lg font-medium border-b pb-2">變更密碼</h3>
           {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}

           {/* Add Current Password Input if needed for custom verification */}
           {/* <div className="space-y-2">
             <Label htmlFor="currentPassword">目前密碼</Label>
             <Input id="currentPassword" name="currentPassword" type="password" ... />
           </div> */}

            <div className="space-y-2">
              <Label htmlFor="newPassword">新密碼</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setPasswordError(null); }}
                disabled={isPasswordPending}
                required
                minLength={6} // Match schema validation
                placeholder="至少 6 個字元"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">確認新密碼</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(null); }}
                disabled={isPasswordPending}
                required
                minLength={6}
              />
               {/* Optional: Show visual mismatch warning */}
                {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-destructive">密碼不符</p>
                )}
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={isPasswordPending || !newPassword || !confirmPassword || newPassword !== confirmPassword}>
                 {isPasswordPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "更新密碼"}
                </Button>
            </div>
        </form>

      </CardContent>
    </Card>
  );
}