
import React, { useState, useEffect } from "react";
import FeaturedBanner from "@/components/media/FeaturedBanner";
import MediaRow from "@/components/media/MediaRow";
import { 
  getTrending, 
  getPopularMovies, 
  getPopularTVShows, 
  getTopRated,
  getNowPlayingMovies,
  MediaItem
} from "@/services/tmdb";
import { toast } from "sonner";

const HomePage: React.FC = () => {
  const [featuredItem, setFeaturedItem] = useState<MediaItem | null>(null);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<MediaItem[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<MediaItem[]>([]);
  const [nowPlaying, setNowPlaying] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [
          trendingRes,
          popularMoviesRes,
          popularTVRes,
          topRatedMoviesRes,
          nowPlayingRes
        ] = await Promise.all([
          getTrending("all", "day"),
          getPopularMovies(),
          getPopularTVShows(),
          getTopRated("movie"),
          getNowPlayingMovies()
        ]);

        // Set featured item from trending
        if (trendingRes.results.length > 0) {
          // Pick a random trending item with a backdrop
          const filteredItems = trendingRes.results.filter(item => item.backdrop_path);
          const randomIndex = Math.floor(Math.random() * Math.min(5, filteredItems.length));
          setFeaturedItem(filteredItems[randomIndex] || trendingRes.results[0]);
        }

        setTrending(trendingRes.results);
        setPopularMovies(popularMoviesRes.results);
        setPopularTVShows(popularTVRes.results);
        setTopRatedMovies(topRatedMoviesRes.results);
        setNowPlaying(nowPlayingRes.results);
      } catch (error) {
        console.error("Error fetching home data:", error);
        toast.error("Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div>
      {/* Hero section */}
      {loading ? (
        <div className="min-h-[60vh] md:min-h-[80vh] w-full bg-muted animate-pulse flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : featuredItem && (
        <FeaturedBanner item={featuredItem} />
      )}

      {/* Content rows */}
      <div className="container mx-auto px-4 pb-16">
        <MediaRow 
          title="Trending Today" 
          items={trending} 
          loading={loading} 
        />
        
        <MediaRow 
          title="Popular Movies" 
          items={popularMovies} 
          loading={loading} 
        />
        
        <MediaRow 
          title="Popular TV Shows" 
          items={popularTVShows} 
          loading={loading} 
        />
        
        <MediaRow 
          title="Top Rated Movies" 
          items={topRatedMovies} 
          loading={loading} 
        />
        
        <MediaRow 
          title="Now Playing" 
          items={nowPlaying} 
          loading={loading} 
        />
      </div>
    </div>
  );
};

export default HomePage;
