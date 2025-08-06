import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar = ({ placeholder = "Enter city or coordinates...", onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query);
      setQuery("");
      setSuggestions([]);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    
    // Mock suggestions - in real app, this would call a geocoding API
    if (value.length > 2) {
      const mockSuggestions = [
        "New York, USA",
        "London, UK", 
        "Tokyo, Japan",
        "Sydney, Australia",
        "Mumbai, India"
      ].filter(city => city.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-20 h-12 bg-card/50 backdrop-blur-sm border-primary/20 focus:border-primary focus:shadow-glow"
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 px-4 bg-gradient-climate hover:shadow-glow"
        >
          Search
        </Button>
      </div>

      {suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-2 bg-card/90 backdrop-blur-md border-primary/20 animate-fade-in-up z-50">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(suggestion);
                setSuggestions([]);
                onSearch?.(suggestion);
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-primary/10 transition-colors flex items-center space-x-2"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span>{suggestion}</span>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
};

export default SearchBar;