'use client';

import React from 'react';
import ReactAnimatedWeather from 'react-animated-weather';
import { WeatherData } from '../types/weather';

interface WeatherCardProps {
  weather: WeatherData;
  showDetails?: boolean;
  className?: string;
}

const defaults = {
  color: '#3b82f6',
  size: 64,
  animate: true,
};

export default function WeatherCard({ weather, showDetails = true, className = '' }: WeatherCardProps) {
  return (
    <div className={`bg-[#1C1D22]/60 backdrop-blur-xl rounded-[32px] p-8 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {weather.city}, {weather.country}
          </h2>
          <p className="text-secondary">{weather.main}</p>
        </div>
        <ReactAnimatedWeather
          icon={weather.icon ?? 'CLEAR_DAY'}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      
      {showDetails && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-[#1C1D22]/80 rounded-2xl p-6 border border-white/5">
            <p className="text-secondary text-sm">Temperature</p>
            <p className="text-2xl font-semibold text-white">{weather.temperatureC}°C</p>
            <p className="text-secondary text-sm">{weather.temperatureF}°F</p>
          </div>
          
          <div className="bg-[#1C1D22]/80 rounded-2xl p-6 border border-white/5">
            <p className="text-secondary text-sm">Humidity</p>
            <p className="text-2xl font-semibold text-white">{weather.humidity}%</p>
          </div>
        </div>
      )}
    </div>
  );
} 