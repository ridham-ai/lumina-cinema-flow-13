
import React from "react";
import { Play, X, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ServerSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onServerSelect: (serverUrl: string) => void;
  item: {
    id: number;
    title?: string;
    name?: string;
  };
  mediaType: "movie" | "tv";
  season?: number;
  episode?: number;
}

const ServerSelector: React.FC<ServerSelectorProps> = ({
  isOpen,
  onClose,
  onServerSelect,
  item,
  mediaType,
  season = 1,
  episode = 1,
}) => {
  const servers = [
    {
      id: 1,
      name: "Server 1 (Vidora)",
      description: "Primary streaming server",
      getUrl: () => {
        if (mediaType === "movie") {
          return `https://vidora.su/movie/${item.id}`;
        } else {
          return `https://vidora.su/tv/${item.id}/${season}/${episode}`;
        }
      },
    },
    {
      id: 2,
      name: "Server 2 (Videasy)",
      description: "Alternative streaming server",
      getUrl: () => {
        if (mediaType === "movie") {
          return `https://player.videasy.net/movie/${item.id}`;
        } else {
          return `https://player.videasy.net/tv/${item.id}/${season}/${episode}?nextEpisode=true&episodeSelector=true`;
        }
      },
    },
    {
      id: 3,
      name: "Server 3 (AutoEmbed)",
      description: "High quality streaming",
      getUrl: () => {
        if (mediaType === "movie") {
          return `https://player.autoembed.cc/embed/movie/${item.id}`;
        } else {
          return `https://player.autoembed.cc/embed/tv/${item.id}/${season}/${episode}`;
        }
      },
    },
    {
      id: 4,
      name: "Server 4 (VidLink)",
      description: "Fast streaming server",
      getUrl: () => {
        if (mediaType === "movie") {
          return `https://vidlink.pro/movie/${item.id}`;
        } else {
          return `https://vidlink.pro/tv/${item.id}/${season}/${episode}`;
        }
      },
    },
  ];

  const handleServerSelect = (server: typeof servers[0]) => {
    const url = server.getUrl();
    onServerSelect(url);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Select Streaming Server
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Choose a server to watch {item.title || item.name}
          </p>
          
          <div className="space-y-2">
            {servers.map((server) => (
              <Button
                key={server.id}
                variant="outline"
                className="w-full justify-start h-auto p-4 hover:bg-primary/5"
                onClick={() => handleServerSelect(server)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <Play className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{server.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {server.description}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServerSelector;
