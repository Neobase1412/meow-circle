import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"

interface PetActivityCardProps {
  activity: {
    id: string
    title: string
    content: string
    recordDate: Date
    recordType: string
    mood: string | null
    photos: string[]
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

  const badgeClass = typeColorMap[activity.recordType] || "bg-gray-100 text-gray-800"
  const formattedDate = format(activity.recordDate, 'yyyy年M月d日', { locale: zhTW })

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={badgeClass}>{activity.recordType}</Badge>
            <h3 className="font-medium mt-2">{activity.title}</h3>
            {activity.mood && (
              <div className="flex items-center mt-1 text-sm text-primary/70">
                <span>心情: {activity.mood}</span>
              </div>
            )}
          </div>
          <div className="flex items-center text-sm text-primary/70">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {activity.content && <div className="mt-2 text-sm text-primary/70">{activity.content}</div>}
      </CardContent>
    </Card>
  )
}
