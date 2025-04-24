import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

interface PetActivityCardProps {
  activity: {
    id: number
    type: string
    duration: number
    date: string
    notes?: string
  }
}

export default function PetActivityCard({ activity }: PetActivityCardProps) {
  // Map type to color
  const typeColorMap: Record<string, string> = {
    遊戲: "bg-green-100 text-green-800",
    散步: "bg-blue-100 text-blue-800",
    訓練: "bg-purple-100 text-purple-800",
    社交: "bg-yellow-100 text-yellow-800",
    洗澡: "bg-cyan-100 text-cyan-800",
  }

  const badgeClass = typeColorMap[activity.type] || "bg-gray-100 text-gray-800"

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={badgeClass}>{activity.type}</Badge>
            <div className="flex items-center mt-2 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span>{activity.duration} 分鐘</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-primary/70">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{activity.date}</span>
          </div>
        </div>

        {activity.notes && <div className="mt-2 text-sm text-primary/70">{activity.notes}</div>}
      </CardContent>
    </Card>
  )
}
