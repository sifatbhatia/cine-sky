'use client';

import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/navigation-bar';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useWeather } from '../hooks/useWeather';
import { FiMapPin, FiNavigation, FiMap, FiCamera, FiSun, FiImage, FiCompass } from 'react-icons/fi';

// Add photography-specific data
const getPhotographySpots = (city: string) => {
  // In a real app, this would come from a database or API
  const spots = [
    { name: 'City Center', type: 'Urban', description: 'Architectural photography opportunities' },
    { name: 'Waterfront', type: 'Natural', description: 'Reflections and cityscape views' },
    { name: 'Historic District', type: 'Urban', description: 'Character and history' },
    { name: 'Park', type: 'Natural', description: 'Nature and wildlife photography' }
  ];
  
  return spots;
};

// Calculate golden hour times (simplified)
const calculateGoldenHours = (lat: number, lon: number) => {
  // This is a simplified calculation - in a real app, you'd use a proper astronomical library
  const date = new Date();
  const hour = date.getHours();
  
  // Approximate golden hours based on time of day
  let sunrise = '6:00 AM';
  let sunset = '8:00 PM';
  
  if (hour < 12) {
    // Morning golden hour is 1 hour after sunrise
    return {
      sunrise: sunrise,
      morningGolden: '7:00 AM',
      sunset: sunset,
      eveningGolden: '7:00 PM'
    };
  } else {
    // Evening golden hour is 1 hour before sunset
    return {
      sunrise: sunrise,
      morningGolden: '7:00 AM',
      sunset: sunset,
      eveningGolden: '7:00 PM'
    };
  }
};

export default function MapView() {
  const { user, isGuest } = useAuth();
  const router = useRouter();
  const { weather, loading } = useWeather();
  const [mapUrl, setMapUrl] = useState('');
  const [showPhotographyInfo, setShowPhotographyInfo] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated and not in guest mode
    if (!user && !isGuest && !loading) {
      router.push('/login');
    }
  }, [user, isGuest, loading, router]);

  useEffect(() => {
    // Set map URL when weather data is available
    if (weather?.lat && weather?.lon) {
      setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=${weather.lon - 0.1}%2C${weather.lat - 0.1}%2C${weather.lon + 0.1}%2C${weather.lat + 0.1}&layer=mapnik&marker=${weather.lat}%2C${weather.lon}`);
    }
  }, [weather]);

  return (
    <div className="min-h-screen bg-[#1d0811] text-white">
      <NavigationBar />
      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <FiMap className="text-[#e43c1c]" size={36} />
            <h1 className="text-[64px] font-extrabold tracking-tight leading-none">
              Map View
            </h1>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 border-4 border-[#e43c1c]/20 border-t-[#e43c1c] rounded-full animate-spin mb-8"></div>
              <p className="text-xl text-secondary">Loading location data...</p>
            </div>
          ) : weather ? (
            <div className="space-y-6">
              <div className="bg-[#1d0811]/60 backdrop-blur-xl rounded-[32px] p-8">
                <div className="flex items-center gap-4 mb-4">
                  <FiMapPin className="text-[#e43c1c]" size={24} />
                  <h2 className="text-3xl font-bold">
                    {weather.city}, {weather.country}
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-secondary">
                  <FiNavigation className="text-[#e43c1c]" size={18} />
                  <p className="text-lg">
                    {weather?.lat?.toFixed(4) ?? '0.0000'}°N, {weather?.lon?.toFixed(4) ?? '0.0000'}°E
                  </p>
                </div>
              </div>
              
              <div className="bg-[#1d0811]/60 backdrop-blur-xl rounded-[32px] overflow-hidden">
                <div className="relative h-[600px]">
                  {mapUrl ? (
                    <iframe
                      src={mapUrl}
                      title="Location Map"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      className="absolute inset-0"
                    ></iframe>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-secondary">Loading map...</p>
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <FiCamera className="text-[#e43c1c]" size={20} />
                      Photography Information
                    </h3>
                    <button 
                      onClick={() => setShowPhotographyInfo(!showPhotographyInfo)}
                      className="text-[#e43c1c] hover:text-[#f04d2e] transition-colors"
                    >
                      {showPhotographyInfo ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  
                  {showPhotographyInfo && (
                    <div className="space-y-6">
                      {/* Golden Hours */}
                      <div className="bg-[#1d0811]/80 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                          <FiSun className="text-[#e43c1c]" size={18} />
                          <span className="font-semibold text-white">Golden Hours</span>
                        </div>
                        
                        {weather.lat && weather.lon ? (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {(() => {
                              const goldenHours = calculateGoldenHours(weather.lat, weather.lon);
                              return (
                                <>
                                  <div className="flex justify-between">
                                    <span className="text-secondary">Sunrise</span>
                                    <span className="text-white">{goldenHours.sunrise}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-secondary">Morning Golden</span>
                                    <span className="text-white">{goldenHours.morningGolden}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-secondary">Evening Golden</span>
                                    <span className="text-white">{goldenHours.eveningGolden}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-secondary">Sunset</span>
                                    <span className="text-white">{goldenHours.sunset}</span>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          <p className="text-secondary text-sm">Location data not available</p>
                        )}
                      </div>
                      
                      {/* Photography Spots */}
                      <div className="bg-[#1d0811]/80 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                          <FiImage className="text-[#e43c1c]" size={18} />
                          <span className="font-semibold text-white">Photography Spots</span>
                        </div>
                        
                        <div className="space-y-3">
                          {getPhotographySpots(weather.city).map((spot, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#e43c1c] mt-2"></span>
                              <div>
                                <h4 className="text-white font-medium">{spot.name}</h4>
                                <p className="text-secondary text-sm">{spot.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Photography Tips */}
                      <div className="bg-[#1d0811]/80 rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                          <FiCompass className="text-[#e43c1c]" size={18} />
                          <span className="font-semibold text-white">Photography Tips</span>
                        </div>
                        
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#e43c1c] mt-2"></span>
                            <span className="text-white">Arrive 30 minutes before golden hour to scout locations</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#e43c1c] mt-2"></span>
                            <span className="text-white">Use a tripod for stability during low light conditions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#e43c1c] mt-2"></span>
                            <span className="text-white">Consider using ND filters for longer exposures</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-900/10 border border-red-500/20 rounded-[32px] p-8">
              <p className="text-red-400 text-lg">Failed to load map data. Please try again later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 