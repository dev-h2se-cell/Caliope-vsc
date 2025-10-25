import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
  reviewCount?: number;
}

export function StarRating({ rating, totalStars = 5, className, reviewCount }: StarRatingProps) {
  const roundedRating = Math.round(rating);
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {[...Array(totalStars)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-5 h-5",
              i < roundedRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>
      <span className="ml-1 text-sm text-muted-foreground">
        {rating}
        {reviewCount && ` (${reviewCount})`}
      </span>
    </div>
  );
}
