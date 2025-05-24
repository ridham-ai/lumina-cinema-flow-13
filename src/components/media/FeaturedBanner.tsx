import React from "react";
import { useNavigate } from "react-router-dom";
import { Play, Info } from "lucide-react";
import { MediaItem, getImageUrl, MediaType } from "@/services/tmdb";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface FeaturedBannerProps {
  item: MediaItem;
}

const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ item }) => {
  const navigate = useNavigate();
  const mediaType = item.media_type || (item.first_air_date ? "tv" : "movie") as MediaType;
  const isMobile = useIsMobile();

  // Format the release date or first air date to display year only
  const year = item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4);
  
  const handleNavigate = () => {
    navigate(`/${mediaType}/${item.id}`);
  };
  
  return (
    <div className={cn(
      "relative w-full overflow-hidden mb-4 md:mb-6",
      isMobile ? "min-h-[40vh]" : "min-h-[50vh] md:min-h-[60vh] lg:min-h-[80vh]"
    )}>
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl(item.backdrop_path, "original") || getImageUrl(item.poster_path, "original") || "/placeholder.svg"}
          alt={item.title || item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
      </div>
      
      {/* Content */}
      <div className={cn(
        "container mx-auto absolute bottom-0 left-0 right-0",
        isMobile ? "px-4 pb-6" : "px-4 pb-12 md:pb-16 lg:pb-24"
      )}>
        <div className={cn("max-w-2xl", isMobile && "max-w-full")}>
          <h1 className={cn(
            "font-bold mb-2 animate-fade-in",
            isMobile ? "text-2xl" : "text-3xl md:text-4xl lg:text-6xl md:mb-3"
          )}>
            {item.title || item.name}
          </h1>
          
          <div className={cn(
            "flex items-center mb-2 animate-fade-in",
            isMobile ? "space-x-2 text-sm" : "space-x-3 md:space-x-4 md:mb-4"
          )} style={{ animationDelay: "0.2s" }}>
            {year && <span className={isMobile ? "text-sm" : "text-sm md:text-base"}>{year}</span>}
            {item.vote_average > 0 && (
              <span className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1">{item.vote_average.toFixed(1)}</span>
              </span>
            )}
          </div>
          
          <p className={cn(
            "opacity-90 mb-3 animate-fade-in line-clamp-2",
            isMobile ? "text-xs md:mb-4" : "text-xs md:text-sm lg:text-base md:line-clamp-3 md:mb-6"
          )} style={{ animationDelay: "0.3s" }}>
            {item.overview}
          </p>
          
          <div className={cn(
            "flex flex-wrap animate-fade-in",
            isMobile ? "gap-2" : "gap-3"
          )} style={{ animationDelay: "0.4s" }}>
            <Button 
              size="sm"
              className="rounded-full" 
              onClick={handleNavigate}
            >
              <Play className="h-3 w-3 mr-1" />
              Watch Now
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-full" 
              onClick={handleNavigate}
            >
              <Info className="h-3 w-3 mr-1" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBanner;
