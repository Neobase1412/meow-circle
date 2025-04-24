"use client"

import { useState } from "react"
import { type Locale, dictionary } from "@/i18n-config"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface DailyTaskCardProps {
  locale: Locale
}

export default function DailyTaskCard({ locale }: DailyTaskCardProps) {
  const t = dictionary[locale]

  // Mock daily tasks
  const [tasks, setTasks] = useState([
    { id: 1, name: "每日簽到", completed: true, points: 10 },
    { id: 2, name: "發布貼文", completed: false, points: 20 },
    { id: 3, name: "留言互動", completed: false, points: 15 },
    { id: 4, name: "上傳寵物照片", completed: false, points: 25 },
  ])

  // Calculate progress
  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const progressPercentage = (completedTasks / totalTasks) * 100

  // Complete a task
  const completeTask = (taskId: number) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task)))
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">每日任務</h3>
          <span className="text-sm text-primary/70">
            {completedTasks}/{totalTasks}
          </span>
        </div>

        <Progress value={progressPercentage} className="h-2 mb-4" />

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    task.completed ? "bg-primary text-white" : "border border-primary/30"
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3" />}
                </div>
                <span className={task.completed ? "text-primary/70 line-through" : ""}>{task.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-primary/70">+{task.points}</span>
                {!task.completed && (
                  <Button variant="outline" size="sm" onClick={() => completeTask(task.id)}>
                    完成
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
