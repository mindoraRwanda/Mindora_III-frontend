import type { CommunityPost } from "@/types/domain";
import { Heart, MessageCircle } from "lucide-react";

interface CommunityPostCardProps {
  post: CommunityPost;
}

export function CommunityPostCard({ post }: CommunityPostCardProps) {
  return (
    <div className="rounded-xl bg-white px-4 py-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold">Anonymous</p>
        <p className="text-[11px] text-muted-foreground">{post.postedAgo}</p>
      </div>
      <p className="mt-2.5 text-[13px] leading-relaxed text-foreground/85">{post.content}</p>
      <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Heart className="h-3.5 w-3.5 text-red-400" fill="currentColor" />
          {post.likes}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5" />
          {post.relateCount}
        </span>
        <span>I relate</span>
      </div>
    </div>
  );
}

interface CommunityHighlightsProps {
  posts: CommunityPost[];
}

export function CommunityHighlights({ posts }: CommunityHighlightsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {posts.map((post) => (
        <CommunityPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
