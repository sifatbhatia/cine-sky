'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  FiPlus, FiX, FiSun, FiCloud, FiHome, FiMap, FiLogOut, 
  FiList, FiSearch, FiUser, FiDroplet, FiArrowUp, FiArrowDown,
  FiCamera, FiEye, FiSunrise, FiMoon, FiFilter
} from 'react-icons/fi';
import { WeatherData } from '../types/weather';
import Link from 'next/link';

const DEFAULT_CITIES = ['New York', 'Tokyo', 'Sydney', 'Paris'];

export default function ListView() {
  const [cities, setCities] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCity, setNewCity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFilmmakerInfo, setShowFilmmakerInfo] = useState(true);
  const { user, logOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!user && !loading) {
      router.push('/login');
    } else {
      // Load cities from localStorage or use defaults
      const savedCities = localStorage.getItem('savedCities');
      setCities(savedCities ? JSON.parse(savedCities) : DEFAULT_CITIES);
    }
  }, [user, router, loading]);

  useEffect(() => {
    const fetchWeatherForCities = async () => {
      if (cities.length === 0) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const weatherPromises = cities.map(async (city) => {
          // Simulate API response to avoid actual API calls
          const weatherConditions = ['Clear', 'Clouds', 'Rain', 'Snow', 'Fog', 'Mist'];
          const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
          
          // Generate random values for filmmaker-specific data
          const sunriseHour = 5 + Math.floor(Math.random() * 2);
          const sunsetHour = 17 + Math.floor(Math.random() * 3);
          const visibility = 5 + Math.floor(Math.random() * 10);
          const uvIndex = 1 + Math.floor(Math.random() * 10);
          const fogChance = Math.floor(Math.random() * 100);
          const tempC = Math.floor(Math.random() * 35); // Random temperature 0-35°C
          
          const country = city === 'New York' ? 'US' : 
                    city === 'Tokyo' ? 'JP' : 
                    city === 'Sydney' ? 'AU' : 
                    city === 'Paris' ? 'FR' : 'UK';
          
          return {
            city: city,
            location: `${city}, ${country}`,
            temperature: tempC,
            temperatureC: tempC,
            temperatureF: Math.floor(tempC * 1.8 + 32),
            humidity: Math.floor(Math.random() * 60) + 20, // Random humidity 20-80%
            main: randomCondition,
            description: `${randomCondition} weather conditions`,
            country,
            // Filmmaker-specific data
            wind: {
              speed: Math.floor(Math.random() * 20),
              direction: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)]
            },
            pressure: 1000 + Math.floor(Math.random() * 50),
            visibility: visibility, // in km
            sunrise: `${sunriseHour}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM`,
            sunset: `${sunsetHour - 12}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`,
            goldenHourAM: `${sunriseHour - 1}:30 - ${sunriseHour + 1}:00 AM`,
            goldenHourPM: `${sunsetHour - 13}:00 - ${sunsetHour - 12}:30 PM`,
            blueHour: `${sunsetHour - 12}:30 - ${sunsetHour - 12 + 1}:00 PM`,
            uvIndex: uvIndex,
            fogChance: fogChance,
            lightQuality: randomCondition === 'Clear' ? 'Excellent' : 
                        randomCondition === 'Clouds' ? 'Diffused' : 
                        randomCondition === 'Rain' ? 'Low contrast' : 
                        randomCondition === 'Fog' || randomCondition === 'Mist' ? 'Atmospheric' : 'Standard'
          };
        });
        
        const weatherResults = await Promise.all(weatherPromises);
        setWeatherData(weatherResults);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch weather data for some cities');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeatherForCities();
  }, [cities]);

  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCity.trim()) {
      return;
    }
    
    if (cities.includes(newCity)) {
      setError('This city is already in your list');
      return;
    }
    
    const updatedCities = [...cities, newCity];
    setCities(updatedCities);
    localStorage.setItem('savedCities', JSON.stringify(updatedCities));
    setNewCity('');
    setError(null);
  };

  const handleRemoveCity = (cityToRemove: string) => {
    const updatedCities = cities.filter(city => city !== cityToRemove);
    setCities(updatedCities);
    localStorage.setItem('savedCities', JSON.stringify(updatedCities));
    
    // Also update the weather data array
    setWeatherData(prevData => 
      prevData.filter(data => data.city !== cityToRemove)
    );
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading && cities.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with Search and Menu */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/home" className="flex items-center">
              <FiCloud className="text-accent mr-2" size={22} />
              <span className="font-bold text-lg">CineSky</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative">
              <input
                type="text"
                className="bg-card/50 text-sm rounded-full px-10 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Search for a location..."
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={16} />
            </div>
            
            <button onClick={toggleMenu} className="p-2 rounded-full bg-card/50 hover:bg-card">
              {isMenuOpen ? <FiX size={20} /> : <FiHome size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Sliding side menu */}
      {isMenuOpen && (
        <div className="fixed top-0 right-0 h-screen w-72 bg-card border-l border-border z-40 shadow-lg transform transition-transform">
          <div className="p-4 flex justify-between items-center border-b border-border">
            <span className="font-bold text-lg">Menu</span>
            <button onClick={toggleMenu}>
              <FiX size={20} />
            </button>
          </div>
          <div className="py-4">
            <div className="px-4 py-2 mb-4">
              <div className="bg-background/50 rounded-lg p-4 flex items-center">
                <div className="bg-primary/20 rounded-full p-2 mr-3">
                  <FiUser className="text-primary" size={18} />
                </div>
                <div>
                  <p className="font-medium">{user?.displayName || 'User'}</p>
                  <p className="text-sm text-secondary">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
            </div>
            <Link href="/home" className="flex items-center px-4 py-3 hover:bg-card/50 text-foreground">
              <FiHome className="mr-3" size={18} />
              Home
            </Link>
            <Link href="/mapview" className="flex items-center px-4 py-3 hover:bg-card/50 text-foreground">
              <FiMap className="mr-3" size={18} />
              Map View
            </Link>
            <Link href="/list" className="flex items-center px-4 py-3 text-primary bg-primary/10 rounded-r-lg border-l-2 border-primary">
              <FiList className="mr-3" size={18} />
              My Locations
            </Link>
            <button onClick={() => logOut()} className="flex items-center px-4 py-3 hover:bg-card/50 text-foreground text-left w-full mt-4 border-t border-border">
              <FiLogOut className="mr-3" size={18} />
              Logout
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto pt-20 px-4 pb-6">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">Shoot Locations</h1>
            
            <div className="flex items-center mt-4 md:mt-0 space-x-4">
              <Link href="/list" className="text-primary border-b-2 border-primary pb-1">List View</Link>
              <Link href="/mapview" className="text-secondary hover:text-foreground">Map View</Link>
              <button 
                onClick={() => setShowFilmmakerInfo(!showFilmmakerInfo)}
                className="ml-2 p-2 rounded-full bg-card/50 hover:bg-card"
              >
                <FiCamera size={18} className={showFilmmakerInfo ? "text-primary" : "text-secondary"} />
              </button>
            </div>
          </div>
          
          {/* Add City Form */}
          <div className="bg-card rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Add New Location</h3>
          <form onSubmit={handleAddCity} className="flex gap-2">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={16} />
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
                  placeholder="Enter city name..."
                  className="w-full bg-background/50 backdrop-blur-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary border border-border"
            />
              </div>
            <button
              type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center"
            >
                <FiPlus className="mr-1" size={18} /> Add
            </button>
          </form>
          
          {error && (
              <p className="mt-2 text-danger text-sm">{error}</p>
          )}
        </div>
        
          {/* Weather Cards Grid */}
          {weatherData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weatherData.map((weather, index) => (
                <div 
                  key={weather.city} 
                  className={`bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow relative
                    ${weather.main === 'Clear' ? 'bg-gradient-to-br from-accent/10 to-card' : 
                      weather.main === 'Rain' ? 'bg-gradient-to-br from-primary/10 to-card' : 
                      weather.main === 'Fog' || weather.main === 'Mist' ? 'bg-gradient-to-br from-primary/5 to-card/95' :
                      weather.main === 'Clouds' ? 'bg-gradient-to-br from-secondary/10 to-card' : 
                      'bg-card'}`
                  }
                >
                <button
                  onClick={() => handleRemoveCity(cities[index])}
                    className="absolute top-4 right-4 z-10 bg-background/30 hover:bg-background/50 text-foreground p-1.5 rounded-full"
                  aria-label={`Remove ${weather.city}`}
                >
                  <FiX size={16} />
                </button>
                  
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">{weather.city}</h2>
                        <div className="text-sm text-secondary">{weather.country}</div>
                      </div>
                      
                      <div className="flex items-center mt-2 md:mt-0">
                        {weather.main === "Clear" ? (
                          <FiSun className="text-accent" size={32} />
                        ) : weather.main === "Rain" ? (
                          <FiDroplet className="text-primary" size={32} />
                        ) : weather.main === "Fog" || weather.main === "Mist" ? (
                          <FiEye className="text-secondary" size={32} />
                        ) : (
                          <FiCloud className="text-secondary" size={32} />
                        )}
                        <span className="ml-2 text-lg">{weather.main}</span>
                      </div>
                    </div>
                    
                    <div className="mt-5 flex justify-between items-end">
                      <div className="flex items-start">
                        <span className="text-5xl font-bold">{weather.temperatureC}</span>
                        <span className="text-xl ml-1">°C</span>
                      </div>
                      
                      <div className="flex space-x-3 text-sm text-secondary">
                        <div className="flex items-center">
                          <FiArrowDown className="mr-1" size={14} />
                          <span>{Math.round(weather.temperatureC - 3)}°</span>
                        </div>
                        <div className="flex items-center">
                          <FiArrowUp className="mr-1" size={14} />
                          <span>{Math.round(weather.temperatureC + 4)}°</span>
                        </div>
                      </div>
                    </div>
                    
                    {showFilmmakerInfo && (
                      <>
                        {/* Filmmaker Info Section */}
                        <div className="mt-6 border-t border-border pt-4">
                          <h3 className="font-medium text-lg flex items-center mb-3">
                            <FiCamera className="mr-2 text-primary" size={18} />
                            Filming Conditions
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="flex items-center mb-2">
                                <FiSunrise className="text-accent mr-2" size={16} />
                                <span className="text-sm text-secondary">Golden Hour</span>
                              </div>
                              <div className="text-sm">AM: {weather.goldenHourAM}</div>
                              <div className="text-sm">PM: {weather.goldenHourPM}</div>
                            </div>
                            
                            <div>
                              <div className="flex items-center mb-2">
                                <FiMoon className="text-primary mr-2" size={16} />
                                <span className="text-sm text-secondary">Blue Hour</span>
                              </div>
                              <div className="text-sm">{weather.blueHour}</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-background/20 rounded-lg p-2 text-center">
                              <div className="text-xs text-secondary mb-1">Visibility</div>
                              <div className="font-medium">{weather.visibility} km</div>
                            </div>
                            
                            <div className="bg-background/20 rounded-lg p-2 text-center">
                              <div className="text-xs text-secondary mb-1">UV Index</div>
                              <div className="font-medium">{weather.uvIndex}</div>
                            </div>
                            
                            <div className="bg-background/20 rounded-lg p-2 text-center">
                              <div className="text-xs text-secondary mb-1">Light</div>
                              <div className="font-medium">{weather.lightQuality}</div>
                            </div>
                          </div>
                          
                          {(weather.main === 'Fog' || weather.main === 'Mist' || (weather.fogChance !== undefined && weather.fogChance > 70)) ? (
                            <div className="bg-primary/10 rounded-lg p-3 mb-3">
                              <div className="flex items-center text-primary">
                                <FiEye className="mr-2" size={16} />
                                <span className="font-medium">Atmospheric Conditions</span>
                              </div>
                              <p className="text-sm mt-1">
                                {weather.main === 'Fog' || weather.main === 'Mist' 
                                  ? 'Currently foggy - ideal for atmospheric shots with depth' 
                                  : `${weather.fogChance ?? 0}% chance of fog in the morning`}
                              </p>
                            </div>
                          ) : null}
                          
                          <div className="bg-accent/10 rounded-lg p-3">
                            <div className="flex items-center text-accent">
                              <FiFilter className="mr-2" size={16} />
                              <span className="font-medium">Recommended Settings</span>
                            </div>
                            <p className="text-sm mt-1">
                              {weather.main === 'Clear' ? 'Use polarizing filter for vibrant skies' : 
                               weather.main === 'Clouds' ? 'Diffused light - great for portraits' :
                               weather.main === 'Rain' ? 'Consider protecting gear and capturing reflections' :
                               weather.main === 'Fog' || weather.main === 'Mist' ? 'Increase contrast in post-processing' :
                               'Standard settings'}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="bg-card/80 border-t border-border p-3">
                    <Link href={`/home?city=${weather.city}`} className="text-primary text-sm hover:underline flex items-center justify-center">
                      View Detailed Forecast
                    </Link>
                  </div>
              </div>
            ))}
          </div>
        ) : (
            <div className="bg-card rounded-xl p-8 text-center">
              <FiList className="text-secondary mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">No locations added</h3>
              <p className="text-secondary mb-4">Add your first shooting location to get started</p>
          </div>
        )}
      </div>
      </main>
    </div>
  );
} 
