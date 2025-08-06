import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Navigation from "@/components/layout/Navigation";
import GlobeVisualization from "@/components/climate/GlobeVisualization";
import { Thermometer, TrendingUp, Building, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

const GlobalHeatmap = () => {
  const [selectedLayer, setSelectedLayer] = useState("lst");
  const [currentYear, setCurrentYear] = useState([2023]);
  const [isPlaying, setIsPlaying] = useState(false);

  const layers = [
    { id: "lst", label: "Surface Temp", icon: Thermometer, color: "text-temp-hot" },
    { id: "anomaly", label: "vs 20th C.", icon: TrendingUp, color: "text-temp-cool" },
    { id: "uhi", label: "Urban Heat", icon: Building, color: "text-temp-extreme" },
  ];

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // In real implementation, this would control timeline animation
  };

  const jumpToYear = (year: number) => {
    setCurrentYear([year]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Global Climate Heatmap</h1>
            <p className="text-lg text-muted-foreground">
              Interactive visualization of global temperature data from 1940 to present
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-4 gap-6">
            
            {/* Layer Controls */}
            <Card className="lg:col-span-1 p-6 h-fit">
              <h3 className="font-semibold mb-4">Data Layers</h3>
              <div className="space-y-3">
                {layers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer.id)}
                    className={cn(
                      "w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300",
                      selectedLayer === layer.id
                        ? "bg-primary/10 border border-primary/30 shadow-glow"
                        : "border border-border hover:bg-muted/50"
                    )}
                  >
                    <layer.icon className={cn("h-5 w-5", layer.color)} />
                    <span className="font-medium">{layer.label}</span>
                  </button>
                ))}
              </div>

              {/* Layer Info */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Current Layer</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedLayer === "lst" && "Land Surface Temperature data from satellite measurements"}
                  {selectedLayer === "anomaly" && "Temperature difference from 20th century average"}
                  {selectedLayer === "uhi" && "Urban Heat Island intensity in major cities"}
                </p>
              </div>
            </Card>

            {/* Globe Visualization */}
            <div className="lg:col-span-3">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">
                    Climate Data - {currentYear[0]}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="w-3 h-3 rounded-full bg-temp-cold"></div>
                    <span>Cold</span>
                    <div className="w-3 h-3 rounded-full bg-temp-moderate"></div>
                    <span>Moderate</span>
                    <div className="w-3 h-3 rounded-full bg-temp-hot"></div>
                    <span>Hot</span>
                    <div className="w-3 h-3 rounded-full bg-temp-extreme"></div>
                    <span>Extreme</span>
                  </div>
                </div>
                
                <div className="relative">
                  <GlobeVisualization className="h-[600px] rounded-lg bg-gradient-to-br from-background to-card border border-primary/20" />
                  
                  {/* Overlay Stats */}
                  <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
                    <h4 className="font-semibold text-sm mb-2">Current Layer: {layers.find(l => l.id === selectedLayer)?.label}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Global Avg:</span>
                        <span className="text-temp-warm font-medium">15.2°C</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Anomaly:</span>
                        <span className="text-temp-hot font-medium">+1.1°C</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Time Machine Controls */}
          <Card className="mt-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Time Machine</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => jumpToYear(1940)}
                  className="border-primary/30"
                >
                  <SkipBack className="h-4 w-4" />
                  1940
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayback}
                  className="border-primary/30"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => jumpToYear(2023)}
                  className="border-primary/30"
                >
                  2023
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>1940</span>
                <span className="font-semibold text-foreground">Year: {currentYear[0]}</span>
                <span>2023</span>
              </div>
              
              <Slider
                value={currentYear}
                onValueChange={setCurrentYear}
                min={1940}
                max={2023}
                step={1}
                className="w-full"
              />

              <div className="grid grid-cols-4 gap-2 mt-4">
                {[1950, 1980, 2000, 2020].map((year) => (
                  <button
                    key={year}
                    onClick={() => jumpToYear(year)}
                    className="px-3 py-2 text-sm rounded-md border border-border hover:bg-muted/50 transition-colors"
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                Drag the slider or use playback controls to explore climate data across decades. 
                Playback speed: 5 years per second.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GlobalHeatmap;