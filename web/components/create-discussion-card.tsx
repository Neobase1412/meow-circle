// web/components/discussion/CreateDiscussionCard.tsx
"use client";

import React, { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { Loader2, Send, HelpCircle, MessageSquare // Example icons
} from "lucide-react";
import { type Locale, dictionary } from "@/i18n-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tag } from "lucide-react";
import { Input } from "@/components/ui/input"; // Use Input for title
import { Label } from "@/components/ui/label"; // Use Label
import { useAuth } from "@/context/AuthContext";
import { createDiscussionAction } from "@/actions/discussionActions"; // Import the specific action
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface CreateDiscussionCardProps {
  locale: Locale;
}

export default function CreateDiscussionCard({ locale }: CreateDiscussionCardProps) {
  const t = dictionary[locale] || dictionary['zh-TW'];
  const { authUser, profile } = useAuth();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ref for optional focus

  // Handle changes for both title and content
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'title') {
        setTitle(value);
    } else if (name === 'content') {
        setContent(value);
    }
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Require title, check login, check pending state
    if (!title.trim() || isPending || !authUser) {
        if (!title.trim()) setError("請輸入討論標題");
        return;
    }
    setError(null);

    startTransition(async () => {
      const result = await createDiscussionAction({
        title: title,
        content: content.trim() || undefined, // Send content only if not empty
      });

      if (result.success) {
        toast({ description: "討論已成功發起！" });
        // Reset state
        setTitle("");
        setContent("");
        // Optionally focus title input again?
      } else {
        setError(result.error || "發生未知錯誤");
        toast({
          title: "錯誤",
          description: result.error || "無法發起討論，請稍後再試。",
          variant: "destructive",
        });
      }
    });
  };

   // Don't render if not logged in
   if (!authUser || !profile) {
     return (
        <Card>
            <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                    <Link href={`/${locale}/login`} className="text-primary underline hover:text-primary/80">登入</Link> 以發起討論
                </p>
            </CardContent>
        </Card>
     );
   }

  return (
    <Card>
      <CardContent className="p-4">
        {error && (
          <p className="mb-3 text-center text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-start gap-3">
            {/* User Avatar */}
            <Image
              src={profile.avatarUrl || "/placeholder-user.jpg"}
              alt={profile.username || "User"}
              width={40}
              height={40}
              className="rounded-full flex-shrink-0 object-cover bg-muted mt-1.5" // Align with top of label/input
            />
            <div className="flex-1 space-y-3">
                {/* Title Input */}
                <div className="space-y-1.5">
                    <Label htmlFor="discussion-title" className="sr-only">標題</Label>
                     <Input
                        id="discussion-title"
                        name="title"
                        placeholder="輸入您的問題或討論標題..." // More specific placeholder
                        value={title}
                        onChange={handleChange}
                        className="font-medium text-base border-secondary focus-visible:ring-primary" // Slightly larger font for title
                        maxLength={150} // Match schema
                        disabled={isPending}
                        required // Title is mandatory
                     />
                </div>
                {/* Content Textarea (Optional) */}
                 <div className="space-y-1.5">
                     <Label htmlFor="discussion-content" className="sr-only">內容 (選填)</Label>
                    <Textarea
                      id="discussion-content"
                      name="content"
                      placeholder="補充更多細節...(選填)"
                      value={content}
                      onChange={handleChange}
                      className="resize-none border-secondary focus-visible:ring-primary min-h-[80px]"
                      rows={3} // Start with 3 rows
                      maxLength={10000} // Match schema
                      disabled={isPending}
                      ref={textareaRef}
                    />
                 </div>
            </div>
          </div>

          {/* Actions and Submit Button */}
          <div className="mt-3 flex justify-between items-center">
            <div className="flex gap-1">
              {/* Placeholder buttons for potential future features like tags/topic selection */}
              <Button type="button" variant="ghost" size="icon" className="text-primary/70" disabled={isPending} title="Add tags (coming soon)">
                 <Tag className="h-5 w-5" />
              </Button>
               <Button type="button" variant="ghost" size="icon" className="text-primary/70" disabled={isPending} title="Choose topic (coming soon)">
                 <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
            <Button type="submit" disabled={!title.trim() || isPending} size="sm">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <> <MessageSquare className="h-4 w-4 mr-1.5"/> 發起討論 </>}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}