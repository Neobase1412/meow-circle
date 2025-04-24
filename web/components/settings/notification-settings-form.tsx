"use client"

import type React from "react"

import { useState } from "react"
import { type Locale, dictionary } from "@/i18n-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface NotificationSettingsFormProps {
  locale: Locale
}

export default function NotificationSettingsForm({ locale }: NotificationSettingsFormProps) {
  const t = dictionary[locale]

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    likes: true,
    comments: true,
    follows: true,
    mentions: true,
    directMessages: true,
    newFeatures: false,
    marketing: false,
  })

  const handleToggle = (name: string) => {
    setSettings((prev) => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the data to the backend
    console.log("Settings saved:", settings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>通知設定</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">通知方式</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="flex-1">
                電子郵件通知
              </Label>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications" className="flex-1">
                推播通知
              </Label>
              <Switch
                id="pushNotifications"
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggle("pushNotifications")}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">通知類型</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="likes" className="flex-1">
                當有人喜歡我的貼文
              </Label>
              <Switch id="likes" checked={settings.likes} onCheckedChange={() => handleToggle("likes")} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="comments" className="flex-1">
                當有人在我的貼文上留言
              </Label>
              <Switch id="comments" checked={settings.comments} onCheckedChange={() => handleToggle("comments")} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="follows" className="flex-1">
                當有人追蹤我
              </Label>
              <Switch id="follows" checked={settings.follows} onCheckedChange={() => handleToggle("follows")} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="mentions" className="flex-1">
                當有人提及我
              </Label>
              <Switch id="mentions" checked={settings.mentions} onCheckedChange={() => handleToggle("mentions")} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="directMessages" className="flex-1">
                當有人傳送私訊給我
              </Label>
              <Switch
                id="directMessages"
                checked={settings.directMessages}
                onCheckedChange={() => handleToggle("directMessages")}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">其他通知</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="newFeatures" className="flex-1">
                新功能和更新
              </Label>
              <Switch
                id="newFeatures"
                checked={settings.newFeatures}
                onCheckedChange={() => handleToggle("newFeatures")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="marketing" className="flex-1">
                行銷和促銷訊息
              </Label>
              <Switch id="marketing" checked={settings.marketing} onCheckedChange={() => handleToggle("marketing")} />
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
