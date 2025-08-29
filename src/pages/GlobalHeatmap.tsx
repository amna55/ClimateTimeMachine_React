// GlobalHeatmap.tsx
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/layout/Navigation";
import { Thermometer, TrendingUp, Map, Globe, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorldMapProps {
  activeLayers: {
    baseMap: boolean;
    borders: boolean;
    temperature: boolean;
    anomaly: boolean;
    absoluteAnomaly: boolean;
  };
  tileUrls: {
    lst?: string;
    anomaly?: string;
    absoluteAnomaly?: string;
  };
  year: number;
}

const WorldMap = lazy(() =>
  import("@/components/climate/GlobeVisualization.tsx") as Promise<{ default: React.FC<WorldMapProps> }>
);

type Layer = {
  id: string;
  label: string;
  icon: React.ComponentType;
  type: "data" | "control";
  mapLayer: keyof WorldMapProps["activeLayers"];
};

const layers: Layer[] = [
  { id: "lst", label: "Surface Temp", icon: Thermometer, type: "data", mapLayer: "temperature" },
  { id: "anomaly", label: "Anomaly", icon: TrendingUp, type: "data", mapLayer: "anomaly" },
  { id: "absolute_anomaly", label: "Absolute Anomaly", icon: TrendingUp, type: "data", mapLayer: "absoluteAnomaly" },
  { id: "borders", label: "Country Borders", icon: Map, type: "control", mapLayer: "borders" },
  { id: "base", label: "Base Map", icon: Globe, type: "control", mapLayer: "baseMap" },
];

const GlobalHeatmap = () => {
  const [currentYear, setCurrentYear] = useState(2025);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tileUrls, setTileUrls] = useState<{ lst?: string; anomaly?: string; absoluteAnomaly?: string }>({});
  const [activeMapLayers, setActiveMapLayers] = useState({
    baseMap: true,
    borders: true,
    temperature: true,
    anomaly: false,
    absoluteAnomaly: false,
  });

  const playbackRef = useRef<NodeJS.Timeout>();

  // Fetch tile URLs for the year
  const fetchClimateData = async (year: number) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/tiles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year }),
      });
      const data = await response.json();
      if (data.status !== "success") throw new Error(data.message || "Tile generation failed");

      // Poll for URLs
      const waitForTileUrls = async (retries = 20, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
          const resp = await fetch(`http://localhost:3000/tiles/urls?year=${year}`);
          const urls = await resp.json();
          if (urls.status === "success" && urls.data) return urls.data;
          await new Promise((r) => setTimeout(r, delay));
        }
        throw new Error("Tile URLs not available");
      };

      const urls = await waitForTileUrls();
      setTileUrls({
        lst: urls.lst_tile_url,
        anomaly: urls.anomaly_tile_url,
        absoluteAnomaly: urls.absolute_anomaly_tile_url,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const jumpToYear = async (year: number) => {
    setCurrentYear(year);
    await fetchClimateData(year);
  };

  // Playback logic
  useEffect(() => {
    if (isPlaying) {
      playbackRef.current = setInterval(() => {
        setCurrentYear((prev) => {
          const nextYear = prev + 1 > 2025 ? 2000 : prev + 1;
          jumpToYear(nextYear);
          return nextYear;
        });
      }, 1000);
    } else clearInterval(playbackRef.current);
    return () => clearInterval(playbackRef.current);
  }, [isPlaying]);

  const toggleMapLayer = (mapLayer: keyof WorldMapProps["activeLayers"]) => {
    setActiveMapLayers((prev) => ({ ...prev, [mapLayer]: !prev[mapLayer] }));
  };

  // Initial load
  useEffect(() => {
    jumpToYear(currentYear);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-8 container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Global Climate Heatmap</h1>
          <p className="text-lg text-muted-foreground">
            Interactive visualization of global temperature data from 2000 to present
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <Card className="lg:col-span-1 p-6 h-fit">
            <h3 className="font-semibold mb-4">Data Layers</h3>
            <div className="space-y-3">
              {layers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => toggleMapLayer(layer.mapLayer)}
                  className={cn(
                    "w-full flex items-center justify-between space-x-3 p-3 rounded-lg transition-all duration-300",
                    activeMapLayers[layer.mapLayer] ? "bg-primary/10 border border-primary/30 shadow-glow" : "border border-border hover:bg-muted/50",
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  )}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3">
                    <layer.icon className="h-5 w-5" />
                    <span className="font-medium">{layer.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {activeMapLayers[layer.mapLayer] ? "On" : "Off"}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Map + Slider */}
          <Card className="lg:col-span-3 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Climate Data - {currentYear}</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => jumpToYear(2000)} disabled={isLoading}>
                  <SkipBack className="h-4 w-4" /> 2000
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)} disabled={isLoading}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => jumpToYear(2025)} disabled={isLoading}>
                  2025 <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Slider
              value={[currentYear]}
              min={2000}
              max={2025}
              step={1}
              onValueChange={([val]) => setCurrentYear(val)}
              onValueCommit={([val]) => jumpToYear(val)}
              disabled={isLoading}
            />

            <div className="relative mt-4 h-[600px] rounded-lg bg-gradient-to-br from-background to-card border border-primary/20 overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center text-white text-lg font-semibold">
                  Loading tiles...
                </div>
              )}
              <Suspense fallback={<div className="h-full flex items-center justify-center">Initializing map...</div>}>
                <WorldMap activeLayers={activeMapLayers} tileUrls={tileUrls} year={currentYear} />
              </Suspense>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GlobalHeatmap;
