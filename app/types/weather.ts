export interface WeatherData {
  city: string;
  location: string;
  temperatureC: number;
  temperatureF: number;
  temperature: number;
  humidity: number;
  description: string;
  main: string;
  country: string;
  icon?: string;
  wind: {
    speed: number;
    direction: string;
  };
  visibility: number;
  pressure: number;
  lat?: number;
  lon?: number;
  
  // Filmmaker-specific properties
  sunrise?: string;
  sunset?: string;
  goldenHourAM?: string;
  goldenHourPM?: string;
  blueHour?: string;
  uvIndex?: number;
  fogChance?: number;
  lightQuality?: string;
} 