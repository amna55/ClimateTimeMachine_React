import { AlertTriangle, Thermometer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface HeatAlertProps {
  location: string;
  temperature: number;
  severity: "warning" | "extreme";
  time: string;
}

const HeatAlert = ({ location, temperature, severity, time }: HeatAlertProps) => {
  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case "extreme":
        return "bg-temp-extreme text-white border-temp-extreme animate-pulse-glow";
      case "warning":
        return "bg-temp-hot text-white border-temp-hot";
      default:
        return "bg-temp-warm text-white border-temp-warm";
    }
  };

  return (
    <Card className="p-4 border-l-4 border-l-temp-hot animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <AlertTriangle className="h-4 w-4 text-temp-hot" />
            <Thermometer className="h-4 w-4 text-temp-extreme" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{location}</h4>
            <p className="text-sm text-muted-foreground">{time}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-temp-extreme">
            {temperature}°C
          </div>
          <Badge className={getSeverityColors(severity)}>
            {severity.toUpperCase()}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default HeatAlert;