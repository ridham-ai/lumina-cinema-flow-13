
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Film, Tv, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchMedia, MediaItem } from "@/services/tmdb";
import MediaGrid from "@/components/media/MediaGrid";
import { toast } from "sonner";

const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<"all" | "movie" | "tv">("all");
  
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        const data = await searchMedia(query, page);
        
        let filteredResults = data.results.filter((item) => 
          (item.media_type === "movie" || item.media_type === "tv") &&
          (item.poster_path || item.backdrop_path)
        );
        
        if (mediaTypeFilter !== "all") {
          filteredResults = filteredResults.filter(
            (item) => item.media_type === mediaTypeFilter
          );
        }
        
        setResults(filteredResults);
        setTotalResults(data.total_results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Failed to load search results");
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query, page, mediaTypeFilter]);
  
  const clearSearch = () => {
    setSearchParams({});
  };
  
  const handleMediaTypeFilter = (type: "all" | "movie" | "tv") => {
    setMediaTypeFilter(type);
    setPage(1);
  };
  
  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-20 md:pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center justify-between mb-6 md:mb-8">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
              Search Results
              {query && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearSearch}
                  className="ml-2 h-8"
                >
                  <X className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
            </h1>
            {query && (
              <p className="text-sm md:text-base text-muted-foreground">
                {totalResults} results for "{query}"
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={mediaTypeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleMediaTypeFilter("all")}
              className="h-9"
            >
              All
            </Button>
            <Button
              variant={mediaTypeFilter === "movie" ? "default" : "outline"}
              size="sm"
              onClick={() => handleMediaTypeFilter("movie")}
              className="h-9"
            >
              <Film className="h-4 w-4 mr-1" /> Movies
            </Button>
            <Button
              variant={mediaTypeFilter === "tv" ? "default" : "outline"}
              size="sm"
              onClick={() => handleMediaTypeFilter("tv")}
              className="h-9"
            >
              <Tv className="h-4 w-4 mr-1" /> TV Shows
            </Button>
          </div>
        </div>
        
        {!query ? (
          <div className="text-center py-16 md:py-24">
            <h2 className="text-lg md:text-xl font-semibold mb-2">Enter a search term</h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Search for movies or TV shows by title
            </p>
          </div>
        ) : (
          <div className="w-full">
            <MediaGrid 
              items={results} 
              loading={loading} 
              emptyMessage="No results found. Try a different search term."
            />
          </div>
        )}
        
        {/* Pagination */}
        {results.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-8 md:mt-12">
            <div className="glass-morphism rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="h-8"
                >
                  Previous
                </Button>
                <span className="text-sm px-3 py-1">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
