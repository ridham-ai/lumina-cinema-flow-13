
import React, { useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MediaItem } from "@/services/tmdb";
import MediaCard from "./MediaCard";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
    <div className="my-6 md:my-8">
      <div className="flex items-center justify-between mb-3 md:mb-4 px-4 md:px-0">
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "p-1.5 md:p-2 rounded-full glass-morphism",
              !canScrollLeft && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Scroll left"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "p-1.5 md:p-2 rounded-full glass-morphism",
              !canScrollRight && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Scroll right"
          >
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </div>
      </div>
      
      <div 
        className="relative overflow-hidden"
        onMouseEnter={checkScrollButtons}
      >
        {loading ? (
          <div className="flex justify-center py-12 md:py-20">
            <div className="animate-spin h-8 w-8 md:h-10 md:w-10 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center py-10 md:py-16 text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div 
            ref={containerRef}
            className="flex overflow-x-auto gap-3 md:gap-4 pb-4 scrollbar-none snap-x pl-4 md:pl-0"
            onScroll={checkScrollButtons}
          >
            {items.map((item) => (
              <div 
                key={`${item.id}-${item.media_type || "unknown"}`} 
                className={cn(
                  "flex-none snap-start",
                  isMobile ? "w-[130px]" : "w-[160px] md:w-[200px]"
                )}
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
