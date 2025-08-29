import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/layout/Navigation";
import HeatAlert from "@/components/climate/HeatAlert";
import HeatAlertList from "@/components/climate/heatalertlist"; // adjust path as needed
import SearchBar from "@/components/climate/SearchBar";
import QuickSelect from "@/components/climate/QuickSelect";
import TemperatureDisplay from "@/components/climate/TemperatureDisplay";
import { ArrowRight, Globe, Zap, TrendingUp, AlertTriangle } from "lucide-react";
import climateHero from "@/assets/climate-hero.jpg";
import { fetchTemperature } from "@/components/climate/current_temp";



const Index = () => {
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [tempError, setTempError] = useState<string | null>(null);
  const [loadingTemp, setLoadingTemp] = useState<boolean>(false);

  const heatAlerts = [
    { location: "Phoenix, AZ", temperature: 47, severity: "extreme" as const, time: "2 hours ago" },
    { location: "Delhi, India", temperature: 44, severity: "warning" as const, time: "4 hours ago" },
    { location: "Baghdad, Iraq", temperature: 46, severity: "extreme" as const, time: "6 hours ago" },
  ];

  const globalStats = [
    { current: 15.2, previous: 14.8, location: "Global Average" },
    { current: 32.1, previous: 30.5, location: "Hottest Recorded Today" },
    { current: -12.3, previous: -10.1, location: "Arctic Average" },
  ];

  useEffect(() => {
    const loadTempForUser = async () => {
      if (!navigator.geolocation) {
        setTempError("Geolocation is not supported by your browser.");
        setLocationName("Unknown Location");
        return;
      }

      setLoadingTemp(true);

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              timeout: 10000,
              maximumAge: 60000,
              enableHighAccuracy: true
            }
          );
        });

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Fetch temperature
        try {
          const temp = await fetchTemperature(lat, lng);
          setCurrentTemp(temp);
          setTempError(null);
        } catch (tempError) {
          console.error("Temperature fetch failed:", tempError);
          setTempError("Failed to get temperature data");
        }

        // Fetch location name
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            {
              headers: {
                'User-Agent': 'Climate-Time-Machine/1.0 (contact@yourdomain.com)'
              }
            }
          );
          
          if (!res.ok) throw new Error('Failed to fetch location name');
          
          const data = await res.json();
          setLocationName(
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            data.address?.state ||
            data.address?.country ||
            `${lat.toFixed(4)}, ${lng.toFixed(4)}`
          );
        } catch (geoError) {
          console.warn("Reverse geocoding failed:", geoError);
          setLocationName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }

      } catch (error) {
        console.error("Geolocation error:", error);
        setTempError(
          error instanceof GeolocationPositionError 
            ? getGeolocationError(error.code) 
            : "Failed to get your location"
        );
        setLocationName("Unknown Location");
      } finally {
        setLoadingTemp(false);
      }
    };

    loadTempForUser();
  }, []);

  const getGeolocationError = (code: number) => {
    switch(code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        return "Location access was denied. Please enable permissions.";
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        return "Location information is unavailable.";
      case GeolocationPositionError.TIMEOUT:
        return "The request to get your location timed out.";
      default:
        return "Error getting your location.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
        <div className="absolute inset-0 opacity-20">
          <img
            src={climateHero}
            alt="Climate visualization"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-climate bg-clip-text text-transparent">
                    Climate Time
                  </span>
                  <br />
                  <span className="text-foreground">Machine</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Explore real-time global temperature data, track climate patterns,
                  and witness how our planet's climate has evolved over time.
                </p>
              </div>

              {/* Search & Quick Actions */}
              <div className="space-y-4">
                <SearchBar
                  placeholder="Search any location..."
                  onSearch={(query) => console.log("Searching:", query)}
                />
                <QuickSelect
                  preset={["Compare Cities", "Heatwave Timeline", "Temperature Trends"]}
                  onSelect={(preset) => console.log("Selected:", preset)}
                />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link to="/heatmap">
                  <Button size="lg" className="bg-gradient-climate hover:shadow-glow">
                    <Globe className="mr-2 h-5 w-5" />
                    Explore Global Data
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/stories">
                  <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Climate Stories
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Globe & Live Temperature - Maintained original structure */}
            <div className="relative">
              <div className="left-4 w-72 bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-primary/20 shadow-lg z-50">
                <h3 className="font-semibold text-sm mb-2">Live Current Temperature</h3>
                <div className="grid grid-cols-1 gap-2">
                  {loadingTemp ? (
                    <p className="text-sm text-muted-foreground">Detecting your location...</p>
                  ) : tempError ? (
                    <div className="text-sm text-red-500">
                      {tempError}
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-primary p-0 ml-2 h-auto"
                        onClick={() => window.location.reload()}
                      >
                        Try again
                      </Button>
                    </div>
                  ) : currentTemp !== null ? (
                    <TemperatureDisplay
                      current={currentTemp}
                      previous={null}
                      location={locationName}
                      size="sm"
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Location not available. Try searching above.
                    </div>
                  )}
                </div>
              </div>
              {/* This space can be used for your GlobeVisualization if you choose to add it later */}
            </div>
          </div>
        </div>
      </section>

      {/* Rest of your existing sections remain unchanged */}
                  <section className="py-16 bg-card/30 backdrop-blur-sm">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-6 w-6 text-temp-hot animate-pulse" />
                      <Zap className="h-5 w-5 text-temp-extreme" />
                    </div>
                    <h2 className="text-2xl font-bold">Last 24h Heat Alerts</h2>
                  </div>
                  <Link to="/heatmap">
                    <Button variant="ghost" className="text-primary hover:text-primary-glow">
                      View All <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <HeatAlertList />
              </div>
</section>


      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Historical Climate Spotlight</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover significant climate events and understand how our planet's temperature patterns have changed over decades.
            </p>
          </div>

          <Card className="p-8 bg-gradient-to-r from-temp-hot/10 to-temp-extreme/10 border-temp-warm/30">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-temp-extreme mb-2">
                  July 2023: Hottest Month on Record
                </h3>
                <p className="text-muted-foreground mb-4">
                  July 2023 officially became the hottest month ever recorded globally,
                  with average temperatures reaching unprecedented levels across multiple continents.
                </p>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-temp-extreme">17.08°C</div>
                    <div className="text-sm text-muted-foreground">Global Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-temp-hot">+1.5°C</div>
                    <div className="text-sm text-muted-foreground">Above Pre-Industrial</div>
                  </div>
                </div>
                <Link to="/stories">
                  <Button className="bg-gradient-heat hover:shadow-warm">
                    Read Full Story <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {globalStats.map((stat, index) => (
                  <Card key={index} className="p-4 bg-card/50 border-primary/20">
                    <TemperatureDisplay
                      current={stat.current}
                      previous={stat.previous}
                      location={stat.location}
                      size="sm"
                    />
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;