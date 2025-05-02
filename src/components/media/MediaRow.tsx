
import React, { useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MediaItem } from "@/services/tmdb";
import MediaCard from "./MediaCard";
import { cn } from "@/lib/utils";

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  loading?: boolean;
  emptyMessage?: string;
}

const MediaRow: React.FC<MediaRowProps> = ({ 
  title, 
  items, 
  loading = false,
  emptyMessage = "No items found"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const checkScrollButtons = () => {
    if (containerRef.current) {
      setCanScrollLeft(containerRef.current.scrollLeft > 0);
      setCanScrollRight(
        containerRef.current.scrollLeft < 
        containerRef.current.scrollWidth - containerRef.current.clientWidth - 10
      );
    }
  };
  
  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.75;
      containerRef.current.scrollTo({
        left: containerRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount),
        behavior: "smooth"
      });
    }
  };
  
  // Check if we can still scroll on component mount
  React.useEffect(() => {
    checkScrollButtons();
    
    // Add resize listener
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, [items]);
  
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "p-2 rounded-full glass-morphism",
              !canScrollLeft && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Scroll left"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "p-2 rounded-full glass-morphism",
              !canScrollRight && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Scroll right"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div 
        className="relative overflow-hidden"
        onMouseEnter={checkScrollButtons}
      >
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center py-16 text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div 
            ref={containerRef}
            className="flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x"
            onScroll={checkScrollButtons}
          >
            {items.map((item) => (
              <div 
                key={`${item.id}-${item.media_type || "unknown"}`} 
                className="flex-none w-[160px] md:w-[200px] snap-start"
              >
                <MediaCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaRow;
