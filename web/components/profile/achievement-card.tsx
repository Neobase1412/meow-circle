// components/profile/achievement-card.tsx
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

// Refine the interface name and structure for clarity
// This structure anticipates data fetched from your future Achievement/UserProgress models
interface Achievement {
  id: number | string; // ID could be number or string (like cuid) from DB
  name: string;
  description: string;
  iconUrl: string | null; // Icon URL might be optional
  progress: number;
  maxProgress: number;
}

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  // Handle potential division by zero if maxProgress is 0
  const progressPercentage =
    achievement.maxProgress > 0
      ? Math.min( (achievement.progress / achievement.maxProgress) * 100, 100) // Cap at 100%
      : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="bg-secondary/30 p-2 rounded-md flex-shrink-0"> {/* Added flex-shrink-0 */}
        <Image
          src={achievement.iconUrl || "/placeholder.svg"} // Use placeholder
          alt={achievement.name || "Achievement"}
          width={32}
          height={32}
          className="object-contain bg-muted rounded-sm" // Use contain, add bg-muted
        />
      </div>
      <div className="flex-1 min-w-0"> {/* Added min-w-0 for flex child clipping */}
        <div className="flex justify-between items-center gap-2"> {/* Added gap */}
          <h3 className="font-medium text-sm truncate">{achievement.name || "Unnamed Achievement"}</h3> {/* Added truncate */}
          <span className="text-xs text-primary/70 flex-shrink-0"> {/* Added flex-shrink-0 */}
            {achievement.progress}/{achievement.maxProgress}
          </span>
        </div>
        <p className="text-xs text-primary/70 mb-1 truncate">{achievement.description || "No description."}</p> {/* Added truncate */}
        <Progress value={progressPercentage} className="h-1" aria-label={`${achievement.name} progress`} />
      </div>
    </div>
  );
}