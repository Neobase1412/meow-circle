// web/components/profile/FollowButton.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus, UserCheck } from "lucide-react";
import { toggleFollowAction } from "@/actions/followActions"; // We will create this next
import { useAuth } from "@/context/AuthContext"; // To check login status client-side if needed
import { cn } from "@/lib/utils";
// Optional: Import useToast for feedback
// import { useToast } from "@/hooks/use-toast";

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing: boolean;
  viewerIsLoggedIn: boolean; // Pass this from the server component
  className?: string;
}

export default function FollowButton({
  targetUserId,
  initialIsFollowing,
  viewerIsLoggedIn,
  className,
}: FollowButtonProps) {
  const router = useRouter();
  const { authUser } = useAuth(); // Get authUser from context for double-checking
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition(); // For loading state without blocking UI
  const [isHovering, setIsHovering] = useState(false);
  // const { toast } = useToast(); // Optional: for showing feedback

  // Ensure client-side state matches server-side prop if viewer logs in/out without full page reload
  // This might happen with SPAs or complex client-side routing
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  // The viewer check here is an extra safety net, the button ideally shouldn't render if not logged in
  const isLoggedIn = viewerIsLoggedIn && !!authUser;

  const handleClick = () => {
    if (!isLoggedIn) {
      // Redirect to login if somehow clicked while logged out
      router.push('/login'); // Adjust locale later if needed
      return;
    }
    if (isPending) return; // Prevent multiple clicks

    startTransition(async () => {
      // Optimistic update
      const previousFollowingState = isFollowing;
      setIsFollowing(!isFollowing);

      const result = await toggleFollowAction(targetUserId);

      if (!result.success) {
        // Revert optimistic update on failure
        setIsFollowing(previousFollowingState);
        console.error("Follow action failed:", result.error);
        // Optional: Show toast notification
        // toast({
        //   title: "Error",
        //   description: result.error || "Could not update follow status.",
        //   variant: "destructive",
        // });
        alert(result.error || "無法更新追蹤狀態。"); // Simple alert fallback
      } else {
         // Success! Server state will be updated via revalidation.
         // Optionally show a success toast for unfollow? Follow usually doesn't need one.
         // if (previousFollowingState) { // Means user just unfollowed
         //   toast({ description: "Unfollowed successfully." });
         // }
         // Trigger re-fetch or rely on revalidatePath from action
         // router.refresh(); // Could force a refresh, but revalidatePath is often better
      }
    });
  };

  // Determine button text and variant
  let buttonText = "Follow";
  let buttonVariant: "default" | "outline" | "destructive" = "default";
  let Icon = UserPlus;

  if (isFollowing) {
    buttonText = isHovering ? "Unfollow" : "Following";
    buttonVariant = isHovering ? "destructive" : "outline";
    Icon = UserCheck;
  }

  // Don't render the button if the viewer isn't logged in
  if (!viewerIsLoggedIn) {
     // Or render a disabled button prompting login
     // return <Button className={className} disabled>Follow</Button>;
     return null; // Or return a link to login
  }

  return (
    <Button
      variant={buttonVariant}
      className={cn("min-w-[100px]", className)} // Added min-width
      disabled={isPending}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {/* Optionally add icon */}
          {/* <Icon className="mr-2 h-4 w-4" /> */}
          {buttonText}
        </>
      )}
    </Button>
  );
}