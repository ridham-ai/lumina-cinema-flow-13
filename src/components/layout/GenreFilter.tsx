
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMedia } from "@/contexts/MediaContext";
import { MediaType } from "@/services/tmdb";

interface GenreFilterProps {
  mediaType: MediaType;
  selectedGenre: number | null;
  onSelectGenre: (genreId: number | null) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ 
  mediaType, 
  selectedGenre, 
  onSelectGenre 
}) => {
  const { genres, loadingGenres } = useMedia();
  
  if (loadingGenres) {
    return (
      <div className="py-4">
        <div className="animate-pulse h-10 bg-muted rounded-full w-full max-w-xs"></div>
      </div>
    );
  }

  return (
    <div className="py-4 overflow-x-auto scrollbar-none">
      <Tabs 
        defaultValue={selectedGenre?.toString() || "all"} 
        onValueChange={(value) => onSelectGenre(value === "all" ? null : parseInt(value))}
        className="w-full"
      >
        <TabsList className="glass-morphism h-auto p-1 w-full flex-wrap">
          <TabsTrigger 
            value="all" 
            className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All
          </TabsTrigger>
          {genres[mediaType].map((genre) => (
            <TabsTrigger
              key={genre.id}
              value={genre.id.toString()}
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {genre.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default GenreFilter;
