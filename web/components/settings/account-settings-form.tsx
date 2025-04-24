"use client"

import type React from "react"

import { useState } from "react"
import { type Locale, dictionary } from "@/i18n-config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { currentUser } from "@/data/users"

interface AccountSettingsFormProps {
  locale: Locale
}

export default function AccountSettingsForm({ locale }: AccountSettingsFormProps) {
  const t = dictionary[locale]

  const [formData, setFormData] = useState({
    email: currentUser.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <CardTitle>帳號設定</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">電子郵件</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">變更密碼</h3>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">目前密碼</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">新密碼</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">確認新密碼</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
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
