
import React, { useState } from "react";
import { Play, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold">Episodes</h2>
        <Select value={selectedSeason.toString()} onValueChange={handleSeasonChange}>
          <SelectTrigger className="w-48 glass-morphism">
            <SelectValue placeholder="Select Season" />
          </SelectTrigger>
          <SelectContent>
            {seasons.map((season) => (
              <SelectItem key={season.id} value={season.season_number.toString()}>
                {season.name || `Season ${season.season_number}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="glass-morphism rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => handleEpisodeClick(episode.episode_number)}
            >
              <div className="relative aspect-video">
                <img
                  src={
                    getImageUrl(episode.still_path, "w500") ||
                    "/placeholder.svg"
                  }
                  alt={episode.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button size="icon" className="rounded-full">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  Episode {episode.episode_number}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm mb-1 line-clamp-1">
                  {episode.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {episode.overview || "No description available"}
                </p>
                {episode.air_date && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(episode.air_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EpisodeSelector;
