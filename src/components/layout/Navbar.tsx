
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Film, Tv, BookmarkPlus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import SearchBar from "../search/SearchBar";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => location.pathname === path;

  // Check if page is scrolled to add background to navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items shared between mobile and desktop
  const navigationItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/movies", icon: Film, label: "Movies" },
    { path: "/tv", icon: Tv, label: "TV Shows" },
    { path: "/watchlist", icon: BookmarkPlus, label: "Watchlist" },
  ];

  // Mobile navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile top header with liquid glass effect */}
        <header className="fixed top-0 left-0 right-0 z-50 liquid-glass border-b border-white/20">
          <div className="flex items-center justify-center px-4 py-3">
            <Link to="/" className="flex items-center">
              <h1 className="text-lg font-bold text-gradient liquid-text">LUMINA</h1>
            </Link>
          </div>
        </header>

        {/* Search overlay */}
        <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Mobile bottom navigation with liquid glass effect */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 liquid-glass-bottom border-t border-white/20 safe-area-pb">
          <div className="flex items-center justify-around px-2 py-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center p-3 min-w-0 flex-1 transition-all duration-500 liquid-nav-item",
                  isActive(item.path) ? "text-primary liquid-active" : "text-muted-foreground hover:text-primary"
                )}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5 mb-1 transition-transform duration-300" />
                  {isActive(item.path) && (
                    <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md animate-pulse"></div>
                  )}
                </div>
                <span className="text-[10px] leading-none font-medium">{item.label}</span>
                {isActive(item.path) && (
                  <div className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-primary liquid-indicator"></div>
                )}
              </Link>
            ))}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex flex-col items-center p-3 text-muted-foreground min-w-0 flex-1 transition-all duration-500 liquid-nav-item hover:text-primary"
            >
              <div className="relative">
                <Search className="h-5 w-5 mb-1 transition-transform duration-300" />
              </div>
              <span className="text-[10px] leading-none font-medium">Search</span>
            </button>
          </div>
        </nav>
      </>
    );
  }

  // Desktop navigation with enhanced liquid glass design
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
        isScrolled ? "liquid-glass-header backdrop-blur-3xl" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo with liquid effect */}
          <Link to="/" className="flex items-center group">
            <h1 className="text-2xl font-bold text-gradient liquid-text group-hover:scale-105 transition-transform duration-300">
              LUMINA
            </h1>
          </Link>

          {/* Main Navigation with enhanced liquid glass */}
          <nav className={cn(
            "liquid-glass-nav rounded-full px-6 md:px-10 py-4 transition-all duration-500 hover:scale-105",
            isScrolled ? "shadow-2xl bg-white/15 border border-white/30" : "bg-white/10 border border-white/20"
          )}>
            <ul className="flex items-center space-x-6 md:space-x-12">
              <li>
                <Link
                  to="/"
                  className={cn(
                    "flex flex-col items-center transition-all duration-500 relative liquid-nav-item group",
                    isActive("/") ? "text-primary scale-110 liquid-active" : "text-muted-foreground hover:text-primary hover:scale-105"
                  )}
                >
                  <div className={cn(
                    "absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-500 liquid-indicator",
                    isActive("/") ? "bg-primary opacity-100 shadow-lg shadow-primary/50" : "opacity-0"
                  )} />
                  <div className="relative">
                    <Home className="h-5 w-5 transition-all duration-300" />
                    {isActive("/") && (
                      <div className="absolute -inset-3 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-xs mt-2 font-semibold liquid-text">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/movies"
                  className={cn(
                    "flex flex-col items-center transition-all duration-500 relative liquid-nav-item group",
                    isActive("/movies") ? "text-primary scale-110 liquid-active" : "text-muted-foreground hover:text-primary hover:scale-105"
                  )}
                >
                  <div className={cn(
                    "absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-500 liquid-indicator",
                    isActive("/movies") ? "bg-primary opacity-100 shadow-lg shadow-primary/50" : "opacity-0"
                  )} />
                  <div className="relative">
                    <Film className="h-5 w-5 transition-all duration-300" />
                    {isActive("/movies") && (
                      <div className="absolute -inset-3 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-xs mt-2 font-semibold liquid-text">Movies</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/tv"
                  className={cn(
                    "flex flex-col items-center transition-all duration-500 relative liquid-nav-item group",
                    isActive("/tv") ? "text-primary scale-110 liquid-active" : "text-muted-foreground hover:text-primary hover:scale-105"
                  )}
                >
                  <div className={cn(
                    "absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-500 liquid-indicator",
                    isActive("/tv") ? "bg-primary opacity-100 shadow-lg shadow-primary/50" : "opacity-0"
                  )} />
                  <div className="relative">
                    <Tv className="h-5 w-5 transition-all duration-300" />
                    {isActive("/tv") && (
                      <div className="absolute -inset-3 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-xs mt-2 font-semibold liquid-text">TV Shows</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/watchlist"
                  className={cn(
                    "flex flex-col items-center transition-all duration-500 relative liquid-nav-item group",
                    isActive("/watchlist") ? "text-primary scale-110 liquid-active" : "text-muted-foreground hover:text-primary hover:scale-105"
                  )}
                >
                  <div className={cn(
                    "absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-500 liquid-indicator",
                    isActive("/watchlist") ? "bg-primary opacity-100 shadow-lg shadow-primary/50" : "opacity-0"
                  )} />
                  <div className="relative">
                    <BookmarkPlus className="h-5 w-5 transition-all duration-300" />
                    {isActive("/watchlist") && (
                      <div className="absolute -inset-3 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-xs mt-2 font-semibold liquid-text">Watchlist</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setSearchOpen(true)}
                  className={cn(
                    "flex flex-col items-center transition-all duration-500 relative liquid-nav-item group",
                    searchOpen ? "text-primary scale-110 liquid-active" : "text-muted-foreground hover:text-primary hover:scale-105"
                  )}
                >
                  <div className={cn(
                    "absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-500 liquid-indicator",
                    searchOpen ? "bg-primary opacity-100 shadow-lg shadow-primary/50" : "opacity-0"
                  )} />
                  <div className="relative">
                    <Search className="h-5 w-5 transition-all duration-300" />
                    {searchOpen && (
                      <div className="absolute -inset-3 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-xs mt-2 font-semibold liquid-text">Search</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Right side placeholder with liquid effect */}
          <div className="w-[100px] flex justify-end">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20"></div>
          </div>
        </div>
      </div>
      
      {/* Search overlay */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};

export default Navbar;
