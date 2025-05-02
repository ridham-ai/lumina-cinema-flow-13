
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Film, Tv, BookmarkPlus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchBar from "../search/SearchBar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Check if page is scrolled to add background to navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass-morphism" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-gradient">LUMINA</h1>
        </Link>

        <nav className="glass-morphism rounded-full px-6 py-2">
          <ul className="flex items-center space-x-8">
            <li>
              <Link
                to="/"
                className={cn(
                  "flex flex-col items-center transition-all duration-300",
                  isActive("/") ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Home className="h-5 w-5" />
                <span className="text-xs mt-1">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/movies"
                className={cn(
                  "flex flex-col items-center transition-all duration-300",
                  isActive("/movies") ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Film className="h-5 w-5" />
                <span className="text-xs mt-1">Movies</span>
              </Link>
            </li>
            <li>
              <Link
                to="/tv"
                className={cn(
                  "flex flex-col items-center transition-all duration-300",
                  isActive("/tv") ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Tv className="h-5 w-5" />
                <span className="text-xs mt-1">TV Shows</span>
              </Link>
            </li>
            <li>
              <Link
                to="/watchlist"
                className={cn(
                  "flex flex-col items-center transition-all duration-300",
                  isActive("/watchlist") ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                <BookmarkPlus className="h-5 w-5" />
                <span className="text-xs mt-1">Watchlist</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "flex flex-col items-center transition-all duration-300",
                  searchOpen ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                <Search className="h-5 w-5" />
                <span className="text-xs mt-1">Search</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Search overlay */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};

export default Navbar;
