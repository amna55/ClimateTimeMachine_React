import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import SearchBar from "@/components/climate/SearchBar";
import TemperatureDisplay from "@/components/climate/TemperatureDisplay";
import { MapPin, TrendingUp, AlertTriangle, Thermometer, Building2, TreePine } from "lucide-react";

const CityAnalysis = () => {
  const [selectedCity, setSelectedCity] = useState("New York");

  const cityData = {
    name: "New York, NY",
    coordinates: "40.7128°N, 74.0060°W",
    currentTemp: 28.5,
    previousTemp: 26.1,
    risk: {
      current: 7.2,
      future2050: 8.9
    },
    trends: [
      { key: 'summer_temps', value: 26.8, change: '+2.1°C since 1990', color: 'text-temp-hot' },
      { key: 'heatwave_days', value: 12, change: '+8 days since 1990', color: 'text-temp-extreme' },
      { key: 'urban_heat', value: 4.3, change: '+1.7°C UHI effect', color: 'text-temp-warm' }
    ],
    benchmarks: [
      { city: 'Paris', risk: 6.8 },
      { city: 'Singapore', risk: 9.1 },
      { city: 'London', risk: 5.4 }
    ]
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 3) return 'text-temp-cool';
    if (risk <= 6) return 'text-temp-moderate';
    if (risk <= 8) return 'text-temp-warm';
    return 'text-temp-extreme';
  };

  const getRiskBadge = (risk: number) => {
    if (risk <= 3) return { label: 'Low Risk', color: 'bg-temp-cool/20 text-temp-cool border-temp-cool' };
    if (risk <= 6) return { label: 'Moderate Risk', color: 'bg-temp-moderate/20 text-temp-moderate border-temp-moderate' };
    if (risk <= 8) return { label: 'High Risk', color: 'bg-temp-warm/20 text-temp-warm border-temp-warm' };
    return { label: 'Extreme Risk', color: 'bg-temp-extreme/20 text-temp-extreme border-temp-extreme' };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">City Climate Analysis</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Deep dive into local climate patterns and microclimate analysis
            </p>
            
            <div className="max-w-md">
              <SearchBar 
                placeholder="Search for a city..."
                onSearch={(city) => setSelectedCity(city)}
              />
            </div>
          </div>

          {/* City Header */}
          <Card className="mb-6 p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{cityData.name}</h2>
                  <p className="text-muted-foreground">{cityData.coordinates}</p>
                </div>
              </div>
              <TemperatureDisplay
                current={cityData.currentTemp}
                previous={cityData.previousTemp}
                location="Current"
                size="lg"
              />
            </div>
          </Card>

          {/* Three-Panel Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Microclimate Map */}
            <Card className="lg:col-span-2 p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Thermometer className="mr-2 h-5 w-5 text-temp-hot" />
                Microclimate Map
              </h3>
              
              <div className="relative h-[400px] bg-gradient-to-br from-temp-cool/20 to-temp-hot/20 rounded-lg border border-primary/20 mb-4">
                {/* Mock heatmap visualization */}
                <div className="absolute inset-4 grid grid-cols-8 grid-rows-6 gap-1">
                  {Array.from({ length: 48 }).map((_, i) => {
                    const intensity = Math.random();
                    const tempColor = intensity > 0.7 ? 'bg-temp-extreme' : 
                                    intensity > 0.5 ? 'bg-temp-hot' :
                                    intensity > 0.3 ? 'bg-temp-warm' : 'bg-temp-cool';
                    return (
                      <div
                        key={i}
                        className={`${tempColor} rounded-sm opacity-60 hover:opacity-100 transition-opacity cursor-pointer`}
                        title={`${(intensity * 40).toFixed(1)}°C`}
                      />
                    );
                  })}
                </div>
                
                {/* Mock overlays */}
                <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded p-2 text-xs">
                  <div className="flex items-center space-x-1 mb-1">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span>Urban Areas</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TreePine className="h-3 w-3 text-temp-moderate" />
                    <span>Parks & Green Spaces</span>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                High-resolution 1km Land Surface Temperature grid with building and park overlays from OpenStreetMap
              </div>
            </Card>

            {/* Right Panel */}
            <div className="space-y-6">
              
              {/* Trend Dashboard */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-temp-warm" />
                  Trends
                </h3>
                
                <div className="space-y-4">
                  {cityData.trends.map((trend, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {trend.key === 'summer_temps' && 'June-Aug Avg'}
                          {trend.key === 'heatwave_days' && '>35°C Days'}
                          {trend.key === 'urban_heat' && 'Urban Heat Island'}
                        </span>
                        <span className={`text-lg font-bold ${trend.color}`}>
                          {trend.value}{trend.key === 'summer_temps' ? '°C' : 
                                     trend.key === 'heatwave_days' ? ' days' : '°C'}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">{trend.change}</div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            trend.key === 'summer_temps' ? 'bg-temp-hot' :
                            trend.key === 'heatwave_days' ? 'bg-temp-extreme' : 'bg-temp-warm'
                          }`}
                          style={{ width: `${(trend.value / (trend.key === 'heatwave_days' ? 30 : 45)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Risk Assessment */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-temp-extreme" />
                  Risk Assessment
                </h3>
                
                <div className="space-y-6">
                  {/* Current Risk */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Current Risk</span>
                      <Badge className={getRiskBadge(cityData.risk.current).color}>
                        {getRiskBadge(cityData.risk.current).label}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted/30 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-gradient-heat transition-all duration-500"
                          style={{ width: `${(cityData.risk.current / 10) * 100}%` }}
                        />
                      </div>
                      <span className={`text-lg font-bold ${getRiskColor(cityData.risk.current)}`}>
                        {cityData.risk.current}/10
                      </span>
                    </div>
                  </div>

                  {/* 2050 Projection */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">2050 Projection</span>
                      <Badge className={getRiskBadge(cityData.risk.future2050).color}>
                        {getRiskBadge(cityData.risk.future2050).label}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted/30 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-gradient-heat transition-all duration-500"
                          style={{ width: `${(cityData.risk.future2050 / 10) * 100}%` }}
                        />
                      </div>
                      <span className={`text-lg font-bold ${getRiskColor(cityData.risk.future2050)}`}>
                        {cityData.risk.future2050}/10
                      </span>
                    </div>
                  </div>

                  {/* Benchmarks */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Compare with other cities</h4>
                    <div className="space-y-2">
                      {cityData.benchmarks.map((benchmark, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{benchmark.city}</span>
                          <span className={`font-medium ${getRiskColor(benchmark.risk)}`}>
                            {benchmark.risk}/10
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityAnalysis;