// web/components/post-card.tsx
"use client";

import React, { useState, useTransition, useEffect } from "react"; // Added useEffect
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { zhTW, enUS } from "date-fns/locale";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Loader2 } from "lucide-react"; // Added Loader2
import { type Locale, dictionary } from "@/i18n-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext"; // For checking login status client-side
import { toggleLikeAction, toggleSaveAction } from "@/actions/postActions"; // Import actions
import { useToast } from "@/hooks/use-toast";
// Import the updated type which includes like/save status
import type { PostForCommunityFeed } from "@/lib/communityData"; // Adjust import path if needed

interface PostCardProps {
  post: PostForCommunityFeed; // Use the updated type
  locale: Locale;
}

export default function PostCard({ post, locale }: PostCardProps) {
  const t = dictionary[locale] || dictionary['zh-TW'];
  const { authUser } = useAuth(); // Get viewer's auth status
  const { toast } = useToast();
  const [isLikePending, startLikeTransition] = useTransition();
  const [isSavePending, startSaveTransition] = useTransition();

  // Initialize state from props
  const [isLiked, setIsLiked] = useState(post.currentUserLiked);
  const [isSaved, setIsSaved] = useState(post.currentUserSaved);
  // Use fetched count as base, adjust optimistically
  const [likeCount, setLikeCount] = useState(post._count?.likes ?? 0);
  // Comment count doesn't change optimistically here
  const commentCount = post._count?.comments ?? 0;

  // Sync state if props change (e.g., after revalidation from another action)
  useEffect(() => {
      setIsLiked(post.currentUserLiked);
      setIsSaved(post.currentUserSaved);
      setLikeCount(post._count?.likes ?? 0);
  }, [post.currentUserLiked, post.currentUserSaved, post._count?.likes]);


  const author = post.author;
  const dateLocale = locale === "zh-TW" ? zhTW : enUS;
  const formattedDate = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: dateLocale }) : '';
  const mediaUrls = post.mediaUrls || [];

  const handleLikeToggle = () => {
    if (!authUser || isLikePending) return; // Check login and pending state

    startLikeTransition(async () => {
        // Optimistic UI update
        const previousLikedState = isLiked;
        const previousLikeCount = likeCount;
        setIsLiked(!previousLikedState);
        setLikeCount(prev => previousLikedState ? Math.max(0, prev - 1) : prev + 1);

        const result = await toggleLikeAction(post.id);

        if (!result.success) {
            // Revert optimistic update on failure
            setIsLiked(previousLikedState);
            setLikeCount(previousLikeCount);
            toast({ title: "錯誤", description: result.error || "無法按讚/取消讚", variant: "destructive" });
        }
         // No success toast needed usually, UI updates optimistically
         // Revalidation from server action will confirm state eventually
    });
  };

  const handleSaveToggle = () => {
      if (!authUser || isSavePending) return;

      startSaveTransition(async () => {
          const previousSavedState = isSaved;
          setIsSaved(!previousSavedState); // Optimistic update

           const result = await toggleSaveAction(post.id);

           if (!result.success) {
                // Revert optimistic update
                setIsSaved(previousSavedState);
                toast({ title: "錯誤", description: result.error || "無法收藏/取消收藏", variant: "destructive" });
           } else {
               // Optionally show toast for successful save/unsave
               toast({ description: result.newState ? "已收藏！" : "已取消收藏。" });
           }
      });
  };

  const handleShare = () => {
      // Basic copy link functionality
      const postUrl = `${window.location.origin}/${locale}/post/${post.id}`; // Assuming /post/[id] route exists
      navigator.clipboard.writeText(postUrl)
        .then(() => {
            toast({ description: "連結已複製！" });
        })
        .catch(err => {
            console.error("Failed to copy link:", err);
            toast({ title: "錯誤", description: "無法複製連結", variant: "destructive"});
        });
  };

  const renderMedia = () => {
    if (mediaUrls.length === 0) {
      return null;
    } else if (mediaUrls.length === 1) {
      return (
        <div className="mt-3 rounded-lg overflow-hidden aspect-video relative bg-muted"> {/* Added aspect ratio and bg */}
          <Image
            src={mediaUrls[0] || "/placeholder.svg"}
            alt="Post media"
            fill // Use fill for better responsiveness within aspect ratio
            className="object-cover" // Use object-cover
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add sizes prop
          />
        </div>
      );
    } else {
      // Grid for multiple images (display up to 4 for a clean look)
      const gridCols = mediaUrls.length >= 4 ? 'grid-cols-2' : `grid-cols-${mediaUrls.length}`;
      return (
        <div className={`mt-3 grid ${gridCols} gap-1`}> {/* Reduced gap */}
          {mediaUrls.slice(0, 4).map((url, index) => (
            <div key={index} className="rounded-md overflow-hidden aspect-square relative bg-muted"> {/* Use aspect-square */}
              <Image
                src={url || "/placeholder.svg"}
                alt={`Post media ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw" // Adjust sizes
              />
               {/* Optional: Overlay for more than 4 images */}
               {index === 3 && mediaUrls.length > 4 && (
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                   <span className="text-white text-xl font-bold">+{mediaUrls.length - 4}</span>
                 </div>
               )}
            </div>
          ))}
        </div>
      );
    }
  };

  // Prevent rendering if essential data is missing (author might be null if relation optional/error)
  if (!author) {
      console.warn("PostCard rendering without author data for post ID:", post.id);
      return null; // Or render a placeholder/error state
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Link to author profile using author ID */}
          <Link href={`/${locale}/profile/${author.id}`}>
            <Image
              src={author.avatarUrl || "/placeholder-user.jpg"} // Use placeholder
              alt={author.username || "User"}
              width={40}
              height={40}
              className="rounded-full object-cover bg-muted"
            />
          </Link>
          <div className="flex-1">
            <div className="flex justify-between items-center"> {/* Added items-center */}
              <div>
                <Link href={`/${locale}/profile/${author.id}`} className="font-semibold hover:underline">
                  {author.fullName || author.username}
                </Link>
                <p className="text-sm text-primary/70">
                   {/* Use @username and formatted date */}
                  @{author.username} · {formattedDate}
                </p>
              </div>
               {/* TODO: Implement More Options Dropdown */}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-2 whitespace-pre-wrap break-words"> {/* Allow wrapping */}
              <p className="text-primary/90">{post.content}</p>
              {post.mood && <p className="text-sm text-primary/70 mt-1">心情：{post.mood}</p>}
              {post.location && <p className="text-sm text-primary/70 mt-1">位置：{post.location}</p>}
              {renderMedia()}
            </div>
             {/* Action Buttons - Use real counts */}
            <div className="mt-4 flex justify-between items-center">
              {/* Like Button */}
              <Button
                variant="ghost" size="sm"
                className={`text-primary/70 hover:text-red-600 ${isLiked ? "text-red-500" : ""}`}
                onClick={handleLikeToggle}
                disabled={!authUser || isLikePending} // Disable if not logged in or pending
                aria-pressed={isLiked}
              >
                 {isLikePending ? <Loader2 className="h-4 w-4 mr-1 animate-spin"/> : <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-red-500" : ""}`} />}
                <span>{likeCount}</span>
              </Button>
              {/* Comment Button (placeholder action) */}
              <Button variant="ghost" size="sm" className="text-primary/70 hover:text-primary hover:bg-secondary/50" title="留言 (開發中)">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{commentCount}</span>
              </Button>
               {/* Share Button */}
              <Button variant="ghost" size="sm" className="text-primary/70 hover:text-primary hover:bg-secondary/50" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                <span>{t["share"]}</span>
              </Button>
               {/* Save/Bookmark Button */}
              <Button
                variant="ghost" size="sm"
                className={`text-primary/70 hover:text-primary hover:bg-secondary/50 ${isSaved ? "text-primary" : ""}`}
                onClick={handleSaveToggle}
                disabled={!authUser || isSavePending}
                aria-pressed={isSaved}
              >
                 {isSavePending ? <Loader2 className="h-4 w-4 mr-1 animate-spin"/> : <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? "fill-primary" : ""}`} />}
                {/* Optional Text: */}
                {/* <span className="hidden sm:inline">{isSaved ? "已收藏" : "收藏"}</span> */}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}