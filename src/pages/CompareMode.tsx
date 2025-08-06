import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/layout/Navigation";
import SearchBar from "@/components/climate/SearchBar";
import TemperatureDisplay from "@/components/climate/TemperatureDisplay";
import { GitCompare, Plus, BarChart3, MapPin } from "lucide-react";

const CompareMode = () => {
  const [selectedCities, setSelectedCities] = useState(["Tokyo", "London"]);

  const cityData = {
    "Tokyo": {
      name: "Tokyo, Japan",
      coordinates: "35.6762°N, 139.6503°E",
      currentTemp: 32.1,
      previousTemp: 29.8,
      yearRange: [1990, 2023],
      avgSummer: 28.5,
      heatwaveDays: 18,
      uhiIntensity: 5.2,
      riskScore: 8.1,
      population: 37.4,
      tempDistribution: [
        { range: "< 0°C", days: 12, color: "bg-temp-cold" },
        { range: "0-15°C", days: 98, color: "bg-temp-cool" },
        { range: "15-25°C", days: 156, color: "bg-temp-moderate" },
        { range: "25-35°C", days: 87, color: "bg-temp-warm" },
        { range: "> 35°C", days: 12, color: "bg-temp-extreme" }
      ]
    },
    "London": {
      name: "London, UK",
      coordinates: "51.5074°N, 0.1278°W",
      currentTemp: 22.3,
      previousTemp: 21.1,
      yearRange: [1990, 2023],
      avgSummer: 18.7,
      heatwaveDays: 4,
      uhiIntensity: 2.8,
      riskScore: 5.4,
      population: 9.6,
      tempDistribution: [
        { range: "< 0°C", days: 28, color: "bg-temp-cold" },
        { range: "0-15°C", days: 187, color: "bg-temp-cool" },
        { range: "15-25°C", days: 134, color: "bg-temp-moderate" },
        { range: "25-35°C", days: 15, color: "bg-temp-warm" },
        { range: "> 35°C", days: 1, color: "bg-temp-extreme" }
      ]
    }
  };

  const addCity = (cityName: string) => {
    if (selectedCities.length < 4 && !selectedCities.includes(cityName)) {
      setSelectedCities([...selectedCities, cityName]);
    }
  };

  const removeCity = (cityName: string) => {
    if (selectedCities.length > 1) {
      setSelectedCities(selectedCities.filter(city => city !== cityName));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <GitCompare className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Compare Cities</h1>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Side-by-side analysis of climate patterns across different cities
            </p>
            
            <div className="flex items-center space-x-4">
              <SearchBar 
                placeholder="Add a city to compare..."
                onSearch={addCity}
              />
              <span className="text-sm text-muted-foreground">
                {selectedCities.length}/4 cities selected
              </span>
            </div>
          </div>

          {/* City Comparison Grid */}
          <div className={`grid gap-6 ${selectedCities.length === 2 ? 'md:grid-cols-2' : selectedCities.length === 3 ? 'lg:grid-cols-3' : 'xl:grid-cols-4'}`}>
            {selectedCities.map((cityName) => {
              const city = cityData[cityName as keyof typeof cityData];
              if (!city) return null;

              return (
                <Card key={cityName} className="p-6 space-y-6">
                  {/* City Header */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-semibold">{city.name}</h3>
                      </div>
                      {selectedCities.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCity(cityName)}
                          className="text-destructive hover:text-destructive"
                        >
                          ×
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{city.coordinates}</p>
                    <TemperatureDisplay
                      current={city.currentTemp}
                      previous={city.previousTemp}
                      location="Current"
                      size="md"
                    />
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Key Metrics
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Summer Avg</div>
                        <div className="text-lg font-bold text-temp-warm">{city.avgSummer}°C</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Heatwave Days</div>
                        <div className="text-lg font-bold text-temp-hot">{city.heatwaveDays}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">UHI Effect</div>
                        <div className="text-lg font-bold text-temp-extreme">+{city.uhiIntensity}°C</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Risk Score</div>
                        <div className="text-lg font-bold text-temp-extreme">{city.riskScore}/10</div>
                      </div>
                    </div>
                  </div>

                  {/* Temperature Distribution */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Temperature Distribution</h4>
                    <div className="space-y-2">
                      {city.tempDistribution.map((dist, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${dist.color}`} />
                            <span>{dist.range}</span>
                          </div>
                          <span className="font-medium">{dist.days} days</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Population Context */}
                  <div className="pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      Population: {city.population}M people
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Data Range: {city.yearRange[0]}-{city.yearRange[1]}
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Add City Card */}
            {selectedCities.length < 4 && (
              <Card className="p-6 border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors">
                <div className="h-full flex flex-col items-center justify-center space-y-4 text-muted-foreground">
                  <Plus className="h-12 w-12" />
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">Add Another City</h3>
                    <p className="text-sm">Compare up to 4 cities simultaneously</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Comparison Summary */}
          {selectedCities.length >= 2 && (
            <Card className="mt-8 p-6">
              <h3 className="text-xl font-semibold mb-4">Comparison Summary</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-temp-hot">Hottest Average</h4>
                  <div className="space-y-2">
                    {selectedCities
                      .sort((a, b) => (cityData[b as keyof typeof cityData]?.avgSummer || 0) - (cityData[a as keyof typeof cityData]?.avgSummer || 0))
                      .map((city, index) => (
                        <div key={city} className="flex justify-between text-sm">
                          <span>{city}</span>
                          <span className="font-medium">{cityData[city as keyof typeof cityData]?.avgSummer}°C</span>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 text-temp-extreme">Most Heatwave Days</h4>
                  <div className="space-y-2">
                    {selectedCities
                      .sort((a, b) => (cityData[b as keyof typeof cityData]?.heatwaveDays || 0) - (cityData[a as keyof typeof cityData]?.heatwaveDays || 0))
                      .map((city, index) => (
                        <div key={city} className="flex justify-between text-sm">
                          <span>{city}</span>
                          <span className="font-medium">{cityData[city as keyof typeof cityData]?.heatwaveDays} days</span>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3 text-temp-warm">Highest Risk Score</h4>
                  <div className="space-y-2">
                    {selectedCities
                      .sort((a, b) => (cityData[b as keyof typeof cityData]?.riskScore || 0) - (cityData[a as keyof typeof cityData]?.riskScore || 0))
                      .map((city, index) => (
                        <div key={city} className="flex justify-between text-sm">
                          <span>{city}</span>
                          <span className="font-medium">{cityData[city as keyof typeof cityData]?.riskScore}/10</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareMode;