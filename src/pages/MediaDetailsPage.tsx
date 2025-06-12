
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  getMediaDetails, 
  getRecommendations, 
  DetailedMediaItem, 
  MediaItem, 
  MediaType 
} from "@/services/tmdb";
import MediaHero from "@/components/media/MediaHero";
import MediaRow from "@/components/media/MediaRow";
import EpisodeSelector from "@/components/media/EpisodeSelector";
import ServerSelector from "@/components/media/ServerSelector";
import { toast } from "sonner";

const MediaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Extract mediaType directly from URL pathname
  const mediaType = window.location.pathname.includes("/movie/") ? "movie" : "tv";
  const [item, setItem] = useState<DetailedMediaItem | null>(null);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [showServerSelector, setShowServerSelector] = useState(false);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedServerUrl, setSelectedServerUrl] = useState("");
  
  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        console.log(`Fetching details for ${mediaType} with ID: ${id}`);
        
        const [detailsData, recommendationsData] = await Promise.all([
          getMediaDetails(mediaType as MediaType, parseInt(id)),
          getRecommendations(mediaType as MediaType, parseInt(id))
        ]);
        
        console.log("Details data received:", detailsData);
        setItem(detailsData);
        setRecommendations(recommendationsData.results);

        // Fetch seasons for TV shows
        if (mediaType === "tv") {
          const seasonsResponse = await fetch(
            `https://api.themoviedb.org/3/tv/${id}?api_key=08c748f7d51cbcbf3189168114145568`
          );
          const seasonsData = await seasonsResponse.json();
          setSeasons(seasonsData.seasons || []);
        }
      } catch (error) {
        console.error("Error fetching media details:", error);
        toast.error("Failed to load content details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
    // Scroll to top when media changes
    window.scrollTo(0, 0);
  }, [mediaType, id]);

  const handleEpisodeSelect = (season: number, episode: number) => {
    console.log("Episode selected:", season, episode);
    setSelectedSeason(season);
    setSelectedEpisode(episode);
    setShowServerSelector(true);
  };

  const handleServerSelect = (serverUrl: string) => {
    console.log("Server selected with URL:", serverUrl);
    setSelectedServerUrl(serverUrl);
    setShowServerSelector(false);
    setShowPlayer(true);
  };

  if (loading || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <MediaHero 
        item={item} 
        mediaType={mediaType as MediaType}
        selectedSeason={selectedSeason}
        selectedEpisode={selectedEpisode}
        showPlayer={showPlayer}
        selectedServerUrl={selectedServerUrl}
        onPlayerClose={() => {
          setShowPlayer(false);
          setSelectedServerUrl("");
        }}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Episode selector for TV shows - moved to top */}
            {mediaType === "tv" && seasons.length > 0 && (
              <div className="mb-12">
                <EpisodeSelector
                  seasons={seasons}
                  onEpisodeSelect={handleEpisodeSelect}
                  tvShowId={parseInt(id!)}
                />
              </div>
            )}
            
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-8">
              {item.overview || "No overview available."}
            </p>
            
            {/* Cast section */}
            {item.credits?.cast && item.credits.cast.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Cast</h2>
                <div className="flex flex-wrap gap-4">
                  {item.credits.cast.slice(0, 6).map((person) => (
                    <div key={person.id} className="text-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden glass-morphism mb-2">
                        {person.profile_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No image</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-medium">{person.name}</h3>
                      <p className="text-xs text-muted-foreground">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <div className="glass-morphism rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Details</h3>
              <div className="space-y-3">
                {mediaType === "movie" ? (
                  <>
                    {item.release_date && (
                      <div>
                        <h4 className="text-sm text-muted-foreground">Release Date</h4>
                        <p>{new Date(item.release_date).toLocaleDateString()}</p>
                      </div>
                    )}
                    {item.runtime && (
                      <div>
                        <h4 className="text-sm text-muted-foreground">Runtime</h4>
                        <p>{Math.floor(item.runtime / 60)}h {item.runtime % 60}m</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {item.first_air_date && (
                      <div>
                        <h4 className="text-sm text-muted-foreground">First Air Date</h4>
                        <p>{new Date(item.first_air_date).toLocaleDateString()}</p>
                      </div>
                    )}
                    {item.episode_run_time && item.episode_run_time.length > 0 && (
                      <div>
                        <h4 className="text-sm text-muted-foreground">Episode Runtime</h4>
                        <p>~{item.episode_run_time[0]} minutes</p>
                      </div>
                    )}
                  </>
                )}
                <div>
                  <h4 className="text-sm text-muted-foreground">Rating</h4>
                  <p>{item.vote_average.toFixed(1)} / 10</p>
                </div>
                <div>
                  <h4 className="text-sm text-muted-foreground">Genres</h4>
                  <p>{item.genres.map(g => g.name).join(", ")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommendations */}
        {recommendations.length > 0 && (
          <MediaRow 
            title="You May Also Like" 
            items={recommendations.map(rec => ({ ...rec, media_type: mediaType }))} 
          />
        )}
      </div>

      {/* Server Selector for Episodes */}
      <ServerSelector
        isOpen={showServerSelector}
        onClose={() => setShowServerSelector(false)}
        onServerSelect={handleServerSelect}
        item={item}
        mediaType={mediaType as MediaType}
        season={selectedSeason}
        episode={selectedEpisode}
      />
    </div>
  );
};

export default MediaDetailsPage;
