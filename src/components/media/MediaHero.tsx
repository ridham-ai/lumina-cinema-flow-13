
import React from "react";
import { Play, Info, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DetailedMediaItem, getImageUrl } from "@/services/tmdb";
import { useMedia } from "@/contexts/MediaContext";

interface MediaHeroProps {
  item: DetailedMediaItem;
  mediaType: "movie" | "tv";
}

const MediaHero: React.FC<MediaHeroProps> = ({ item, mediaType }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useMedia();
  const inWatchlist = isInWatchlist(item.id);
  
  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist({...item, media_type: mediaType});
    }
  };
  
  // Find trailer or teaser
  const trailer = item.videos?.results.find(
    (video) => video.type === "Trailer" || video.type === "Teaser"
  );
  
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  return (
    <div className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={getImageUrl(item.backdrop_path || item.poster_path, "original") || "/placeholder.svg"}
          alt={item.title || item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10 w-full">
        <div className="flex flex-col md:flex-row md:items-end gap-8">
          {/* Poster */}
          <div className="w-full max-w-xs mx-auto md:mx-0 glass-morphism rounded-lg overflow-hidden">
            <img
              src={getImageUrl(item.poster_path, "w500") || "/placeholder.svg"}
              alt={item.title || item.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Details */}
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
              {item.title || item.name}
            </h1>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <span className="glass-morphism px-2 py-1 rounded-md">
                {item.release_date?.substring(0, 4) || 
                 item.first_air_date?.substring(0, 4) || 
                 "TBA"}
              </span>
              
              {mediaType === "movie" && item.runtime && (
                <span className="glass-morphism px-2 py-1 rounded-md">
                  {formatRuntime(item.runtime)}
                </span>
              )}
              
              {item.vote_average > 0 && (
                <span className="glass-morphism px-2 py-1 rounded-md flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{item.vote_average.toFixed(1)}</span>
                </span>
              )}
              
              {item.genres.map((genre) => (
                <span key={genre.id} className="glass-morphism px-2 py-1 rounded-md">
                  {genre.name}
                </span>
              ))}
            </div>
            
            {/* Overview */}
            <p className="text-sm md:text-base opacity-90 mb-6 line-clamp-3 md:line-clamp-none">
              {item.overview}
            </p>
            
            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="rounded-full">
                <Play className="h-4 w-4 mr-2" />
                Watch Now
              </Button>
              
              {trailer && (
                <Button variant="outline" size="lg" className="rounded-full">
                  <Info className="h-4 w-4 mr-2" />
                  Watch Trailer
                </Button>
              )}
              
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "rounded-full",
                  inWatchlist && "text-primary border-primary"
                )}
                onClick={handleWatchlistToggle}
              >
                <Heart className={cn("h-4 w-4", inWatchlist && "fill-current")} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaHero;
