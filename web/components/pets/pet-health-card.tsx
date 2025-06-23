import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"

interface PetHealthCardProps {
  record: {
    id: string
    title: string
    description: string
    date: Date
    recordType: string
    veterinarian: string | null
    hospital: string | null
    attachments: string[]
  }
}

export default function PetHealthCard({ record }: PetHealthCardProps) {
  // Map type to color
  const typeColorMap: Record<string, string> = {
    疫苗接種: "bg-blue-100 text-blue-800",
    體檢: "bg-green-100 text-green-800",
    驅蟲: "bg-purple-100 text-purple-800",
    治療: "bg-red-100 text-red-800",
    手術: "bg-orange-100 text-orange-800",
  }

  const badgeClass = typeColorMap[record.recordType] || "bg-gray-100 text-gray-800"
  const formattedDate = format(record.date, 'yyyy年M月d日', { locale: zhTW })

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={badgeClass}>{record.recordType}</Badge>
            <h3 className="font-medium mt-2">{record.title}</h3>
          </div>
          <div className="flex items-center text-sm text-primary/70">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="mt-2 text-sm text-primary/70">
          {record.hospital && <div>醫院: {record.hospital}</div>}
          {record.veterinarian && <div>獸醫: {record.veterinarian}</div>}
          {record.description && <div className="mt-1">{record.description}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
