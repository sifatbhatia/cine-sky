'use client';

import React, { useEffect, useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import { dateBuilder } from '../lib/weather-utils';
import Clock from 'react-live-clock';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiWind, FiDroplet, FiMapPin, FiSun, FiCloud, 
  FiEye, FiSunrise, FiClock
} from 'react-icons/fi';
import NavigationBar from '../components/navigation-bar';

export default function Home() {
  const { weather, loading, error } = useWeather();
  const { user } = useAuth();
  const router = useRouter();
  const [dateTime, setDateTime] = useState(new Date());

  // Update date time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Redirect if not authenticated
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <div className="w-20 h-20 relative">
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FiSun className="text-accent" size={32} />
          </div>
        </div>
        <h3 className="text-2xl font-medium mt-6">Loading weather data...</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1D22] text-white">
      <NavigationBar />
      
      <main className="container mx-auto px-4 pt-32 pb-24">
        {weather ? (
          <>
            <div className="weather-header">
              <div className="location-info">
                <h1>{weather.city}</h1>
                <div className="location-detail">
                  <FiMapPin />
                  <span>{weather.country}</span>
                </div>
              </div>
              
              <div className="current-time">
                <div className="date">{dateBuilder(dateTime)}</div>
                <div className="time">
                  <FiClock />
                  <Clock format="h:mm A" interval={1000} ticking={true} />
                </div>
              </div>
            </div>

            <div className="weather-grid">
              <div className="weather-main">
                <div className="weather-primary">
                  <div className="weather-icon">
                    {weather.main === "Clear" ? (
                      <FiSun className="text-accent" />
                    ) : (
                      <FiCloud className="text-accent" />
                    )}
                  </div>
                  <div className="weather-temp">
                    <span className="temp">{Math.round(weather.temperatureC ?? 0)}</span>
                    <span className="unit">°C</span>
                  </div>
                  <div className="weather-desc">{weather.main}</div>
                </div>

                <div className="weather-details">
                  <div className="detail-item">
                    <FiDroplet />
                    <span className="label">Humidity</span>
                    <span className="value">{weather.humidity ?? 0}%</span>
                  </div>
                  <div className="detail-item">
                    <FiWind />
                    <span className="label">Wind</span>
                    <span className="value">{weather?.wind?.speed ?? 0} m/s</span>
                  </div>
                  <div className="detail-item">
                    <FiEye />
                    <span className="label">Visibility</span>
                    <span className="value">{weather?.visibility ?? 0} km</span>
                  </div>
                </div>
              </div>

              <div className="golden-hours">
                <h3>
                  <FiSunrise className="icon" />
                  Golden Hours
                </h3>
                <div className="golden-grid">
                  <div className="golden-item">
                    <span className="time">05:45 AM</span>
                    <span className="label">Sunrise</span>
                  </div>
                  <div className="golden-item">
                    <span className="time">07:15 AM</span>
                    <span className="label">Golden Hour</span>
                  </div>
                  <div className="golden-item">
                    <span className="time">06:30 PM</span>
                    <span className="label">Golden Hour</span>
                  </div>
                  <div className="golden-item">
                    <span className="time">08:15 PM</span>
                    <span className="label">Sunset</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : error ? (
          <div className="error-container">
            <FiCloud className="error-icon" />
            <h2>Unable to load weather data</h2>
            <p>{error}</p>
          </div>
        ) : null}
      </main>
    </div>
  );
} 