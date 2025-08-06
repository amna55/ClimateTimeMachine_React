import { Thermometer, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemperatureDisplayProps {
  current: number;
  previous?: number;
  location: string;
  unit?: "C" | "F";
  size?: "sm" | "md" | "lg";
}

const TemperatureDisplay = ({ 
  current, 
  previous, 
  location, 
  unit = "C", 
  size = "md" 
}: TemperatureDisplayProps) => {
  const difference = previous ? current - previous : 0;
  const isIncreasing = difference > 0;
  
  const getTemperatureColor = (temp: number) => {
    if (temp <= 0) return "text-temp-cold";
    if (temp <= 15) return "text-temp-cool";
    if (temp <= 25) return "text-temp-moderate";
    if (temp <= 35) return "text-temp-warm";
    if (temp <= 45) return "text-temp-hot";
    return "text-temp-extreme";
  };

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  };

  return (
    <div className="flex items-center space-x-3">
      <Thermometer className={cn(iconSizes[size], getTemperatureColor(current))} />
      
      <div>
        <div className="flex items-baseline space-x-2">
          <span className={cn("font-bold", sizeClasses[size], getTemperatureColor(current))}>
            {current}°{unit}
          </span>
          
          {previous && (
            <div className="flex items-center space-x-1 text-sm">
              {isIncreasing ? (
                <TrendingUp className="h-3 w-3 text-temp-hot" />
              ) : (
                <TrendingDown className="h-3 w-3 text-temp-cool" />
              )}
              <span className={cn(
                "text-xs font-medium",
                isIncreasing ? "text-temp-hot" : "text-temp-cool"
              )}>
                {isIncreasing ? "+" : ""}{difference.toFixed(1)}°
              </span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground">{location}</p>
      </div>
    </div>
  );
};

export default TemperatureDisplay;