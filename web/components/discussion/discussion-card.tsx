// web/components/discussion/discussion-card.tsx
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { zhTW, enUS } from 'date-fns/locale';
import { MessageSquare, Eye } from 'lucide-react'; // Example icons
import { type Locale } from '@/i18n-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; // Use Card components
import { Badge } from '@/components/ui/badge';
import type { DiscussionForFeed } from '@/lib/discussionData'; // Import the correct type

interface DiscussionCardProps {
    discussion: DiscussionForFeed;
    locale: Locale;
}

export default function DiscussionCard({ discussion, locale }: DiscussionCardProps) {
    const author = discussion.author;
    const commentCount = discussion._count?.comments ?? 0;
    // Assuming viewCount is selected directly on the Discussion model if needed
    const viewCount = discussion.viewCount ?? 0;

    const dateLocale = locale === "zh-TW" ? zhTW : enUS;
    const formattedDate = discussion.createdAt ? formatDistanceToNow(new Date(discussion.createdAt), {
        addSuffix: true,
        locale: dateLocale,
    }) : '';

    if (!author) return null; // Don't render if author is missing

    return (
        <Card className="hover:bg-secondary/20 transition-colors">
            <CardContent className="p-4 flex gap-3">
                 {/* Author Avatar */}
                 <Link href={`/${locale}/profile/${author.id}`} className="flex-shrink-0 mt-1">
                     <Image
                        src={author.avatarUrl || "/placeholder-user.jpg"}
                        alt={author.username || "User"}
                        width={36}
                        height={36}
                        className="rounded-full object-cover bg-muted"
                     />
                 </Link>

                 <div className="flex-1 min-w-0">
                     {/* Title linked to discussion detail page */}
                     <Link href={`/${locale}/discussion/${discussion.id}`} className="block hover:underline">
                         <h3 className="font-semibold text-base leading-snug truncate mb-1">
                            {discussion.title}
                         </h3>
                     </Link>

                     {/* Author and Date Info */}
                      <div className="text-xs text-primary/70 mb-2">
                        <Link href={`/${locale}/profile/${author.id}`} className="hover:underline font-medium">
                           {author.fullName || author.username}
                        </Link>
                        <span> 發起於 {formattedDate}</span>
                        {/* Optionally display Topic */}
                        {discussion.topic?.title && (
                           <span className='ml-2'>
                             in <Link href={`/${locale}/community/topics/${discussion.topicId}`} className="hover:underline font-medium">{discussion.topic.title}</Link>
                           </span>
                        )}
                     </div>

                     {/* Optional: Display snippet of content */}
                     {/* {discussion.content && (
                         <p className="text-sm text-primary/80 line-clamp-2 mb-2">
                            {discussion.content}
                         </p>
                     )} */}

                     {/* Footer with Stats */}
                      <div className="flex items-center gap-4 text-xs text-primary/70">
                         <div className="flex items-center gap-1">
                             <MessageSquare className="h-3.5 w-3.5" />
                             <span>{commentCount} 回覆</span>
                         </div>
                         <div className="flex items-center gap-1">
                             <Eye className="h-3.5 w-3.5" />
                             <span>{viewCount} 查看</span>
                         </div>
                         {/* Add tags if needed */}
                     </div>
                 </div>
            </CardContent>
        </Card>
    );
}