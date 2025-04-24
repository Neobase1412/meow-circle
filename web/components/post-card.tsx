"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { zhTW, enUS } from "date-fns/locale"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react"
import { type Locale, dictionary } from "@/i18n-config"
import type { Post } from "@/types/post"
import { users } from "@/data/users"
import { likes, comments } from "@/data/posts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface PostCardProps {
  post: Post
  locale: Locale
}

export default function PostCard({ post, locale }: PostCardProps) {
  const t = dictionary[locale]
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Find the author
  const author = users.find((user) => user.id === post.authorId)

  // Count likes and comments
  const likeCount = likes.filter((like) => like.postId === post.id).length
  const commentCount = comments.filter((comment) => comment.postId === post.id).length

  // Format date based on locale
  const dateLocale = locale === "zh-TW" ? zhTW : enUS
  const formattedDate = formatDistanceToNow(post.createdAt, {
    addSuffix: true,
    locale: dateLocale,
  })

  // Handle media display
  const renderMedia = () => {
    if (post.mediaUrls.length === 0) {
      return null
    } else if (post.mediaUrls.length === 1) {
      return (
        <div className="mt-3 rounded-lg overflow-hidden">
          <Image
            src={post.mediaUrls[0] || "/placeholder.svg"}
            alt="Post media"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
      )
    } else {
      return (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {post.mediaUrls.slice(0, 4).map((url, index) => (
            <div key={index} className="rounded-lg overflow-hidden">
              <Image
                src={url || "/placeholder.svg"}
                alt={`Post media ${index + 1}`}
                width={300}
                height={300}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Link href={`/${locale}/profile/${author?.id}`}>
            <Image
              src={author?.avatarUrl || "/images/avatars/default.jpg"}
              alt={author?.username || "User"}
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <Link href={`/${locale}/profile/${author?.id}`} className="font-semibold hover:underline">
                  {author?.fullName || author?.username}
                </Link>
                <p className="text-sm text-primary/70">
                  @{author?.username} · {formattedDate}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-2">
              <p className="text-primary/90">{post.content}</p>
              {post.mood && <p className="text-sm text-primary/70 mt-1">心情：{post.mood}</p>}
              {post.location && <p className="text-sm text-primary/70 mt-1">位置：{post.location}</p>}
              {renderMedia()}
            </div>
            <div className="mt-4 flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary/70 hover:text-primary hover:bg-secondary/50"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-primary text-primary" : ""}`} />
                <span>{likeCount + (isLiked ? 1 : 0)}</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-primary/70 hover:text-primary hover:bg-secondary/50">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{commentCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-primary/70 hover:text-primary hover:bg-secondary/50">
                <Share2 className="h-4 w-4 mr-1" />
                <span>{t["share"]}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary/70 hover:text-primary hover:bg-secondary/50"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? "fill-primary text-primary" : ""}`} />
                <span>{isSaved ? "已收藏" : "收藏"}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
