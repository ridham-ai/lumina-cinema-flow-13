
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

  // Enhanced scroll detection with smooth transitions
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
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
        {/* Mobile top header with enhanced glassmorphism */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/20 border-b border-white/10 shadow-2xl">
          <div className="flex items-center justify-center px-4 py-4">
            <Link to="/" className="flex items-center group">
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                LUMINA
              </h1>
            </Link>
          </div>
        </header>

        {/* Search overlay */}
        <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Mobile bottom navigation with enhanced design */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-3xl bg-black/30 border-t border-white/15 shadow-2xl safe-area-pb">
          <div className="flex items-center justify-around px-2 py-3">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center p-3 min-w-0 flex-1 transition-all duration-300 rounded-xl",
                  isActive(item.path) 
                    ? "text-white bg-white/10 shadow-lg" 
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="relative mb-1">
                  <item.icon className="h-5 w-5 transition-transform duration-300" />
                  {isActive(item.path) && (
                    <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm"></div>
                  )}
                </div>
                <span className="text-[10px] leading-none font-medium font-display">{item.label}</span>
              </Link>
            ))}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex flex-col items-center p-3 text-white/70 min-w-0 flex-1 transition-all duration-300 rounded-xl hover:text-white hover:bg-white/5"
            >
              <div className="relative mb-1">
                <Search className="h-5 w-5 transition-transform duration-300" />
              </div>
              <span className="text-[10px] leading-none font-medium font-display">Search</span>
            </button>
          </div>
        </nav>
      </>
    );
  }

  // Desktop navigation with sophisticated design
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out",
        isScrolled 
          ? "backdrop-blur-3xl bg-black/25 shadow-2xl border-b border-white/10" 
          : "backdrop-blur-xl bg-black/10"
      )}
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105">
                LUMINA
              </h1>
              <div className="absolute -inset-2 bg-gradient-to-r from-white/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </div>
          </Link>

          {/* Enhanced Main Navigation */}
          <nav className={cn(
            "relative backdrop-blur-2xl rounded-2xl px-8 py-4 transition-all duration-500 border",
            isScrolled 
              ? "bg-white/15 border-white/25 shadow-2xl" 
              : "bg-white/10 border-white/20 shadow-xl"
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-2xl"></div>
            <ul className="relative flex items-center space-x-8">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex flex-col items-center transition-all duration-300 relative group px-3 py-2 rounded-xl",
                      isActive(item.path) 
                        ? "text-white bg-white/15 shadow-lg transform scale-105" 
                        : "text-white/80 hover:text-white hover:bg-white/10 hover:scale-105"
                    )}
                  >
                    <div className="relative mb-2">
                      <item.icon className="h-5 w-5 transition-all duration-300" />
                      {isActive(item.path) && (
                        <div className="absolute -inset-2 bg-white/25 rounded-full blur-md animate-pulse"></div>
                      )}
                    </div>
                    <span className="text-xs font-semibold font-display tracking-wide">
                      {item.label}
                    </span>
                    
                    {/* Enhanced Active Indicator */}
                    <div className={cn(
                      "absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-300",
                      isActive(item.path) 
                        ? "bg-white opacity-100 shadow-lg shadow-white/50" 
                        : "opacity-0"
                    )} />
                    
                    {/* Hover Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                </li>
              ))}
              
              {/* Search Button */}
              <li>
                <button
                  onClick={() => setSearchOpen(true)}
                  className={cn(
                    "flex flex-col items-center transition-all duration-300 relative group px-3 py-2 rounded-xl",
                    searchOpen 
                      ? "text-white bg-white/15 shadow-lg transform scale-105" 
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:scale-105"
                  )}
                >
                  <div className="relative mb-2">
                    <Search className="h-5 w-5 transition-all duration-300" />
                    {searchOpen && (
                      <div className="absolute -inset-2 bg-white/25 rounded-full blur-md animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-xs font-semibold font-display tracking-wide">
                    Search
                  </span>
                  
                  <div className={cn(
                    "absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-300",
                    searchOpen 
                      ? "bg-white opacity-100 shadow-lg shadow-white/50" 
                      : "opacity-0"
                  )} />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </li>
            </ul>
          </nav>

          {/* Enhanced Right Side Element */}
          <div className="w-[120px] flex justify-end">
            <div className="relative group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/25"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search overlay */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};

export default Navbar;
