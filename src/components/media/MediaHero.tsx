
import React, { useState } from "react";
import { Play, Info, Heart, X } from "lucide-react";
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
  const [showTrailer, setShowTrailer] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  
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

  // Generate the Vidora.su URL based on media type
  const getPlayerUrl = () => {
    if (mediaType === "movie") {
      return `https://vidora.su/movie/${item.id}?parameters`;
    } else if (mediaType === "tv") {
      // For TV shows, we'll default to season 1, episode 1
      // You might want to enhance this later to select the correct episode
      return `https://vidora.su/tv/${item.id}/1/1?parameters`;
    }
    return "";
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
              <Button 
                size="lg" 
                className="rounded-full"
                onClick={() => setShowPlayer(true)}
              >
                <Play className="h-4 w-4 mr-2" />
                Watch Now
              </Button>
              
              {trailer && (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full"
                  onClick={() => setShowTrailer(true)}
                >
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
      
      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl aspect-video">
            <Button
              variant="outline"
              size="icon"
              className="absolute -top-12 right-0 rounded-full bg-black/50 text-white border-none hover:bg-black/80"
              onClick={() => setShowTrailer(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Trailer"
            ></iframe>
          </div>
        </div>
      )}

      {/* Vidora.su Player Modal */}
      {showPlayer && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl aspect-video">
            <Button
              variant="outline"
              size="icon"
              className="absolute -top-12 right-0 rounded-full bg-black/50 text-white border-none hover:bg-black/80"
              onClick={() => setShowPlayer(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <iframe
              src={getPlayerUrl()}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              title={`Watch ${item.title || item.name}`}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaHero;
