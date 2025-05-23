
import React from "react";
import { Link } from "react-router-dom";
import { Heart, Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaItem, getImageUrl, MediaType } from "@/services/tmdb";
import { useMedia } from "@/contexts/MediaContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface MediaCardProps {
  item: MediaItem;
  className?: string;
  showTitle?: boolean;
  disableHover?: boolean;
}

const MediaCard: React.FC<MediaCardProps> = ({ 
  item, 
  className, 
  showTitle = true,
  disableHover = false
}) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useMedia();
  const inWatchlist = isInWatchlist(item.id);
  const mediaType = item.media_type || (item.first_air_date ? "tv" : "movie") as MediaType;
  const isMobile = useIsMobile();
  
  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWatchlist) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist({...item, media_type: mediaType});
    }
  };
  
  return (
    <Link 
      to={`/${mediaType}/${item.id}`} 
      className={cn(
        "block relative rounded-lg overflow-hidden",
        !disableHover && "card-hover",
        className
      )}
    >
      <div className="aspect-[2/3] relative">
        <img 
          src={getImageUrl(item.poster_path, "w500") || "/placeholder.svg"} 
          alt={item.title || item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center">
          <div className="p-2 md:p-4 w-full">
            <div className="flex items-center justify-between mb-1 md:mb-2">
              <div className="flex items-center">
                <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 mr-1" />
                <span className="text-xs md:text-sm">{item.vote_average.toFixed(1)}</span>
              </div>
              <button 
                onClick={handleWatchlistToggle} 
                className={cn(
                  "p-1 md:p-2 rounded-full transition-colors",
                  inWatchlist 
                    ? "bg-primary/20 text-primary" 
                    : "bg-black/40 text-white hover:bg-primary/20 hover:text-primary"
                )}
                aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
              >
                <Heart className={cn("h-3 w-3 md:h-4 md:w-4", inWatchlist && "fill-current")} />
              </button>
            </div>
            
            <button className="w-full py-1 md:py-2 bg-primary text-primary-foreground rounded-md flex items-center justify-center text-xs md:text-sm">
              <Play className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
              Watch
            </button>
          </div>
        </div>
      </div>
      
      {showTitle && (
        <div className="mt-1 md:mt-2">
          <h3 className="font-medium text-xs md:text-sm truncate">
            {item.title || item.name}
          </h3>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            {item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4) || "TBA"}
          </p>
        </div>
      )}
    </Link>
  );
};

export default MediaCard;
