/**
 * Filmmaker-specific utility functions for CineSky
 */

// Types for lighting conditions
export interface LightingConditions {
  goldenHour: {
    morning: TimeRange;
    evening: TimeRange;
  };
  blueHour: {
    morning: TimeRange;
    evening: TimeRange;
  };
  sunPosition: {
    angle: number;
    direction: string;
  };
  lightQuality: string;
  recommendedSettings: CameraSettings;
}

export interface TimeRange {
  start: string;
  end: string;
  durationMinutes: number;
}

export interface CameraSettings {
  aperture: string;
  shutterspeed: string;
  iso: string;
  filters: string[];
  notes: string;
}

/**
 * Calculate golden hour times based on sunrise and sunset
 */
export function calculateGoldenHours(sunrise: Date, sunset: Date): { morning: TimeRange; evening: TimeRange } {
  // Morning golden hour starts about 30 minutes before sunrise and lasts ~40 minutes after
  const morningStart = new Date(sunrise);
  morningStart.setMinutes(sunrise.getMinutes() - 30);
  
  const morningEnd = new Date(sunrise);
  morningEnd.setMinutes(sunrise.getMinutes() + 40);
  
  // Evening golden hour starts about 40 minutes before sunset and lasts until sunset
  const eveningStart = new Date(sunset);
  eveningStart.setMinutes(sunset.getMinutes() - 40);
  
  const eveningEnd = new Date(sunset);
  
  return {
    morning: {
      start: formatTime(morningStart),
      end: formatTime(morningEnd),
      durationMinutes: 70
    },
    evening: {
      start: formatTime(eveningStart),
      end: formatTime(eveningEnd),
      durationMinutes: 40
    }
  };
}

/**
 * Calculate blue hour times (twilight period after sunset or before sunrise)
 */
export function calculateBlueHours(sunrise: Date, sunset: Date): { morning: TimeRange; evening: TimeRange } {
  // Morning blue hour starts about 30 minutes before sunrise
  const morningStart = new Date(sunrise);
  morningStart.setMinutes(sunrise.getMinutes() - 30);
  
  // Evening blue hour starts at sunset and lasts ~20-30 minutes
  const eveningStart = new Date(sunset);
  
  const eveningEnd = new Date(sunset);
  eveningEnd.setMinutes(sunset.getMinutes() + 30);
  
  return {
    morning: {
      start: formatTime(morningStart),
      end: formatTime(sunrise),
      durationMinutes: 30
    },
    evening: {
      start: formatTime(eveningStart),
      end: formatTime(eveningEnd),
      durationMinutes: 30
    }
  };
}

/**
 * Get recommended camera settings based on time and weather conditions
 */
export function getRecommendedSettings(time: Date, weather: string): CameraSettings {
  const hour = time.getHours();
  const isGoldenHour = (hour >= 5 && hour <= 8) || (hour >= 17 && hour <= 19);
  const isBlueHour = (hour >= 4 && hour <= 5) || (hour >= 19 && hour <= 20);
  const isNight = (hour >= 20 || hour <= 4);
  const isCloudy = weather.toLowerCase().includes('cloud') || weather.toLowerCase().includes('overcast');
  
  if (isNight) {
    return {
      aperture: "f/1.4 - f/2.8",
      shutterspeed: "1/30 or slower",
      iso: "800 - 3200",
      filters: ["Light pollution filter"],
      notes: "Use tripod; consider long exposures for night sky/cityscapes"
    };
  }
  
  if (isGoldenHour) {
    return {
      aperture: "f/2.8 - f/8",
      shutterspeed: "1/125 - 1/250",
      iso: "100 - 400",
      filters: ["Graduated ND filter", "Warming filter (optional)"],
      notes: "Capture warm tones and long shadows; great for silhouettes"
    };
  }
  
  if (isBlueHour) {
    return {
      aperture: "f/2.8 - f/5.6",
      shutterspeed: "1/60 - 1/125",
      iso: "400 - 800",
      filters: ["Cooling filter (optional)"],
      notes: "Great for city lights and blue tones; use tripod for longer exposures"
    };
  }
  
  if (isCloudy) {
    return {
      aperture: "f/4 - f/8",
      shutterspeed: "1/125 - 1/250",
      iso: "200 - 400",
      filters: ["Polarizing filter"],
      notes: "Even, diffused lighting; great for portraits and eliminating harsh shadows"
    };
  }
  
  // Default daytime settings
  return {
    aperture: "f/8 - f/16",
    shutterspeed: "1/250 - 1/500",
    iso: "100 - 200",
    filters: ["Polarizing filter", "ND filter"],
    notes: "Use polarizer to reduce glare and enhance colors; ND filter to handle bright conditions"
  };
}

