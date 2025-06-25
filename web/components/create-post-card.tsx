// web/components/create-post-card.tsx
"use client";

import React, { useState, useTransition, useRef, useEffect } from "react";
import Image from "next/image";
// Added Tooltip components
import { ImageIcon, Smile, MapPin, Tag, Lock, Loader2, Globe, Users, ImagePlus, X } from "lucide-react";
import { type Locale, dictionary } from "@/i18n-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { createPostAction } from "@/actions/postActions";
import { useToast } from "@/hooks/use-toast";
import { Visibility } from '@prisma/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { uploadFilesToSupabase } from "@/lib/storageUtils";
// Import Tooltip components
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface CreatePostCardProps {
  locale: Locale;
}

export default function CreatePostCard({ locale }: CreatePostCardProps) {
  const t = dictionary[locale] || dictionary['zh-TW'];
  const { authUser, profile } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PUBLIC);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs on component unmount or when previews change
  useEffect(() => {
    // This function will run when the component unmounts
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]); // Rerun if imagePreviews array itself changes reference (though content change is more likely)


  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && selectedFiles.length === 0) || isPending || isUploading || !authUser) return;
    setError(null);
    setIsUploading(false); // Reset just in case

    let uploadedMediaUrls: string[] = [];

    // --- Step 1: Upload Files (if any) ---
    if (selectedFiles.length > 0) {
        setIsUploading(true);
        const uploadResult = await uploadFilesToSupabase(
            selectedFiles,
            'posts', // Bucket name
            'posts',       // Folder name within user dir
            authUser.id
        );
        setIsUploading(false);

        if (uploadResult.errors.length > 0) {
             const firstErrorMessage = uploadResult.errors[0];
             setError(`圖片上傳失敗: ${firstErrorMessage}`);
             toast({
                 title: "上傳錯誤",
                 description: `部分或全部圖片無法上傳。請再試一次。 (${firstErrorMessage})`,
                 variant: "destructive",
             });
             return; // Stop submission
        }
        uploadedMediaUrls = uploadResult.successfulUrls;
    }
    // --- End File Upload ---

    // --- Step 2: Create Post in DB (Use transition) ---
    startTransition(async () => {
      const result = await createPostAction({
        content: content,
        visibility: visibility,
        mediaUrls: uploadedMediaUrls,
      });

      if (result.success) {
        toast({ description: "貼文已成功發布！" });
        // Reset state
        setContent("");
        setSelectedFiles([]);
        // Revoke URLs *before* clearing previews state
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        setImagePreviews([]);
        setVisibility(Visibility.PUBLIC);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setError(result.error || "發生未知錯誤");
        toast({
          title: "錯誤",
          description: result.error || "無法發布貼文，請稍後再試。",
          variant: "destructive",
        });
      }
    });
  };

   // --- Image Upload Handlers ---
   const triggerFileInput = () => {
     if (isPending || isUploading) return;
     fileInputRef.current?.click();
   };

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       const files = event.target.files;
       if (files) {
           const newFiles = Array.from(files);
           const MAX_FILES = 5;
           const MAX_SIZE_MB = 5;

           // Filter valid files based on limits and type
           const filesToAdd: File[] = [];
           for (const file of newFiles) {
               // Check total count limit first
               if (selectedFiles.length + filesToAdd.length >= MAX_FILES) {
                   toast({ title: "錯誤", description: `超過上傳限制 (${MAX_FILES} 張圖片)。`, variant: "destructive" });
                   break; // Stop processing further files
               }
               // Check size limit
               if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                   toast({ title: "錯誤", description: `檔案 ${file.name} 過大 (上限 ${MAX_SIZE_MB}MB)。`, variant: "destructive" });
                   continue; // Skip this file
               }
               // Check type
                const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
                if (!allowedTypes.includes(file.type)) {
                    toast({ title: "錯誤", description: `不支援的檔案格式: ${file.name}`, variant: "destructive" });
                    continue; // Skip this file
                }
               filesToAdd.push(file);
           }

           if (filesToAdd.length > 0) {
               setSelectedFiles(prev => [...prev, ...filesToAdd]);
               const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
               setImagePreviews(prev => [...prev, ...newPreviews]);
           }
       }
       // Reset file input value to allow re-uploading the same file name
       if (fileInputRef.current) {
         fileInputRef.current.value = "";
       }
   };

   const removeImage = (indexToRemove: number) => {
        // Ensure index is valid
        if (indexToRemove < 0 || indexToRemove >= imagePreviews.length) return;
        // Revoke object URL before removing from state
        URL.revokeObjectURL(imagePreviews[indexToRemove]);
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
   }
   // --- End Image Upload Handlers ---

   // Don't render if not logged in
   if (!authUser || !profile) {
     // Optionally return a placeholder or login prompt
     return null;
   }

   // Helper for visibility icon/text definition
   const getVisibilityInfo = () => {
     switch (visibility) {
       case Visibility.FOLLOWERS: return { icon: Users, text: "追蹤者" };
       case Visibility.PRIVATE: return { icon: Lock, text: "僅自己" };
       case Visibility.PUBLIC:
       default: return { icon: Globe, text: "公開" };
     }
   }
   // Call the helper function to get the current info for rendering
   const VisibilityInfo = getVisibilityInfo(); // <<< Correct placement

   // Combined loading state for disabling UI elements
  const isLoading = isPending || isUploading;

  return (
    <TooltipProvider delayDuration={100}>
      <Card>
        <CardContent className="p-4">
        {error && (
           <p className="mb-2 text-center text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded">{error}</p>
        )}
          <form onSubmit={handleSubmit}>
             {/* Textarea and Avatar */}
             <div className="flex gap-3">
            <Image
              src={profile.avatarUrl || "/placeholder-user.jpg"}
              alt={profile.username || "User"}
              width={40} height={40}
              className="rounded-full flex-shrink-0 object-cover bg-muted"
            />
            <Textarea
              placeholder="分享你的想法..." value={content} onChange={handleContentChange}
              className="flex-1 resize-none border-secondary focus-visible:ring-primary min-h-[60px]"
              rows={content.split('\n').length > 2 ? undefined : 2}
              maxLength={10000} disabled={isLoading}
            />
          </div>

            {/* Image Previews */}
          {imagePreviews.length > 0 && (
             <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {imagePreviews.map((previewUrl, index) => (
                    <div key={previewUrl} className="relative aspect-square group">
                         <Image src={previewUrl} alt={`Preview ${index + 1}`} fill className="object-cover rounded-md bg-muted"/>
                        <Button type="button" variant="destructive" size="icon"
                            className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)} disabled={isLoading} aria-label="Remove image" >
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                ))}
            </div>
          )}

            {/* Action Buttons and Submit */}
            <div className="mt-3 flex justify-between items-center flex-wrap gap-y-2">
              <div className="flex gap-1 flex-wrap">
                {/* Image Upload Button (Functional) */}
                <Tooltip>
                   <TooltipTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" className="text-primary/70"
                         onClick={triggerFileInput} disabled={isLoading || selectedFiles.length >= 5} aria-label="Add image">
                         <ImagePlus className="h-5 w-5" />
                         <input type="file" ref={fileInputRef} onChange={handleFileChange}
                           accept="image/png, image/jpeg, image/webp, image/gif" style={{ display: 'none' }} multiple disabled={isLoading} />
                      </Button>
                   </TooltipTrigger>
                   <TooltipContent><p>新增圖片</p></TooltipContent>
                </Tooltip>

                {/* --- Placeholder Buttons with Tooltips --- */}
                <Tooltip>
                   <TooltipTrigger asChild>
                       {/* Add disabled state visually and functionally */}
                      <Button type="button" variant="ghost" size="icon" className="text-primary/70 opacity-50 cursor-not-allowed" disabled title="Add emoji (coming soon)">
                         <Smile className="h-5 w-5" />
                      </Button>
                   </TooltipTrigger>
                   <TooltipContent><p>新增表情 (開發中)</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                   <TooltipTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" className="text-primary/70 opacity-50 cursor-not-allowed" disabled title="Add location (coming soon)">
                         <MapPin className="h-5 w-5" />
                      </Button>
                   </TooltipTrigger>
                   <TooltipContent><p>新增地點 (開發中)</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                   <TooltipTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" className="text-primary/70 opacity-50 cursor-not-allowed" disabled title="Add tags (coming soon)">
                         <Tag className="h-5 w-5" />
                      </Button>
                   </TooltipTrigger>
                   <TooltipContent><p>新增標籤 (開發中)</p></TooltipContent>
                </Tooltip>
                 {/* --- End Placeholder Buttons --- */}

                {/* Visibility Selector (Functional) */}
                <Tooltip>
                   <TooltipTrigger asChild>
                      <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button type="button" variant="ghost" size="icon" className="text-primary/70" disabled={isLoading}>
                               <VisibilityInfo.icon className="h-5 w-5" />
                           </Button>
                         </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                           <DropdownMenuItem onClick={() => setVisibility(Visibility.PUBLIC)}><Globe className="mr-2 h-4 w-4" /> 公開</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setVisibility(Visibility.FOLLOWERS)}><Users className="mr-2 h-4 w-4" /> 追蹤者</DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setVisibility(Visibility.PRIVATE)}><Lock className="mr-2 h-4 w-4" /> 僅自己</DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                   </TooltipTrigger>
                   <TooltipContent><p>可見度: {VisibilityInfo.text}</p></TooltipContent>
                </Tooltip>

              </div>
              {/* Submit Button */}
              <Button type="submit" disabled={(!content.trim() && selectedFiles.length === 0) || isLoading} size="sm">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "發布"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}