// web/components/topic-card.tsx
import Link from "next/link";
import Image from "next/image";
import { type Locale } from "@/i18n-config"; // Removed dictionary import
import { Badge } from "@/components/ui/badge";
import type { TopicForCommunitySidebar } from "@/lib/communityData"; // Import correct type

interface TopicCardProps {
  topic: TopicForCommunitySidebar; // Use Prisma-derived type
  locale: Locale;
}

export default function TopicCard({ topic, locale }: TopicCardProps) {
  // const t = dictionary[locale]; // 't' not used

  return (
    <Link
      // Use topic.id for the link
      href={`/${locale}/community/topics/${topic.id}`}
      className="flex gap-3 hover:bg-secondary/20 p-2 rounded-md transition-colors"
    >
      <Image
        src={topic.iconUrl || "/placeholder.svg"} // Use placeholder if iconUrl is null
        alt={topic.title || "Topic"}
        width={40}
        height={40}
        className="rounded-md object-cover flex-shrink-0 bg-muted" // Added flex-shrink-0 and bg-muted
      />
      <div className="flex-1 min-w-0"> {/* Added min-w-0 */}
        <div className="flex items-center gap-2">
          <h4 className="font-medium truncate">{topic.title || "Untitled Topic"}</h4> {/* Added truncate */}
          {/* Use isOfficial field from fetched data */}
          {topic.isOfficial && (
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/50"> {/* Slightly different styling for official */}
              官方
            </Badge>
          )}
        </div>
        <p className="text-sm text-primary/70 line-clamp-1">{topic.description || "No description available."}</p>
        <div className="flex items-center gap-4 mt-1">
          {/* Use followerCount and postCount from fetched data */}
          <span className="text-xs text-primary/70">{topic.followerCount} 追蹤</span>
          <span className="text-xs text-primary/70">{topic.postCount} 貼文</span>
        </div>
      </div>
    </Link>
  );
}