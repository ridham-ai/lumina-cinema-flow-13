
import React, { useState, useEffect } from "react";
import { 
  getPopularTVShows, 
  getMediaByGenre, 
  MediaItem, 
  MediaType 
} from "@/services/tmdb";
import MediaGrid from "@/components/media/MediaGrid";
import GenreFilter from "@/components/layout/GenreFilter";
import { toast } from "sonner";

const TVShowsPage: React.FC = () => {
  const [shows, setShows] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true);
        
        let showsData;
        
        if (selectedGenre) {
          showsData = await getMediaByGenre("tv", selectedGenre);
        } else {
          showsData = await getPopularTVShows();
        }
        
        // Add media_type to each item for proper routing
        const showsWithType = showsData.results.map((show) => ({
          ...show,
          media_type: "tv" as MediaType
        }));
        
        setShows(showsWithType);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
        toast.error("Failed to load TV shows");
      } finally {
        setLoading(false);
      }
    };
    
    fetchShows();
  }, [selectedGenre]);

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">TV Shows</h1>
        
        <GenreFilter 
          mediaType="tv" 
          selectedGenre={selectedGenre} 
          onSelectGenre={setSelectedGenre} 
        />
        
        <MediaGrid 
          items={shows} 
          loading={loading} 
          emptyMessage="No TV shows found" 
        />
      </div>
    </div>
  );
};

export default TVShowsPage;
