'use client';

import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/navigation-bar';
import { api } from '../lib/api';
import {
  FiSearch,
  FiMapPin,
  FiThermometer,
  FiDroplet,
  FiWind,
  FiInfo,
  FiCompass
} from 'react-icons/fi';
import { getWeatherIcon, getWindDirection } from '../lib/weather-utils';
import ReactAnimatedWeather from 'react-animated-weather';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { WeatherData } from '../types/weather';

const defaults = {
  color: '#e43c1c',
  size: 128,
  animate: true,
};

const popularCities = [
  'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai',
  'Toronto', 'Singapore', 'Berlin', 'Mumbai'
];

export default function WeatherSearch() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const searchWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a city name');
      return;
    }
    fetchWeatherData(query);
  };

  const fetchWeatherData = async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${api.base}weather?q=${cityName}&units=metric&APPID=${api.key}`
      );

      if (!response.ok) {
        throw new Error('City not found. Please try another location.');
      }

      const data = await response.json();

      setWeather({
        city: data.name || 'Unknown City',
        country: data.sys.country || 'Unknown Country',
        location: `${data.name || 'Unknown City'}, ${data.sys.country || 'Unknown Country'}`,
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round(data.main.temp * 1.8 + 32),
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        main: data.weather[0].main || 'Unknown',
        description: data.weather[0].description || 'No description available',
        icon: getWeatherIcon(data.weather[0].main),
        wind: {
          speed: data.wind?.speed || 0,
          direction: data.wind?.deg ? getWindDirection(data.wind.deg) : 'N/A'
        },
        visibility: data.visibility ? data.visibility / 1000 : 0, // Convert to km
        pressure: data.main.pressure || 0,
        lat: data.coord?.lat,
        lon: data.coord?.lon
      });

    } catch (error: unknown) {
      const err = error as Error;
      setError(err.message || 'Something went wrong. Please try again.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1d0811] text-white">
      <NavigationBar />
      <div className="container mx-auto px-4 pt-32 pb-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-[64px] sm:text-[72px] font-extrabold tracking-tight leading-tight mb-4 text-white drop-shadow-lg">
            Weather Search
          </h1>
          <p className="text-secondary text-xl sm:text-2xl mb-12 max-w-3xl leading-relaxed">
            Search for any city around the world to get real-time weather information.
          </p>

          <form onSubmit={searchWeather} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-12">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full h-[64px] bg-[#1d0811]/70 backdrop-blur-md rounded-full pl-14 pr-6 text-lg sm:text-xl text-white placeholder-secondary/50 border border-white/10 focus:ring-2 focus:ring-[#e43c1c]/30 focus:outline-none transition-all"
                placeholder="Search for a city (e.g. London, New York...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#e43c1c]" size={20} />
            </div>
            <button
              type="submit"
              className="h-[64px] px-10 bg-[#e43c1c] hover:bg-[#c93517] rounded-full text-white text-lg sm:text-xl font-semibold transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Searching...
                </div>
              ) : (
                'Search'
              )}
            </button>
          </form>

          {!weather && !loading && !error && (
            <div className="mb-12">
              <h3 className="text-secondary text-xl font-semibold mb-4 flex items-center gap-2">
                <FiCompass className="text-[#e43c1c]" size={22} />
                Popular Cities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {popularCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setQuery(city);
                      fetchWeatherData(city);
                    }}
                    className="px-5 py-3 bg-[#1d0811]/70 backdrop-blur-lg rounded-xl text-white text-lg font-medium hover:bg-[#1d0811]/90 transition-all"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-6 mb-10">
              <div className="flex items-start gap-4">
                <FiInfo className="mt-1 text-red-500" size={24} />
                <div>
                  <p className="text-xl font-semibold text-red-500 mb-1">Oops!</p>
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-16 h-16 border-4 border-[#e43c1c]/20 border-t-[#e43c1c] rounded-full animate-spin mb-8"></div>
              <p className="text-xl text-secondary">Searching for weather data...</p>
            </div>
          )}

          {weather && !loading && (
            <div className="bg-[#1d0811]/60 backdrop-blur-xl rounded-[32px] overflow-hidden">
              <div className="p-12 bg-gradient-to-r from-[#e43c1c]/10 to-transparent">
                <div className="flex flex-wrap items-start justify-between gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <FiMapPin className="text-[#e43c1c]" size={24} />
                      <h2 className="text-4xl font-bold text-white">
                        {weather.city}, {weather.country}
                      </h2>
                    </div>
                    <p className="text-2xl text-secondary capitalize">
                      {weather.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <ReactAnimatedWeather
                      icon={weather.icon ?? 'CLEAR_DAY'}
                      color={defaults.color}
                      size={100}
                      animate={defaults.animate}
                    />
                    <div className="text-7xl font-bold text-white">
                      {weather.temperatureC}
                      <span className="text-2xl align-top ml-1">°C</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
                <div className="bg-[#1d0811]/80 rounded-2xl p-6 shadow-inner border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <FiThermometer className="text-[#e43c1c]" size={20} />
                    <span className="text-base text-secondary">Temperature</span>
                  </div>
                  <p className="text-3xl font-semibold text-white">{weather.temperatureC}°C</p>
                </div>

                <div className="bg-[#1d0811]/80 rounded-2xl p-6 shadow-inner border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <FiDroplet className="text-[#e43c1c]" size={20} />
                    <span className="text-base text-secondary">Humidity</span>
                  </div>
                  <p className="text-3xl font-semibold text-white">{weather.humidity}%</p>
                </div>

                <div className="bg-[#1d0811]/80 rounded-2xl p-6 shadow-inner border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <FiWind className="text-[#e43c1c]" size={20} />
                    <span className="text-base text-secondary">Wind Speed</span>
                  </div>
                  <p className="text-3xl font-semibold text-white">{weather.wind.speed} m/s</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
