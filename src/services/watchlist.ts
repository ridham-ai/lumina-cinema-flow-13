
import { MediaItem, MediaType } from "./tmdb";

export interface WatchlistItem extends MediaItem {
  addedAt: number;
}

const WATCHLIST_KEY = "lumina_watchlist";

// Get the watchlist from localStorage
export const getWatchlist = (): WatchlistItem[] => {
  const watchlist = localStorage.getItem(WATCHLIST_KEY);
  
  if (watchlist) {
    try {
      return JSON.parse(watchlist);
    } catch (error) {
      console.error("Error parsing watchlist:", error);
      return [];
    }
  }
  
  return [];
};

// Add an item to the watchlist
export const addToWatchlist = (item: MediaItem): void => {
  const watchlist = getWatchlist();
  
  // Check if the item is already in the watchlist
  if (!watchlist.some(i => i.id === item.id)) {
    const watchlistItem: WatchlistItem = {
      ...item,
      addedAt: Date.now()
    };
    
    watchlist.push(watchlistItem);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }
};

// Remove an item from the watchlist
export const removeFromWatchlist = (id: number): void => {
  const watchlist = getWatchlist();
  const updatedWatchlist = watchlist.filter(item => item.id !== id);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
};

// Check if an item is in the watchlist
export const isInWatchlist = (id: number): boolean => {
  const watchlist = getWatchlist();
  return watchlist.some(item => item.id === id);
};