/**
 * Calculate sun position (simplified approximation)
 */
export function calculateSunPosition(time: Date, latitude: number): { angle: number; direction: string } {
  const hour = time.getHours();
  const minute = time.getMinutes();
  const dayMinute = hour * 60 + minute;
  
  // Simple approximation - not actual astronomical calculation
  let angle = 0;
  let direction = "East";
  
  // Assuming sunrise around 6 AM and sunset around 6 PM for this simple model
  if (dayMinute < 360) { // Before 6 AM
    angle = 0;
    direction = "East";
  } else if (dayMinute < 720) { // 6 AM to 12 PM
    angle = (dayMinute - 360) / 360 * 90; // 0 to 90 degrees
    direction = "Southeast";
  } else if (dayMinute < 1080) { // 12 PM to 6 PM
    angle = 90 - (dayMinute - 720) / 360 * 90; // 90 to 0 degrees
    direction = "Southwest";
  } else { // After 6 PM
    angle = 0;
    direction = "West";
  }
  
  // Adjust for latitude (simplified)
  if (latitude > 0) { // Northern hemisphere
    direction = direction.replace("East", "Southeast").replace("West", "Southwest");
  } else { // Southern hemisphere
    direction = direction.replace("East", "Northeast").replace("West", "Northwest");
  }
  
  return { angle, direction };
}

/**
 * Get a description of the lighting quality based on time and weather
 */
export function getLightQuality(time: Date, weather: string): string {
  const hour = time.getHours();
  
  if (hour >= 5 && hour <= 7) {
    return "Morning golden hour - soft, warm directional light with long shadows. Ideal for landscapes and portraits.";
  }
  
  if (hour >= 17 && hour <= 19) {
    return "Evening golden hour - warm, orange-red tones with dramatic long shadows. Perfect for silhouettes and rim lighting.";
  }
  
  if (hour >= 19 && hour <= 20) {
    return "Blue hour - soft blue ambient light with balanced exposure between sky and artificial lights.";
  }
  
  if (hour >= 10 && hour <= 14) {
    if (weather.toLowerCase().includes("cloud") || weather.toLowerCase().includes("overcast")) {
      return "Overcast midday - diffused, even lighting with minimal shadows. Good for portraits and reducing contrast.";
    }
    return "Harsh midday light - strong contrast and short shadows. Consider using diffusers or shooting in shade.";
  }
  
  if (hour >= 20 || hour <= 4) {
    return "Night conditions - low ambient light. Requires additional lighting or long exposure techniques.";
  }
  
  return "Standard daylight - good overall lighting with moderate shadows.";
}

/**
 * Calculate the current UV index based on time of day and weather conditions (approximation)
 */
export function calculateUVIndex(time: Date, weather: string): number {
  const hour = time.getHours();
  
  // Base UV calculation (simplified model)
  let baseUV = 0;
  
  if (hour >= 10 && hour <= 14) {
    baseUV = 9; // Peak UV hours
  } else if (hour >= 8 && hour <= 16) {
    baseUV = 6; // High UV hours
  } else if (hour >= 6 && hour <= 18) {
    baseUV = 3; // Moderate UV
  }
  
  // Adjust for weather conditions
  if (weather.toLowerCase().includes("cloud") || weather.toLowerCase().includes("overcast")) {
    baseUV = Math.floor(baseUV * 0.7); // Clouds reduce UV
  }
  if (weather.toLowerCase().includes("rain") || weather.toLowerCase().includes("snow")) {
    baseUV = Math.floor(baseUV * 0.5); // Rain/snow reduces UV further
  }
  
  return Math.max(1, Math.min(11, baseUV)); // Ensure UV is between 1-11
}

// Helper function to format time as HH:MM AM/PM
function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Calculate visibility quality for filming
export function getVisibilityQuality(visibilityKm: number): string {
  if (visibilityKm >= 10) {
    return "Excellent - ideal for landscape and distant shots";
  } else if (visibilityKm >= 5) {
    return "Good - suitable for most outdoor filming";
  } else if (visibilityKm >= 2) {
    return "Moderate - limited visibility for distant objects";
  } else {
    return "Poor - consider close-up shots or using fog as an artistic element";
  }
}

// Get fog/mist conditions for filming
export function getFogConditions(humidity: number, temp: number, dewPoint: number): string {
  const tempDewPointDiff = Math.abs(temp - dewPoint);
  
  if (humidity > 90 && tempDewPointDiff < 2.5) {
    return "Heavy fog likely - excellent for atmospheric shots";
  } else if (humidity > 80 && tempDewPointDiff < 5) {
    return "Light fog or mist possible - good for creating mood";
  }
  
  return "Clear conditions - no fog expected";
} 