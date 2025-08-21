'use client';

import { useState } from 'react';
import { useGetWeatherByCityQuery } from '@/features/weather/weatherApi';
import WeatherSearch from './WeatherSearch';

const WeatherDisplay = () => {
  const [city, setCity] = useState('London');
  const { data, error, isLoading, isFetching } = useGetWeatherByCityQuery(city);

  const handleSearch = (searchCity) => {
    if (searchCity.trim()) {
      setCity(searchCity);
    }
  };

  return (
    <div className="weather-container">
      <WeatherSearch onSearch={handleSearch} />
      
      {isLoading || isFetching ? (
        <div className="loading">Loading weather data for {city}...</div>
      ) : error ? (
        <div className="error">
          Error: {error.status} - {error.data?.message || 'Failed to fetch weather data'}
        </div>
      ) : data ? (
        <div className="weather-data">
          <h2>{data.name}, {data.sys.country}</h2>
          <div className="weather-main">
            <img
              src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt={data.weather[0].description}
            />
            <div className="temperature">{Math.round(data.main.temp)}°C</div>
          </div>
          <div className="weather-description">{data.weather[0].description}</div>
          <div className="weather-details">
            <div>
              <span>Feels like</span>
              <span>{Math.round(data.main.feels_like)}°C</span>
            </div>
            <div>
              <span>Humidity</span>
              <span>{data.main.humidity}%</span>
            </div>
            <div>
              <span>Wind Speed</span>
              <span>{data.wind.speed} m/s</span>
            </div>
            <div>
              <span>Pressure</span>
              <span>{data.main.pressure} hPa</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WeatherDisplay;