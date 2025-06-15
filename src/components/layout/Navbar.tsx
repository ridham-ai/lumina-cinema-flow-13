
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
  const [backgroundBrightness, setBackgroundBrightness] = useState(0.5);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => location.pathname === path;

  // Analyze background brightness to adjust navbar transparency
  useEffect(() => {
    const analyzeBackground = () => {
      const heroSection = document.querySelector('[class*="banner"], [class*="hero"], .featured-content');
      if (heroSection) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = heroSection.querySelector('img');
        
        if (img && img.complete) {
          canvas.width = 100;
          canvas.height = 100;
          ctx?.drawImage(img, 0, 0, 100, 100);
          
          try {
            const imageData = ctx?.getImageData(0, 0, 100, 100);
            if (imageData) {
              let brightness = 0;
              for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];
                brightness += (r * 0.299 + g * 0.587 + b * 0.114) / 255;
              }
              const avgBrightness = brightness / (imageData.data.length / 4);
              setBackgroundBrightness(avgBrightness);
            }
          } catch (error) {
            // Fallback if canvas analysis fails
            setBackgroundBrightness(0.5);
          }
        }
      }
    };

    // Analyze on component mount and when images load
    analyzeBackground();
    
    // Re-analyze when new images load
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.complete) {
        analyzeBackground();
      } else {
        img.addEventListener('load', analyzeBackground);
      }
    });

    return () => {
      images.forEach(img => {
        img.removeEventListener('load', analyzeBackground);
      });
    };
  }, [location.pathname]);

  // Check if page is scrolled to add background to navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate adaptive transparency based on background brightness
  const getAdaptiveStyles = () => {
    const isDarkBackground = backgroundBrightness < 0.4;
    const isBrightBackground = backgroundBrightness > 0.7;
    
    if (isScrolled) {
      return isDarkBackground 
        ? "adaptive-nav-dark-scrolled"
        : isBrightBackground 
        ? "adaptive-nav-bright-scrolled"
        : "adaptive-nav-medium-scrolled";
    } else {
      return isDarkBackground 
        ? "adaptive-nav-dark"
        : isBrightBackground 
        ? "adaptive-nav-bright"
        : "adaptive-nav-medium";
    }
  };

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
        {/* Mobile top header */}
        <header className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b border-white/10 transition-all duration-500",
          getAdaptiveStyles()
        )}>
          <div className="flex items-center justify-center px-4 py-3">
            <Link to="/" className="flex items-center">
              <h1 className="text-lg font-bold text-gradient">LUMINA</h1>
            </Link>
          </div>
        </header>

        {/* Search overlay */}
        <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Mobile bottom navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-white/10 safe-area-pb">
          <div className="flex items-center justify-around px-2 py-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center p-2 min-w-0 flex-1",
                  isActive(item.path) ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-[10px] leading-none">{item.label}</span>
                {isActive(item.path) && (
                  <div className="absolute bottom-1 h-1 w-1 rounded-full bg-primary"></div>
                )}
              </Link>
            ))}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex flex-col items-center p-2 text-muted-foreground min-w-0 flex-1"
            >
              <Search className="h-5 w-5 mb-1" />
              <span className="text-[10px] leading-none">Search</span>
            </button>
          </div>
        </nav>
      </>
    );
  }

  // Desktop navigation
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        getAdaptiveStyles()
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-gradient">LUMINA</h1>
          </Link>

          {/* Main Navigation */}
          <nav className={cn(
            "adaptive-nav-glass rounded-full px-4 md:px-8 py-3 transition-all duration-300"
          )}>
            <ul className="flex items-center space-x-4 md:space-x-10">
              <li>
                <Link
                  to="/"
                  className={cn(
                    "flex flex-col items-center transition-all duration-300 relative",
                    isActive("/") ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <div className={cn(
                    "absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all",
                    isActive("/") ? "bg-primary opacity-100" : "opacity-0"
                  )} />
                  <Home className="h-5 w-5" />
                  <span className="text-xs mt-1 font-medium">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/movies"
                  className={cn(
                    "flex flex-col items-center transition-all duration-300 relative",
                    isActive("/movies") ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <div className={cn(
                    "absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all",
                    isActive("/movies") ? "bg-primary opacity-100" : "opacity-0"
                  )} />
                  <Film className="h-5 w-5" />
                  <span className="text-xs mt-1 font-medium">Movies</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/tv"
                  className={cn(
                    "flex flex-col items-center transition-all duration-300 relative",
                    isActive("/tv") ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <div className={cn(
                    "absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all",
                    isActive("/tv") ? "bg-primary opacity-100" : "opacity-0"
                  )} />
                  <Tv className="h-5 w-5" />
                  <span className="text-xs mt-1 font-medium">TV Shows</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/watchlist"
                  className={cn(
                    "flex flex-col items-center transition-all duration-300 relative",
                    isActive("/watchlist") ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <div className={cn(
                    "absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all",
                    isActive("/watchlist") ? "bg-primary opacity-100" : "opacity-0"
                  )} />
                  <BookmarkPlus className="h-5 w-5" />
                  <span className="text-xs mt-1 font-medium">Watchlist</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setSearchOpen(true)}
                  className={cn(
                    "flex flex-col items-center transition-all duration-300 relative",
                    searchOpen ? "text-primary scale-110" : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <div className={cn(
                    "absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all",
                    searchOpen ? "bg-primary opacity-100" : "opacity-0"
                  )} />
                  <Search className="h-5 w-5" />
                  <span className="text-xs mt-1 font-medium">Search</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Right side - could add user profile or additional actions here */}
          <div className="w-[100px]">
            {/* Placeholder to balance the layout */}
          </div>
        </div>
      </div>
      
      {/* Search overlay */}
      <SearchBar isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
};

export default Navbar;
