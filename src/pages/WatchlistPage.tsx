
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Filter, SortAsc, SortDesc, BookmarkX } from "lucide-react";
import MediaGrid from "@/components/media/MediaGrid";
import { useMedia } from "@/contexts/MediaContext";
import { MediaItem } from "@/services/tmdb";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

type SortOption = "recent" | "title" | "rating";
type SortDirection = "asc" | "desc";
type MediaTypeFilter = "all" | "movie" | "tv";

const WatchlistPage: React.FC = () => {
  const { watchlist, refreshWatchlist } = useMedia();
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaTypeFilter>("all");
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  
  // Apply sorting and filtering
  useEffect(() => {
    let items = [...watchlist];
    
    // Apply media type filter
    if (mediaTypeFilter !== "all") {
      items = items.filter((item) => item.media_type === mediaTypeFilter);
    }
    
    // Apply sorting
    items.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "recent") {
        comparison = (b.addedAt || 0) - (a.addedAt || 0);
      } else if (sortBy === "title") {
        const aTitle = (a.title || a.name || "").toLowerCase();
        const bTitle = (b.title || b.name || "").toLowerCase();
        comparison = aTitle.localeCompare(bTitle);
      } else if (sortBy === "rating") {
        comparison = b.vote_average - a.vote_average;
      }
      
      return sortDirection === "asc" ? -comparison : comparison;
    });
    
    setFilteredItems(items);
  }, [watchlist, sortBy, sortDirection, mediaTypeFilter]);
  
  // Refresh watchlist on mount
  useEffect(() => {
    refreshWatchlist();
  }, []);
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };
  
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">My Watchlist</h1>
          
          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {mediaTypeFilter === "all" ? "All Types" : mediaTypeFilter === "movie" ? "Movies" : "TV Shows"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setMediaTypeFilter("all")}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMediaTypeFilter("movie")}>
                  Movies
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMediaTypeFilter("tv")}>
                  TV Shows
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  Sort: {sortBy === "recent" ? "Date Added" : sortBy === "title" ? "Title" : "Rating"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("recent")}>
                  Date Added
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("title")}>
                  Title
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("rating")}>
                  Rating
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSortDirection}
              className="flex items-center gap-2"
            >
              {sortDirection === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <BookmarkX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start adding movies and TV shows to your watchlist to keep track of what you want to watch.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild>
                <Link to="/movies">Browse Movies</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/tv">Browse TV Shows</Link>
              </Button>
            </div>
          </div>
        ) : (
          <MediaGrid items={filteredItems} />
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
