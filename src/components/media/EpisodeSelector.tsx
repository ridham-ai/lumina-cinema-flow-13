
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {episodes.map((episode) => (
            <Card
              key={episode.id}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-br from-black/30 via-black/20 to-transparent backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50"
              onClick={() => handleEpisodeClick(episode.episode_number)}
            >
              {/* Episode Thumbnail */}
              <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                <img
                  src={
                    getImageUrl(episode.still_path, "w500") ||
                    "/placeholder.svg"
                  }
                  alt={episode.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border border-white/40 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="h-8 w-8 text-white fill-white drop-shadow-lg" />
                  </div>
                </div>
                
                {/* Episode Number Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm text-white text-sm font-bold px-4 py-2 rounded-full border border-white/30 shadow-lg">
                  Episode {episode.episode_number}
                </div>
                
                {/* Runtime Badge */}
                {episode.runtime && (
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-full border border-white/20 flex items-center gap-2 shadow-lg">
                    <Clock className="h-4 w-4" />
                    {episode.runtime}min
                  </div>
                )}
              </div>
              
              {/* Episode Content */}
              <CardContent className="p-6 space-y-4">
                {/* Title and Air Date */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xl text-white line-clamp-2 group-hover:text-blue-300 transition-colors duration-300 leading-tight">
                    {episode.name}
                  </h3>
                  
                  {episode.air_date && (
                    <div className="flex items-center gap-2 text-white/60">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {new Date(episode.air_date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Overview */}
                {episode.overview && (
                  <p className="text-white/80 text-sm line-clamp-3 leading-relaxed">
                    {episode.overview}
                  </p>
                )}
                
                {/* Watch Button */}
                <div className="pt-4">
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEpisodeClick(episode.episode_number);
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Watch Now
                  </Button>
                </div>
              </CardContent>

              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </Card>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!loading && episodes.length === 0 && (
        <div className="text-center py-20">
          <div className="glass-morphism rounded-2xl p-12 max-w-md mx-auto border border-white/10">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-white/10 to-white/5 rounded-full flex items-center justify-center border border-white/20">
              <Play className="h-10 w-10 text-white/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Episodes Found</h3>
            <p className="text-white/70 leading-relaxed">
              Episodes for this season are not available at the moment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodeSelector;
