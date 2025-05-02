
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
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              Search Results
              {query && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearSearch}
                  className="ml-2"
                >
                  <X className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
            </h1>
            {query && (
              <p className="text-muted-foreground">
                {totalResults} results for "{query}"
              </p>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={mediaTypeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleMediaTypeFilter("all")}
            >
              All
            </Button>
            <Button
              variant={mediaTypeFilter === "movie" ? "default" : "outline"}
              size="sm"
              onClick={() => handleMediaTypeFilter("movie")}
            >
              <Film className="h-4 w-4 mr-1" /> Movies
            </Button>
            <Button
              variant={mediaTypeFilter === "tv" ? "default" : "outline"}
              size="sm"
              onClick={() => handleMediaTypeFilter("tv")}
            >
              <Tv className="h-4 w-4 mr-1" /> TV Shows
            </Button>
          </div>
        </div>
        
        {!query ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-2">Enter a search term</h2>
            <p className="text-muted-foreground">
              Search for movies or TV shows by title
            </p>
          </div>
        ) : (
          <MediaGrid 
            items={results} 
            loading={loading} 
            emptyMessage="No results found. Try a different search term."
          />
        )}
        
        {/* Pagination */}
        {results.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="join glass-morphism">
              <Button
                variant="ghost"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="mx-1"
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="mx-1"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
