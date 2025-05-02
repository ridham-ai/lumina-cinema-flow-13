
import React, { useState, useEffect } from "react";
import { 
  getPopularMovies, 
  getMediaByGenre, 
  MediaItem, 
  MediaType 
} from "@/services/tmdb";
import MediaGrid from "@/components/media/MediaGrid";
import GenreFilter from "@/components/layout/GenreFilter";
import { toast } from "sonner";

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        
        let moviesData;
        
        if (selectedGenre) {
          moviesData = await getMediaByGenre("movie", selectedGenre);
        } else {
          moviesData = await getPopularMovies();
        }
        
        // Add media_type to each item for proper routing
        const moviesWithType = moviesData.results.map((movie) => ({
          ...movie,
          media_type: "movie" as MediaType
        }));
        
        setMovies(moviesWithType);
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast.error("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [selectedGenre]);

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Movies</h1>
        
        <GenreFilter 
          mediaType="movie" 
          selectedGenre={selectedGenre} 
          onSelectGenre={setSelectedGenre} 
        />
        
        <MediaGrid 
          items={movies} 
          loading={loading} 
          emptyMessage="No movies found" 
        />
      </div>
    </div>
  );
};

export default MoviesPage;
