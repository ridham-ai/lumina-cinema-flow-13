
const API_KEY = "08c748f7d51cbcbf3189168114145568";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export type MediaType = "movie" | "tv";

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: MediaType;
  genre_ids: number[];
}

export interface DetailedMediaItem extends MediaItem {
  runtime?: number;
  episode_run_time?: number[];
  genres: { id: number; name: string }[];
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos?: {
    results: Video[];
  };
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

// Helper function to fetch data from the TMDB API
const fetchFromTMDB = async <T>(endpoint: string, params?: Record<string, string>): Promise<T> => {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });

  const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status}`);
  }

  return response.json();
};

// Get image URL with specified size
export const getImageUrl = (path: string | null, size: string = "original"): string | null => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Get trending movies and TV shows
export const getTrending = async (mediaType: "all" | MediaType = "all", timeWindow: "day" | "week" = "week") => {
  return fetchFromTMDB<{ results: MediaItem[] }>(`/trending/${mediaType}/${timeWindow}`);
};

// Get popular movies
export const getPopularMovies = async () => {
  return fetchFromTMDB<{ results: MediaItem[] }>("/movie/popular");
};

// Get popular TV shows
export const getPopularTVShows = async () => {
  return fetchFromTMDB<{ results: MediaItem[] }>("/tv/popular");
};

// Get movie or TV show details
export const getMediaDetails = async (mediaType: MediaType, id: number) => {
  return fetchFromTMDB<DetailedMediaItem>(
    `/${mediaType}/${id}`, 
    { append_to_response: "videos,credits" }
  );
};

// Search movies and TV shows
export const searchMedia = async (query: string, page: number = 1) => {
  return fetchFromTMDB<{ results: MediaItem[]; total_results: number; total_pages: number }>(
    "/search/multi", 
    { query, page: page.toString() }
  );
};

// Get movie recommendations
export const getRecommendations = async (mediaType: MediaType, id: number) => {
  return fetchFromTMDB<{ results: MediaItem[] }>(`/${mediaType}/${id}/recommendations`);
};

// Get genres
export const getGenres = async (mediaType: MediaType) => {
  return fetchFromTMDB<{ genres: Genre[] }>(`/genre/${mediaType}/list`);
};

// Get media by genre
export const getMediaByGenre = async (mediaType: MediaType, genreId: number, page: number = 1) => {
  return fetchFromTMDB<{ results: MediaItem[]; total_results: number; total_pages: number }>(
    `/discover/${mediaType}`, 
    { with_genres: genreId.toString(), page: page.toString() }
  );
};

// Get now playing movies
export const getNowPlayingMovies = async () => {
  return fetchFromTMDB<{ results: MediaItem[] }>("/movie/now_playing");
};

// Get top rated
export const getTopRated = async (mediaType: MediaType) => {
  return fetchFromTMDB<{ results: MediaItem[] }>(`/${mediaType}/top_rated`);
};

// Get upcoming movies
export const getUpcomingMovies = async () => {
  return fetchFromTMDB<{ results: MediaItem[] }>("/movie/upcoming");
};

// Get on the air TV shows
export const getOnTheAirTVShows = async () => {
  return fetchFromTMDB<{ results: MediaItem[] }>("/tv/on_the_air");
};
