// web/components/settings/ProfileSettingsForm.tsx
"use client";

import React, { useState, useEffect, useTransition, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Locale, dictionary } from "@/i18n-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Use context
import { updateUserProfile, updateUserAvatar } from "@/actions/userActions"; // Import actions
import { createClient } from '@/lib/supabase/client'; // For avatar upload
import { useToast } from "@/hooks/use-toast"; // Use toast for feedback

interface ProfileSettingsFormProps {
  locale: Locale;
}

export default function ProfileSettingsForm({ locale }: ProfileSettingsFormProps) {
  const t = dictionary[locale];
  const { authUser, profile } = useAuth(); // Get logged-in user data
  const { toast } = useToast();
  const router = useRouter(); // if needed for navigation

  // Form State
  const [formData, setFormData] = useState({
    fullName: "", // Initialize empty, populate from profile
    username: "",
    bio: "",
    // Add location/website if they are simple fields
    // location: "",
    // website: "",
  });
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [isPending, startTransition] = useTransition(); // Form submission loading state
  const [error, setError] = useState<string | null>(null);

  // Avatar Upload State
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUrlPreview, setAvatarUrlPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient(); // Client for storage uploads

  // Effect to load profile data into the form once context is ready
  useEffect(() => {
    if (profile && !initialDataLoaded) {
      setFormData({
        fullName: profile.fullName || "",
        username: profile.username || "",
        bio: profile.bio || "",
        // location: profile.location || "", // Populate if field exists
        // website: profile.website || "", // Populate if field exists
      });
      setAvatarUrlPreview(profile.avatarUrl || null); // Set initial avatar preview
      setInitialDataLoaded(true); // Prevent resetting on subsequent renders
    }
  }, [profile, initialDataLoaded]); // Depend on profile and loaded flag

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isPending) return;

    startTransition(async () => {
      // Prepare data matching the Zod schema in the action
      const dataToSubmit = {
        fullName: formData.fullName,
        username: formData.username,
        bio: formData.bio,
        // location: formData.location,
        // website: formData.website,
      };

      const result = await updateUserProfile(dataToSubmit);

      if (result.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        // Optionally update context if needed, though revalidation might suffice
      } else {
        setError(result.error || "An unknown error occurred.");
        toast({
          title: "Error",
          description: result.error || "Failed to update profile.",
          variant: "destructive",
        });
      }
    });
  };

  // --- Avatar Upload Logic ---
  const handleAvatarClick = () => {
    fileInputRef.current?.click(); // Trigger hidden file input
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !authUser) return;

    setIsUploadingAvatar(true);
    setError(null); // Clear previous errors

    try {
      const fileExt = file.name.split('.').pop();
      // Use user ID and timestamp for unique file path
      const filePath = `${authUser.id}/avatar-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars') // Ensure 'avatars' bucket exists and has policies set
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Overwrite if file exists (optional, consider versions)
        });

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

       if (!urlData?.publicUrl) throw new Error("Could not get public URL");

       // Update preview immediately
       setAvatarUrlPreview(urlData.publicUrl);

      // Call server action to update Prisma
      const updateResult = await updateUserAvatar(urlData.publicUrl);

      if (!updateResult.success) {
        throw new Error(updateResult.error || "Failed to save avatar URL.");
      }

      toast({ description: "Avatar updated!" });

    } catch (err: any) {
      console.error("Avatar upload failed:", err);
      setError(err.message || 'Avatar upload failed');
      toast({
        title: "Error",
        description: err.message || 'Avatar upload failed.',
        variant: "destructive",
      });
       // Revert preview if needed (optional)
       setAvatarUrlPreview(profile?.avatarUrl || null);
    } finally {
      setIsUploadingAvatar(false);
       // Reset file input value to allow re-uploading the same file name
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  // --- End Avatar Upload Logic ---

  // Render loading state or login prompt if profile isn't loaded yet
  if (!initialDataLoaded && !profile) {
     // Check authUser as well for initial check
      if (!authUser) {
          return (
            <Card>
                <CardHeader><CardTitle>個人資料設定</CardTitle></CardHeader>
                <CardContent>
                    <p>請先 <Link href={`/${locale}/login`} className="underline">登入</Link> 以編輯個人資料。</p>
                </CardContent>
            </Card>
          );
      }
      return (
        <Card>
            <CardHeader><CardTitle>個人資料設定</CardTitle></CardHeader>
            <CardContent><p>Loading profile...</p></CardContent>
        </Card>
      );
  }
   // Should not happen if authUser exists, but as safeguard
  if (!profile) return <p>Error: Profile data missing.</p>;


  return (
    <Card>
      <CardHeader>
        <CardTitle>個人資料設定</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Display general errors */}
        {error && (
          <p className="mb-4 text-center text-sm text-red-600 bg-red-100 p-2 rounded border border-red-300">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Avatar and Basic Info --- */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative flex-shrink-0">
              <Image
                // Use preview URL for immediate feedback during/after upload
                src={avatarUrlPreview || profile.avatarUrl || "/placeholder-user.jpg"}
                alt={profile.username || "User"}
                width={100}
                height={100}
                className="rounded-full object-cover bg-muted" // Added styles
                key={avatarUrlPreview} // Force re-render on preview change
              />
              <Button
                type="button" // Important: prevent form submission
                size="icon"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                aria-label="Change avatar"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp, image/gif" // Specify accepted types
                style={{ display: 'none' }}
                disabled={isUploadingAvatar}
              />
            </div>

            <div className="flex-1 space-y-4 w-full"> {/* Added w-full */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">名稱</Label> {/* Changed htmlFor to fullName */}
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isPending || isUploadingAvatar}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">使用者名稱</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={isPending || isUploadingAvatar}
                    // Consider adding pattern or specific validation hints
                  />
                   {/* TODO: Add username availability check feedback */}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">簡介</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  disabled={isPending || isUploadingAvatar}
                  maxLength={500} // Match schema validation
                />
              </div>
            </div>
          </div>

          {/* --- Location and Website --- */}
          {/* Uncomment and adjust if these fields are in your User model */}
          {/*
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">所在地</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} disabled={isPending || isUploadingAvatar} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">網站</Label>
              <Input id="website" name="website" type="url" value={formData.website} onChange={handleChange} disabled={isPending || isUploadingAvatar} />
            </div>
          </div>
          */}

          {/* --- Submit Button --- */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || isUploadingAvatar}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "儲存變更"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}