import Image from "next/image"
import { Progress } from "@/components/ui/progress"

interface AchievementCardProps {
  achievement: {
    id: number
    name: string
    description: string
    iconUrl: string
    progress: number
    maxProgress: number
  }
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100

  return (
    <div className="flex items-center gap-3">
      <div className="bg-secondary/30 p-2 rounded-md">
        <Image
          src={achievement.iconUrl || "/placeholder.svg?height=32&width=32&query=achievement"}
          alt={achievement.name}
          width={32}
          height={32}
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm">{achievement.name}</h3>
          <span className="text-xs text-primary/70">
            {achievement.progress}/{achievement.maxProgress}
          </span>
        </div>
        <p className="text-xs text-primary/70 mb-1">{achievement.description}</p>
        <Progress value={progressPercentage} className="h-1" />
      </div>
    </div>
  )
}
