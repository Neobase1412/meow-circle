import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface PetHealthCardProps {
  record: {
    id: number
    type: string
    name: string
    date: string
    provider: string
    notes?: string
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

  const badgeClass = typeColorMap[record.type] || "bg-gray-100 text-gray-800"

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={badgeClass}>{record.type}</Badge>
            <h3 className="font-medium mt-2">{record.name}</h3>
          </div>
          <div className="flex items-center text-sm text-primary/70">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{record.date}</span>
          </div>
        </div>

        <div className="mt-2 text-sm text-primary/70">
          <div>提供者: {record.provider}</div>
          {record.notes && <div className="mt-1">{record.notes}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
