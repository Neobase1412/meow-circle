"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { type Locale, dictionary } from "@/i18n-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { currentUser } from "@/data/users"
import { Camera } from "lucide-react"

interface ProfileSettingsFormProps {
  locale: Locale
}

export default function ProfileSettingsForm({ locale }: ProfileSettingsFormProps) {
  const t = dictionary[locale]

  const [formData, setFormData] = useState({
    name: currentUser.name,
    username: currentUser.username,
    bio: currentUser.bio || "",
    location: currentUser.location || "",
    website: currentUser.website || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the data to the backend
    console.log("Form submitted:", formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>個人資料設定</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative">
              <Image
                src={currentUser.avatarUrl || "/images/avatars/default.jpg"}
                alt={currentUser.name}
                width={100}
                height={100}
                className="rounded-full"
              />
              <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">名稱</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">使用者名稱</Label>
                  <Input id="username" name="username" value={formData.username} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">簡介</Label>
                <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">所在地</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">網站</Label>
              <Input id="website" name="website" value={formData.website} onChange={handleChange} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">儲存變更</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
