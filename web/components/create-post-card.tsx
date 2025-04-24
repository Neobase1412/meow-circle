"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ImageIcon, Smile, MapPin, Tag, Lock } from "lucide-react"
import { type Locale, dictionary } from "@/i18n-config"
import { currentUser } from "@/data/users"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface CreatePostCardProps {
  locale: Locale
}

export default function CreatePostCard({ locale }: CreatePostCardProps) {
  const t = dictionary[locale]
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the post to the server
    console.log("Post content:", content)
    setContent("")
    alert("功能開發中，敬請期待！")
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <Image
              src={currentUser.avatarUrl || "/images/avatars/default.jpg"}
              alt={currentUser.username}
              width={40}
              height={40}
              className="rounded-full"
            />
            <Textarea
              placeholder="分享你的想法..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 resize-none border-secondary focus-visible:ring-primary"
            />
          </div>
          <div className="mt-3 flex justify-between items-center">
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" className="text-primary/70">
                <ImageIcon className="h-4 w-4 mr-1" />
                <span>圖片</span>
              </Button>
              <Button type="button" variant="ghost" size="sm" className="text-primary/70">
                <Smile className="h-4 w-4 mr-1" />
                <span>心情</span>
              </Button>
              <Button type="button" variant="ghost" size="sm" className="text-primary/70">
                <MapPin className="h-4 w-4 mr-1" />
                <span>位置</span>
              </Button>
              <Button type="button" variant="ghost" size="sm" className="text-primary/70">
                <Tag className="h-4 w-4 mr-1" />
                <span>標籤</span>
              </Button>
              <Button type="button" variant="ghost" size="sm" className="text-primary/70">
                <Lock className="h-4 w-4 mr-1" />
                <span>公開</span>
              </Button>
            </div>
            <Button type="submit" disabled={!content.trim()}>
              發布
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
