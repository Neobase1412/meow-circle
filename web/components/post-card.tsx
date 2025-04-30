// web/components/post-card.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { zhTW, enUS } from "date-fns/locale";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { type Locale, dictionary } from "@/i18n-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PostForCommunityFeed } from "@/lib/communityData"; // Import the correct type

interface PostCardProps {
  post: PostForCommunityFeed; // Use the Prisma-derived type
  locale: Locale;
  // TODO: Add props for initial like/save status for the current user
  // initialIsLiked?: boolean;
  // initialIsSaved?: boolean;
}

export default function PostCard({ post, locale /*, initialIsLiked = false, initialIsSaved = false */ }: PostCardProps) {
  const t = dictionary[locale];
  // Note: Like/Save state is currently local ONLY. Needs server actions.
  const [isLiked, setIsLiked] = useState(false); // Replace with prop/action later
  const [isSaved, setIsSaved] = useState(false); // Replace with prop/action later

  // Use author data directly from the post prop
  const author = post.author;

  // Use counts directly from the post prop
  const likeCount = post._count?.likes ?? 0; // Use fetched count as base
  const commentCount = post._count?.comments ?? 0; // Use fetched count

  // Format date based on locale
  const dateLocale = locale === "zh-TW" ? zhTW : enUS;
  const formattedDate = post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { // Ensure date is Date object
    addSuffix: true,
    locale: dateLocale,
  }) : '';

  // Handle media display (Ensure mediaUrls is treated as potentially null/undefined)
  const mediaUrls = post.mediaUrls || [];
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
              {/* TODO: Implement Like Action */}
              <Button
                variant="ghost"
                size="sm"
                className="text-primary/70 hover:text-primary hover:bg-destructive/10" // Like hover red
                onClick={() => setIsLiked(!isLiked)}
                aria-pressed={isLiked}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-red-500 text-red-500" : ""}`} /> {/* Use red for like */}
                <span>{likeCount + (isLiked && !(post._count?.likes??0 >= likeCount) ? 1 : 0)}</span> {/* Basic optimistic update display */}
              </Button>
               {/* TODO: Link/Open Comments */}
              <Button variant="ghost" size="sm" className="text-primary/70 hover:text-primary hover:bg-secondary/50">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{commentCount}</span>
              </Button>
               {/* TODO: Implement Share Action */}
              <Button variant="ghost" size="sm" className="text-primary/70 hover:text-primary hover:bg-secondary/50">
                <Share2 className="h-4 w-4 mr-1" />
                <span>{t["share"]}</span>
              </Button>
               {/* TODO: Implement Save/Bookmark Action */}
              <Button
                variant="ghost"
                size="sm"
                className="text-primary/70 hover:text-primary hover:bg-secondary/50"
                onClick={() => setIsSaved(!isSaved)}
                aria-pressed={isSaved}
              >
                <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? "fill-primary text-primary" : ""}`} />
                {/* <span>{isSaved ? "已收藏" : "收藏"}</span> */} {/* Icon only might be cleaner */}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}