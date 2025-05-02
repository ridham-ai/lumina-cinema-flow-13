
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md glass-morphism rounded-lg p-8">
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <p className="text-xl mb-6">Oops! This destination doesn't exist</p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for might have been removed or is temporarily unavailable.
        </p>
        <Button asChild className="rounded-full">
          <Link to="/">
            <Home className="h-4 w-4 mr-2" /> Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
