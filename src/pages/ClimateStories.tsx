import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import { BookOpen, Calendar, MapPin, TrendingUp, AlertTriangle, Users } from "lucide-react";

const ClimateStories = () => {
  const stories = [
    {
      id: 1,
      title: "2003 European Heatwave",
      subtitle: "The deadly summer that changed Europe",
      date: "August 2003",
      location: "Europe",
      deaths: "70,000+",
      peakTemp: "47.4°C",
      image: "🌡️",
      description: "The 2003 European heatwave was one of the deadliest natural disasters in European history. Temperatures soared to unprecedented levels, with London hitting 38.5°C - the highest ever recorded at the time.",
      keyStats: [
        { label: "Deaths", value: "70,000+", icon: Users },
        { label: "Peak Temperature", value: "47.4°C", icon: TrendingUp },
        { label: "Duration", value: "2 months", icon: Calendar },
        { label: "Countries Affected", value: "12", icon: MapPin }
      ],
      impact: "This event led to major changes in European heat warning systems and urban planning strategies."
    },
    {
      id: 2,
      title: "July 2023: Hottest Month Ever",
      subtitle: "Breaking global temperature records",
      date: "July 2023",
      location: "Global",
      deaths: "N/A",
      peakTemp: "17.08°C",
      image: "🔥",
      description: "July 2023 became the hottest month ever recorded globally, with average temperatures reaching 17.08°C. This broke the previous record and marked a significant milestone in climate change.",
      keyStats: [
        { label: "Global Average", value: "17.08°C", icon: TrendingUp },
        { label: "Above Pre-Industrial", value: "+1.5°C", icon: AlertTriangle },
        { label: "Ocean Temperature", value: "20.96°C", icon: TrendingUp },
        { label: "Arctic Ice Loss", value: "1.5M km²", icon: AlertTriangle }
      ],
      impact: "This record-breaking month highlighted the accelerating pace of global warming and its immediate impacts."
    },
    {
      id: 3,
      title: "The 2050 Climate Projection",
      subtitle: "What the future might hold",
      date: "Projection for 2050",
      location: "Global",
      deaths: "Projected millions",
      peakTemp: "2-4°C higher",
      image: "🌍",
      description: "Climate models project that by 2050, we could see 50% more heatwaves, new danger zones emerging, and billions of people facing unprecedented heat stress.",
      keyStats: [
        { label: "More Heatwaves", value: "+50%", icon: TrendingUp },
        { label: "New Danger Zones", value: "15+ regions", icon: AlertTriangle },
        { label: "People at Risk", value: "5 billion", icon: Users },
        { label: "Temperature Rise", value: "+2-4°C", icon: TrendingUp }
      ],
      impact: "These projections underscore the urgent need for climate adaptation and mitigation strategies."
    },
    {
      id: 4,
      title: "Pacific Northwest Heat Dome",
      subtitle: "When the Pacific Northwest burned",
      date: "June 2021",
      location: "Pacific Northwest, North America",
      deaths: "1,400+",
      peakTemp: "49.6°C",
      image: "🔥",
      description: "A historic heat dome brought unprecedented temperatures to the typically mild Pacific Northwest, with Lytton, BC reaching 49.6°C before being destroyed by wildfire.",
      keyStats: [
        { label: "Peak Temperature", value: "49.6°C", icon: TrendingUp },
        { label: "Deaths", value: "1,400+", icon: Users },
        { label: "Temperature Records", value: "100+", icon: Calendar },
        { label: "Economic Loss", value: "$17B USD", icon: AlertTriangle }
      ],
      impact: "This event showed that even temperate regions are vulnerable to extreme heat in our changing climate."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Climate Chronicles</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the stories behind major climate events and understand how extreme weather 
              has shaped our world and what the future may hold.
            </p>
          </div>

          {/* Stories Grid */}
          <div className="space-y-8">
            {stories.map((story, index) => (
              <Card key={story.id} className={`p-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex gap-8 items-center`}>
                
                {/* Story Image/Icon */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gradient-climate rounded-full flex items-center justify-center text-6xl animate-pulse-glow">
                    {story.image}
                  </div>
                </div>

                {/* Story Content */}
                <div className="flex-1 space-y-6">
                  
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <Badge variant="outline" className="border-primary/30">
                        <Calendar className="mr-1 h-3 w-3" />
                        {story.date}
                      </Badge>
                      <Badge variant="outline" className="border-primary/30">
                        <MapPin className="mr-1 h-3 w-3" />
                        {story.location}
                      </Badge>
                    </div>
                    <h2 className="text-3xl font-bold">{story.title}</h2>
                    <p className="text-lg text-muted-foreground">{story.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-foreground leading-relaxed">{story.description}</p>

                  {/* Key Stats */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {story.keyStats.map((stat, statIndex) => (
                      <Card key={statIndex} className="p-4 bg-card/50 border-primary/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <stat.icon className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">{stat.label}</span>
                        </div>
                        <div className="text-xl font-bold text-temp-hot">{stat.value}</div>
                      </Card>
                    ))}
                  </div>

                  {/* Impact */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-temp-extreme" />
                      Impact & Legacy
                    </h4>
                    <p className="text-sm text-muted-foreground">{story.impact}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Temperature Data
                    </Button>
                    <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
                      <MapPin className="mr-2 h-4 w-4" />
                      Explore on Map
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <Card className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Informed About Climate Change</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Understanding these events helps us prepare for the future. Explore our interactive tools 
              to dive deeper into climate data and trends.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-gradient-climate hover:shadow-glow">
                <TrendingUp className="mr-2 h-4 w-4" />
                Explore Temperature Trends
              </Button>
              <Button variant="outline" className="border-primary/30">
                <MapPin className="mr-2 h-4 w-4" />
                View Global Heatmap
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClimateStories;