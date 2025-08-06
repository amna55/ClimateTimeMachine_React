import { Button } from "@/components/ui/button";
import { GitCompare, Clock, TrendingUp, Map } from "lucide-react";

interface QuickSelectProps {
  preset: string[];
  onSelect?: (preset: string) => void;
}

const QuickSelect = ({ preset, onSelect }: QuickSelectProps) => {
  const getIcon = (presetName: string) => {
    switch (presetName.toLowerCase()) {
      case "compare cities":
        return <GitCompare className="h-4 w-4" />;
      case "heatwave timeline":
        return <Clock className="h-4 w-4" />;
      case "temperature trends":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Map className="h-4 w-4" />;
    }
  };

  const getVariant = (index: number) => {
    return index === 0 ? "default" : "outline";
  };

  return (
    <div className="flex flex-wrap gap-3">
      {preset.map((item, index) => (
        <Button
          key={item}
          variant={getVariant(index)}
          onClick={() => onSelect?.(item)}
          className="flex items-center space-x-2 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary hover:shadow-glow transition-all duration-300"
        >
          {getIcon(item)}
          <span>{item}</span>
        </Button>
      ))}
    </div>
  );
};

export default QuickSelect;