'use client';

import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/navigation-bar';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useWeather } from '../hooks/useWeather';
import { FiMapPin, FiNavigation, FiMap } from 'react-icons/fi';

export default function MapView() {
  const { user } = useAuth();
  const router = useRouter();
  const { weather, loading } = useWeather();
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    // Redirect if not authenticated
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, router, loading]);

  useEffect(() => {
    // Set map URL when weather data is available
    if (weather?.lat && weather?.lon) {
      setMapUrl(`https://www.openstreetmap.org/export/embed.html?bbox=${weather.lon - 0.1}%2C${weather.lat - 0.1}%2C${weather.lon + 0.1}%2C${weather.lat + 0.1}&layer=mapnik&marker=${weather.lat}%2C${weather.lon}`);
    }
  }, [weather]);

  return (
    <div className="min-h-screen bg-[#1C1D22] text-white">
      <NavigationBar />
      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <FiMap className="text-primary" size={36} />
            <h1 className="text-[64px] font-extrabold tracking-tight leading-none">
              Map View
            </h1>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-8"></div>
              <p className="text-xl text-secondary">Loading location data...</p>
            </div>
          ) : weather ? (
            <div className="space-y-6">
              <div className="bg-[#1C1D22]/60 backdrop-blur-xl rounded-[32px] p-8">
                <div className="flex items-center gap-4 mb-4">
                  <FiMapPin className="text-primary" size={24} />
                  <h2 className="text-3xl font-bold">
                    {weather.city}, {weather.country}
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-secondary">
                  <FiNavigation size={18} />
                  <p className="text-lg">
                    {weather?.lat?.toFixed(4) ?? '0.0000'}°N, {weather?.lon?.toFixed(4) ?? '0.0000'}°E
                  </p>
                </div>
              </div>
              
              <div className="bg-[#1C1D22]/60 backdrop-blur-xl rounded-[32px] overflow-hidden">
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
                  <p className="text-secondary text-sm">
                    Note: This is a simplified map view. In a production environment, you would
                    implement a more advanced mapping solution with interactive features.
                  </p>
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