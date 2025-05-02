
import React, { useState, useEffect, useRef } from "react";
import { X, Search, Film, Tv, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { searchMedia, MediaItem, getImageUrl } from "@/services/tmdb";

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = "auto";
      setQuery("");
      setResults([]);
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        try {
          const data = await searchMedia(query);
          setResults(data.results.filter(item => 
            (item.media_type === "movie" || item.media_type === "tv") && 
            (item.poster_path || item.backdrop_path)
          ).slice(0, 8));
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleViewAll = () => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  const handleItemClick = (item: MediaItem) => {
    navigate(`/${item.media_type}/${item.id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="glass-morphism flex items-center rounded-full w-full max-w-2xl mx-auto overflow-hidden px-6 py-3">
            <Search className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for movies, TV shows..."
              className="bg-transparent border-none outline-none flex-1 text-foreground placeholder-muted-foreground"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery("")} className="flex-shrink-0">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>
          <button 
            onClick={onClose}
            className="ml-4 p-2 glass-morphism rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {query.length > 0 && (
              <div className="mb-4">
                {results.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {query.length < 3 
                      ? "Type at least 3 characters to search" 
                      : "No results found"}
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {results.map((item) => (
                        <div 
                          key={`${item.media_type}-${item.id}`}
                          onClick={() => handleItemClick(item)}
                          className="glass-morphism rounded-lg overflow-hidden card-hover cursor-pointer"
                        >
                          <div className="aspect-[2/3] relative">
                            <img 
                              src={getImageUrl(item.poster_path || item.backdrop_path, "w500") || "/placeholder.svg"} 
                              alt={item.title || item.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 glass-morphism rounded-full px-2 py-1 text-xs flex items-center">
                              {item.media_type === "movie" 
                                ? <Film className="h-3 w-3 mr-1" /> 
                                : <Tv className="h-3 w-3 mr-1" />}
                              {item.media_type === "movie" ? "Movie" : "TV"}
                            </div>
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-sm truncate">
                              {item.title || item.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4) || "Unknown"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {results.length > 0 && (
                      <div className="mt-6 text-center">
                        <button 
                          onClick={handleViewAll}
                          className="glass-morphism inline-flex items-center px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                          View all results
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
