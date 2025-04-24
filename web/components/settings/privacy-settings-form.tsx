"use client"

import type React from "react"

import { useState } from "react"
import { type Locale, dictionary } from "@/i18n-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface PrivacySettingsFormProps {
  locale: Locale
}

export default function PrivacySettingsForm({ locale }: PrivacySettingsFormProps) {
  const t = dictionary[locale]

  const [settings, setSettings] = useState({
    profileVisibility: "public",
    postVisibility: "public",
    allowTagging: true,
    showOnlineStatus: true,
    showActivityStatus: true,
    allowDirectMessages: "everyone",
  })

  const handleToggle = (name: string) => {
    setSettings((prev) => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  }

  const handleChange = (name: string, value: string) => {
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the data to the backend
    console.log("Settings saved:", settings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>隱私設定</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">個人資料隱私</h3>

            <div className="space-y-2">
              <Label>個人資料可見性</Label>
              <RadioGroup
                value={settings.profileVisibility}
                onValueChange={(value) => handleChange("profileVisibility", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="profile-public" />
                  <Label htmlFor="profile-public">公開 - 所有人都可以看到您的個人資料</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="followers" id="profile-followers" />
                  <Label htmlFor="profile-followers">僅限追蹤者 - 只有追蹤您的人可以看到您的個人資料</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="profile-private" />
                  <Label htmlFor="profile-private">私人 - 只有您批准的人可以看到您的個人資料</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>貼文可見性</Label>
              <RadioGroup
                value={settings.postVisibility}
                onValueChange={(value) => handleChange("postVisibility", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="post-public" />
                  <Label htmlFor="post-public">公開 - 所有人都可以看到您的貼文</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="followers" id="post-followers" />
                  <Label htmlFor="post-followers">僅限追蹤者 - 只有追蹤您的人可以看到您的貼文</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">互動設定</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="allowTagging" className="flex-1">
                允許他人標記我
              </Label>
              <Switch
                id="allowTagging"
                checked={settings.allowTagging}
                onCheckedChange={() => handleToggle("allowTagging")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showOnlineStatus" className="flex-1">
                顯示我的在線狀態
              </Label>
              <Switch
                id="showOnlineStatus"
                checked={settings.showOnlineStatus}
                onCheckedChange={() => handleToggle("showOnlineStatus")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showActivityStatus" className="flex-1">
                顯示我的活動狀態
              </Label>
              <Switch
                id="showActivityStatus"
                checked={settings.showActivityStatus}
                onCheckedChange={() => handleToggle("showActivityStatus")}
              />
            </div>

            <div className="space-y-2">
              <Label>誰可以傳送私訊給我</Label>
              <RadioGroup
                value={settings.allowDirectMessages}
                onValueChange={(value) => handleChange("allowDirectMessages", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="everyone" id="dm-everyone" />
                  <Label htmlFor="dm-everyone">所有人</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="followers" id="dm-followers" />
                  <Label htmlFor="dm-followers">僅限追蹤者</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nobody" id="dm-nobody" />
                  <Label htmlFor="dm-nobody">不允許任何人</Label>
                </div>
              </RadioGroup>
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
