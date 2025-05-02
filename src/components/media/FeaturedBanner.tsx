
import React from "react";
import { useNavigate } from "react-router-dom";
import { Play, Info } from "lucide-react";
import { MediaItem, getImageUrl, MediaType } from "@/services/tmdb";
import { Button } from "@/components/ui/button";

interface FeaturedBannerProps {
  item: MediaItem;
}

const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ item }) => {
  const navigate = useNavigate();
  const mediaType = item.media_type || (item.first_air_date ? "tv" : "movie") as MediaType;

  // Format the release date or first air date to display year only
  const year = item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4);
  
  const handleNavigate = () => {
    navigate(`/${mediaType}/${item.id}`);
  };
  
  return (
    <div className="relative min-h-[60vh] md:min-h-[80vh] w-full overflow-hidden mb-8">
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
      <div className="container mx-auto px-4 absolute bottom-0 left-0 right-0 pb-16 md:pb-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 animate-fade-in">
            {item.title || item.name}
          </h1>
          
          <div className="flex items-center space-x-4 mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {year && <span className="text-sm md:text-base">{year}</span>}
            {item.vote_average > 0 && (
              <span className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1">{item.vote_average.toFixed(1)}</span>
              </span>
            )}
          </div>
          
          <p className="text-sm md:text-base opacity-90 mb-6 line-clamp-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {item.overview}
          </p>
          
          <div className="flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Button size="lg" className="rounded-full" onClick={handleNavigate}>
              <Play className="h-4 w-4 mr-2" />
              Watch Now
            </Button>
            <Button variant="outline" size="lg" className="rounded-full" onClick={handleNavigate}>
              <Info className="h-4 w-4 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedBanner;
