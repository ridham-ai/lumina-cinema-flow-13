
import React, { useState } from "react";
import { Play, ChevronDown, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/services/tmdb";

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime?: number;
}

interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  episodes?: Episode[];
}

interface EpisodeSelectorProps {
  seasons: Season[];
  onEpisodeSelect: (season: number, episode: number) => void;
  tvShowId: number;
}

const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  seasons,
  onEpisodeSelect,
  tvShowId,
}) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch episodes for selected season
  const fetchSeasonDetails = async (seasonNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${tvShowId}/season/${seasonNumber}?api_key=08c748f7d51cbcbf3189168114145568`
      );
      const data = await response.json();
      setEpisodes(data.episodes || []);
    } catch (error) {
      console.error("Error fetching season details:", error);
      setEpisodes([]);
    } finally {
      setLoading(false);
    }
  };

  // Load first season episodes on mount
  React.useEffect(() => {
    if (seasons.length > 0) {
      fetchSeasonDetails(1);
    }
  }, [tvShowId, seasons]);

  const handleSeasonChange = (seasonNumber: string) => {
    const season = parseInt(seasonNumber);
    setSelectedSeason(season);
    fetchSeasonDetails(season);
  };

  const handleEpisodeClick = (episodeNumber: number) => {
    onEpisodeSelect(selectedSeason, episodeNumber);
  };

  if (seasons.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Episodes
          </h2>
          <p className="text-muted-foreground mt-1">
            {episodes.length} episodes available
          </p>
        </div>
        
        <div className="sm:ml-auto">
          <Select value={selectedSeason.toString()} onValueChange={handleSeasonChange}>
            <SelectTrigger className="w-64 h-12 glass-morphism border-white/20 bg-white/5 backdrop-blur-xl">
              <SelectValue placeholder="Select Season" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 backdrop-blur-xl border-white/20">
              {seasons.map((season) => (
                <SelectItem 
                  key={season.id} 
                  value={season.season_number.toString()}
                  className="text-white hover:bg-white/10"
                >
                  {season.name || `Season ${season.season_number}`}
                  <span className="ml-2 text-xs text-white/60">
                    ({season.episode_count} episodes)
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Episodes Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full" />
            <p className="text-muted-foreground">Loading episodes...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {episodes.map((episode) => (
            <Card
              key={episode.id}
              className="group cursor-pointer bg-black/20 backdrop-blur-xl border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden"
              onClick={() => handleEpisodeClick(episode.episode_number)}
            >
              {/* Episode Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={
                    getImageUrl(episode.still_path, "w500") ||
                    "/placeholder.svg"
                  }
                  alt={episode.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
                    <Play className="h-6 w-6 text-white fill-white" />
                  </div>
                </div>
                
                {/* Episode Number Badge */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">
                  Ep {episode.episode_number}
                </div>
                
                {/* Runtime Badge */}
                {episode.runtime && (
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded border border-white/20 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {episode.runtime}m
                  </div>
                )}
              </div>
              
              {/* Episode Info */}
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors">
                    {episode.name}
                  </h3>
                  
                  {episode.air_date && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-white/60">
                      <Calendar className="h-3 w-3" />
                      {new Date(episode.air_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  )}
                </div>
                
                {episode.overview && (
                  <p className="text-sm text-white/70 line-clamp-3 leading-relaxed">
                    {episode.overview}
                  </p>
                )}
                
                {/* Watch Button */}
                <div className="pt-2">
                  <Button 
                    size="sm" 
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEpisodeClick(episode.episode_number);
                    }}
                  >
                    <Play className="h-3 w-3 mr-2" />
                    Watch Episode
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!loading && episodes.length === 0 && (
        <div className="text-center py-16">
          <div className="glass-morphism rounded-xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
              <Play className="h-8 w-8 text-white/60" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Episodes Found</h3>
            <p className="text-white/60">
              Episodes for this season are not available at the moment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeSelector;
