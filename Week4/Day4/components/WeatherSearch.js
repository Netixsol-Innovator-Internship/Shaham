'use client';

import { useState } from 'react';

const WeatherSearch = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter city name"
        required
      />
      <button type="submit">Get Weather</button>
    </form>
  );
};

export default WeatherSearch;