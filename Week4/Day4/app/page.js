'use client';

import WeatherDisplay from '@/components/WeatherDisplay';

export default function Home() {
  return (
    <div className="container">
      <div className="header">
        <h1>Weather App</h1>
        <p>Get current weather information for any city</p>
      </div>
      
      <WeatherDisplay />
    </div>
  );
}